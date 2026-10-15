/**
 * Testes do Button: bloqueio de cliques durante `loading`.
 *
 * O executor do Node não carrega .tsx, então o Button.tsx é transpilado em
 * memória com o `typescript` do projeto (já instalado) e executado com
 * stubs para os imports de alias/Next. React é o real. Sem dependência nova.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const React = require('react');

function carregarButton() {
  const fonte = readFileSync(new URL('./Button.tsx', import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(fonte, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
    },
  });
  const stubs = {
    react: React,
    'next/link': { default: () => null },
    '@/lib/cn': { cn: (...a) => a.filter(Boolean).join(' ') },
    './Icon': { SpinnerIcon: () => null },
  };
  const modulo = { exports: {} };
  vm.runInNewContext(outputText, {
    React,
    module: modulo,
    exports: modulo.exports,
    require: (id) => {
      if (!(id in stubs)) throw new Error(`import inesperado no Button: ${id}`);
      return stubs[id];
    },
  });
  return modulo.exports.Button;
}

// forwardRef devolve um objeto com `render(props, ref)`.
function renderizar(props) {
  const Button = carregarButton();
  return Button.render({ children: 'Ver meu resultado', ...props }, null);
}

function eventoFalso() {
  let prevenido = false;
  return { preventDefault: () => (prevenido = true), get prevenido() { return prevenido; } };
}

describe('Button com loading', () => {
  test('não aciona o onClick recebido enquanto loading é true', () => {
    let chamadas = 0;
    const el = renderizar({ loading: true, onClick: () => chamadas++ });
    const evento = eventoFalso();
    el.props.onClick?.(evento);
    el.props.onClick?.(evento);
    assert.equal(chamadas, 0);
  });

  test('marca aria-disabled e aria-busy enquanto loading', () => {
    const el = renderizar({ loading: true, onClick: () => {} });
    assert.equal(el.props['aria-disabled'], true);
    assert.equal(el.props['aria-busy'], true);
  });

  test('aciona o onClick normalmente quando não está em loading', () => {
    let chamadas = 0;
    const el = renderizar({ onClick: () => chamadas++ });
    el.props.onClick(eventoFalso());
    assert.equal(chamadas, 1);
  });
});
