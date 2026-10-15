/**
 * Testes da lógica de abrir/fechar do Tooltip (mouse, teclado, toque, Esc e
 * clique fora). Os handlers vivem dentro do componente, então ele é renderizado
 * com um renderizador de hooks mínimo e `document` falso, sem DOM.
 * Posicionamento (useLayoutEffect, getBoundingClientRect) NÃO é coberto aqui.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { buscar, carregarModulo, criarRenderizador } from '../../test-utils/carregar-tsx.mjs';

function montar() {
  const ouvintes = {};
  const documento = {
    addEventListener: (t, f) => (ouvintes[t] ??= new Set()).add(f),
    removeEventListener: (t, f) => ouvintes[t]?.delete(f),
  };
  const emitir = (tipo, evento) => [...(ouvintes[tipo] ?? [])].forEach((f) => f(evento));
  const r = criarRenderizador(
    (react) =>
      carregarModulo(fileURLToPath(new URL('./Tooltip.tsx', import.meta.url)), {
        react,
        globais: { document: documento, window: { innerWidth: 1000 } },
        stubs: {
          '@/lib/glossary': { glossary: {}, glossaryText: () => '' },
          './Icon': { InfoIcon: () => null },
        },
      }).Tooltip,
    { content: 'Explicação', label: 'O que é CPR?' },
  );
  const botao = () => buscar(r.arvore, (n) => n.type === 'button')[0].props;
  const aberto = () => botao()['aria-expanded'];
  const balao = () => buscar(r.arvore, (n) => n.props?.role === 'tooltip');
  return { r, botao, aberto, balao, emitir, ouvintes };
}

describe('Tooltip: mouse', () => {
  test('começa fechado, sem aria-describedby', () => {
    const t = montar();
    assert.equal(t.aberto(), false);
    assert.equal(t.botao()['aria-describedby'], undefined);
    assert.equal(t.balao().length, 0);
  });

  test('passar o mouse abre; sair fecha', () => {
    const t = montar();
    t.botao().onPointerEnter({ pointerType: 'mouse' });
    assert.equal(t.aberto(), true);
    t.botao().onPointerLeave({ pointerType: 'mouse' });
    assert.equal(t.aberto(), false);
  });

  test('aberto: o balão tem role=tooltip e o id citado por aria-describedby', () => {
    const t = montar();
    t.botao().onPointerEnter({ pointerType: 'mouse' });
    const [balao] = t.balao();
    assert.equal(t.botao()['aria-describedby'], balao.props.id);
  });

  test('clique do mouse só abre (não alterna)', () => {
    const t = montar();
    t.botao().onPointerDown({ pointerType: 'mouse' });
    t.botao().onClick();
    t.botao().onClick();
    assert.equal(t.aberto(), true);
  });
});

describe('Tooltip: teclado', () => {
  test('foco abre; blur fecha', () => {
    const t = montar();
    t.botao().onKeyDown();
    t.botao().onFocus();
    assert.equal(t.aberto(), true);
    t.botao().onBlur();
    assert.equal(t.aberto(), false);
  });

  test('Esc fecha; outras teclas não', () => {
    const t = montar();
    t.botao().onFocus();
    t.emitir('keydown', { key: 'Enter' });
    assert.equal(t.aberto(), true);
    t.emitir('keydown', { key: 'Escape' });
    assert.equal(t.aberto(), false);
  });
});

describe('Tooltip: toque', () => {
  test('um toque abre e outro toque fecha', () => {
    const t = montar();
    // Sequência real do navegador: pointerdown, mouseenter/focus ignorados, click.
    t.botao().onPointerDown({ pointerType: 'touch' });
    t.botao().onFocus();
    t.botao().onClick();
    assert.equal(t.aberto(), true);
    t.botao().onPointerDown({ pointerType: 'touch' });
    t.botao().onClick();
    assert.equal(t.aberto(), false);
  });

  test('o foco gerado pelo toque não abre sozinho (evita abrir e fechar no mesmo toque)', () => {
    const t = montar();
    t.botao().onPointerDown({ pointerType: 'touch' });
    t.botao().onFocus();
    assert.equal(t.aberto(), false);
  });

  test('pointerenter/leave de toque são ignorados', () => {
    const t = montar();
    t.botao().onPointerEnter({ pointerType: 'touch' });
    assert.equal(t.aberto(), false);
    t.botao().onPointerDown({ pointerType: 'touch' });
    t.botao().onClick();
    t.botao().onPointerLeave({ pointerType: 'touch' });
    assert.equal(t.aberto(), true);
  });

  test('toque fora do tooltip fecha', () => {
    const t = montar();
    t.botao().onPointerDown({ pointerType: 'touch' });
    t.botao().onClick();
    // wrapperRef.current é nulo sem DOM: tudo conta como "fora".
    t.emitir('pointerdown', { target: {} });
    assert.equal(t.aberto(), false);
  });

  test('depois do blur, o próximo foco por teclado volta a abrir', () => {
    const t = montar();
    t.botao().onPointerDown({ pointerType: 'touch' });
    t.botao().onClick();
    t.botao().onBlur();
    assert.equal(t.aberto(), false);
    t.botao().onFocus();
    assert.equal(t.aberto(), true);
  });
});

describe('Tooltip: ouvintes globais', () => {
  test('só registra keydown/pointerdown enquanto aberto e remove ao fechar', () => {
    const t = montar();
    assert.equal(t.ouvintes.keydown?.size ?? 0, 0);
    t.botao().onPointerEnter({ pointerType: 'mouse' });
    assert.equal(t.ouvintes.keydown.size, 1);
    assert.equal(t.ouvintes.pointerdown.size, 1);
    t.botao().onPointerLeave({ pointerType: 'mouse' });
    assert.equal(t.ouvintes.keydown.size, 0);
    assert.equal(t.ouvintes.pointerdown.size, 0);
  });
});
