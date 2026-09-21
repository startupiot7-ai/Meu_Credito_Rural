import { cn } from '@/lib/cn';

/**
 * HeroScene — "um feixe de luz revelando um caminho na lavoura".
 *
 * Reads left to right as confusão → clareza: the left side sits under fog
 * (neblina = a dívida rural's complexity), the beam from the lighthouse crosses
 * the scene, and on the right the coffee rows and the path are legible, ending
 * at the horizon (planejamento futuro).
 *
 * Inline SVG on purpose: no image request, nothing to wait for on a weak
 * connection, and it stays sharp at every breakpoint. Decorative — the headline
 * beside it carries the message — so it is hidden from assistive technology.
 */
export function HeroScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 300"
      className={cn('h-auto w-full', className)}
      aria-hidden
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Sky: warm morning light gathering towards the horizon. */}
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBEDC9" />
          <stop offset="55%" stopColor="#FDFBF6" />
          <stop offset="100%" stopColor="#F7F2E8" />
        </linearGradient>

        {/* The beam — brightest at the lamp, dissolving as it reaches the field. */}
        <linearGradient id="hero-beam" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#F1C55A" stopOpacity="0.78" />
          <stop offset="35%" stopColor="#F1C55A" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#F7DC94" stopOpacity="0" />
        </linearGradient>

        {/* Fog over the unexamined side of the scene. */}
        <linearGradient id="hero-fog" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F7F2E8" stopOpacity="0.96" />
          <stop offset="45%" stopColor="#F7F2E8" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#F7F2E8" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="hero-near-field" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#43744C" />
          <stop offset="100%" stopColor="#26492F" />
        </linearGradient>
      </defs>

      <rect width="400" height="300" fill="url(#hero-sky)" />

      {/*
       * Distant hills — the horizon, i.e. what can be planned for.
       * Each band is drawn well past where the next one starts: the layers are
       * meant to overlap, otherwise the page colour shows through as a seam
       * wherever two curves cross.
       */}
      <path d="M0 150c48-16 84-6 128 4s86 6 130-10 92-14 142 2v60H0Z" fill="#B9D1BA" opacity="0.75" />
      <path d="M0 168c60-14 96-2 148 8s96 2 142-12 76-8 110 4v70H0Z" fill="#8FB492" opacity="0.8" />

      {/* Mid-ground coffee rows, curving with the terrain. */}
      <path d="M0 196c70-18 130-14 200 2s130 18 200 2v100H0Z" fill="#63926A" />
      <g stroke="#43744C" strokeWidth="2.5" strokeLinecap="round" opacity="0.65" fill="none">
        <path d="M-10 214c80-16 150-12 220 4s120 14 200-2" />
        <path d="M-10 232c80-16 150-12 220 4s120 14 200-2" />
      </g>

      {/* Near field. */}
      <path d="M0 244c74-20 136-16 208 2s122 18 192 0v54H0Z" fill="url(#hero-near-field)" />

      {/*
       * The path. It starts in the fog on the left and widens as it climbs
       * towards the lighthouse: the route becomes clear as it gets lit.
       */}
      <path
        d="M96 300c14-32 34-52 62-66s52-24 66-40"
        stroke="#E2D6C0"
        strokeWidth="22"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      <path
        d="M96 300c14-32 34-52 62-66s52-24 66-40"
        stroke="#F7F2E8"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray="1 16"
        fill="none"
      />

      {/* Coffee shrubs along the lit side of the path. */}
      <g fill="#1E3A26">
        <ellipse cx="246" cy="214" rx="13" ry="10" />
        <ellipse cx="278" cy="226" rx="15" ry="11" />
        <ellipse cx="316" cy="216" rx="12" ry="9" />
        <ellipse cx="352" cy="228" rx="16" ry="12" />
      </g>
      {/* Ripe cherries — the only red in the identity, used sparingly. */}
      <g fill="#A63D33" opacity="0.85">
        <circle cx="242" cy="211" r="2" />
        <circle cx="282" cy="223" r="2" />
        <circle cx="349" cy="225" r="2" />
      </g>

      {/*
       * Fog over the side of the scene the producer has not looked at yet, then
       * the beam across it. Both sit *behind* the lighthouse, so the tower
       * stands in front of its own light instead of being washed out by it.
       */}
      <rect x="0" y="104" width="230" height="196" fill="url(#hero-fog)" />

      {/*
       * The beam: two wedges from the same origin at the lamp — a wider, softer
       * spread around a narrower core — so the light reads as coming *from*
       * somewhere rather than as a band laid across the picture.
       */}
      <g className="animate-beam-sweep">
        <path d="M290 96 20 132l270 62Z" fill="url(#hero-beam)" opacity="0.5" />
        <path d="M290 98 40 148l250 26Z" fill="url(#hero-beam)" opacity="0.85" />
      </g>

      {/* The lighthouse, standing on the ridge — not on a rock in the sea. */}
      <g transform="translate(290 96)">
        <path d="M-9 76 -4 8h18l5 68Z" fill="#FDFBF6" />
        <path d="M-9 76 -4 8h9v68Z" fill="#EFE7D7" />
        <path d="M-6.4 36h20.8" stroke="#2F5B39" strokeWidth="7" />
        <path d="M-5.2 20h18.4" stroke="#7A4F33" strokeWidth="4" />
        {/* Lamp room. */}
        <rect x="-6" y="-6" width="20" height="14" rx="2" fill="#26492F" />
        <circle cx="4" cy="1" r="4.4" fill="#E9AE2E" />
        <path d="M-8 -6h24" stroke="#26492F" strokeWidth="3" strokeLinecap="round" />
        <path d="M4 -14l0 7" stroke="#26492F" strokeWidth="2.5" strokeLinecap="round" />
      </g>

    </svg>
  );
}

/**
 * BeamDivider — a thin horizontal light streak used between landing sections.
 * The metaphor carried at the smallest possible scale: a line of light.
 */
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
