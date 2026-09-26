/**
 * Testes da conta de cada cenário.
 *
 * O teste mais importante aqui é o de "não contar duas vezes": quando o
 * crédito paga parte do custo, a sobra tem que ser igual à conta econômica
 * simples (receita − custo − juros − outros pagamentos).
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  descreverHipotese,
  hipotesesDosCenarios,
  projetarCenario,
  projetarOsTresCenarios,
} from './cenarios.ts';

const esperado = { variacaoDaProducao: 0, variacaoDoPreco: 0, variacaoDoCusto: 0 };
const informado = (valor) => ({ valor, origem: 'informado' });
const zero = { valor: 0, origem: 'nao-se-aplica' };

/** Percentuais como 1,1 deixam resíduos mínimos; a tela sempre arredonda. */
function quaseIgual(atual, esperado) {
  assert.ok(Math.abs(atual - esperado) < 1e-6, `${atual} deveria ser ${esperado}`);
}

/** Uma safra de referência: 1.000 sacas a R$ 1.500, custo de R$ 900 mil. */
function safra(alteracoes = {}) {
  return {
    perfil: 'planejando-safra',
    producaoEsperadaTotal: informado(1000),
    producaoPropriaEsperada: informado(1000),
    producaoMediaHistorica: { valor: null, origem: 'nao-sei' },
    precoPorSaca: informado(1500),
    custoTotalDaSafra: informado(900_000),
    valorDoCusteio: informado(500_000),
    parcelaDoCusteio: informado(550_000),
    sacasPrometidas: zero,
    parteComPrecoFechado: zero,
    parcelaDeInvestimento: zero,
    comprasAPrazoOuAdiantamento: zero,
    arrendamento: zero,
    retiradaDaFamilia: zero,
    protecao: [],
    acontecimentos: [],
    aproximacoes: [],
    ...alteracoes,
  };
}

describe('não contar o mesmo custo duas vezes', () => {
  test('com o custeio pagando parte do custo, a sobra é receita − custo − juros', () => {
    const cenario = projetarCenario(safra(), esperado, 'esperado');
    // 1.500.000 − 900.000 − 50.000 de juros
    assert.equal(cenario.recursosAposCompromissos, 550_000);
  });

  test('café prometido em barter paga insumos e não vira receita', () => {
    const cenario = projetarCenario(safra({ sacasPrometidas: informado(100) }), esperado, 'esperado');
    assert.equal(cenario.receita, 900 * 1500);
    // A conta econômica continua a mesma: o barter só trocou a forma de pagar o insumo.
    assert.equal(cenario.recursosAposCompromissos, 550_000);
  });

  test('compras a prazo pagam custo e também são compromisso, sem duplicar', () => {
    const cenario = projetarCenario(
      safra({ comprasAPrazoOuAdiantamento: informado(100_000) }),
      esperado,
      'esperado',
    );
    assert.equal(cenario.recursosAposCompromissos, 550_000);
  });

  test('crédito acima do custo reduz a sobra: o dinheiro foi para outra coisa', () => {
    const cenario = projetarCenario(
      safra({ custoTotalDaSafra: informado(300_000) }),
      esperado,
      'esperado',
    );
    // 1.500.000 − 0 de custo próprio − 550.000 de parcela
    assert.equal(cenario.recursosAposCompromissos, 950_000);
  });
});

describe('cenário desfavorável', () => {
  test('usa as hipóteses aprovadas e fica pior que o esperado', () => {
    const cenarios = projetarOsTresCenarios(safra());
    assert.deepEqual(cenarios.desfavoravel.hipoteses, hipotesesDosCenarios().desfavoravel);
    // Receita: 800 sacas × R$ 1.200. Custo: 990 mil, dos quais 490 mil do bolso.
    quaseIgual(cenarios.desfavoravel.receita, 960_000);
    quaseIgual(cenarios.desfavoravel.recursosAposCompromissos, 960_000 - 490_000 - 550_000);
    assert.ok(cenarios.favoravel.recursosAposCompromissos > cenarios.esperado.recursosAposCompromissos);
  });

  test('sacas com preço fechado não perdem valor quando o preço cai', () => {
    const semContrato = projetarCenario(safra(), hipotesesDosCenarios().desfavoravel, 'desfavoravel');
    const comContrato = projetarCenario(
      safra({ parteComPrecoFechado: informado(0.5) }),
      hipotesesDosCenarios().desfavoravel,
      'desfavoravel',
    );
    // 500 sacas a R$ 1.500 + 300 sacas a R$ 1.200
    quaseIgual(comContrato.receita, 500 * 1500 + 300 * 1200);
    assert.ok(comContrato.receita > semContrato.receita);
  });

  test('se faltar café até para os contratos, a diferença aparece como receita negativa', () => {
    const cenario = projetarCenario(
      safra({ sacasPrometidas: informado(900) }),
      hipotesesDosCenarios().desfavoravel,
      'desfavoravel',
    );
    // Colhe 800, deve 900: compra 100 sacas a R$ 1.200.
    quaseIgual(cenario.receita, -100 * 1200);
  });
});

describe('hipóteses em palavras', () => {
  test('descreve o desfavorável sem jargão', () => {
    assert.equal(
      descreverHipotese(hipotesesDosCenarios().desfavoravel),
      '20% menos café, preço 20% menor e custo 10% maior',
    );
  });

  test('descreve o esperado e o favorável', () => {
    assert.equal(descreverHipotese(esperado), 'Tudo como você espera');
    assert.equal(descreverHipotese(hipotesesDosCenarios().favoravel), '10% mais café e preço 10% maior');
  });
});
