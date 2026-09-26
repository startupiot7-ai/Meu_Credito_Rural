/**
 * O consentimento 1 (estatísticas anônimas) começa desligado e pode ser retirado.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  autorizarEstatistica,
  consentimentoEstatisticoInicial,
  revogarEstatistica,
} from './consentimento-estatistico.ts';

const MOMENTO = '2026-09-26T10:00:00.000Z';
const DEPOIS = '2026-09-27T10:00:00.000Z';

describe('consentimento para estatísticas anônimas', () => {
  test('começa desligado', () => {
    assert.equal(consentimentoEstatisticoInicial.autorizado, false);
    assert.equal(consentimentoEstatisticoInicial.autorizadoEm, null);
  });

  test('ligar e desligar ficam no histórico', () => {
    const ligado = autorizarEstatistica(consentimentoEstatisticoInicial, MOMENTO);
    assert.equal(ligado.autorizado, true);
    assert.equal(ligado.autorizadoEm, MOMENTO);
    const desligado = revogarEstatistica(ligado, DEPOIS);
    assert.equal(desligado.autorizado, false);
    assert.equal(desligado.autorizadoEm, null);
    assert.deepEqual(
      desligado.historico.map((registro) => registro.acao),
      ['autorizou', 'revogou'],
    );
  });

  test('repetir a mesma ação não muda nada', () => {
    const ligado = autorizarEstatistica(consentimentoEstatisticoInicial, MOMENTO);
    assert.equal(autorizarEstatistica(ligado, DEPOIS), ligado);
    assert.equal(revogarEstatistica(consentimentoEstatisticoInicial, DEPOIS), consentimentoEstatisticoInicial);
  });

  test('não altera o estado inicial', () => {
    autorizarEstatistica(consentimentoEstatisticoInicial, MOMENTO);
    assert.equal(consentimentoEstatisticoInicial.autorizado, false);
  });
});
