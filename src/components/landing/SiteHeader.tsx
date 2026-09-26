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
 * next harvest does not need a navigation system; they need the page to get out of the way. On
 * mobile the links collapse into a single scrollable row rather than a burger
 * menu, so nothing is hidden behind an icon.
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
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Meu Crédito Rural, página inicial" className="shrink-0 rounded-md">
          <Logo />
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
        <ButtonLink href="/diagnostico" size="sm" className="shrink-0">
          <span className="md:hidden">Começar</span>
          <span className="hidden md:inline">Simular minha safra</span>
        </ButtonLink>
      </div>
    </header>
  );
}
