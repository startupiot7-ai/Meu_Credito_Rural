/**
 * Utilitários de teste: carrega um .ts/.tsx transpilando em memória com o
 * `typescript` do projeto e executa em `vm`, e oferece um "renderizador" mínimo
 * de hooks (sem DOM, sem dependência nova) para exercitar componentes.
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const ReactReal = require('react');

export const cn = (...a) => a.filter(Boolean).join(' ');

/** Transpila e executa o arquivo. `stubs` resolve cada import; `globais` entra no contexto. */
export function carregarModulo(caminhoAbsoluto, { stubs = {}, react = ReactReal, globais = {} } = {}) {
  const fonte = readFileSync(caminhoAbsoluto, 'utf8');
  const { outputText } = ts.transpileModule(fonte, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      jsx: ts.JsxEmit.React,
      esModuleInterop: true,
    },
  });
  const todos = { react, '@/lib/cn': { cn }, ...stubs };
  const modulo = { exports: {} };
  // Executa no mesmo realm do teste (e não num contexto novo): objetos criados
  // pelo módulo têm o mesmo Object.prototype/Array.prototype do teste, e
  // `assert.deepStrictEqual` não acusa diferença de protótipo entre realms.
  const escopo = {
    React: react,
    module: modulo,
    exports: modulo.exports,
    console,
    ...globais,
    require: (id) => {
      if (!(id in todos)) throw new Error(`import inesperado: ${id}`);
      return todos[id];
    },
  };
  const nomes = Object.keys(escopo);
  const executar = vm.runInThisContext(`(function (${nomes.join(', ')}) {${outputText}\n})`);
  executar(...nomes.map((nome) => escopo[nome]));
  return modulo.exports;
}

/**
 * Renderizador mínimo: guarda estado/refs por ordem de chamada, roda efeitos
 * depois de cada render (com limpeza do anterior) e permite re-renderizar.
 */
export function criarRenderizador(componente, props, { aoMontar } = {}) {
  const estado = [];
  const efeitos = [];
  const limpezas = [];
  let indice = 0;
  let ultimo = null;
  let usoDeId = 0;

  const react = {
    ...ReactReal,
    useState(inicial) {
      const i = indice++;
      if (!(i in estado)) estado[i] = typeof inicial === 'function' ? inicial() : inicial;
      return [
        estado[i],
        (v) => {
          const novo = typeof v === 'function' ? v(estado[i]) : v;
          if (!Object.is(novo, estado[i])) {
            estado[i] = novo;
            renderizar();
          }
        },
      ];
    },
    useRef(inicial) {
      const i = indice++;
      if (!(i in estado)) estado[i] = { current: inicial ?? null };
      return estado[i];
    },
    useId() {
      const i = indice++;
      if (!(i in estado)) estado[i] = `:r${usoDeId++}:`;
      return estado[i];
    },
    useCallback: (fn) => fn,
    useEffect(fn) {
      efeitos.push(fn);
      indice++;
    },
    useLayoutEffect(fn) {
      efeitos.push(fn);
      indice++;
    },
  };

  let emRender = false;
  let comp = null;
  function renderizar() {
    if (emRender) return;
    emRender = true;
    try {
      for (let n = 0; n < 20; n++) {
        limpezas.splice(0).forEach((l) => l());
        indice = 0;
        efeitos.length = 0;
        comp ??= componente(react);
        ultimo = comp(props);
        const pend = efeitos.slice();
        const antes = estado.slice();
        pend.forEach((e) => {
          const l = e();
          if (typeof l === 'function') limpezas.push(l);
        });
        // Efeitos podem ter mudado estado (já re-renderizando via setter bloqueado por emRender).
        if (estado.some((v, i) => !Object.is(v, antes[i]))) continue;
        break;
      }
    } finally {
      emRender = false;
    }
  }
  renderizar();
  aoMontar?.();
  return {
    get arvore() {
      return ultimo;
    },
    desmontar: () => limpezas.splice(0).forEach((l) => l()),
  };
}

/** Percorre a árvore de elementos React e devolve os que satisfazem o predicado. */
export function buscar(no, pred, achados = []) {
  if (no == null || typeof no !== 'object') return achados;
  if (Array.isArray(no)) {
    no.forEach((f) => buscar(f, pred, achados));
    return achados;
  }
  if (pred(no)) achados.push(no);
  buscar(no.props?.children, pred, achados);
  return achados;
}
