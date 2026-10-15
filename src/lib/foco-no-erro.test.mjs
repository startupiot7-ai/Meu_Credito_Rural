/**
 * Testes da lógica de foco no primeiro campo inválido, com elementos falsos
 * (sem DOM). O comportamento real de foco e rolagem é verificado no navegador.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  controleParaFocar,
  focarPrimeiroInvalido,
  preferenciaDeMovimentoReduzido,
  SELETOR_DE_INVALIDO,
 } from './foco-no-erro.ts';

function elemento({ controle = false, filhos = {}, registro = [] } = {}) {
  return {
    matches: (seletor) => controle && seletor === 'input, select, textarea',
    querySelector: (seletor) => filhos[seletor] ?? null,
    focus: (opcoes) => registro.push(['focus', opcoes]),
    scrollIntoView: (opcoes) => registro.push(['scroll', opcoes]),
  };
}

const SEL_MARCADO = 'input:checked:not(:disabled)';
const SEL_PRIMEIRO = 'input:not(:disabled), select:not(:disabled), textarea:not(:disabled)';

describe('controleParaFocar', () => {
  test('um campo de texto é o próprio alvo', () => {
    const campo = elemento({ controle: true });
    assert.equal(controleParaFocar(campo), campo);
  });

  test('num grupo, prefere a opção marcada', () => {
    const marcada = elemento({ controle: true });
    const primeira = elemento({ controle: true });
    const grupo = elemento({ filhos: { [SEL_MARCADO]: marcada, [SEL_PRIMEIRO]: primeira } });
    assert.equal(controleParaFocar(grupo), marcada);
  });

  test('num grupo sem marcada, usa a primeira opção', () => {
    const primeira = elemento({ controle: true });
    const grupo = elemento({ filhos: { [SEL_PRIMEIRO]: primeira } });
    assert.equal(controleParaFocar(grupo), primeira);
  });

  test('grupo sem controle focável devolve null', () => {
    assert.equal(controleParaFocar(elemento()), null);
  });
});

describe('focarPrimeiroInvalido', () => {
  test('foca e rola até o primeiro inválido, sem rolagem automática do foco', () => {
    const registro = [];
    const campo = elemento({ controle: true, registro });
    const raiz = { querySelector: (s) => (s === SELETOR_DE_INVALIDO ? campo : null) };
    assert.equal(focarPrimeiroInvalido(raiz, false), true);
    assert.deepEqual(registro, [
      ['focus', { preventScroll: true }],
      ['scroll', { block: 'center', behavior: 'smooth' }],
    ]);
  });

  test('com movimento reduzido a rolagem é instantânea', () => {
    const registro = [];
    const campo = elemento({ controle: true, registro });
    focarPrimeiroInvalido({ querySelector: () => campo }, true);
    assert.equal(registro[1][1].behavior, 'auto');
  });

  test('sem marcador de erro, não faz nada', () => {
    assert.equal(focarPrimeiroInvalido({ querySelector: () => null }, false), false);
    assert.equal(focarPrimeiroInvalido(null, false), false);
  });

  test('o seletor cobre campos e grupos', () => {
    assert.match(SELETOR_DE_INVALIDO, /aria-invalid="true"/);
    assert.match(SELETOR_DE_INVALIDO, /data-invalido="true"/);
  });
});

describe('focarPrimeiroInvalido: bordas', () => {
  test('raiz undefined não faz nada', () => {
    assert.equal(focarPrimeiroInvalido(undefined, false), false);
  });

  test('grupo inválido sem controle focável: devolve false e não foca nem rola', () => {
    const registro = [];
    const grupo = elemento({ registro });
    assert.equal(focarPrimeiroInvalido({ querySelector: () => grupo }, false), false);
    assert.deepEqual(registro, []);
  });

  test('controle desabilitado não é escolhido: o seletor das opções exclui :disabled', () => {
    // Num grupo, só chegam a ser consultados seletores com :not(:disabled).
    const consultados = [];
    const grupo = {
      matches: () => false,
      querySelector: (s) => (consultados.push(s), null),
      focus() {},
      scrollIntoView() {},
    };
    assert.equal(controleParaFocar(grupo), null);
    assert.equal(consultados.length, 2);
    for (const s of consultados) assert.match(s, /:not\(:disabled\)/);
  });

  test('grupo com a opção marcada desabilitada cai na primeira opção habilitada', () => {
    const primeira = elemento({ controle: true });
    // O seletor de marcada exclui desabilitadas, então não acha nada.
    const grupo = elemento({ filhos: { [SEL_PRIMEIRO]: primeira } });
    assert.equal(controleParaFocar(grupo), primeira);
  });

  test('um campo inválido que é ele mesmo desabilitado ainda é devolvido (limitação conhecida)', () => {
    // matches() é sobre o tipo do elemento, não sobre o estado: o navegador
    // simplesmente ignora focus() em desabilitado. Documenta o comportamento.
    const campo = elemento({ controle: true });
    assert.equal(controleParaFocar(campo), campo);
  });
});

describe('preferenciaDeMovimentoReduzido', () => {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const restaurar = () => {
    if (original) Object.defineProperty(globalThis, 'window', original);
    else delete globalThis.window;
  };

  test('fora do navegador (sem window) assume movimento reduzido', () => {
    delete globalThis.window;
    try {
      assert.equal(preferenciaDeMovimentoReduzido(), true);
    } finally {
      restaurar();
    }
  });

  test('window sem matchMedia assume movimento reduzido', () => {
    globalThis.window = {};
    try {
      assert.equal(preferenciaDeMovimentoReduzido(), true);
    } finally {
      restaurar();
    }
  });

  test('lê a consulta prefers-reduced-motion do sistema', () => {
    for (const matches of [true, false]) {
      const consultas = [];
      globalThis.window = { matchMedia: (q) => (consultas.push(q), { matches }) };
      try {
        assert.equal(preferenciaDeMovimentoReduzido(), matches);
        assert.deepEqual(consultas, ['(prefers-reduced-motion: reduce)']);
      } finally {
        restaurar();
      }
    }
  });
});

describe('focarPrimeiroInvalido: scrollIntoView ausente', () => {
  test('elemento sem scrollIntoView (ambiente antigo) lança TypeError depois de focar', () => {
    const registro = [];
    const campo = { matches: () => true, querySelector: () => null, focus: () => registro.push('focus') };
    assert.throws(() => focarPrimeiroInvalido({ querySelector: () => campo }, false), TypeError);
    assert.deepEqual(registro, ['focus']);
  });
});
