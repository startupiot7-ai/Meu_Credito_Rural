/**
 * Testes da margem de segurança.
 *
 * A prova de que as fórmulas estão certas: aplicar exatamente a margem
 * calculada como variação de um cenário tem que levar a sobra a zero.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { projetarCenario } from './cenarios.ts';
import { calcularMargemDeSeguranca } from './margem-de-seguranca.ts';

const semVariacao = { variacaoDaProducao: 0, variacaoDoPreco: 0, variacaoDoCusto: 0 };
const informado = (valor) => ({ valor, origem: 'informado' });
const zero = { valor: 0, origem: 'nao-se-aplica' };

function quaseIgual(atual, esperado) {
  assert.ok(Math.abs(atual - esperado) < 1e-6, `${atual} deveria ser ${esperado}`);
}

function safra(alteracoes = {}) {
  return {
    perfil: 'planejando-safra',
    producaoEsperadaTotal: informado(1000),
    producaoPropriaEsperada: informado(1000),
    producaoMediaHistorica: informado(850),
    precoPorSaca: informado(1500),
    custoTotalDaSafra: informado(900_000),
    valorDoCusteio: informado(500_000),
    parcelaDoCusteio: informado(550_000),
    sacasPrometidas: informado(200),
    parteComPrecoFechado: informado(0.25),
    parcelaDeInvestimento: zero,
    comprasAPrazoOuAdiantamento: zero,
    arrendamento: zero,
    retiradaDaFamilia: informado(100_000),
    protecao: [],
    acontecimentos: [],
    aproximacoes: [],
    ...alteracoes,
  };
}

function margemDe(dados) {
  const esperado = projetarCenario(dados, semVariacao, 'esperado');
  return { esperado, margem: calcularMargemDeSeguranca(dados, esperado) };
}

describe('cada margem leva a sobra exatamente a zero', () => {
  const dados = safra();
  const { esperado, margem } = margemDe(dados);

  test('a safra de referência tem sobra positiva', () => {
    assert.ok(esperado.recursosAposCompromissos > 0);
    assert.equal(margem.calculavel, true);
  });

  test('quebra de produção', () => {
    const quebra = margem.quebraDeProducaoSuportada.fracao;
    const cenario = projetarCenario(dados, { ...semVariacao, variacaoDaProducao: -quebra }, 'desfavoravel');
    quaseIgual(cenario.recursosAposCompromissos, 0);
  });

  test('a quebra também sai em sacas', () => {
    // Sobra de R$ 450 mil ÷ R$ 1.500 por saca = 300 sacas.
    quaseIgual(esperado.recursosAposCompromissos, 450_000);
    quaseIgual(margem.quebraDeProducaoSuportada.sacas, 300);
  });

  test('queda de preço', () => {
    assert.equal(margem.quedaDePrecoSuportada.tipo, 'percentual');
    const queda = margem.quedaDePrecoSuportada.valor;
    const cenario = projetarCenario(dados, { ...semVariacao, variacaoDoPreco: -queda }, 'desfavoravel');
    quaseIgual(cenario.recursosAposCompromissos, 0);
  });

  test('aumento de custo', () => {
    const aumento = margem.aumentoDeCustoSuportado;
    const cenario = projetarCenario(dados, { ...semVariacao, variacaoDoCusto: aumento }, 'desfavoravel');
    quaseIgual(cenario.recursosAposCompromissos, 0);
  });

  test('aumento de custo quando o crédito era maior que o custo', () => {
    const comFolga = safra({ custoTotalDaSafra: informado(400_000) });
    const { margem: margemComFolga } = margemDe(comFolga);
    const cenario = projetarCenario(
      comFolga,
      { ...semVariacao, variacaoDoCusto: margemComFolga.aumentoDeCustoSuportado },
      'desfavoravel',
    );
    quaseIgual(cenario.recursosAposCompromissos, 0);
  });
});

describe('casos especiais', () => {
  test('sem sobra no esperado, todas as margens são zero', () => {
    const { margem } = margemDe(safra({ retiradaDaFamilia: informado(900_000) }));
    assert.equal(margem.quebraDeProducaoSuportada.fracao, 0);
    assert.deepEqual(margem.quedaDePrecoSuportada, { tipo: 'percentual', valor: 0 });
    assert.equal(margem.aumentoDeCustoSuportado, 0);
  });

  test('com toda a safra livre com preço fechado, o preço não ameaça o pagamento', () => {
    const { margem } = margemDe(safra({ sacasPrometidas: zero, parteComPrecoFechado: informado(1) }));
    assert.deepEqual(margem.quedaDePrecoSuportada, { tipo: 'preco-nao-ameaca-o-pagamento' });
  });

  test('compara a média histórica com a produção esperada', () => {
    const { margem } = margemDe(safra());
    quaseIgual(margem.mediaHistoricaAbaixoDaEsperada, 0.15);
  });

  test('sem preço, a margem não é calculável', () => {
    const { margem } = margemDe(safra({ precoPorSaca: { valor: null, origem: 'nao-sei' } }));
    assert.equal(margem.calculavel, false);
  });
});
