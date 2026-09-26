/**
 * Cálculos simples sobre a carteira agregada.
 *
 * Só imports de tipo, para que os testes rodem direto no Node.
 */
import type { FaixaDaMargem, ProdutoresPorSituacao, SituacaoNoPainel } from './tipos';

/** Ordem de leitura das situações em todo o painel: da melhor para a pior. */
export const ORDEM_DAS_SITUACOES: SituacaoNoPainel[] = ['cobre-com-folga', 'cobre-apertado', 'nao-cobre'];

/** Ordem das faixas de margem: de quem não tem margem a quem tem mais. */
export const ORDEM_DAS_FAIXAS_DE_MARGEM: FaixaDaMargem[] = [
  'sem-margem',
  'ate-10',
  'de-10-a-20',
  'de-20-a-30',
  'acima-de-30',
];

/** Retorna 0 quando o total é zero, para nunca mostrar "NaN%" na tela. */
export function calcularPercentual(parte: number, total: number): number {
  if (total <= 0) return 0;
  return (parte / total) * 100;
}

export function somarProdutoresPorSituacao(produtoresPorSituacao: ProdutoresPorSituacao): number {
  return ORDEM_DAS_SITUACOES.reduce((soma, situacao) => soma + produtoresPorSituacao[situacao], 0);
}

/** Soma os números de um registro, como as faixas de margem ou a exposição climática. */
export function somarQuantidades(quantidades: Record<string, number>): number {
  return Object.values(quantidades).reduce((soma, quantidade) => soma + quantidade, 0);
}
