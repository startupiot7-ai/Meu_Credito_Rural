import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';
import { ArrowRightIcon } from './Icon';

/**
 * TextLink — chamada secundária em forma de link.
 *
 * Usada onde o botão de destaque seria repetição (meio da página). Área de
 * toque de pelo menos 44 px de altura, sublinhado sempre visível (não depende
 * só da cor) e anel de foco com o token `focus-ring`.
 */
export type TextLinkProps = Omit<ComponentProps<typeof Link>, 'children'> & {
  children: React.ReactNode;
  /** Seta ao final do texto. Ligada por padrão. */
  arrow?: boolean;
};

export function TextLink({ children, arrow = true, className, ...rest }: TextLinkProps) {
  return (
    <Link
      {...rest}
      className={cn(
        'inline-flex min-h-touch items-center gap-1.5 rounded-md py-2 text-body font-semibold text-canopy-700',
        'underline decoration-canopy-600/40 underline-offset-4 transition-colors duration-base ease-standard',
        'hover:text-canopy-800 hover:decoration-canopy-700',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      <span>{children}</span>
      {arrow ? <ArrowRightIcon aria-hidden className="shrink-0" /> : null}
    </Link>
  );
}
