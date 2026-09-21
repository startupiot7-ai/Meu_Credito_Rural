/**
 * pt-BR formatting and parsing helpers.
 *
 * Every number the producer sees is written the way they would write it:
 * "R$ 750.000", "40%", "1.500 sacas". Inputs accept the same shapes.
 */

const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const BRL_CENTS = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const DECIMAL = new Intl.NumberFormat('pt-BR');

/** 750000 -> "R$ 750.000" (no cents — the amounts here are large and round). */
export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '';
  return BRL.format(value).replace(/ /g, ' ');
}

/** 1500.5 -> "R$ 1.500,50". Used where precision is actually meaningful. */
export function formatCurrencyWithCents(value: number): string {
  return BRL_CENTS.format(value).replace(/ /g, ' ');
}

/** 500 -> "500"; 1500 -> "1.500" */
export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '';
  return DECIMAL.format(value);
}

/** 40 -> "40%"; 40.5 -> "40,5%" */
export function formatPercent(value: number | null | undefined, decimals = 0): string {
  if (value === null || value === undefined || Number.isNaN(value)) return '';
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
}

/**
 * Turns whatever the user typed into a number.
 * Accepts "R$ 750.000", "750000", "750.000,50", "40,5".
 * Returns `null` when there is no number in the string at all.
 */
export function parseBrNumber(raw: string): number | null {
  const cleaned = raw.replace(/[^\d,.-]/g, '');
  if (!cleaned) return null;
  // pt-BR: "." groups thousands, "," is the decimal separator.
  const normalized = cleaned.replace(/\./g, '').replace(',', '.');
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Live mask for a currency field: keeps only digits and re-groups them, so the
 * value reads correctly while the producer is still typing.
 * "750000" -> "R$ 750.000"
 */
export function maskCurrency(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  if (!digits) return '';
  return formatCurrency(Number(digits));
}

/**
 * Live mask for a percentage field. Allows one decimal place and clamps to 100,
 * which prevents the most common typo (an extra zero) before it happens.
 */
export function maskPercent(raw: string): string {
  const cleaned = raw.replace(/[^\d,]/g, '').replace(/,(?=.*,)/g, '');
  if (!cleaned) return '';
  const [whole, decimal] = cleaned.split(',');
  const wholeNumber = Math.min(Number(whole || '0'), 100);
  const base = String(wholeNumber);
  if (decimal === undefined) return `${base}%`;
  if (wholeNumber === 100) return '100%';
  return `${base},${decimal.slice(0, 1)}%`;
}

/** Digits-only mask for plain quantities such as "500 sacas". */
export function maskInteger(raw: string): string {
  const digits = raw.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  if (!digits) return '';
  return formatNumber(Number(digits));
}

/**
 * Share of projected revenue already committed to debt.
 * Returns `null` when revenue is zero or unknown — we never divide by nothing
 * and we never show a percentage we cannot justify.
 */
export function debtToRevenueRatio(debt: number, revenue: number): number | null {
  if (!revenue || revenue <= 0) return null;
  return (debt / revenue) * 100;
}

export type RiskLevel = 'healthy' | 'attention' | 'risk';

/**
 * Indicative reading of the debt-to-revenue ratio.
 *
 * NOTE: thresholds are illustrative for this front-end prototype. The real
 * analysis engine will replace them and will take culture, cycle and cost
 * structure into account.
 */
export function riskLevelFromRatio(ratio: number): RiskLevel {
  if (ratio < 30) return 'healthy';
  if (ratio < 50) return 'attention';
  return 'risk';
}
