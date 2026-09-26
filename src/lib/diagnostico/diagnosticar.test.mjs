/**
 * Os seis casos de referência do diagnóstico preventivo, do começo ao fim.
 *
 *  1. risco baixo                      → exemplo "planejando, com folga"
 *  2. risco intermediário              → exemplo "já tenho custeio, apertado"
 *  3. risco elevado                    → os pagamentos passam da receita
 *  4. dados faltantes                  → sem preço, não há conta
 *  5. resposta por faixa               → ponto médio e faixa aberta explicados
 *  6. cenário desfavorável muda tudo   → sobra alta no esperado, falta no pior
 *
 * E as regras que valem para qualquer resultado: nada de nota ou score, um
 * único próximo passo, no máximo três fatores e premissas sempre visíveis.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { diagnosticar } from './diagnosticar.ts';
import { exemploJaTenhoCusteioApertado, exemploPlanejandoComFolga } from './exemplos.ts';
import { respostasVazias } from './respostas-vazias.ts';

const exato = (valor) => ({ forma: 'exato', valor });
const faixa = (id) => ({ forma: 'faixa', faixa: id });

function quaseIgual(atual, esperado) {
  assert.ok(Math.abs(atual - esperado) < 1e-6, `${atual} deveria ser ${esperado}`);
}

describe('1. risco baixo', () => {
  const resultado = diagnosticar(exemploPlanejandoComFolga);

  test('a safra cobre com folga, mesmo no cenário desfavorável', () => {
    assert.equal(resultado.situacao, 'cobre-com-folga');
    assert.ok(resultado.cenarios.desfavoravel.recursosAposCompromissos > 0);
  });

  test('o próximo passo é firmar os números, sem pressa', () => {
    assert.equal(resultado.proximoPasso.id, 'guardar-e-refazer');
    assert.equal(resultado.mp, null);
  });
});

describe('2. risco intermediário', () => {
  const resultado = diagnosticar(exemploJaTenhoCusteioApertado);

  test('cobre no esperado, mas não no desfavorável', () => {
    assert.equal(resultado.situacao, 'cobre-apertado');
  });

  test('explica que é a combinação de quedas que aperta', () => {
    const ids = resultado.fatores.map((fator) => fator.id);
    assert.ok(ids.includes('combinacao-de-quedas'));
    assert.ok(ids.includes('expectativa-acima-da-media'));
  });

  test('sem dificuldade de pagamento, a MP não aparece', () => {
    assert.equal(resultado.mostrarCaminhosDeRenegociacao, false);
    assert.equal(resultado.mp, null);
  });
});

describe('3. risco elevado', () => {
  const respostas = {
    ...exemploJaTenhoCusteioApertado,
    acontecimentosDaSafra: ['parcela-atrasada'],
    producaoEsperadaSacas: exato(350),
  };
  const resultado = diagnosticar(respostas);

  test('os pagamentos passam da receita já no cenário esperado', () => {
    assert.equal(resultado.situacao, 'nao-cobre');
    assert.ok(resultado.cenarios.esperado.recursosAposCompromissos < 0);
    assert.match(resultado.frase, /faltam cerca de R\$/);
  });

  test('a margem de segurança é zero', () => {
    assert.equal(resultado.margem.quebraDeProducaoSuportada.fracao, 0);
  });

  test('prioridade: renegociação, com a MP como "não avaliada"', () => {
    assert.equal(resultado.proximoPasso.id, 'entender-prorrogacao-e-renegociacao');
    assert.equal(resultado.mostrarCaminhosDeRenegociacao, true);
    assert.equal(resultado.mp.estado, 'nao-avaliada');
    assert.equal(resultado.fatores[0].id, 'sinais-de-dificuldade');
  });
});

describe('4. dados faltantes', () => {
  const resultado = diagnosticar({
    ...exemploPlanejandoComFolga,
    precoPorSaca: { forma: 'nao-sei' },
  });

  test('sem preço, não calcula e diz o que falta', () => {
    assert.equal(resultado.situacao, 'dados-insuficientes');
    assert.equal(resultado.cenarios, null);
    assert.ok(resultado.dadosQueFaltam.some((falta) => /preço/.test(falta)));
  });

  test('o próximo passo é completar o que falta', () => {
    assert.equal(resultado.proximoPasso.id, 'descobrir-dado-que-falta');
    assert.match(resultado.proximoPasso.descricao, /preço/);
  });

  test('um diagnóstico em branco também não quebra', () => {
    const vazio = diagnosticar(respostasVazias);
    assert.equal(vazio.situacao, 'dados-insuficientes');
    assert.ok(vazio.dadosQueFaltam.length >= 3);
  });
});

describe('5. resposta por faixa', () => {
  test('o preço por faixa usa o ponto médio e explica a aproximação', () => {
    const resultado = diagnosticar(exemploPlanejandoComFolga);
    // Faixa de R$ 1.600 a R$ 2.000 → R$ 1.800 × 450 sacas.
    quaseIgual(resultado.cenarios.esperado.receita, 1800 * 450);
    assert.ok(resultado.aproximacoes.some((frase) => /meio da faixa "De R\$ 1\.600 a R\$ 2\.000"/.test(frase)));
  });

  test('custo por faixa aberta usa o limite e avisa que pode ser maior', () => {
    const resultado = diagnosticar({
      ...exemploPlanejandoComFolga,
      custoDaSafra: { base: 'por-hectare', valor: faixa('custo-ha-acima-30mil') },
    });
    // R$ 30 mil × 15 ha = R$ 450 mil de custo; o custeio de R$ 200 mil paga uma parte.
    quaseIgual(resultado.cenarios.esperado.custosPagosComRecursoProprio, 450_000 - 200_000);
    assert.ok(resultado.aproximacoes.some((frase) => /pode ser maior/.test(frase)));
  });
});

describe('6. o cenário desfavorável muda o resultado', () => {
  // Muito café prometido: a quebra sai inteira das poucas sacas livres.
  const resultado = diagnosticar({
    ...exemploPlanejandoComFolga,
    sacasPrometidas: exato(250),
    custoDaSafra: { base: 'total-da-safra', valor: exato(500_000) },
    valorDoCusteio: exato(150_000),
    outrosPagamentos: { ...respostasVazias.outrosPagamentos, parcelaDeInvestimento: exato(100_000) },
  });

  test('sobra bem no esperado e falta no desfavorável', () => {
    const { esperado, desfavoravel } = resultado.cenarios;
    assert.ok(esperado.recursosAposCompromissos > 100_000);
    assert.ok(desfavoravel.recursosAposCompromissos < 0);
    assert.equal(resultado.situacao, 'cobre-apertado');
  });

  test('aponta a safra prometida e orienta a revisar antes de contratar', () => {
    assert.equal(resultado.fatores[0].id, 'safra-muito-prometida');
    assert.equal(resultado.proximoPasso.id, 'revisar-safra-prometida');
  });
});

describe('regras de qualquer resultado', () => {
  const casos = [
    exemploPlanejandoComFolga,
    exemploJaTenhoCusteioApertado,
    respostasVazias,
    { ...exemploJaTenhoCusteioApertado, producaoEsperadaSacas: exato(200) },
  ];

  test('nunca fala em nota, score ou pontuação', () => {
    for (const respostas of casos) {
      const resultado = diagnosticar(respostas);
      const textos = [
        resultado.rotuloDaSituacao,
        resultado.frase,
        resultado.proximoPasso.titulo,
        resultado.proximoPasso.descricao,
        ...resultado.fatores.flatMap((fator) => [fator.titulo, fator.explicacao]),
      ].join(' ');
      assert.doesNotMatch(textos, /\b(score|nota|pontua|crítico)/i);
    }
  });

  test('no máximo três fatores e sempre um próximo passo', () => {
    for (const respostas of casos) {
      const resultado = diagnosticar(respostas);
      assert.ok(resultado.fatores.length <= 3);
      assert.ok(resultado.proximoPasso.titulo.length > 0);
    }
  });

  test('as premissas usadas vêm sempre marcadas como hipótese a validar', () => {
    const resultado = diagnosticar(exemploPlanejandoComFolga);
    assert.ok(resultado.premissasUsadas.length >= 5);
    assert.ok(resultado.premissasUsadas.every((premissa) => premissa.aValidar));
  });

  test('é uma função pura: mesmas respostas, mesmo resultado', () => {
    assert.deepEqual(diagnosticar(exemploJaTenhoCusteioApertado), diagnosticar(exemploJaTenhoCusteioApertado));
  });
});
