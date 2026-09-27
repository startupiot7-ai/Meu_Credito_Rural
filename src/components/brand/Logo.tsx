import Image from 'next/image';
import { cn } from '@/lib/cn';

/**
 * LogoMark — the official brand symbol, served from `public/logo-oficial.png`.
 *
 * The file is a trimmed, transparent export of `LogoOficial.png` (564x426), so
 * it sits on any of the sand backgrounds without a white box around it. Width
 * follows the height through `w-auto`, keeping the 4:3 proportion. `cn` does
 * not resolve conflicts, so the default height is replaced, not appended to.
 */
export function LogoMark({ className = 'h-6' }: { className?: string }) {
  return (
    <Image
      src="/logo-oficial.png"
      alt=""
      width={564}
      height={426}
      priority
      className={cn('w-auto', className)}
    />
  );
}

/**
 * Full lockup: mark plus wordmark. Used in the header and the footer.
 *
 * `compactOnMobile` drops the wordmark below `sm`, for headers that also carry
 * a badge or a button and would otherwise overflow a phone screen.
 */
export function Logo({
  className,
  tone = 'dark',
  compactOnMobile = false,
}: {
  className?: string;
  tone?: 'dark' | 'light';
  compactOnMobile?: boolean;
}) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark className="h-7 shrink-0 sm:h-10" />
      <span
        className={cn(
          'whitespace-nowrap font-display text-title-sm font-bold leading-none tracking-tight',
          tone === 'dark' ? 'text-canopy-800' : 'text-sand-50',
          compactOnMobile && 'hidden sm:inline',
        )}
      >
        Meu Crédito Rural
      </span>
    </span>
  );
}
