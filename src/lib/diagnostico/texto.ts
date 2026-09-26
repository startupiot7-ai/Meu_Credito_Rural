/**
 * Como os números do motor aparecem nas frases do resultado.
 *
 * Valores em reais vêm arredondados para o milhar e com "cerca de": uma
 * simulação feita com estimativas não merece centavos.
 */
import { formatCurrency, formatNumber, formatPercent } from '../format.ts';

/** 267.412 -> "cerca de R$ 267.000". */
export function reaisAproximados(valor: number): string {
  return `cerca de ${formatCurrency(Math.round(Math.abs(valor) / 1000) * 1000)}`;
}

/** 0,2 -> "20%". */
export function percentual(fracao: number): string {
  return formatPercent(Math.round(fracao * 100));
}

/** 180,4 -> "180 sacas". */
export function sacas(quantidade: number): string {
  const arredondado = Math.round(quantidade);
  return `${formatNumber(arredondado)} ${arredondado === 1 ? 'saca' : 'sacas'}`;
}
