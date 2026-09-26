/**
 * Formatação de valores para o público institucional.
 *
 * O gestor lê carteiras inteiras: "R$ 412 mi" é mais rápido de comparar do que
 * "R$ 412.000.000". Os valores exatos continuam disponíveis onde importam.
 */

const moedaAbreviada = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  notation: 'compact',
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const dataCurta = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' });

const dataComHora = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});

/** 412000000 -> "R$ 412 mi"; 61400000 -> "R$ 61,4 mi" */
export function formatarMoedaAbreviada(valor: number): string {
  return moedaAbreviada.format(valor).replace(/ /g, ' ');
}

/** "2026-09-02" -> "02/09/2026" */
export function formatarData(dataIso: string): string {
  // Datas sem horário são lidas ao meio-dia para não "voltar um dia" por fuso.
  const data = dataIso.length === 10 ? new Date(`${dataIso}T12:00:00`) : new Date(dataIso);
  return dataCurta.format(data);
}

/** "2026-09-25T18:00:00-03:00" -> "25 de setembro de 2026 às 18:00" */
export function formatarDataComHora(dataIso: string): string {
  return dataComHora.format(new Date(dataIso));
}
