'use client';

import { useId } from 'react';
import type { ReactNode, SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Field, controlBase, controlStatus } from './Field';
import { ChevronDownIcon } from './Icon';

/**
 * Select — a native `<select>` underneath.
 *
 * Deliberately not a custom dropdown: the OS picker is what our audience
 * already knows, it is keyboard and screen-reader correct for free, and it
 * costs no JavaScript on a slow connection. Only the chevron is ours.
 */

export type SelectOption = { value: string; label: string; disabled?: boolean };

export type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & {
  label: string;
  options: SelectOption[];
  /** Shown as the first, unselectable entry — e.g. "Selecione uma opção". */
  placeholder?: string;
  hint?: ReactNode;
  error?: string;
  success?: string;
  labelAdornment?: ReactNode;
  optional?: boolean;
  id?: string;
  className?: string;
};

export function Select({
  label,
  options,
  placeholder = 'Selecione uma opção',
  hint,
  error,
  success,
  labelAdornment,
  optional,
  id,
  className,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <Field
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      success={success}
      labelAdornment={labelAdornment}
      optional={optional}
      className={className}
    >
      {(aria) => (
        <div className="relative">
          <select
            {...props}
            {...aria}
            className={cn(
              controlBase,
              controlStatus[aria.status],
              'cursor-pointer appearance-none pr-12',
              // An unanswered select reads as placeholder text, not as an answer.
              !props.value && !props.defaultValue && 'text-ink-400',
            )}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-title-sm text-ink-500"
          />
        </div>
      )}
    </Field>
  );
}
