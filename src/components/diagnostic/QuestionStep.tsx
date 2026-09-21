import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * QuestionStep — the frame every question sits in.
 *
 * One question, its clarification, the control, and nothing else. Keeping the
 * frame identical from step to step means the producer only has to read what
 * changed, which is the whole reason for a one-question-per-screen flow.
 */
export function QuestionStep({
  title,
  help,
  children,
  footnote,
  className,
}: {
  title: string;
  /** One line lowering the stakes of answering, e.g. "uma estimativa já serve". */
  help?: ReactNode;
  children: ReactNode;
  /** Small reassurance under the control. */
  footnote?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('animate-fade-up', className)}>
      {/*
       * Focused by the flow on every step change so the new question is
       * announced. `focus:outline-none` is deliberate: the focus exists for
       * assistive technology, and nobody tabs to a heading.
       */}
      <h1 tabIndex={-1} className="text-title focus:outline-none lg:text-title-lg">
        {title}
      </h1>
      {help ? <p className="mt-2.5 text-body leading-relaxed text-ink-600">{help}</p> : null}

      <div className="mt-7">{children}</div>

      {footnote ? <p className="mt-5 text-body-sm text-ink-500">{footnote}</p> : null}
    </div>
  );
}
