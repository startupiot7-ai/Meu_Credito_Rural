import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Section — the shared rhythm of the landing page.
 *
 * Every section states what it is about in an eyebrow, a heading and at most
 * one supporting paragraph before any content. Keeping that order identical
 * down the page means the producer learns the pattern once and can then skim.
 */
export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  tone = 'default',
  className,
  headingClassName,
}: {
  id: string;
  /** Short label above the heading, e.g. "O problema". */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  /** `sand` gives the section a subtle band so long pages stay navigable. */
  tone?: 'default' | 'sand' | 'canopy';
  className?: string;
  headingClassName?: string;
}) {
  const headingId = `${id}-titulo`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn(
        'section-y scroll-mt-16',
        tone === 'sand' && 'bg-sand-100',
        tone === 'canopy' && 'bg-canopy-800 text-sand-100',
        className,
      )}
    >
      <div className="container-page">
        <div className={cn('max-w-prose', headingClassName)}>
          {eyebrow ? (
            <p
              className={cn(
                'mb-3 text-caption font-semibold uppercase tracking-[0.12em]',
                tone === 'canopy' ? 'text-beam-300' : 'text-canopy-600',
              )}
            >
              {eyebrow}
            </p>
          ) : null}
          <h2
            id={headingId}
            className={cn(
              'text-title-lg lg:text-display',
              tone === 'canopy' && 'text-sand-50',
            )}
          >
            {title}
          </h2>
          {description ? (
            <p
              className={cn(
                'mt-4 text-body-lg leading-relaxed',
                tone === 'canopy' ? 'text-sand-200' : 'text-ink-600',
              )}
            >
              {description}
            </p>
          ) : null}
        </div>

        {children ? <div className="mt-8 lg:mt-12">{children}</div> : null}
      </div>
    </section>
  );
}
