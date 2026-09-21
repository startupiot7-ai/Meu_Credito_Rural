import type { SVGProps } from 'react';

/**
 * Hand-rolled icon set — no icon package.
 *
 * Two reasons: the payload stays tiny on rural connections, and the stroke
 * weight stays consistent with the rest of the interface. Icons are decorative
 * by default (`aria-hidden`); anywhere an icon carries meaning on its own the
 * calling component supplies a visible label or `sr-only` text.
 */
type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function Base({ title, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export const CheckIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </Base>
);

export const CheckCircleIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.5 2.5 2.5L16 9.5" />
  </Base>
);

export const AlertTriangleIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4.5 2.8 19.5h18.4L12 4.5Z" />
    <path d="M12 10v4" />
    <path d="M12 17.2h.01" />
  </Base>
);

export const AlertCircleIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5v5" />
    <path d="M12 16.2h.01" />
  </Base>
);

export const InfoIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5" />
    <path d="M12 7.8h.01" />
  </Base>
);

export const XIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Base>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m14.5 5-7 7 7 7" />
  </Base>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m9.5 5 7 7-7 7" />
  </Base>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="m5 9.5 7 7 7-7" />
  </Base>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </Base>
);

export const UploadIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 16V4" />
    <path d="m7.5 8.5 4.5-4.5 4.5 4.5" />
    <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />
  </Base>
);

export const FileIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M13.5 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V8l-5-5Z" />
    <path d="M13.5 3v4A1 1 0 0 0 14.5 8h4" />
  </Base>
);

export const TrashIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4.5 6.5h15" />
    <path d="M9.5 6.5V4.8A1.3 1.3 0 0 1 10.8 3.5h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7" />
    <path d="M6.5 6.5 7.4 20a1.3 1.3 0 0 0 1.3 1.2h6.6a1.3 1.3 0 0 0 1.3-1.2l.9-13.5" />
  </Base>
);

export const SpinnerIcon = (p: IconProps) => (
  <Base {...p} strokeWidth={2.25}>
    <path d="M12 3a9 9 0 1 0 9 9" />
  </Base>
);

export const ShieldIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 3 5 5.8v5.4c0 4.3 2.8 8.2 7 9.8 4.2-1.6 7-5.5 7-9.8V5.8L12 3Z" />
    <path d="m9 12 2.2 2.2L15.5 10" />
  </Base>
);

export const LockIcon = (p: IconProps) => (
  <Base {...p}>
    <rect x="4.5" y="10" width="15" height="10.5" rx="1.8" />
    <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
  </Base>
);

export const EyeOffIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 3l18 18" />
    <path d="M10.6 6.3A8.6 8.6 0 0 1 12 6.2c5 0 9 5.8 9 5.8a16 16 0 0 1-3 3.4" />
    <path d="M6.2 8A16.4 16.4 0 0 0 3 12s4 5.8 9 5.8a8.5 8.5 0 0 0 3.3-.7" />
    <path d="M9.9 10.2a2.9 2.9 0 0 0 4 4" />
  </Base>
);

/** Used by the "Como funciona" steps and the diagnostic progress dots. */
export const RouteDotsIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="5" cy="19" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="5" r="2" />
    <path strokeDasharray="1 3" d="M6.6 17.4 10.4 13.6M13.6 10.4l3.8-3.8" />
  </Base>
);

/** Coffee leaf — used as a quiet agricultural signature, never as decoration alone. */
export const CoffeeLeafIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M20 4c0 8-5 13-11.5 13C6 17 4 15 4 12.5 4 6.5 11 4 20 4Z" />
    <path d="M20 4 7 17" />
  </Base>
);

export const ScaleIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M12 4v16" />
    <path d="M6.5 20h11" />
    <path d="M4 8h16" />
    <path d="M7.5 8 4.5 14h6L7.5 8Z" />
    <path d="M16.5 8 13.5 14h6l-3-6Z" />
  </Base>
);

export const ChartIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M4 20V4" />
    <path d="M4 20h16" />
    <path d="M8 20v-6" />
    <path d="M13 20V8" />
    <path d="M18 20v-9" />
  </Base>
);

export const CompassIcon = (p: IconProps) => (
  <Base {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15 9-1.7 4.3L9 15l1.7-4.3L15 9Z" />
  </Base>
);

export const SaveIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M5.5 4h10L20 8.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V5.5A1.5 1.5 0 0 1 5.5 4Z" />
    <path d="M8 4v5h7" />
    <path d="M8 20.5v-5.2h8v5.2" />
  </Base>
);

export const CloudOffIcon = (p: IconProps) => (
  <Base {...p}>
    <path d="M3 3l18 18" />
    <path d="M7.3 8.1A5 5 0 0 1 17 9.4a3.8 3.8 0 0 1 2.7 6.2" />
    <path d="M16.5 18H7a4 4 0 0 1-1.1-7.8" />
  </Base>
);
