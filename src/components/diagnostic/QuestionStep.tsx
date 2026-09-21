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
       * `key`ed by the parent so this heading remounts on every step, which is
       * what makes a screen reader announce the new question.
       */}
      <h1 tabIndex={-1} className="text-title lg:text-title-lg">
        {title}
      </h1>
      {help ? <p className="mt-2.5 text-body leading-relaxed text-ink-600">{help}</p> : null}

      <div className="mt-7">{children}</div>

      {footnote ? <p className="mt-5 text-body-sm text-ink-500">{footnote}</p> : null}
    </div>
  );
}
