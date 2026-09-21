import { cn } from '@/lib/cn';
import { CheckIcon } from './Icon';

/**
 * Progress — "pontos no caminho".
 *
 * The diagnostic asks one question per screen, which is calm but disorienting
 * unless the producer can always see how far along they are and how much is
 * left. Steps already answered are lit; the current one carries the beam; the
 * ones ahead are dim but visible, so the path has a visible end.
 */

export type StepProgressProps = {
  /** 1-based index of the step being answered. */
  current: number;
  total: number;
  /** Short pt-BR names, one per step. Used for the label and for screen readers. */
  labels: string[];
  className?: string;
};

export function StepProgress({ current, total, labels, className }: StepProgressProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-body-sm font-medium text-ink-800">
          Etapa {current} de {total}
          <span className="text-ink-500"> · {labels[current - 1]}</span>
        </p>
        <p className="text-caption tabular-nums text-ink-500">{percent}%</p>
      </div>

      {/*
       * A single progressbar carries the state for assistive technology; the
       * dots below are decorative reinforcement of the same information.
       */}
      <div
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={`Etapa ${current} de ${total}: ${labels[current - 1]}`}
        className="h-1.5 w-full overflow-hidden rounded-full bg-sand-200"
      >
        <div
          className="h-full rounded-full bg-canopy-600 transition-[width] duration-slow ease-enter"
          style={{ width: `${percent}%` }}
        />
      </div>

      <ol aria-hidden className="flex items-center gap-1.5">
        {labels.map((label, index) => {
          const step = index + 1;
          const done = step < current;
          const active = step === current;
          return (
            <li
              key={label}
              className={cn(
                'h-2 flex-1 rounded-full transition-colors duration-slow ease-standard',
                done && 'bg-canopy-500',
                active && 'bg-beam-400',
                !done && !active && 'bg-sand-200',
              )}
            />
          );
        })}
      </ol>
    </div>
  );
}

export type ProgressBarProps = {
  /** 0–100. */
  value: number;
  label: string;
  /** Shown to the right of the label, already formatted in pt-BR. */
  valueLabel?: string;
  tone?: 'canopy' | 'healthy' | 'attention' | 'risk';
  className?: string;
};

const barTones = {
  canopy: 'bg-canopy-600',
  healthy: 'bg-healthy-solid',
  attention: 'bg-attention-solid',
  risk: 'bg-risk-solid',
} as const;

/** A plain labelled bar, used for single measures outside the chart component. */
export function ProgressBar({ value, label, valueLabel, tone = 'canopy', className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-body-sm text-ink-700">{label}</span>
        {valueLabel ? (
          <span className="text-body-sm font-semibold tabular-nums text-ink-900">{valueLabel}</span>
        ) : null}
      </div>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(clamped)}
        aria-label={label}
        className="h-2.5 w-full overflow-hidden rounded-full bg-sand-200"
      >
        <div
          className={cn('h-full rounded-full transition-[width] duration-slow ease-enter', barTones[tone])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export type CheckStepsProps = {
  steps: { label: string; description?: string; done?: boolean }[];
  className?: string;
};

/** Vertical checklist used on the results screen for "o que já temos". */
export function CheckSteps({ steps, className }: CheckStepsProps) {
  return (
    <ol className={cn('flex flex-col gap-3', className)}>
      {steps.map((step) => (
        <li key={step.label} className="flex items-start gap-3">
          <span
            className={cn(
              'mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border',
              step.done
                ? 'border-healthy-border bg-healthy-surface text-healthy-fg'
                : 'border-sand-300 bg-sand-100 text-ink-400',
            )}
          >
            {step.done ? (
              <CheckIcon className="text-[0.8rem]" strokeWidth={3} />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
            )}
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-body text-ink-900">{step.label}</span>
            {step.description ? (
              <span className="text-body-sm text-ink-600">{step.description}</span>
            ) : null}
          </span>
        </li>
      ))}
    </ol>
  );
}
