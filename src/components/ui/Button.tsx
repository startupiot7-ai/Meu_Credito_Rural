import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { SpinnerIcon } from './Icon';

/**
 * Button — the single affordance for "do the next thing".
 *
 * States covered: default, hover, focus-visible, active, disabled, loading.
 * Every size clears the 44px minimum touch target on mobile.
 */

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'beam';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg ' +
  'font-sans font-semibold ' +
  'transition-[background-color,border-color,color,box-shadow,transform] duration-base ' +
  'ease-standard select-none active:translate-y-px ' +
  'disabled:cursor-not-allowed disabled:active:translate-y-0 ' +
  'aria-disabled:cursor-not-allowed';

const variants: Record<ButtonVariant, string> = {
  /** The path forward. Deep green with the amber beam as the focus ring. */
  primary:
    'bg-canopy-600 text-sand-50 shadow-sm hover:bg-canopy-700 active:bg-canopy-800 ' +
    'disabled:bg-sand-300 disabled:text-ink-400 disabled:shadow-none',
  /** An equally valid, lower-commitment choice — never visually punished. */
  secondary:
    'border border-canopy-600/35 bg-sand-50 text-canopy-700 hover:border-canopy-600/60 ' +
    'hover:bg-canopy-50 active:bg-canopy-100 ' +
    'disabled:border-sand-300 disabled:bg-sand-100 disabled:text-ink-400',
  ghost:
    'text-canopy-700 hover:bg-canopy-50 active:bg-canopy-100 ' +
    'disabled:text-ink-400 disabled:hover:bg-transparent',
  /**
   * The lighthouse light. For a single call to action on a dark canopy
   * surface, where the green primary would disappear into the background.
   *
   * This is a variant rather than a `className` override on purpose: Tailwind
   * emits `bg-beam-*` before `bg-canopy-*`, so a passed-in background silently
   * loses to the variant's and the button comes out green.
   */
  beam:
    'bg-beam-400 text-ink-900 shadow-sm hover:bg-beam-300 active:bg-beam-500 ' +
    'disabled:bg-sand-300 disabled:text-ink-400 disabled:shadow-none',
  /** Reserved for destructive confirmation, not for "bad news". */
  danger:
    'bg-risk-solid text-sand-50 shadow-sm hover:brightness-95 active:brightness-90 ' +
    'disabled:bg-sand-300 disabled:text-ink-400 disabled:shadow-none',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'min-h-touch px-4 text-body-sm',
  md: 'min-h-touch px-5 py-3 text-body',
  lg: 'min-h-[3.25rem] px-6 py-3.5 text-body-lg',
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Stretch to the full width of its container — the default on mobile CTAs. */
  fullWidth?: boolean;
  /** Shows a spinner, blocks interaction and announces the wait politely. */
  loading?: boolean;
  /** pt-BR text announced while `loading` is true. */
  loadingLabel?: string;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
};

export type ButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

function classes(
  variant: ButtonVariant,
  size: ButtonSize,
  fullWidth: boolean | undefined,
  className: string | undefined,
) {
  return cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className);
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    fullWidth,
    loading = false,
    loadingLabel = 'Carregando',
    iconLeft,
    iconRight,
    className,
    children,
    disabled,
    type = 'button',
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      // The button stays focusable while loading so the user is not thrown out
      // of the tab order mid-action; `aria-disabled` conveys the blocked state.
      aria-disabled={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled}
      className={classes(variant, size, fullWidth, className)}
      onClick={loading ? (event) => event.preventDefault() : props.onClick}
      {...props}
    >
      {loading ? (
        <>
          <SpinnerIcon className="animate-spin text-[1.15em]" />
          <span>{loadingLabel}…</span>
          <span className="sr-only" role="status">
            {loadingLabel}, aguarde
          </span>
        </>
      ) : (
        <>
          {iconLeft ? <span className="text-[1.15em]">{iconLeft}</span> : null}
          {children}
          {iconRight ? <span className="text-[1.15em]">{iconRight}</span> : null}
        </>
      )}
    </button>
  );
});

export type ButtonLinkProps = CommonProps &
  Omit<React.ComponentProps<typeof Link>, 'className'> & { className?: string };

/** Same visual language as `Button`, for navigation rather than action. */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  fullWidth,
  iconLeft,
  iconRight,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={classes(variant, size, fullWidth, className)} {...props}>
      {iconLeft ? <span className="text-[1.15em]">{iconLeft}</span> : null}
      {children}
      {iconRight ? <span className="text-[1.15em]">{iconRight}</span> : null}
    </Link>
  );
}
