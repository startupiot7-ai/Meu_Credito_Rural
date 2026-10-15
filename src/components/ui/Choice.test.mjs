/**
 * Testes do Choice: atributos ARIA do grupo de opções e do Checkbox, ligação
 * do erro por aria-describedby e o comportamento da prop `card`.
 * Renderiza a função componente sem DOM (ver src/test-utils/carregar-tsx.mjs).
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { buscar, carregarModulo, criarRenderizador } from '../../test-utils/carregar-tsx.mjs';

const caminho = (arq) => fileURLToPath(new URL(arq, import.meta.url));
const Icone = () => null;

function carregar(react) {
  const FieldError = carregarModulo(caminho('./FieldError.tsx'), {
    react,
    stubs: { './Icon': { AlertCircleIcon: Icone } },
  }).FieldError;
  return carregarModulo(caminho('./Choice.tsx'), {
    react,
    stubs: { './FieldError': { FieldError }, './Icon': { CheckIcon: Icone } },
  });
}

function renderizar(nome, props) {
  return criarRenderizador((react) => carregar(react)[nome], props).arvore;
}

const porTipo = (arvore, tipo) => buscar(arvore, (n) => n.type === tipo);
const ehErro = (n) => typeof n.type === 'function' && n.props?.role === undefined && 'id' in n.props && n.type.name === 'FieldError';

describe('RadioCardGroup', () => {
  test('sem erro: não marca data-invalido nem aria-describedby', () => {
    const arvore = renderizar('RadioCardGroup', { legend: 'Pergunta', id: 'g', children: null });
    assert.equal(arvore.type, 'fieldset');
    assert.equal(arvore.props.id, 'g');
    assert.equal(arvore.props['data-invalido'], undefined);
    assert.equal(arvore.props['aria-describedby'], undefined);
    assert.equal(buscar(arvore, ehErro).length, 0);
  });

  test('com erro: data-invalido e aria-describedby apontam para o id do elemento de erro', () => {
    const arvore = renderizar('RadioCardGroup', { legend: 'Pergunta', id: 'g', error: 'Escolha uma opção', children: null });
    assert.equal(arvore.props['data-invalido'], true);
    assert.equal(arvore.props['aria-describedby'], 'g-erro');
    const erros = buscar(arvore, ehErro);
    assert.equal(erros.length, 1);
    assert.equal(erros[0].props.id, arvore.props['aria-describedby']);
    assert.equal(erros[0].props.children, 'Escolha uma opção');
  });

  test('sem id informado, usa um id gerado e o erro deriva dele', () => {
    const arvore = renderizar('RadioCardGroup', { legend: 'P', error: 'x', children: null });
    assert.ok(arvore.props.id);
    assert.equal(arvore.props['aria-describedby'], `${arvore.props.id}-erro`);
    assert.equal(buscar(arvore, ehErro)[0].props.id, `${arvore.props.id}-erro`);
  });

  test('erro vazio (string vazia) é tratado como sem erro', () => {
    const arvore = renderizar('RadioCardGroup', { legend: 'P', id: 'g', error: '', children: null });
    assert.equal(arvore.props['data-invalido'], undefined);
    assert.equal(arvore.props['aria-describedby'], undefined);
  });
});

describe('FieldError', () => {
  test('é um alerta com o id recebido', () => {
    const FieldError = carregarModulo(caminho('./FieldError.tsx'), {
      stubs: { './Icon': { AlertCircleIcon: Icone } },
    }).FieldError;
    const el = FieldError({ id: 'abc', children: 'Erro' });
    assert.equal(el.type, 'p');
    assert.equal(el.props.role, 'alert');
    assert.equal(el.props.id, 'abc');
  });
});

describe('Checkbox', () => {
  const entrada = (arvore) => porTipo(arvore, 'input')[0];

  test('sem erro: sem aria-invalid e sem aria-describedby', () => {
    const arvore = renderizar('Checkbox', { checked: false, onChange() {}, label: 'Não sei' });
    const input = entrada(arvore);
    assert.equal(input.props['aria-invalid'], undefined);
    assert.equal(input.props['aria-describedby'], undefined);
    assert.equal(buscar(arvore, ehErro).length, 0);
  });

  for (const card of [false, true]) {
    test(`com erro (card=${card}): aria-invalid e aria-describedby apontam para o erro`, () => {
      const arvore = renderizar('Checkbox', { checked: false, onChange() {}, label: 'x', error: 'Obrigatório', card });
      const input = entrada(arvore);
      assert.equal(input.props['aria-invalid'], true);
      const erros = buscar(arvore, ehErro);
      assert.equal(erros.length, 1);
      assert.equal(erros[0].props.id, input.props['aria-describedby']);
      assert.ok(input.props['aria-describedby']);
    });

    test(`card=${card}: preserva checked e dispara onChange com o valor do input`, () => {
      for (const checked of [true, false]) {
        const chamadas = [];
        const arvore = renderizar('Checkbox', { checked, onChange: (v) => chamadas.push(v), label: 'x', card });
        const input = entrada(arvore);
        assert.equal(input.props.checked, checked);
        input.props.onChange({ target: { checked: !checked } });
        assert.deepEqual(chamadas, [!checked]);
      }
    });
  }

  test('card não altera o tipo nem o disabled do input', () => {
    const base = { checked: true, onChange() {}, label: 'x', disabled: true };
    const a = entrada(renderizar('Checkbox', base)).props;
    const b = entrada(renderizar('Checkbox', { ...base, card: true })).props;
    assert.equal(a.type, 'checkbox');
    assert.equal(b.type, 'checkbox');
    assert.equal(a.disabled, b.disabled);
    assert.equal(a.checked, b.checked);
  });

  test('card troca só a moldura da label (borda de 2px e 44 px de altura mínima)', () => {
    const sem = porTipo(renderizar('Checkbox', { checked: false, onChange() {}, label: 'x' }), 'label')[0];
    const com = porTipo(renderizar('Checkbox', { checked: false, onChange() {}, label: 'x', card: true }), 'label')[0];
    assert.doesNotMatch(sem.props.className, /border-2/);
    assert.match(com.props.className, /border-2/);
    assert.match(com.props.className, /min-h-touch/);
  });
});
