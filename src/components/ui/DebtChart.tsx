import { cn } from '@/lib/cn';
import { formatCurrency, formatPercent, riskLevelFromRatio } from '@/lib/format';
import type { RiskLevel } from '@/lib/format';
import { StatusBadge } from './StatusBadge';

/**
 * DebtShareChart — how much of the projected revenue is already committed.
 *
 * This is the one number the whole product turns on, so it is drawn as a single
 * proportion bar rather than a chart with axes: one bar, two parts, both
 * labelled. The percentage never appears alone — it always sits next to the
 * sentence that says what it means.
 *
 * Encoding notes:
 *  - The status colour (verde/amarelo/vermelho) is reinforced by an icon and a
 *    written label, and every segment is directly labelled, so the reading
 *    survives greyscale, colour blindness and a bright screen in the field.
 *  - A 2px gap of page colour separates the two segments, so the boundary is a
 *    shape and not only a hue change.
 *  - The figures below the bar double as the accessible table view.
 */

export type DebtShareChartProps = {
  /** Revenue the harvest is expected to generate, in BRL. */
  revenue: number;
  /** Debt reported by the producer, in BRL. */
  debt: number;
  /** Set false on the landing preview, where the explanation lives in the section copy. */
  showExplanation?: boolean;
  className?: string;
};

const toneByLevel: Record<RiskLevel, { bar: string; badge: string; label: string }> = {
  healthy: {
    bar: 'bg-healthy-solid',
    badge: 'healthy',
    label: 'Comprometimento baixo',
  },
  attention: {
    bar: 'bg-attention-solid',
    badge: 'attention',
    label: 'Comprometimento moderado',
  },
  risk: {
    bar: 'bg-risk-solid',
    badge: 'risk',
    label: 'Comprometimento elevado',
  },
};

/**
 * Plain-language reading of the ratio. Never a verdict on the producer, always
 * a description of the numbers plus what can be done about them.
 */
function explain(level: RiskLevel, ratio: number): string {
  const share = formatPercent(Math.round(ratio));
  switch (level) {
    case 'healthy':
      return `Com base nas informações fornecidas, ${share} da receita projetada está comprometida com a dívida. Sobra margem para os custos da safra, mas vale acompanhar a cada ciclo.`;
    case 'attention':
      return `Com base nas informações fornecidas, ${share} da receita projetada já está reservado para a dívida. É um peso relevante: vale entender agora quais alternativas podem ser avaliadas antes da próxima safra.`;
    case 'risk':
      return `Com base nas informações fornecidas, ${share} da receita projetada está comprometido com a dívida. Sobra pouco para custear a produção. Vamos entender quais alternativas podem ser avaliadas para o seu caso.`;
  }
}

export function DebtShareChart({
  revenue,
  debt,
  showExplanation = true,
  className,
}: DebtShareChartProps) {
  const hasRevenue = revenue > 0;
  const ratio = hasRevenue ? (debt / revenue) * 100 : 0;
  // The bar is capped at 100% so a debt larger than the revenue still draws;
  // the real figure stays in the label, which is never capped.
  const barShare = Math.min(ratio, 100);
  const level = riskLevelFromRatio(ratio);
  const tone = toneByLevel[level];
  const remaining = Math.max(revenue - debt, 0);

  if (!hasRevenue) {
    return (
      <p className={cn('text-body-sm text-ink-600', className)}>
        Informe a produção esperada e o preço estimado para ver o peso da dívida na sua receita.
      </p>
    );
  }

  return (
    <figure className={cn('m-0 flex flex-col gap-4', className)}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <span className="flex items-baseline gap-2">
          <span className="font-display text-display font-bold tabular-nums text-ink-900">
            {formatPercent(Math.round(ratio))}
          </span>
          <span className="text-body-sm text-ink-600">da receita projetada</span>
        </span>
        <StatusBadge tone={tone.badge as 'healthy' | 'attention' | 'risk'} size="sm">
          {tone.label}
        </StatusBadge>
      </figcaption>

      {/* The bar. Decorative for assistive tech — the figures below carry the data. */}
      <div aria-hidden className="flex h-5 w-full gap-0.5 overflow-hidden rounded-full bg-sand-200">
        <div
          className={cn('h-full rounded-full transition-[width] duration-slow ease-enter', tone.bar)}
          style={{ width: `${barShare}%` }}
        />
        <div className="h-full flex-1 rounded-full bg-sand-300/70" />
      </div>

      {/*
       * Direct labels. Each carries a colour swatch *and* its own text, so the
       * two segments are told apart by reading, not by hue.
       */}
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-2.5">
          <span aria-hidden className={cn('mt-1.5 h-3 w-3 shrink-0 rounded-sm', tone.bar)} />
          <div>
            <dt className="text-body-sm text-ink-600">Comprometido com a dívida</dt>
            <dd className="text-body-lg font-semibold tabular-nums text-ink-900">
              {formatCurrency(debt)}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <span aria-hidden className="mt-1.5 h-3 w-3 shrink-0 rounded-sm bg-sand-300" />
          <div>
            <dt className="text-body-sm text-ink-600">Restante da receita projetada</dt>
            <dd className="text-body-lg font-semibold tabular-nums text-ink-900">
              {formatCurrency(remaining)}
            </dd>
          </div>
        </div>
      </dl>

      {showExplanation ? (
        <p className="text-body-sm leading-relaxed text-ink-700">{explain(level, ratio)}</p>
      ) : null}
    </figure>
  );
}

export type ComparisonBarProps = {
  label: string;
  /** Value drawn, already in the same unit as `max`. */
  value: number;
  max: number;
  /** pt-BR text shown at the end of the bar. */
  valueLabel: string;
  tone?: 'canopy' | 'beam' | 'muted';
  /** Marks the row as the one being recommended — used once per comparison. */
  highlighted?: boolean;
  className?: string;
};

const comparisonTones = {
  canopy: 'bg-canopy-600',
  beam: 'bg-beam-500',
  muted: 'bg-sand-400',
} as const;

/**
 * A labelled horizontal bar for side-by-side comparisons (e.g. yearly payment
 * under two sets of conditions). One measure, one axis, always directly
 * labelled — no second scale, no legend to decode.
 */
export function ComparisonBar({
  label,
  value,
  max,
  valueLabel,
  tone = 'canopy',
  highlighted = false,
  className,
}: ComparisonBarProps) {
  const share = max > 0 ? Math.max(4, Math.min(100, (value / max) * 100)) : 0;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <span
          className={cn(
            'text-body-sm',
            highlighted ? 'font-semibold text-ink-900' : 'text-ink-700',
          )}
        >
          {label}
        </span>
        <span className="text-body-sm font-semibold tabular-nums text-ink-900">{valueLabel}</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-sand-200">
        <div
          className={cn('h-full rounded-full', comparisonTones[tone])}
          style={{ width: `${share}%` }}
        />
      </div>
    </div>
  );
}
