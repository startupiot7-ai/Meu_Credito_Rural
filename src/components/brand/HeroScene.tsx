import Image from 'next/image';
import { cn } from '@/lib/cn';

/**
 * HeroScene — the official logo at hero size.
 *
 * The same `public/logo-oficial.png` as the header lockup, centred on the warm
 * golden-hour gradient the hero panel has always used, so the page opens on the
 * brand rather than on an illustration of it.
 *
 * Decorative: the headline beside it carries the message.
 */
export function HeroScene({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'flex items-center justify-center bg-gradient-to-b from-[#FBEDC9] to-[#FDFBF6] to-70%',
        className,
      )}
    >
      <Image
        src="/logo-oficial.png"
        alt=""
        width={564}
        height={426}
        priority
        className="h-auto w-3/5 max-w-[20rem] animate-fade-up"
      />
    </div>
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
