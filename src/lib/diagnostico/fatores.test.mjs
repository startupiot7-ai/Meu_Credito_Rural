/**
 * Testes da situação, dos fatores e do próximo passo.
 *
 * Os contextos são montados com as funções reais do motor, a partir de
 * respostas, para que o teste leia como um caso do produtor.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { projetarOsTresCenarios } from './cenarios.ts';
import { escolherFatores, MAXIMO_DE_FATORES_NA_TELA } from './fatores.ts';
import { interpretarRespostas } from './interpretar-respostas.ts';
import { calcularMargemDeSeguranca } from './margem-de-seguranca.ts';
import { escolherProximoPasso } from './proximo-passo.ts';
import { respostasVazias } from './respostas-vazias.ts';
import { classificarSituacao, listarDadosQueFaltam } from './situacao.ts';

const exato = (valor) => ({ forma: 'exato', valor });

/**
 * 1.000 sacas a R$ 1.500 e R$ 600 mil de custo, com R$ 500 mil de custeio.
 * Sobra R$ 900 mil no esperado e R$ 300 mil no desfavorável: cobre com folga.
 * A retirada da família é o controle usado nos testes para apertar a safra.
 */
function respostas(alteracoes = {}) {
  return {
    ...respostasVazias,
    perfil: 'planejando-safra',
    producaoEsperadaSacas: exato(1000),
    precoPorSaca: exato(1500),
    custoDaSafra: { base: 'total-da-safra', valor: exato(600_000) },
    valorDoCusteio: exato(500_000),
    protecao: ['seguro-rural'],
    ...alteracoes,
  };
}

function analisar(alteracoes) {
  const dados = interpretarRespostas(respostas(alteracoes));
  const cenarios = projetarOsTresCenarios(dados);
  const margem = calcularMargemDeSeguranca(dados, cenarios.esperado);
  const situacao = classificarSituacao(cenarios);
  const fatores = escolherFatores({ dados, cenarios, margem, situacao });
  const proximoPasso = escolherProximoPasso({ dados, situacao, fatores, dadosQueFaltam: [] });
  return { dados, cenarios, situacao, fatores, proximoPasso, ids: fatores.map((fator) => fator.id) };
}

describe('situação', () => {
  test('sobra no desfavorável: cobre com folga', () => {
    assert.equal(analisar().situacao, 'cobre-com-folga');
  });

  test('sobra só no esperado: cobre apertado', () => {
    assert.equal(analisar({ retiradaDaFamilia: exato(400_000) }).situacao, 'cobre-apertado');
  });

  test('falta já no esperado: não cobre', () => {
    assert.equal(analisar({ retiradaDaFamilia: exato(1_000_000) }).situacao, 'nao-cobre');
  });

  test('sem custo e sem custeio não há conta', () => {
    const dados = interpretarRespostas(respostas({ custoDaSafra: { base: 'nao-sei' }, valorDoCusteio: null }));
    assert.ok(listarDadosQueFaltam(dados).some((falta) => /quanto a safra custa/.test(falta)));
  });
});

describe('fatores', () => {
  test('nunca passam de três', () => {
    const { fatores } = analisar({
      perfil: 'ja-tenho-custeio',
      acontecimentosDaSafra: ['parcela-atrasada'],
      retiradaDaFamilia: exato(1_000_000),
      sacasPrometidas: exato(500),
      producaoMediaSacas: exato(600),
      protecao: ['nenhuma'],
      custoDaSafra: { base: 'nao-sei' },
    });
    assert.equal(fatores.length, MAXIMO_DE_FATORES_NA_TELA);
    assert.equal(fatores[0].id, 'sinais-de-dificuldade');
  });

  test('muito café prometido aparece e explica o efeito na quebra', () => {
    const { ids, fatores } = analisar({ sacasPrometidas: exato(400) });
    assert.ok(ids.includes('safra-muito-prometida'));
    const fator = fatores.find((item) => item.id === 'safra-muito-prometida');
    // 20% de 1.000 sacas = 200, que saem das 600 livres: um terço delas.
    assert.match(fator.explicacao, /caem 33%/);
  });

  test('expectativa acima da média mostra quanto a sobra cai na média', () => {
    const { ids } = analisar({ producaoMediaSacas: exato(800) });
    assert.ok(ids.includes('expectativa-acima-da-media'));
  });

  test('expectativa dentro da tolerância não vira fator', () => {
    const { ids } = analisar({ producaoMediaSacas: exato(900) });
    assert.ok(!ids.includes('expectativa-acima-da-media'));
  });

  test('safra apertada sem nenhuma piora isolada fatal: fator de combinação', () => {
    const { situacao, ids } = analisar({ retiradaDaFamilia: exato(400_000) });
    assert.equal(situacao, 'cobre-apertado');
    assert.ok(ids.includes('combinacao-de-quedas'));
    assert.ok(!ids.includes('margem-de-producao-curta'));
  });

  test('margem de produção menor que a hipótese do desfavorável', () => {
    const { ids } = analisar({ retiradaDaFamilia: exato(700_000) });
    assert.ok(ids.includes('margem-de-producao-curta'));
    assert.ok(!ids.includes('combinacao-de-quedas'));
  });

  test('sem seguro nem irrigação completa: fator climático', () => {
    assert.ok(analisar({ protecao: ['irrigacao-em-parte'] }).ids.includes('sem-protecao-climatica'));
    assert.ok(!analisar({ protecao: ['proagro'] }).ids.includes('sem-protecao-climatica'));
  });
});

describe('próximo passo', () => {
  test('é sempre um só e nunca manda contratar', () => {
    const casos = [
      {},
      { retiradaDaFamilia: exato(400_000) },
      { retiradaDaFamilia: exato(1_000_000) },
      { perfil: 'ja-tenho-custeio', acontecimentosDaSafra: ['ja-renegociou'] },
    ];
    for (const caso of casos) {
      const { proximoPasso } = analisar(caso);
      assert.equal(typeof proximoPasso.titulo, 'string');
      assert.doesNotMatch(`${proximoPasso.titulo} ${proximoPasso.descricao}`, /\bcontrate\b/i);
    }
  });

  test('perda por clima com seguro: comunicar a perda vem antes de tudo', () => {
    const { proximoPasso } = analisar({
      perfil: 'ja-tenho-custeio',
      acontecimentosDaSafra: ['perda-por-clima-ou-praga', 'parcela-atrasada'],
    });
    assert.equal(proximoPasso.id, 'comunicar-perda-ao-seguro');
  });

  test('quem já tem custeio e não cobre vai para renegociação', () => {
    const { proximoPasso } = analisar({ perfil: 'ja-tenho-custeio', retiradaDaFamilia: exato(1_000_000) });
    assert.equal(proximoPasso.id, 'entender-prorrogacao-e-renegociacao');
  });

  test('quem está planejando e não cobre revisa o plano antes de contratar', () => {
    const { proximoPasso } = analisar({ retiradaDaFamilia: exato(1_000_000) });
    assert.equal(proximoPasso.id, 'revisar-plano-antes-de-contratar');
  });

  test('safra apertada com muito café prometido: revisar o comprometido', () => {
    const { situacao, proximoPasso } = analisar({ sacasPrometidas: exato(400), retiradaDaFamilia: exato(200_000) });
    assert.equal(situacao, 'cobre-apertado');
    assert.equal(proximoPasso.id, 'revisar-safra-prometida');
    assert.match(proximoPasso.titulo, /Antes de contratar/);
  });
});
