import Image from 'next/image';
import { cn } from '@/lib/cn';

/**
 * LogoMark — the official brand symbol, served from `public/logo-oficial.png`.
 *
 * The file is a trimmed, transparent export of `LogoOficial.png` (318x240), so
 * it sits on any of the sand backgrounds without a white box around it. Width
 * follows the height through `w-auto`, keeping the 4:3 proportion.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/logo-oficial.png"
      alt=""
      width={318}
      height={240}
      priority
      className={cn('h-6 w-auto', className)}
    />
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
      <LogoMark className="h-10 shrink-0" />
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
