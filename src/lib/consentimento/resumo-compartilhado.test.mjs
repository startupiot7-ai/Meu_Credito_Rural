/**
 * Garante que a instituição autorizada recebe só o resumo, nunca as respostas.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { diagnosticar } from '../diagnostico/diagnosticar.ts';
import { exemploJaTenhoCusteioApertado, exemploPlanejandoComFolga } from '../diagnostico/exemplos.ts';
import { montarResumoCompartilhado } from './resumo-compartilhado.ts';

describe('resumo compartilhado com instituições autorizadas', () => {
  const exemplos = [exemploJaTenhoCusteioApertado, exemploPlanejandoComFolga];

  test('tem só situação, margem e fator principal', () => {
    for (const respostas of exemplos) {
      const linhas = montarResumoCompartilhado(diagnosticar(respostas));
      assert.deepEqual(
        linhas.map((linha) => linha.rotulo),
        ['Situação da safra', 'Margem de segurança', 'O que mais pesou'],
      );
    }
  });

  test('nenhum valor em reais nem quantidade de sacas sai do aparelho', () => {
    for (const respostas of exemplos) {
      const texto = montarResumoCompartilhado(diagnosticar(respostas))
        .map((linha) => linha.valor)
        .join(' ');
      assert.doesNotMatch(texto, /R\$/);
      assert.doesNotMatch(texto, /sacas?\b/);
      assert.doesNotMatch(texto, /família/i);
    }
  });

  test('a margem é descrita em percentual de quebra', () => {
    const [, margem] = montarResumoCompartilhado(diagnosticar(exemploJaTenhoCusteioApertado));
    assert.equal(margem.valor, 'A colheita pode ser até 28% menor antes de faltar dinheiro');
  });
});
