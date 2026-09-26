/**
 * Garante que toda premissa do motor está documentada e com o valor aprovado.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import * as premissas from './premissas.ts';

const premissasSimples = [
  premissas.quedaDeProducaoNoCenarioDesfavoravel,
  premissas.quedaDePrecoNoCenarioDesfavoravel,
  premissas.aumentoDeCustoNoCenarioDesfavoravel,
  premissas.altaDeProducaoNoCenarioFavoravel,
  premissas.altaDePrecoNoCenarioFavoravel,
  premissas.prazoDoCusteioEmMeses,
  premissas.toleranciaDaExpectativaSobreAMedia,
  premissas.limiteDeSafraPrometida,
  ...Object.values(premissas.taxaDeJurosAnualPorLinha),
];

const listasDeFaixas = [
  premissas.faixasDePrecoPorSaca,
  premissas.faixasDeCustoPorHectare,
  premissas.faixasDeCustoPorSaca,
  premissas.faixasDeValorDaSafra,
  premissas.faixasDeValorAnual,
];

describe('documentação das premissas', () => {
  test('toda premissa tem nome, unidade, finalidade, fonte e justificativa', () => {
    for (const premissa of premissasSimples) {
      for (const campo of ['nome', 'unidade', 'finalidade', 'fonte', 'justificativa']) {
        assert.ok(premissa[campo]?.length > 0, `${premissa.nome}: falta ${campo}`);
      }
    }
  });

  test('nenhuma premissa está marcada como validada ainda', () => {
    for (const premissa of [...premissasSimples, ...listasDeFaixas]) {
      assert.equal(premissa.estado, premissas.PREMISSA_A_VALIDAR, premissa.nome);
    }
  });

  test('o marcador é o combinado com a equipe', () => {
    assert.equal(premissas.PREMISSA_A_VALIDAR, '{{PREMISSA_A_VALIDAR}}');
  });
});

describe('valores provisórios aprovados', () => {
  test('cenário desfavorável: 20% menos produção, 20% menos preço, 10% mais custo', () => {
    assert.equal(premissas.quedaDeProducaoNoCenarioDesfavoravel.valor, 0.2);
    assert.equal(premissas.quedaDePrecoNoCenarioDesfavoravel.valor, 0.2);
    assert.equal(premissas.aumentoDeCustoNoCenarioDesfavoravel.valor, 0.1);
  });

  test('prazo de 12 meses, tolerância de 15% e limite de 30% prometido', () => {
    assert.equal(premissas.prazoDoCusteioEmMeses.valor, 12);
    assert.equal(premissas.toleranciaDaExpectativaSobreAMedia.valor, 0.15);
    assert.equal(premissas.limiteDeSafraPrometida.valor, 0.3);
  });

  test('as taxas de juros continuam sem valor até a validação', () => {
    for (const taxa of Object.values(premissas.taxaDeJurosAnualPorLinha)) {
      assert.equal(taxa.valor, null, taxa.nome);
    }
  });
});

describe('faixas', () => {
  test('cada lista começa em zero, é contínua e termina numa faixa aberta', () => {
    for (const lista of listasDeFaixas) {
      assert.equal(lista.faixas[0].minimo, 0, lista.nome);
      for (let posicao = 1; posicao < lista.faixas.length; posicao += 1) {
        assert.equal(lista.faixas[posicao].minimo, lista.faixas[posicao - 1].maximo, lista.nome);
      }
      assert.equal(lista.faixas.at(-1).maximo, null, lista.nome);
    }
  });

  test('identificadores de faixa não se repetem entre listas', () => {
    const identificadores = listasDeFaixas.flatMap((lista) => lista.faixas.map((faixa) => faixa.id));
    assert.equal(new Set(identificadores).size, identificadores.length);
  });
});
