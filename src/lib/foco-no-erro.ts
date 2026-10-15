/**
 * Foco no primeiro campo inválido.
 *
 * Os campos de texto marcam o erro com `aria-invalid="true"`. Grupos de opções
 * (fieldset de rádio/checkbox) marcam com `data-invalido="true"`, porque
 * `aria-invalid` não é um atributo válido para um grupo genérico. A ordem do
 * documento é a ordem visual, então o primeiro marcador é o primeiro campo
 * com erro.
 */

export const SELETOR_DE_INVALIDO = '[aria-invalid="true"], [data-invalido="true"]';

const SELETOR_DE_CONTROLE = 'input, select, textarea';

/** Parte de `HTMLElement` que esta lógica usa; permite testar sem DOM. */
export type ElementoFocavel = {
  matches(seletor: string): boolean;
  querySelector(seletor: string): ElementoFocavel | null;
  focus(opcoes?: { preventScroll?: boolean }): void;
  scrollIntoView(opcoes?: { block?: 'center' | 'nearest'; behavior?: 'auto' | 'smooth' }): void;
};

export type RaizDeBusca = {
  querySelector(seletor: string): ElementoFocavel | null;
};

/**
 * Devolve o controle que deve receber o foco para um marcador de erro: o
 * próprio campo, ou, num grupo, a opção marcada (se houver) ou a primeira.
 */
export function controleParaFocar(marcador: ElementoFocavel): ElementoFocavel | null {
  if (marcador.matches(SELETOR_DE_CONTROLE)) return marcador;
  return (
    marcador.querySelector('input:checked:not(:disabled)') ??
    marcador.querySelector('input:not(:disabled), select:not(:disabled), textarea:not(:disabled)')
  );
}

/**
 * Foca o primeiro campo inválido dentro de `raiz` e o traz para a vista.
 * Devolve `true` se achou algum. Chame depois do render que mostra o erro.
 *
 * `block: 'center'` mantém o campo longe do cabeçalho e da barra fixa de ações.
 * Com movimento reduzido, a rolagem é instantânea.
 */
export function focarPrimeiroInvalido(
  raiz: RaizDeBusca | null | undefined,
  movimentoReduzido: boolean,
): boolean {
  const marcador = raiz?.querySelector(SELETOR_DE_INVALIDO);
  if (!marcador) return false;
  const alvo = controleParaFocar(marcador);
  if (!alvo) return false;
  // preventScroll: a rolagem é feita abaixo, com a margem e o comportamento certos.
  alvo.focus({ preventScroll: true });
  alvo.scrollIntoView({ block: 'center', behavior: movimentoReduzido ? 'auto' : 'smooth' });
  return true;
}

/** Lê a preferência do sistema; fora do navegador, assume movimento reduzido. */
export function preferenciaDeMovimentoReduzido(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
