import { cn } from '@/lib/cn';
import { formatCurrency, formatPercent, riskLevelFromRatio } from '@/lib/format';
import type { RiskLevel } from '@/lib/format';
import { StatusBadge } from './StatusBadge';

/**
 * DebtShareChart — how much of the harvest is already spoken for.
 *
 * Simplification pass: this used to show the percentage, a badge, the bar, a
 * two-column table of both currency figures, and a four-line paragraph — five
 * ways of saying one thing. What is left is the number, what it means in one
 * sentence, the bar, and the money that is actually left over.
 *
 * The rule that did not change: the percentage never appears alone. The line
 * under it always says what it means in money.
 *
 * Encoding: the status colour is reinforced by an icon and a written label on
 * the badge, and the remainder is stated in text, so the reading survives
 * greyscale and colour blindness.
 */

export type DebtShareChartProps = {
  /** Revenue the harvest is expected to generate, in BRL. */
  revenue: number;
  /** Debt reported by the producer, in BRL. */
  debt: number;
  className?: string;
};

const tones: Record<RiskLevel, { bar: string; badge: 'healthy' | 'attention' | 'risk'; label: string }> = {
  healthy: { bar: 'bg-healthy-solid', badge: 'healthy', label: 'Peso baixo' },
  attention: { bar: 'bg-attention-solid', badge: 'attention', label: 'Peso relevante' },
  risk: { bar: 'bg-risk-solid', badge: 'risk', label: 'Peso alto' },
};

export function DebtShareChart({ revenue, debt, className }: DebtShareChartProps) {
  if (revenue <= 0) {
    return (
      <p className={cn('text-body text-ink-600', className)}>
        Informe a produção e o preço para ver o peso da dívida.
      </p>
    );
  }

  const ratio = (debt / revenue) * 100;
  // The bar is capped so a debt larger than the revenue still draws; the
  // figure in the label is never capped.
  const barShare = Math.min(ratio, 100);
  const tone = tones[riskLevelFromRatio(ratio)];
  const remaining = revenue - debt;

  return (
    <figure className={cn('m-0', className)}>
      <figcaption className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <span className="font-display text-display-lg font-bold leading-none tabular-nums text-ink-900">
          {formatPercent(Math.round(ratio))}
        </span>
        <StatusBadge tone={tone.badge} size="sm">
          {tone.label}
        </StatusBadge>
      </figcaption>

      <p className="mt-3 text-body-lg leading-snug text-ink-800">
        da receita da safra já está comprometida com a dívida.
      </p>

      <div aria-hidden className="mt-4 h-3 w-full overflow-hidden rounded-full bg-sand-200">
        <div
          className={cn('h-full rounded-full transition-[width] duration-slow ease-enter', tone.bar)}
          style={{ width: `${barShare}%` }}
        />
      </div>

      <p className="mt-3 text-body text-ink-600">
        {remaining > 0 ? (
          <>
            Sobram{' '}
            <strong className="font-semibold tabular-nums text-ink-900">
              {formatCurrency(remaining)}
            </strong>{' '}
            para custear a produção.
          </>
        ) : (
          <>A dívida já passa da receita esperada para esta safra.</>
        )}
      </p>
    </figure>
  );
}

export type ComparisonBarProps = {
  label: string;
  /** Value drawn, in the same unit as `max`. */
  value: number;
  max: number;
  /** pt-BR text shown beside the label. */
  valueLabel: string;
  /** Marks the row worth looking at first — used once per comparison. */
  highlighted?: boolean;
  className?: string;
};

/**
 * One labelled bar for a side-by-side comparison. One measure, one axis,
 * always directly labelled — no second scale, no legend to decode.
 */
export function ComparisonBar({
  label,
  value,
  max,
  valueLabel,
  highlighted = false,
  className,
}: ComparisonBarProps) {
  const share = max > 0 ? Math.max(4, Math.min(100, (value / max) * 100)) : 0;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span className={cn('text-body', highlighted ? 'font-semibold text-ink-900' : 'text-ink-800')}>
          {label}
        </span>
        <span className="text-body-lg font-semibold tabular-nums text-ink-900">{valueLabel}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-sand-200">
        <div
          className={cn('h-full rounded-full', highlighted ? 'bg-beam-500' : 'bg-canopy-600')}
          style={{ width: `${share}%` }}
        />
      </div>
    </div>
  );
}
