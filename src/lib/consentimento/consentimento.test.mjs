/**
 * Testes das regras de consentimento da originação qualificada.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  autorizarInstituicao,
  consentimentoInicial,
  instituicaoEstaAutorizada,
  quantidadeDeInstituicoesAutorizadas,
  revogarInstituicao,
  revogarTodasAsInstituicoes,
} from './consentimento.ts';

const MOMENTO = '2026-09-26T10:00:00.000Z';
const DEPOIS = '2026-09-27T10:00:00.000Z';

describe('consentimento da originação qualificada', () => {
  test('começa sem nenhuma instituição autorizada', () => {
    assert.equal(quantidadeDeInstituicoesAutorizadas(consentimentoInicial), 0);
    assert.equal(instituicaoEstaAutorizada(consentimentoInicial, 'cooperativa-exemplo'), false);
    assert.deepEqual(consentimentoInicial.historico, []);
  });

  test('autorizar uma instituição não autoriza nenhuma outra', () => {
    const consentimento = autorizarInstituicao(consentimentoInicial, 'cooperativa-exemplo', MOMENTO);
    assert.equal(instituicaoEstaAutorizada(consentimento, 'cooperativa-exemplo'), true);
    assert.equal(instituicaoEstaAutorizada(consentimento, 'banco-exemplo'), false);
    assert.equal(consentimento.autorizacoesAtivas['cooperativa-exemplo'], MOMENTO);
  });

  test('revogar retira a autorização e registra a retirada no histórico', () => {
    const autorizado = autorizarInstituicao(consentimentoInicial, 'banco-exemplo', MOMENTO);
    const revogado = revogarInstituicao(autorizado, 'banco-exemplo', DEPOIS);
    assert.equal(instituicaoEstaAutorizada(revogado, 'banco-exemplo'), false);
    assert.deepEqual(
      revogado.historico.map((registro) => registro.acao),
      ['autorizou', 'revogou'],
    );
  });

  test('retirar todas as autorizações deixa o produtor como no início', () => {
    let consentimento = autorizarInstituicao(consentimentoInicial, 'cooperativa-exemplo', MOMENTO);
    consentimento = autorizarInstituicao(consentimento, 'banco-exemplo', MOMENTO);
    consentimento = revogarTodasAsInstituicoes(consentimento, DEPOIS);
    assert.equal(quantidadeDeInstituicoesAutorizadas(consentimento), 0);
    assert.equal(consentimento.historico.filter((registro) => registro.acao === 'revogou').length, 2);
  });

  test('não altera o estado inicial compartilhado', () => {
    autorizarInstituicao(consentimentoInicial, 'cooperativa-exemplo', MOMENTO);
    assert.equal(quantidadeDeInstituicoesAutorizadas(consentimentoInicial), 0);
  });

  test('autorizar de novo quem já está autorizado não duplica o histórico', () => {
    const umaVez = autorizarInstituicao(consentimentoInicial, 'cooperativa-exemplo', MOMENTO);
    const duasVezes = autorizarInstituicao(umaVez, 'cooperativa-exemplo', DEPOIS);
    assert.equal(duasVezes.historico.length, 1);
    assert.equal(duasVezes.autorizacoesAtivas['cooperativa-exemplo'], MOMENTO);
  });
});
