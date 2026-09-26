import { cn } from '@/lib/cn';

/**
 * ComparisonBar — one labelled bar in a side-by-side comparison.
 *
 * Used for the safety margin (how much the harvest can worsen before money
 * runs out) and for portfolio distributions. One measure, one axis, always
 * directly labelled.
 *
 * The debt-share chart that used to live next to it was removed with the
 * pivot to prevention: it encoded a fixed "30% / 50% of revenue" rule that
 * had no source and ignored production costs.
 */

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
