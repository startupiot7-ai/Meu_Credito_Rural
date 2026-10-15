/**
 * Validação do que vem do localStorage: na dúvida, não há autorização.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  consentimentoDeValorSalvo,
  instituicaoEstaAutorizada,
  quantidadeDeInstituicoesAutorizadas,
} from './consentimento.ts';

const vazio = { autorizacoesAtivas: {}, historico: [] };

describe('consentimentoDeValorSalvo', () => {
  for (const [nome, valor] of [
    ['null', null],
    ['número', 42],
    ['texto', 'banco'],
    ['array', []],
    ['autorizacoesAtivas string', { autorizacoesAtivas: 'banco' }],
    ['autorizacoesAtivas array', { autorizacoesAtivas: ['banco'] }],
    ['autorizacoesAtivas número', { autorizacoesAtivas: 3 }],
    ['autorizacoesAtivas null', { autorizacoesAtivas: null }],
  ]) {
    test(`${nome}: sem autorização e sem lançar erro`, () => {
      const r = consentimentoDeValorSalvo(valor);
      assert.deepEqual(r, vazio);
      assert.equal(instituicaoEstaAutorizada(r, 'banco'), false);
      assert.equal(quantidadeDeInstituicoesAutorizadas(r), 0);
    });
  }

  test('descarta entradas internas malformadas e mantém as válidas', () => {
    const r = consentimentoDeValorSalvo({
      autorizacoesAtivas: { a: '2026-01-01', b: true, c: 1, d: null, e: {}, f: '' },
    });
    assert.deepEqual(r.autorizacoesAtivas, { a: '2026-01-01' });
  });

  test('histórico: descarta registros incompletos ou com ação desconhecida', () => {
    const ok = { identificadorDaInstituicao: 'a', acao: 'autorizou', em: 'x' };
    const r = consentimentoDeValorSalvo({
      historico: [ok, null, 'x', [], { ...ok, acao: 'outra' }, { ...ok, em: 1 }, { acao: 'revogou', em: 'x' }],
    });
    assert.deepEqual(r.historico, [ok]);
  });

  test('histórico que não é array vira lista vazia', () => {
    assert.deepEqual(consentimentoDeValorSalvo({ historico: 'x' }).historico, []);
  });

  test('estado válido passa intacto', () => {
    const valido = {
      autorizacoesAtivas: { a: '2026-01-01' },
      historico: [{ identificadorDaInstituicao: 'a', acao: 'autorizou', em: '2026-01-01' }],
    };
    assert.deepEqual(consentimentoDeValorSalvo(valido), valido);
  });
});
