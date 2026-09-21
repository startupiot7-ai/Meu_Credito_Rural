import { cn } from '@/lib/cn';

/**
 * LighthouseMark — the brand symbol.
 *
 * A lighthouse drawn with the same stroke language as the interface icons, with
 * one short beam. It marks a direction; it is not a rescue. Deliberately not
 * nautical: no waves, no rope, no anchor — the environment is a coffee farm.
 */
export function LighthouseMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('h-8 w-8', className)}
      role="img"
      aria-label="Meu Crédito Rural"
      focusable="false"
    >
      {/* The light itself — the only warm element in the mark. */}
      <path d="M16 6.2a2.4 2.4 0 0 1 2.4 2.4v1.1h-4.8V8.6A2.4 2.4 0 0 1 16 6.2Z" fill="#E9AE2E" />
      {/* The beam, pointing to where the path is. */}
      <path
        d="M19.4 8.1 27.5 5v7.2l-8.1-3.1Z"
        fill="#E9AE2E"
        opacity="0.38"
      />
      {/* Tower. */}
      <path
        d="M12.6 11.2h6.8l1.7 12.3a1 1 0 0 1-1 1.1h-8.2a1 1 0 0 1-1-1.1l1.7-12.3Z"
        fill="#2F5B39"
      />
      {/* Gallery rail and a band, so the silhouette reads as a lighthouse at 16px. */}
      <path d="M11.9 11.2h8.2M12.9 16.4h6.2" stroke="#FDFBF6" strokeWidth="1.3" strokeLinecap="round" />
      {/* Ground: two soil ridges, the farm rather than the sea. */}
      <path
        d="M4.5 27.4c3.4-1.4 6.9-2.1 11.5-2.1s8.1.7 11.5 2.1"
        stroke="#7A4F33"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Full lockup: mark plus wordmark. Used in the header and the footer. */
export function Logo({
  className,
  tone = 'dark',
}: {
  className?: string;
  tone?: 'dark' | 'light';
}) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LighthouseMark className="h-8 w-8 shrink-0" />
      <span
        className={cn(
          'font-display text-title-sm font-bold leading-none tracking-tight',
          tone === 'dark' ? 'text-canopy-800' : 'text-sand-50',
        )}
      >
        Meu Crédito Rural
      </span>
    </span>
  );
}
