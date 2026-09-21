import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { AlertCircleIcon, AlertTriangleIcon, CheckCircleIcon, InfoIcon } from './Icon';

/**
 * StatusBadge — "luz verde / amarela / vermelha".
 *
 * The traffic-light reading of a situation. Colour is never the only signal:
 * each tone ships with its own icon shape *and* a written label, so the badge
 * still works in greyscale, for a colour-blind reader, and when read aloud.
 *
 * Wording rule: the label describes the situation, not a verdict on the person.
 * "Atenção", never "Crítico"; "Risco elevado", never "Você está mal".
 */

export type StatusTone = 'healthy' | 'attention' | 'risk' | 'info';

const tones: Record<StatusTone, { classes: string; Icon: typeof CheckCircleIcon }> = {
  healthy: {
    classes: 'border-healthy-border bg-healthy-surface text-healthy-fg',
    Icon: CheckCircleIcon,
  },
  attention: {
    classes: 'border-attention-border bg-attention-surface text-attention-fg',
    Icon: AlertTriangleIcon,
  },
  risk: {
    classes: 'border-risk-border bg-risk-surface text-risk-fg',
    Icon: AlertCircleIcon,
  },
  info: {
    classes: 'border-info-border bg-info-surface text-info-fg',
    Icon: InfoIcon,
  },
};

export type StatusBadgeProps = {
  tone: StatusTone;
  children: ReactNode;
  size?: 'sm' | 'md';
  className?: string;
};

export function StatusBadge({ tone, children, size = 'md', className }: StatusBadgeProps) {
  const { classes, Icon } = tones[tone];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        size === 'sm' ? 'px-2.5 py-1 text-caption' : 'px-3 py-1.5 text-body-sm',
        classes,
        className,
      )}
    >
      <Icon className="shrink-0 text-[1.05em]" />
      {children}
    </span>
  );
}

/**
 * The same three-light scale rendered as a legend, used wherever we show a
 * status for the first time so the producer learns what the colours mean.
 */
export function StatusLegend({ className }: { className?: string }) {
  return (
    <ul className={cn('flex flex-wrap gap-2', className)}>
      <li>
        <StatusBadge tone="healthy" size="sm">
          Situação saudável
        </StatusBadge>
      </li>
      <li>
        <StatusBadge tone="attention" size="sm">
          Atenção
        </StatusBadge>
      </li>
      <li>
        <StatusBadge tone="risk" size="sm">
          Risco elevado
        </StatusBadge>
      </li>
    </ul>
  );
}
