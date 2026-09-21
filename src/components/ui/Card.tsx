import type { ElementType, ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Card — a single idea, grouped.
 *
 * Three surfaces only. `raised` is the default (content on the beige page),
 * `flat` is for cards inside an already-elevated container, and `beam` marks
 * the one recommended path on a screen — the lighthouse pointing at it. Never
 * use `beam` twice on the same screen; it stops meaning anything.
 */

export type CardProps = {
  as?: ElementType;
  variant?: 'raised' | 'flat' | 'beam';
  className?: string;
  children: ReactNode;
};

const variants = {
  raised: 'border border-sand-200 bg-sand-50 shadow-card',
  flat: 'border border-sand-200 bg-sand-100/60',
  beam: 'border-2 border-beam-300 bg-beam-50 shadow-card',
} as const;

export function Card({ as: Tag = 'div', variant = 'raised', className, children }: CardProps) {
  return (
    <Tag className={cn('rounded-2xl p-5 md:p-6', variants[variant], className)}>{children}</Tag>
  );
}

export function CardHeader({
  title,
  description,
  icon,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-4 flex items-start gap-3', className)}>
      {icon ? (
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-canopy-50 text-title-sm text-canopy-600">
          {icon}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <h3 className="text-title-sm">{title}</h3>
        {description ? <p className="mt-1 text-body-sm text-ink-600">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
