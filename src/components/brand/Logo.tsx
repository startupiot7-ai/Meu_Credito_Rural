import { cn } from '@/lib/cn';

/**
 * LighthouseMark — the brand symbol, small variant.
 *
 * Five solid shapes, no strokes: base, tower, lantern room, roof, beam.
 * Built like a trail marker rather than an illustration, because it has to
 * survive 24px in the header.
 *
 * The geometry is deliberate and fixed:
 *   base (15.4)  >  tower shaft (8.4 at the foot, 4.4 at the top)
 *   lantern room (6.4) overhangs the top of the tower, and the roof (7.6)
 *   overhangs the lantern — so the eye climbs to the light before the amber
 *   does that job on its own.
 *
 * The shaft is ~2.7x taller than it is wide at the foot. Squatter than that
 * and it stops reading as a lighthouse and starts reading as a hut.
 *
 * The lantern is the only warm element, and the beam leaves it — the mark says
 * "the path is visible from here", not "we come and get you".
 *
 * There is a purpose-built larger variant in `HeroScene.tsx`; this one is never
 * scaled up to do that job.
 */
export function LighthouseMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn('h-6 w-6', className)}
      role="img"
      aria-label="Meu Crédito Rural"
      focusable="false"
    >
      <defs>
        {/* The beam fades outward, so it reads as light rather than a wedge. */}
        <linearGradient id="mark-beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E9AE2E" stopOpacity="0.68" />
          <stop offset="100%" stopColor="#E9AE2E" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Beam — drawn first so the tower always sits in front of its own light. */}
      <path d="M15.2 5.6 23.6 3.2v7.4L15.2 8Z" fill="url(#mark-beam)" />

      {/* Ground: the farm the lighthouse stands on, not a rock in the sea. */}
      <rect x="4.3" y="19.8" width="15.4" height="2.2" rx="1.1" fill="#613F2A" />

      {/* Tower. */}
      <path d="M7.8 19.8 9.8 8.4h4.4l2 11.4Z" fill="#26492F" />

      {/* Lantern room — wider than the tower top, and the only warm shape. */}
      <rect x="8.8" y="4.8" width="6.4" height="3.6" rx="0.8" fill="#E9AE2E" />

      {/* Roof, overhanging the lantern. */}
      <path d="M8.2 4.8 12 2.2l3.8 2.6Z" fill="#1E3A26" />
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
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LighthouseMark className="h-7 w-7 shrink-0" />
      <span
        className={cn(
          'whitespace-nowrap font-display text-title-sm font-bold leading-none tracking-tight',
          tone === 'dark' ? 'text-canopy-800' : 'text-sand-50',
        )}
      >
        Meu Crédito Rural
      </span>
    </span>
  );
}
