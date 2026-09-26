/**
 * A simulação da página inicial usa a mesma conta do diagnóstico completo.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { simularRapido } from './simulacao-rapida.ts';

function quaseIgual(atual, esperado) {
  assert.ok(Math.abs(atual - esperado) < 1e-6, `${atual} deveria ser ${esperado}`);
}

describe('simulação rápida', () => {
  test('os números de exemplo da página mostram uma safra apertada', () => {
    const resultado = simularRapido({
      producaoEsperadaSacas: 500,
      precoPorSaca: 1500,
      custoTotalDaSafra: 500_000,
      valorDoCusteio: 300_000,
    });
    assert.equal(resultado.situacao, 'cobre-apertado');
    // 750 mil de venda − 200 mil de custo do bolso − 300 mil de parcela
    quaseIgual(resultado.cenarios.esperado.recursosAposCompromissos, 250_000);
    // 480 mil − 250 mil − 300 mil
    quaseIgual(resultado.cenarios.desfavoravel.recursosAposCompromissos, -70_000);
  });

  test('campo apagado vira "não sei" e, sem preço, não há conta', () => {
    const resultado = simularRapido({
      producaoEsperadaSacas: 500,
      precoPorSaca: null,
      custoTotalDaSafra: 500_000,
      valorDoCusteio: 300_000,
    });
    assert.equal(resultado.situacao, 'dados-insuficientes');
  });
});
