/**
 * Cálculos simples sobre a carteira agregada.
 *
 * Só imports de tipo, para que os testes rodem direto no Node.
 */
import type { FaixaDeRisco, ProdutoresPorFaixa } from './tipos';

/** Ordem de leitura das faixas em todo o painel: da melhor para a pior. */
export const ORDEM_DAS_FAIXAS: FaixaDeRisco[] = ['saudavel', 'atencao', 'risco'];

/** Retorna 0 quando o total é zero, para nunca mostrar "NaN%" na tela. */
export function calcularPercentual(parte: number, total: number): number {
  if (total <= 0) return 0;
  return (parte / total) * 100;
}

export function somarProdutoresPorFaixa(produtoresPorFaixa: ProdutoresPorFaixa): number {
  return ORDEM_DAS_FAIXAS.reduce((soma, faixa) => soma + produtoresPorFaixa[faixa], 0);
}
