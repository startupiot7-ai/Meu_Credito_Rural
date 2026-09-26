import { cn } from '@/lib/cn';

/**
 * HeroScene — the lighthouse at hero size.
 *
 * A purpose-built variant of `LighthouseMark`, not that mark scaled up. It
 * keeps the same five-shape language — plinth, tower, lantern room, roof,
 * beam — with the proportions that matter preserved at this size:
 *
 *   plinth (44) > tower foot (36) > tower top (24) < lantern room (30) < roof (38)
 *
 * What changed from the small mark is the environment, and only as much of it
 * as the metaphor needs: fog on the left where nothing has been looked at yet,
 * a track climbing out of it, and the beam crossing from the lantern. No coffee
 * shrubs, no cherries, no dotted path — the scene says one thing.
 *
 * Decorative: the headline beside it carries the message.
 */
export function HeroScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 240"
      className={cn('h-auto w-full', className)}
      aria-hidden
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBEDC9" />
          <stop offset="70%" stopColor="#FDFBF6" />
        </linearGradient>

        {/* Brightest at the lantern, gone by the far edge. */}
        <linearGradient id="hero-beam" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#F1C55A" stopOpacity="0.85" />
          <stop offset="45%" stopColor="#F1C55A" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#F7DC94" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="hero-fog" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F7F2E8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#F7F2E8" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="320" height="240" fill="url(#hero-sky)" />

      {/* Two ground bands. Each is drawn well past the next so no seam shows. */}
      <path d="M0 150c80-18 180-10 320-22v130H0Z" fill="#B9D1BA" />
      <path d="M0 180c90-20 190-8 320-22v122H0Z" fill="#63926A" />

      {/* The track climbs out of the fog and reaches the foot of the tower. */}
      <path
        d="M52 240c26-34 74-54 156-66"
        stroke="#E2D6C0"
        strokeWidth="15"
        strokeLinecap="round"
        fill="none"
      />

      {/* Fog over the side not yet looked at, then the beam across it. */}
      <rect x="0" y="86" width="190" height="154" fill="url(#hero-fog)" />

      <g className="animate-beam-sweep">
        <path d="M218 84 8 108v38l210-46Z" fill="url(#hero-beam)" opacity="0.5" />
        <path d="M218 88 8 116v18l210-36Z" fill="url(#hero-beam)" />
      </g>

      {/* The lighthouse, in front of its own light. */}
      <rect x="210" y="166" width="44" height="9" rx="4.5" fill="#613F2A" />
      <path d="M214 166 220 96h24l6 70Z" fill="#26492F" />
      <rect x="217" y="76" width="30" height="20" rx="4" fill="#E9AE2E" />
      <path d="M213 76 232 60l19 16Z" fill="#1E3A26" />
    </svg>
  );
}

/** A thin line of light, used to separate sections without a hard rule. */
export function BeamDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'h-px w-full bg-gradient-to-r from-transparent via-beam-300 to-transparent',
        className,
      )}
    />
  );
}
