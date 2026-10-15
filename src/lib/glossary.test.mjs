/**
 * Garante que toda chave usada em <Term term="..."> existe no glossário e que
 * as entradas estão completas. Varre o código-fonte (sem DOM).
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { glossary, glossaryText } from './glossary.ts';

const RAIZ_SRC = fileURLToPath(new URL('..', import.meta.url));

function arquivos(dir, achados = []) {
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) arquivos(caminho, achados);
    else if (/\.(tsx|ts)$/.test(nome)) achados.push(caminho);
  }
  return achados;
}

function usosDeTerm() {
  const usos = [];
  for (const arquivo of arquivos(RAIZ_SRC)) {
    const fonte = readFileSync(arquivo, 'utf8');
    for (const m of fonte.matchAll(/<Term\b[^>]*?\bterm=(?:"([^"]+)"|\{\s*['"]([^'"]+)['"]\s*\})/gs)) {
      usos.push({ arquivo, chave: m[1] ?? m[2] });
    }
    // <Term com term dinâmico (variável) não dá para checar estaticamente.
    for (const m of fonte.matchAll(/<Term\b[^>]*?\bterm=\{(?!\s*['"])/gs)) {
      usos.push({ arquivo, chave: null, dinamico: m[0] });
    }
  }
  return usos;
}

describe('glossário', () => {
  test('o projeto usa <Term> (varredura achou usos)', () => {
    assert.ok(usosDeTerm().length > 0);
  });

  test('toda chave usada em <Term term="..."> existe no glossário', () => {
    const faltando = usosDeTerm()
      .filter((u) => u.chave && !(u.chave in glossary))
      .map((u) => `${u.arquivo}: ${u.chave}`);
    assert.deepEqual(faltando, []);
  });

  test('não há <Term> com chave dinâmica (que a varredura não consegue checar)', () => {
    assert.deepEqual(usosDeTerm().filter((u) => u.dinamico).map((u) => u.arquivo), []);
  });

  test('as chaves barter e trading existem', () => {
    assert.ok('barter' in glossary);
    assert.ok('trading' in glossary);
  });

  test('toda entrada tem term e definition não vazios', () => {
    for (const [chave, entrada] of Object.entries(glossary)) {
      assert.ok(entrada.term?.trim(), `${chave}: term vazio`);
      assert.ok(entrada.definition?.trim(), `${chave}: definition vazia`);
    }
  });

  test('glossaryText devolve texto para toda chave', () => {
    for (const chave of Object.keys(glossary)) {
      assert.ok(glossaryText(chave).includes(glossary[chave].definition), chave);
    }
  });
});
