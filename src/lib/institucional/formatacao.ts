/**
 * Formatação de datas para o público institucional.
 *
 * O painel não mostra valores em reais: com a pivotagem, ele soma situações
 * da safra e margens, e não dívidas.
 */

const dataCurta = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' });

const dataComHora = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'America/Sao_Paulo',
});


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
