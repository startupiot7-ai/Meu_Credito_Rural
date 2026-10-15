'use client';

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { glossary, glossaryText } from '@/lib/glossary';
import type { GlossaryEntry, GlossaryKey } from '@/lib/glossary';
import { InfoIcon } from './Icon';

/**
 * Tooltip — an explanation attached to a term, opened by hover, focus or tap.
 *
 * Accessibility notes:
 *  - The trigger is a real `<button>`, so it is reachable by keyboard and by
 *    touch. Hover-only tooltips are useless on the phones most of our audience
 *    uses.
 *  - Escape closes it, and a click elsewhere dismisses it.
 *  - Mouse: hover opens, leaving closes. Keyboard: focus opens, blur closes.
 *    Touch: one tap opens, another tap (or a tap elsewhere) closes. On touch
 *    the browser fires mouseenter/focus before click, so those two are ignored
 *    for touch pointers; otherwise the same tap would open and close at once.
 *  - The bubble is nudged sideways so it never leaves the viewport (320 px).
 *  - The content is also rendered into an `sr-only` region, so a screen-reader
 *    user gets the definition without having to discover the trigger.
 */

export type TooltipProps = {
  /** Plain-language explanation, pt-BR. */
  content: ReactNode;
  /** Accessible name for the trigger, e.g. "O que é CPR?". */
  label: string;
  children?: ReactNode;
  className?: string;
};

export function Tooltip({ content, label, children, className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const bubbleRef = useRef<HTMLSpanElement>(null);
  const pointerType = useRef<string>('mouse');
  const [shift, setShift] = useState(0);

  // Keep the bubble inside the viewport: measure it once open and slide it back.
  useLayoutEffect(() => {
    if (!open) {
      setShift(0);
      return;
    }
    const bubble = bubbleRef.current;
    if (!bubble) return;
    const margin = 8;
    const rect = bubble.getBoundingClientRect();
    const current = shift;
    const left = rect.left - current;
    const right = rect.right - current;
    let next = 0;
    if (left < margin) next = margin - left;
    else if (right > window.innerWidth - margin) next = window.innerWidth - margin - right;
    if (next !== current) setShift(next);
  }, [open, shift]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }
    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  return (
    <span ref={wrapperRef} className={cn('relative inline-flex items-center', className)}>
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onPointerDown={(event) => {
          pointerType.current = event.pointerType;
        }}
        onClick={() => {
          // Touch toggles; mouse and keyboard only open (hover/focus already did).
          if (pointerType.current === 'touch') setOpen((value) => !value);
          else setOpen(true);
          // 'touch' vale só para este toque: no iOS o botão não recebe foco e o
          // blur nunca viria para limpar, deixando o Tab seguinte sem abrir.
          pointerType.current = 'mouse';
        }}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse') setOpen(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === 'mouse') setOpen(false);
        }}
        onFocus={() => {
          if (pointerType.current !== 'touch') setOpen(true);
        }}
        onBlur={() => {
          pointerType.current = 'mouse';
          setOpen(false);
        }}
        onKeyDown={() => {
          pointerType.current = 'keyboard';
        }}
        className={cn(
          'relative inline-grid h-6 w-6 place-items-center rounded-full text-ink-500',
          // Área de toque de 44 px mesmo com o desenho menor.
          'before:absolute before:-inset-2.5 before:content-[""]',
          'transition-colors duration-base ease-standard hover:bg-sand-200 hover:text-ink-700',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
        )}
      >
        {children ?? <InfoIcon className="text-body" />}
      </button>

      {open ? (
        <span
          ref={bubbleRef}
          id={id}
          role="tooltip"
          // Centraliza com a propriedade `translate` (não com `transform`): a animação
          // `animate-fade-up` anima `transform` e, com fill-mode both, anularia um -translate-x-1/2.
          style={{ translate: `calc(-50% + ${shift}px) 0` }}
          className={cn(
            'absolute left-1/2 top-[calc(100%+0.5rem)] z-30 w-[min(18rem,calc(100vw-2.5rem))]',
            'animate-fade-up rounded-lg bg-ink-900 px-3.5 py-2.5',
            'text-body-sm leading-snug text-sand-100 shadow-lg',
          )}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}

export type TermProps = {
  /** Which glossary entry to explain. */
  term: GlossaryKey;
  /** Override the visible text — defaults to the term as the glossary spells it. */
  children?: ReactNode;
  className?: string;
};

/**
 * Term — wraps a piece of financial jargon so it is never shown bare.
 *
 * Renders the word with a dotted underline plus an info trigger carrying the
 * plain-language definition. Product rule: the first time a term appears on a
 * screen it must be a `<Term>`.
 */
export function Term({ term, children, className }: TermProps) {
  const entry: GlossaryEntry = glossary[term];

  return (
    <span className={cn('inline-flex items-baseline gap-0.5', className)}>
      <abbr
        title={undefined}
        className="cursor-help border-b border-dashed border-ink-400 no-underline"
      >
        {children ?? entry.term}
      </abbr>
      <Tooltip
        label={`O que significa ${entry.term}?`}
        content={
          <span>
            <strong className="font-semibold text-sand-50">
              {entry.expansion ? `${entry.term} — ${entry.expansion}` : entry.term}
            </strong>
            <br />
            {entry.definition}
          </span>
        }
      />
      {/* Same explanation, linearised for assistive technology. */}
      <span className="sr-only">{glossaryText(term)}</span>
    </span>
  );
}
