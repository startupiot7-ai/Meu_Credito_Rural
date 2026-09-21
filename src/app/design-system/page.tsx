import type { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink, ChevronLeftIcon } from '@/components/ui';
import {
  beam,
  borderRadius,
  canopy,
  coffee,
  fontSize,
  ink,
  sand,
  spacing,
  status,
} from '@/design-system/tokens';
import { Gallery } from './Gallery';

export const metadata: Metadata = {
  title: 'Design system',
  description:
    'Referência viva dos tokens e componentes do Meu Crédito Rural, com todos os estados interativos.',
  robots: { index: false, follow: false },
};

/**
 * Design system reference page.
 *
 * Renders the tokens straight from `src/design-system/tokens.ts`, so this page
 * cannot drift from the values the product actually uses: if a swatch here is
 * wrong, the token is wrong.
 */

const palettes = [
  { name: 'Canopy — verde agrícola (primária)', scale: canopy },
  { name: 'Sand — bege quente (superfícies)', scale: sand },
  { name: 'Coffee — marrom café (secundária)', scale: coffee },
  { name: 'Beam — âmbar do farol (destaque)', scale: beam },
  { name: 'Ink — neutros de texto', scale: ink },
];

export default function DesignSystemPage() {
  return (
    <div className="min-h-dvh bg-sand-50">
      <header className="border-b border-sand-200 bg-sand-50">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" aria-label="Meu Crédito Rural, página inicial" className="rounded-md">
            <Logo />
          </Link>
          <ButtonLink href="/" variant="ghost" size="sm" iconLeft={<ChevronLeftIcon />}>
            Voltar ao site
          </ButtonLink>
        </div>
      </header>

      <main id="conteudo" className="container-page py-10 lg:py-14">
        <div className="max-w-prose">
          <p className="text-caption font-semibold uppercase tracking-[0.12em] text-canopy-600">
            Referência interna
          </p>
          <h1 className="mt-3 text-title-lg lg:text-display">Design system</h1>
          <p className="mt-4 text-body-lg leading-relaxed text-ink-600">
            Os tokens e os componentes do Meu Crédito Rural, com todos os estados. Os valores
            abaixo são lidos diretamente do arquivo de tokens — se algo aqui estiver errado, o
            token está errado.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-12">
          <section aria-labelledby="cores" className="border-t border-sand-200 pt-10">
            <h2 id="cores" className="text-title">
              Cores
            </h2>
            <p className="mt-2 max-w-prose text-body-sm text-ink-600">
              Verde agrícola profundo como voz principal, bege quente como página, marrom café
              como apoio e âmbar como a luz do farol — usado em destaques e no anel de foco.
            </p>

            <div className="mt-6 flex flex-col gap-6">
              {palettes.map((palette) => (
                <div key={palette.name}>
                  <h3 className="text-body font-medium text-ink-900">{palette.name}</h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {Object.entries(palette.scale).map(([step, value]) => (
                      <li key={step} className="w-[4.5rem]">
                        <span
                          className="block h-12 w-full rounded-md border border-ink-900/10"
                          style={{ backgroundColor: value }}
                        />
                        <span className="mt-1 block text-caption text-ink-600">{step}</span>
                        <span className="block text-[0.7rem] uppercase text-ink-400">
                          {value}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <div>
                <h3 className="text-body font-medium text-ink-900">
                  Status — luz verde, amarela e vermelha
                </h3>
                <ul className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(status).map(([name, tone]) => (
                    <li
                      key={name}
                      className="rounded-lg border p-3"
                      style={{ backgroundColor: tone.surface, borderColor: tone.border }}
                    >
                      <span
                        className="block text-body-sm font-semibold"
                        style={{ color: tone.fg }}
                      >
                        {name}
                      </span>
                      <span className="mt-1 block text-caption" style={{ color: tone.fg }}>
                        superfície {tone.surface} · texto {tone.fg}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section aria-labelledby="tipografia" className="border-t border-sand-200 pt-10">
            <h2 id="tipografia" className="text-title">
              Tipografia
            </h2>
            <p className="mt-2 max-w-prose text-body-sm text-ink-600">
              Duas famílias: Source Serif 4 para títulos e Inter para tudo que precisa ser lido
              e respondido. O corpo nunca fica abaixo de 1rem.
            </p>
            <ul className="mt-6 flex flex-col divide-y divide-sand-200 border-y border-sand-200">
              {Object.entries(fontSize).map(([name, [size]]) => (
                <li key={name} className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-4">
                  <span className="w-28 shrink-0 text-caption text-ink-500">{name}</span>
                  <span className="w-20 shrink-0 text-caption tabular-nums text-ink-400">
                    {size}
                  </span>
                  <span
                    className={
                      name.startsWith('display') || name.startsWith('title')
                        ? 'font-display font-semibold text-ink-900'
                        : 'text-ink-800'
                    }
                    style={{ fontSize: size }}
                  >
                    Sua dívida rural tem caminhos
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="espacamento" className="border-t border-sand-200 pt-10">
            <h2 id="espacamento" className="text-title">
              Espaçamento e raios
            </h2>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-body font-medium text-ink-900">Escala de espaçamento</h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {Object.entries(spacing).map(([name, value]) => (
                    <li key={name} className="flex items-center gap-3">
                      <span className="w-32 shrink-0 text-caption text-ink-500">{name}</span>
                      <span className="w-14 shrink-0 text-caption tabular-nums text-ink-400">
                        {value}
                      </span>
                      <span className="h-3 rounded-sm bg-canopy-400" style={{ width: value }} />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-body font-medium text-ink-900">Raios de borda</h3>
                <ul className="mt-3 flex flex-wrap gap-3">
                  {Object.entries(borderRadius).map(([name, value]) => (
                    <li key={name} className="text-center">
                      <span
                        className="block h-16 w-16 border-2 border-canopy-500 bg-canopy-50"
                        style={{ borderRadius: value }}
                      />
                      <span className="mt-1 block text-caption text-ink-600">{name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <Gallery />
        </div>
      </main>
    </div>
  );
}
