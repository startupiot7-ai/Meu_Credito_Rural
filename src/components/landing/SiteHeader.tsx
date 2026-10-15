'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui';

/**
 * SiteHeader — deliberately thin.
 *
 * Four anchors and one action. A producer arriving with a question about the
 * next harvest does not need a navigation system; they need the page to get out of the way.
 * From `lg` up the links sit in the header bar. Below `lg` they move to a second
 * row under the bar, scrollable on the horizontal axis (no burger menu, so
 * nothing is hidden behind an icon). Section anchors use `scroll-mt-28` below
 * `lg` to clear both rows.
 */

const links = [
  { href: '#o-problema', label: 'O problema' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#simulador', label: 'Simulador' },
  { href: '#perguntas-frequentes', label: 'Perguntas frequentes' },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-colors duration-base ease-standard',
        scrolled
          ? 'border-sand-200 bg-sand-50/95 backdrop-blur-sm'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-2 min-[360px]:gap-4">
        <Link href="/" aria-label="Meu Crédito Rural, página inicial" className="shrink-0 rounded-md">
          {/* Abaixo de 360 px o nome encolhe um pouco para caber ao lado do botão. */}
          <Logo className="max-[359px]:[&>span:last-child]:!text-body" />
        </Link>

        <nav aria-label="Seções da página" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="rounded-md px-3 py-2 text-body-sm text-ink-700 transition-colors hover:bg-sand-100 hover:text-ink-900"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/*
         * Shorter label on phones: at 360–430px the full sentence crowds the
         * wordmark. The destination and the meaning are unchanged.
         */}
        <ButtonLink href="/diagnostico" size="sm" variant="secondary" className="shrink-0 !px-3 min-[360px]:!px-4">
          <span className="md:hidden">Começar</span>
          <span className="hidden md:inline">Simular minha safra</span>
        </ButtonLink>
      </div>

      {/* Below `lg`: the section links in a row of their own, scrollable sideways. */}
      <nav
        aria-label="Seções da página"
        className="overflow-x-auto border-t border-sand-200/70 [-ms-overflow-style:none] [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max items-center gap-1 px-gutter-mobile py-1 md:px-gutter-desktop">
          {links.map((link) => (
            <li key={link.href} className="shrink-0">
              <a
                href={link.href}
                className="inline-flex min-h-touch items-center whitespace-nowrap rounded-md px-3 text-body-sm text-ink-700 transition-colors hover:bg-sand-100 hover:text-ink-900"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
