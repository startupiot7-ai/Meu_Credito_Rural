import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import {
  AlertCircleIcon,
  CheckCircleIcon,
  CloudOffIcon,
  CompassIcon,
} from './Icon';

/**
 * Empty, error and success states.
 *
 * All three follow the same three-part shape, because an interface that always
 * explains itself the same way is one less thing to learn:
 *   1. what is going on, 2. why, in plain language, 3. one thing to do next.
 *
 * Tone: an empty screen is not a failure and an error is not the producer's
 * fault. Neither is ever phrased as a warning about their situation.
 */

export type StateViewProps = {
  variant: 'empty' | 'error' | 'offline' | 'success';
  title: string;
  description: ReactNode;
  /** A single action. Deliberately not a list. */
  action?: ReactNode;
  /** Rare second option, e.g. "Voltar". */
  secondaryAction?: ReactNode;
  className?: string;
};

const variants = {
  empty: { Icon: CompassIcon, tint: 'bg-sand-200 text-ink-600' },
  error: { Icon: AlertCircleIcon, tint: 'bg-risk-surface text-risk-fg' },
  offline: { Icon: CloudOffIcon, tint: 'bg-attention-surface text-attention-fg' },
  success: { Icon: CheckCircleIcon, tint: 'bg-healthy-surface text-healthy-fg' },
} as const;

export function StateView({
  variant,
  title,
  description,
  action,
  secondaryAction,
  className,
}: StateViewProps) {
  const { Icon, tint } = variants[variant];

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'flex flex-col items-center gap-4 rounded-2xl border border-sand-200 bg-sand-50 px-6 py-10 text-center',
        className,
      )}
    >
      <span className={cn('grid h-14 w-14 place-items-center rounded-full text-display', tint)}>
        <Icon />
      </span>

      <div className="max-w-prose">
        <h3 className="text-title-sm">{title}</h3>
        <p className="mt-2 text-body-sm leading-relaxed text-ink-600">{description}</p>
      </div>

      {action || secondaryAction ? (
        <div className="mt-1 flex flex-col items-center gap-2 sm:flex-row">
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}
