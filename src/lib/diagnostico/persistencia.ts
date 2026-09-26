/**
 * Como o diagnóstico fica guardado no aparelho do produtor.
 *
 * Versão atual: `mcr:diagnostico:v2`. A versão 1 (do diagnóstico antigo, de
 * dívida) NUNCA é sobrescrita: quando só ela existe, aproveitamos o que dá
 * (cultura, sacas e preço) e seguimos na versão 2. O valor da dívida antiga
 * não é aproveitado de propósito: era o saldo total, e a conta nova precisa
 * da parcela desta safra. Usar um no lugar do outro daria um resultado errado.
 *
 * Tudo aqui é puro (sem `localStorage`), para poder ser testado no Node. O
 * hook `useDiagnosticoSalvo` faz a leitura e a escrita de verdade.
 */
import { ehIdDeTela, primeiraTelaIncompleta } from './fluxo.ts';
import type { IdDaTela } from './fluxo.ts';
import { respostasVazias } from './respostas-vazias.ts';
import type { Cultura, RespostasDoDiagnostico } from './tipos.ts';

export const CHAVE_DO_DIAGNOSTICO = 'mcr:diagnostico:v2';
export const CHAVE_DO_DIAGNOSTICO_ANTIGO = 'mcr:diagnostico:v1';

export type EstadoSalvo = {
  versao: 2;
  respostas: RespostasDoDiagnostico;
  /** Identificador da tela, não a posição: o caminho muda com o perfil. */
  telaAtual: IdDaTela;
  /** Momento da última gravação, no formato ISO. */
  salvoEm: string | null;
};

export function serializarEstado(estado: EstadoSalvo): string {
  return JSON.stringify(estado);
}

/**
 * Lê o que está guardado na versão 2. Qualquer coisa estranha (texto
 * quebrado, versão diferente) vira `null`: melhor recomeçar do que travar.
 */
export function lerEstadoSalvo(texto: string | null): EstadoSalvo | null {
  if (!texto) return null;
  try {
    const lido = JSON.parse(texto) as Partial<EstadoSalvo>;
    if (lido.versao !== 2 || typeof lido.respostas !== 'object' || lido.respostas === null) return null;

    // Mescla sobre o formato vazio, para um campo novo nunca ficar indefinido.
    const respostas: RespostasDoDiagnostico = {
      ...respostasVazias,
      ...lido.respostas,
      outrosPagamentos: { ...respostasVazias.outrosPagamentos, ...lido.respostas.outrosPagamentos },
      versao: 2,
    };
    const telaAtual = ehIdDeTela(lido.telaAtual) ? lido.telaAtual : primeiraTelaIncompleta(respostas);
    return { versao: 2, respostas, telaAtual, salvoEm: lido.salvoEm ?? null };
  } catch {
    return null;
  }
}

/* --------------------------------------------------------- versão 1 */

/** O formato do diagnóstico antigo, só com o que interessa para a migração. */
type RespostasDaVersao1 = {
  crop?: 'arabica' | 'conilon' | 'cafe-e-outras' | 'outra' | null;
  expectedBags?: number | null;
  pricePerBag?: number | null;
};

/**
 * "Café e outra cultura" não diz se o café é arábica ou conilon: não
 * adivinhamos, e a pergunta volta em branco.
 */
const culturaDaVersao1: Record<string, Cultura | null> = {
  arabica: 'cafe-arabica',
  conilon: 'cafe-conilon',
  'cafe-e-outras': null,
  outra: 'outra',
};

export type ResultadoDaMigracao = { estado: EstadoSalvo; respostasAproveitadas: number };

/** Aproveita cultura, sacas e preço do diagnóstico antigo. Devolve `null` se não houver nada útil. */
export function migrarDaVersao1(texto: string | null): ResultadoDaMigracao | null {
  if (!texto) return null;
  let antigas: RespostasDaVersao1;
  try {
    antigas = (JSON.parse(texto) as { answers?: RespostasDaVersao1 }).answers ?? {};
  } catch {
    return null;
  }

  const respostas: RespostasDoDiagnostico = { ...respostasVazias };
  let respostasAproveitadas = 0;

  const cultura = antigas.crop ? culturaDaVersao1[antigas.crop] : null;
  if (cultura) {
    respostas.cultura = cultura;
    respostasAproveitadas += 1;
  }
  if (typeof antigas.expectedBags === 'number' && antigas.expectedBags > 0) {
    respostas.producaoEsperadaSacas = { forma: 'exato', valor: antigas.expectedBags };
    respostasAproveitadas += 1;
  }
  if (typeof antigas.pricePerBag === 'number' && antigas.pricePerBag > 0) {
    respostas.precoPorSaca = { forma: 'exato', valor: antigas.pricePerBag };
    respostasAproveitadas += 1;
  }

  if (respostasAproveitadas === 0) return null;
  // O perfil não existia antes: o produtor começa por ele, com o resto já preenchido.
  return { estado: { versao: 2, respostas, telaAtual: 'perfil', salvoEm: null }, respostasAproveitadas };
}
