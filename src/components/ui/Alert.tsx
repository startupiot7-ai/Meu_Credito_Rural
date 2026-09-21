'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
  XIcon,
} from './Icon';
import type { StatusTone } from './StatusBadge';

/**
 * Alert — a message about the producer's situation or about the system.
 *
 * Tone rule from the product voice: we explain, we never alarm. An alert says
 * what happened and what can be done next; it does not say the situation is
 * critical, and it never uses fear to push an action.
 */

export type AlertProps = {
  tone: StatusTone;
  title: ReactNode;
  children?: ReactNode;
  /** Optional single next step. One action, never a row of them. */
  action?: ReactNode;
  /** Renders a "Fechar" control. */
  onDismiss?: () => void;
  icon?: ReactNode;
  className?: string;
};

const tones: Record<StatusTone, { classes: string; Icon: typeof InfoIcon; role: 'alert' | 'status' }> =
  {
    healthy: {
      classes: 'border-healthy-border bg-healthy-surface text-healthy-fg',
      Icon: CheckCircleIcon,
      role: 'status',
    },
    attention: {
      classes: 'border-attention-border bg-attention-surface text-attention-fg',
      Icon: AlertTriangleIcon,
      role: 'status',
    },
    risk: {
      classes: 'border-risk-border bg-risk-surface text-risk-fg',
      Icon: AlertCircleIcon,
      role: 'alert',
    },
    info: {
      classes: 'border-info-border bg-info-surface text-info-fg',
      Icon: InfoIcon,
      role: 'status',
    },
  };

export function Alert({ tone, title, children, action, onDismiss, icon, className }: AlertProps) {
  const { classes, Icon, role } = tones[tone];

  return (
    <div
      role={role}
      className={cn('flex items-start gap-3 rounded-xl border p-4', classes, className)}
    >
      <span className="mt-0.5 shrink-0 text-title-sm">{icon ?? <Icon />}</span>

      <div className="min-w-0 flex-1">
        <p className="text-body font-semibold">{title}</p>
        {children ? (
          <div className="mt-1 text-body-sm leading-relaxed text-ink-700">{children}</div>
        ) : null}
        {action ? <div className="mt-3">{action}</div> : null}
      </div>

      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar aviso"
          className="-m-1 grid h-touch w-touch shrink-0 place-items-center rounded-md text-current opacity-70 transition-opacity hover:opacity-100"
        >
          <XIcon className="text-body-lg" />
        </button>
      ) : null}
    </div>
  );
}
