'use client';

import { useCallback, useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Button } from './Button';
import { XIcon } from './Icon';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Shared modal behaviour for the bottom sheet and the confirmation dialog:
 * focus moves in on open, stays trapped while open, Escape closes, the page
 * behind stops scrolling, and focus returns to whatever opened it.
 */
function useModalBehaviour(open: boolean, onClose: () => void) {
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const trapFocus = useCallback((event: KeyboardEvent) => {
    const panel = panelRef.current;
    if (!panel) return;
    const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;

    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === panel)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }, []);

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    // Focus the panel itself rather than its first control: the producer should
    // hear the question before landing on an answer.
    panelRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
      } else if (event.key === 'Tab') {
        trapFocus(event);
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      restoreRef.current?.focus();
    };
  }, [open, onClose, trapFocus]);

  return panelRef;
}

export type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Optional line under the title. */
  description?: ReactNode;
  children: ReactNode;
  /** Sticky action row pinned to the bottom of the sheet. */
  footer?: ReactNode;
};

/**
 * BottomSheet — the mobile pattern for secondary content.
 *
 * Slides up from the thumb, never covers the whole screen, and always has a
 * visible way out. On tablet and desktop it centres as a panel instead.
 */
export function BottomSheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: BottomSheetProps) {
  const panelRef = useModalBehaviour(open, onClose);
  const titleId = useId();
  const descriptionId = useId();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center">
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-ink-900/40 animate-fade-up"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className={cn(
          'relative flex max-h-[85dvh] w-full flex-col rounded-t-3xl bg-sand-50 shadow-lg',
          'animate-sheet-in focus:outline-none',
          'md:max-w-lg md:rounded-3xl',
        )}
      >
        {/* Grab handle: a familiar affordance that the sheet can be dismissed. */}
        <span aria-hidden className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-sand-300 md:hidden" />

        <div className="flex items-start gap-3 px-5 pb-3 pt-4 md:pt-6">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-title-sm">
              {title}
            </h2>
            {description ? (
              <p id={descriptionId} className="mt-1 text-body-sm text-ink-600">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="-mr-2 -mt-2 grid h-touch w-touch shrink-0 place-items-center rounded-lg text-ink-500 transition-colors hover:bg-sand-200 hover:text-ink-800"
          >
            <XIcon className="text-title-sm" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-5">{children}</div>

        {footer ? (
          <div className="border-t border-sand-200 bg-sand-100/70 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  /** What will happen, in plain language. Never just "Tem certeza?". */
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Use for irreversible actions — turns the confirm button red. */
  destructive?: boolean;
  loading?: boolean;
};

/**
 * ConfirmDialog — asks before something the producer cannot undo.
 *
 * The cancel action is never hidden or styled as a mistake: user control means
 * backing out has to be as easy as going forward.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  destructive = false,
  loading = false,
}: ConfirmDialogProps) {
  const panelRef = useModalBehaviour(open, onClose);
  const titleId = useId();
  const descriptionId = useId();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <div aria-hidden onClick={onClose} className="absolute inset-0 bg-ink-900/40" />

      <div
        ref={panelRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative w-full max-w-md animate-fade-up rounded-2xl bg-sand-50 p-6 shadow-lg focus:outline-none"
      >
        <h2 id={titleId} className="text-title-sm">
          {title}
        </h2>
        <div id={descriptionId} className="mt-2 text-body-sm leading-relaxed text-ink-600">
          {description}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
