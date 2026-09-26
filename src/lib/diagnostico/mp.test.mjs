/**
 * A MP continua "não avaliada" até a validação jurídica.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { CRITERIO_A_VALIDAR, criteriosDaMp, lerMp } from './mp.ts';

describe('MP 1.376/2026', () => {
  test('nenhum critério está validado ainda', () => {
    assert.ok(criteriosDaMp.length > 0);
    for (const criterio of criteriosDaMp) {
      assert.equal(criterio.validado, false, criterio.nome);
      assert.equal(criterio.regra, CRITERIO_A_VALIDAR, criterio.nome);
    }
  });

  test('cada critério tem nome, regra, dado necessário e fonte', () => {
    for (const criterio of criteriosDaMp) {
      for (const campo of ['nome', 'regra', 'dadoNecessario', 'fonte']) {
        assert.ok(criterio[campo].length > 0, `${criterio.nome}: falta ${campo}`);
      }
    }
  });

  test('com critério pendente, a leitura é "não avaliada" e lista os pendentes', () => {
    const leitura = lerMp();
    assert.equal(leitura.estado, 'nao-avaliada');
    assert.deepEqual(
      leitura.criteriosPendentes,
      criteriosDaMp.map((criterio) => criterio.nome),
    );
  });

  test('mesmo com tudo validado, não afirma elegibilidade sem a verificação programada', () => {
    const todosValidados = criteriosDaMp.map((criterio) => ({ ...criterio, validado: true }));
    const leitura = lerMp(todosValidados);
    assert.equal(leitura.estado, 'nao-avaliada');
    assert.deepEqual(leitura.criteriosPendentes, []);
  });
});
