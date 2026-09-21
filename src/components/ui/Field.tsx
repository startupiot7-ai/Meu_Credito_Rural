import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { AlertCircleIcon, CheckCircleIcon } from './Icon';

/**
 * Field — the shared chrome around every form control: label, helper text,
 * error and success messages, all wired with the right ARIA relationships.
 *
 * Controls do not own their own label; they receive one from here. That keeps
 * label placement, spacing and error phrasing identical everywhere.
 */

export type FieldStatus = 'default' | 'error' | 'success';

export type FieldProps = {
  id: string;
  label: string;
  /** Shown under the label, before the control. Use it to prevent errors. */
  hint?: ReactNode;
  /** pt-BR error message. Its presence flips the field into the error state. */
  error?: string;
  /** pt-BR confirmation, e.g. "Documento recebido." */
  success?: string;
  /** Rendered next to the label — typically a `<Term>` or `<Tooltip>`. */
  labelAdornment?: ReactNode;
  optional?: boolean;
  className?: string;
  children: (aria: {
    id: string;
    'aria-describedby': string | undefined;
    'aria-invalid': boolean | undefined;
    status: FieldStatus;
  }) => ReactNode;
};

export function Field({
  id,
  label,
  hint,
  error,
  success,
  labelAdornment,
  optional,
  className,
  children,
}: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const messageId = error || success ? `${id}-message` : undefined;
  const describedBy = [hintId, messageId].filter(Boolean).join(' ') || undefined;
  const status: FieldStatus = error ? 'error' : success ? 'success' : 'default';

  return (
    <div className={cn('flex flex-col gap-stack-xs', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor={id} className="text-body font-medium text-ink-900">
          {label}
        </label>
        {optional ? (
          <span className="text-caption text-ink-500">(opcional)</span>
        ) : null}
        {labelAdornment}
      </div>

      {hint ? (
        <p id={hintId} className="text-body-sm text-ink-600">
          {hint}
        </p>
      ) : null}

      {children({
        id,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
        status,
      })}

      {error || success ? (
        <p
          id={messageId}
          // Errors interrupt; confirmations wait their turn.
          role={error ? 'alert' : 'status'}
          className={cn(
            'flex items-start gap-1.5 text-body-sm',
            error ? 'text-risk-fg' : 'text-healthy-fg',
          )}
        >
          {error ? (
            <AlertCircleIcon className="mt-0.5 shrink-0 text-[1.05em]" />
          ) : (
            <CheckCircleIcon className="mt-0.5 shrink-0 text-[1.05em]" />
          )}
          <span>{error ?? success}</span>
        </p>
      ) : null}
    </div>
  );
}

/** Shared control surface, so input / select / textarea look like one family. */
export const controlBase =
  'w-full min-h-touch rounded-lg border bg-sand-50 px-4 py-3 text-body text-ink-900 ' +
  'placeholder:text-ink-400 transition-[border-color,box-shadow,background-color] ' +
  'duration-base ease-standard ' +
  'disabled:cursor-not-allowed disabled:border-sand-300 disabled:bg-sand-100 disabled:text-ink-400';

export const controlStatus: Record<FieldStatus, string> = {
  default: 'border-sand-300 hover:border-sand-400 focus:border-canopy-500',
  error: 'border-risk-solid bg-risk-surface/40 hover:border-risk-solid focus:border-risk-solid',
  success: 'border-healthy-border focus:border-healthy-solid',
};
