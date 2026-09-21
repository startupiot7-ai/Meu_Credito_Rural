'use client';

import { forwardRef, useId, useState } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  maskCurrency,
  maskInteger,
  maskPercent,
  parseBrNumber,
} from '@/lib/format';
import { Field, controlBase, controlStatus } from './Field';
import type { FieldStatus } from './Field';

/**
 * Text, currency, percentage and quantity inputs.
 *
 * The masked variants format while the producer types — "750000" becomes
 * "R$ 750.000" — so the value on screen is always the value they meant. The
 * numeric keypad is requested on mobile (`inputMode`), and the parsed number is
 * handed back through `onValueChange` so callers never parse strings themselves.
 */

type BaseInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  status?: FieldStatus;
  /** Fixed text glued to the left of the value, e.g. "R$". */
  prefix?: ReactNode;
  /** Fixed text glued to the right, e.g. "sacas". */
  suffix?: ReactNode;
};

export const RawInput = forwardRef<HTMLInputElement, BaseInputProps>(function RawInput(
  { status = 'default', prefix, suffix, className, ...props },
  ref,
) {
  if (!prefix && !suffix) {
    return (
      <input ref={ref} className={cn(controlBase, controlStatus[status], className)} {...props} />
    );
  }

  return (
    <div
      className={cn(
        'flex items-stretch overflow-hidden rounded-lg border bg-sand-50',
        'transition-[border-color] duration-base ease-standard',
        'focus-within:ring-2 focus-within:ring-beam-500 focus-within:ring-offset-2 focus-within:ring-offset-sand-50',
        controlStatus[status],
        className,
      )}
    >
      {prefix ? (
        <span
          aria-hidden
          className="flex items-center bg-sand-100 px-3.5 text-body font-medium text-ink-600"
        >
          {prefix}
        </span>
      ) : null}
      <input
        ref={ref}
        className="min-h-touch w-full min-w-0 bg-transparent px-3.5 py-3 text-body text-ink-900 placeholder:text-ink-400 focus:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:text-ink-400"
        {...props}
      />
      {suffix ? (
        <span
          aria-hidden
          className="flex items-center bg-sand-100 px-3.5 text-body font-medium text-ink-600"
        >
          {suffix}
        </span>
      ) : null}
    </div>
  );
});

type FieldShell = {
  label: string;
  hint?: ReactNode;
  error?: string;
  success?: string;
  labelAdornment?: ReactNode;
  optional?: boolean;
  className?: string;
  id?: string;
};

export type TextInputProps = FieldShell & Omit<BaseInputProps, 'status' | 'id'>;

export function TextInput({
  label,
  hint,
  error,
  success,
  labelAdornment,
  optional,
  className,
  id,
  ...props
}: TextInputProps) {
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
      {(aria) => <RawInput {...props} {...aria} status={aria.status} />}
    </Field>
  );
}

type MaskedProps = FieldShell &
  Omit<BaseInputProps, 'status' | 'id' | 'value' | 'onChange' | 'defaultValue'> & {
    /** Numeric value. `null` means "not answered yet", never 0. */
    value: number | null;
    onValueChange: (value: number | null) => void;
  };

type MaskConfig = {
  /** Re-formats raw keystrokes into the display shape. */
  mask: (raw: string) => string;
  /** Renders a number coming from outside (saved answers, defaults). */
  toText: (value: number) => string;
  inputMode: 'numeric' | 'decimal';
  placeholder: string;
};

const currencyMask: MaskConfig = {
  mask: maskCurrency,
  toText: (value) => formatCurrency(Math.round(value)),
  inputMode: 'numeric',
  placeholder: 'R$ 0',
};

const percentMask: MaskConfig = {
  mask: maskPercent,
  toText: (value) => formatPercent(value, Number.isInteger(value) ? 0 : 1),
  inputMode: 'decimal',
  placeholder: '0%',
};

const quantityMask: MaskConfig = {
  mask: maskInteger,
  toText: (value) => formatNumber(Math.round(value)),
  inputMode: 'numeric',
  placeholder: '0',
};

/**
 * Keeps the text on screen and the numeric value in the parent in step.
 *
 * The text is local so half-typed input such as "40," survives a re-render, but
 * whenever the parent's number stops matching what is typed — answers restored
 * from this device, a reset, a default — the text is rebuilt from that number.
 */
function useMaskedNumber(
  value: number | null,
  onValueChange: (value: number | null) => void,
  config: MaskConfig,
) {
  const [text, setText] = useState(() => (value === null ? '' : config.toText(value)));

  const typed = text ? parseBrNumber(text) : null;
  if (typed !== value) {
    setText(value === null ? '' : config.toText(value));
  }

  return {
    value: text,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      const masked = config.mask(event.target.value);
      setText(masked);
      onValueChange(masked ? parseBrNumber(masked) : null);
    },
  };
}

function MaskedInput({
  config,
  label,
  hint,
  error,
  success,
  labelAdornment,
  optional,
  className,
  id,
  value,
  onValueChange,
  ...props
}: MaskedProps & { config: MaskConfig }) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const bind = useMaskedNumber(value, onValueChange, config);

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
        <RawInput
          {...props}
          {...aria}
          status={aria.status}
          inputMode={config.inputMode}
          autoComplete="off"
          placeholder={props.placeholder ?? config.placeholder}
          {...bind}
        />
      )}
    </Field>
  );
}

/** Currency field. Displays "R$ 750.000" and reports 750000. */
export function CurrencyInput(props: MaskedProps) {
  return <MaskedInput config={currencyMask} {...props} />;
}

/** Percentage field. Displays "40%" and reports 40. Clamped to 0–100. */
export function PercentInput(props: MaskedProps) {
  return <MaskedInput config={percentMask} {...props} />;
}

/** Plain quantity with thousands separators, e.g. "500" followed by "sacas". */
export function QuantityInput(props: MaskedProps) {
  return <MaskedInput config={quantityMask} {...props} />;
}
