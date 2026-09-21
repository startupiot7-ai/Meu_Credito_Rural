import { cn } from '@/lib/cn';

/**
 * Skeleton — visible system status while content is on its way.
 *
 * Used everywhere rather than a spinner: on a weak rural connection a page can
 * take several seconds, and a shape that already looks like the answer reads as
 * "it is coming" instead of "it is broken". The shimmer stops under
 * `prefers-reduced-motion` (handled globally in globals.css).
 */

export function Skeleton({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'block rounded-md bg-sand-200',
        'bg-[linear-gradient(90deg,theme(colors.sand.200)_0%,theme(colors.sand.100)_40%,theme(colors.sand.200)_80%)]',
        'bg-[length:220%_100%] animate-shimmer',
        className,
      )}
    />
  );
}

/**
 * Wraps a loading region so assistive technology hears one polite message
 * instead of a pile of empty boxes.
 */
export function SkeletonRegion({
  label = 'Carregando informações',
  className,
  children,
}: {
  label?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" aria-live="polite" aria-busy className={className}>
      <span className="sr-only">{label}…</span>
      {children}
    </div>
  );
}

/** Text block placeholder: a heading plus a few lines of body. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2.5', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn('h-4', index === lines - 1 ? 'w-3/5' : 'w-full')}
        />
      ))}
    </div>
  );
}

/** Matches the footprint of a `Card` with a header and two lines. */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-sand-200 bg-sand-50 p-5 md:p-6', className)}>
      <div className="mb-4 flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex-1">
          <Skeleton className="h-5 w-2/5" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  );
}
