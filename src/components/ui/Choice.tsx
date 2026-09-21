'use client';

import { useId } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { CheckIcon } from './Icon';

/**
 * RadioCard and Checkbox.
 *
 * The diagnostic asks one question per screen, and most answers are a choice
 * between a handful of options. Radio *cards* — large, tappable, with room for
 * a line of explanation — beat a column of small dots for a producer answering
 * on a phone, in the sun, possibly without reading glasses.
 *
 * Both controls keep a real `<input>` underneath: keyboard navigation, arrow
 * keys within a radio group and screen-reader semantics come from the platform.
 */

export type RadioCardProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  label: string;
  /** One short line clarifying what the option means, in plain language. */
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
};

export function RadioCard({
  name,
  value,
  checked,
  onChange,
  label,
  description,
  icon,
  disabled,
  className,
}: RadioCardProps) {
  const id = useId();

  return (
    <div className={cn('relative', className)}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => onChange(value)}
        className="peer sr-only"
      />
      <label
        htmlFor={id}
        className={cn(
          'flex min-h-touch cursor-pointer items-start gap-3 rounded-xl border-2 bg-sand-50 p-4',
          'transition-[border-color,background-color,box-shadow] duration-base ease-standard',
          'hover:border-canopy-300 hover:bg-canopy-50/50',
          'peer-checked:border-canopy-600 peer-checked:bg-canopy-50 peer-checked:shadow-xs',
          'peer-focus-visible:ring-2 peer-focus-visible:ring-beam-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-sand-50',
          'peer-disabled:cursor-not-allowed peer-disabled:border-sand-200 peer-disabled:bg-sand-100',
          'peer-disabled:hover:border-sand-200 peer-disabled:hover:bg-sand-100',
          checked ? 'border-canopy-600' : 'border-sand-300',
        )}
      >
        {/*
         * The selection indicator is a shape as well as a colour — a filled ring —
         * so the chosen option is legible without relying on hue.
         */}
        <span
          aria-hidden
          className={cn(
            'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2',
            'transition-colors duration-base ease-standard',
            checked ? 'border-canopy-600 bg-canopy-600' : 'border-sand-400 bg-sand-50',
          )}
        >
          <span
            className={cn(
              'h-2 w-2 rounded-full bg-sand-50 transition-transform duration-base ease-standard',
              checked ? 'scale-100' : 'scale-0',
            )}
          />
        </span>

        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="flex items-center gap-2 text-body font-medium text-ink-900">
            {icon ? <span className="text-title-sm text-canopy-600">{icon}</span> : null}
            {label}
          </span>
          {description ? (
            <span className="text-body-sm text-ink-600">{description}</span>
          ) : null}
        </span>
      </label>
    </div>
  );
}

export type RadioCardGroupProps = {
  /** The question itself. Rendered as the group's legend. */
  legend: string;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
};

/** Wraps a set of `RadioCard`s in a real fieldset so the question is announced. */
export function RadioCardGroup({ legend, hint, error, children, className }: RadioCardGroupProps) {
  return (
    <fieldset className={cn('flex flex-col gap-stack-sm border-0 p-0', className)}>
      <legend className="mb-1 text-body font-medium text-ink-900">{legend}</legend>
      {hint ? <p className="mb-1 text-body-sm text-ink-600">{hint}</p> : null}
      <div className="flex flex-col gap-2.5">{children}</div>
      {error ? (
        <p role="alert" className="mt-1 text-body-sm text-risk-fg">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  error?: string;
  className?: string;
};

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled,
  error,
  className,
}: CheckboxProps) {
  const id = useId();
  const messageId = error ? `${id}-message` : undefined;

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="relative flex items-start gap-3">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={messageId}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <label
          htmlFor={id}
          className={cn(
            'flex min-h-touch cursor-pointer items-start gap-3 rounded-md py-2',
            // The ring lives on the label because Tailwind's `peer-*` variants
            // only reach siblings of the input, not their descendants.
            'peer-focus-visible:ring-2 peer-focus-visible:ring-beam-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-sand-50',
            'peer-disabled:cursor-not-allowed',
          )}
        >
          <span
            aria-hidden
            className={cn(
              'mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-sm border-2 text-sand-50',
              'transition-colors duration-base ease-standard',
              checked ? 'border-canopy-600 bg-canopy-600' : 'border-sand-400 bg-sand-50',
              error && !checked && 'border-risk-solid',
              disabled && 'border-sand-300 bg-sand-100',
            )}
          >
            <CheckIcon
              className={cn(
                'text-[0.85rem] transition-transform duration-base ease-standard',
                checked ? 'scale-100' : 'scale-0',
              )}
              strokeWidth={3}
            />
          </span>
          <span className="flex flex-col gap-0.5">
            <span
              className={cn(
                'text-body-sm text-ink-800',
                disabled && 'text-ink-400',
              )}
            >
              {label}
            </span>
            {description ? (
              <span className="text-caption text-ink-500">{description}</span>
            ) : null}
          </span>
        </label>
      </div>
      {error ? (
        <p id={messageId} role="alert" className="pl-8 text-body-sm text-risk-fg">
          {error}
        </p>
      ) : null}
    </div>
  );
}
