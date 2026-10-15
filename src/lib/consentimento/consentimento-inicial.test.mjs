/**
 * LGPD: os dois consentimentos começam DESLIGADOS, e um localStorage vazio,
 * corrompido ou parcial nunca liga nada. Os hooks são executados com um
 * renderizador mínimo e um `window.localStorage` falso (sem DOM).
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { carregarModulo, criarRenderizador } from '../../test-utils/carregar-tsx.mjs';
import { consentimentoInicial, quantidadeDeInstituicoesAutorizadas } from './consentimento.ts';
import { consentimentoEstatisticoInicial } from './consentimento-estatistico.ts';

const caminho = (arq) => fileURLToPath(new URL(arq, import.meta.url));

function lerHook(arquivo, nomeDoHook, stubsDoModulo, armazenamento) {
  const storage = {
    getItem: (k) => {
      if (armazenamento === 'erro') throw new Error('SecurityError');
      return armazenamento[k] ?? null;
    },
    setItem() {},
  };
  let resultado;
  criarRenderizador(
    (react) => {
      const hook = carregarModulo(caminho(arquivo), {
        react,
        stubs: stubsDoModulo,
        globais: { window: { localStorage: storage } },
      })[nomeDoHook];
      return () => {
        resultado = hook();
        return null;
      };
    },
    {},
  );
  return resultado;
}

const lerOriginacao = (armazenamento) =>
  lerHook('./useConsentimentoDeOriginacao.ts', 'useConsentimentoDeOriginacao', {
    './consentimento': carregarRegras('./consentimento.ts'),
  }, armazenamento);
const lerEstatistico = (armazenamento) =>
  lerHook('./useConsentimentoEstatistico.ts', 'useConsentimentoEstatistico', {
    './consentimento-estatistico': carregarRegras('./consentimento-estatistico.ts'),
  }, armazenamento);

// Carrega o módulo de regras pelo mesmo caminho de transpilação dos hooks.
function carregarRegras(arq) {
  return carregarModulo(caminho(arq));
}

const CHAVE_O = 'mcr:consentimento-originacao:v2';
const CHAVE_E = 'mcr:consentimento-estatistico:v1';

describe('estado inicial', () => {
  test('consentimentoInicial não autoriza nenhuma instituição', () => {
    assert.deepEqual(consentimentoInicial.autorizacoesAtivas, {});
    assert.deepEqual(consentimentoInicial.historico, []);
    assert.equal(quantidadeDeInstituicoesAutorizadas(consentimentoInicial), 0);
  });

  test('consentimentoEstatisticoInicial não autoriza nada', () => {
    assert.equal(consentimentoEstatisticoInicial.autorizado, false);
    assert.equal(consentimentoEstatisticoInicial.autorizadoEm, null);
    assert.deepEqual(consentimentoEstatisticoInicial.historico, []);
  });
});

describe('hook da originação com localStorage problemático', () => {
  const semAutorizacao = (r) => assert.equal(quantidadeDeInstituicoesAutorizadas(r.consentimento), 0);

  test('vazio: nada autorizado e carregado=true', () => {
    const r = lerOriginacao({});
    semAutorizacao(r);
    assert.equal(r.carregado, true);
  });

  for (const [nome, valor] of [
    ['JSON inválido', '{nao-e-json'],
    ['null', 'null'],
    ['número', '42'],
    ['array', '[]'],
    ['objeto vazio', '{}'],
    ['campos parciais (só histórico)', '{"historico":[]}'],
  ]) {
    test(`${nome}: nada autorizado`, () => {
      const r = lerOriginacao({ [CHAVE_O]: valor });
      semAutorizacao(r);
      assert.equal(r.carregado, true);
    });
  }

  test('getItem lançando erro: nada autorizado e carregado=true', () => {
    const r = lerOriginacao('erro');
    semAutorizacao(r);
    assert.equal(r.carregado, true);
  });

  test('autorização salva na v1 não é herdada (só sinaliza o aviso)', () => {
    const r = lerOriginacao({
      'mcr:consentimento-originacao:v1': JSON.stringify({ autorizacoesAtivas: { banco: '2026-01-01' } }),
    });
    semAutorizacao(r);
    assert.equal(r.haviaAutorizacaoAntiga, true);
  });

  test('autorizacoesAtivas com tipo errado (string) não vira autorização', () => {
    const r = lerOriginacao({ [CHAVE_O]: '{"autorizacoesAtivas":"banco"}' });
    // Esperado: tratado como corrompido, sem autorizar ninguém.
    assert.deepEqual(r.consentimento.autorizacoesAtivas, {});
  });
});

describe('hook estatístico com localStorage problemático', () => {
  test('vazio: desligado', () => {
    const r = lerEstatistico({});
    assert.equal(r.consentimento.autorizado, false);
    assert.equal(r.carregado, true);
  });

  for (const [nome, valor] of [
    ['JSON inválido', 'xxx'],
    ['null', 'null'],
    ['objeto vazio', '{}'],
    ['autorizado como string "true"', '{"autorizado":"true","autorizadoEm":"2026-01-01"}'],
    ['autorizado como 1', '{"autorizado":1,"autorizadoEm":"2026-01-01"}'],
    ['autorizado false com data preenchida', '{"autorizado":false,"autorizadoEm":"2026-01-01"}'],
    ['só historico', '{"historico":[{"acao":"autorizou","em":"x"}]}'],
  ]) {
    test(`${nome}: desligado e sem data de autorização`, () => {
      const r = lerEstatistico({ [CHAVE_E]: valor });
      assert.equal(r.consentimento.autorizado, false);
      assert.equal(r.consentimento.autorizadoEm, null);
    });
  }

  test('getItem lançando erro: desligado e carregado=true', () => {
    const r = lerEstatistico('erro');
    assert.equal(r.consentimento.autorizado, false);
    assert.equal(r.carregado, true);
  });

  test('autorizado:true explícito é respeitado (controle positivo)', () => {
    const r = lerEstatistico({ [CHAVE_E]: '{"autorizado":true,"autorizadoEm":"2026-01-01"}' });
    assert.equal(r.consentimento.autorizado, true);
  });
});
