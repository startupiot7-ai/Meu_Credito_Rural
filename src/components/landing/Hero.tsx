import { HeroScene } from '@/components/brand/HeroScene';
import { ButtonLink, ArrowRightIcon } from '@/components/ui';

/**
 * Hero — the five-second test.
 *
 * Simplification pass: the "Orientação independente sobre crédito rural" badge
 * came out. It was an abstraction sitting above the one sentence that already
 * says the same thing concretely, and it pushed the headline down the screen.
 * What is left is the promise, what we do, and the way in.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-titulo" className="relative overflow-hidden">
      <div className="container-page pb-12 pt-12 lg:pb-20 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="max-w-prose">
            <h1
              id="hero-titulo"
              className="text-display leading-[1.08] sm:text-display-lg lg:text-display-xl"
            >
              Sua dívida rural tem caminhos.{' '}
              <span className="text-canopy-700">Nós ajudamos você a enxergá-los.</span>
            </h1>

            <p className="mt-5 text-body-lg leading-relaxed text-ink-600">
              Entenda sua situação, simule o impacto da dívida na produção e descubra quais
              alternativas podem fazer sentido para o seu caso.
            </p>

            <div className="mt-8 flex flex-col gap-3 md:flex-row">
              <ButtonLink
                href="/diagnostico"
                size="lg"
                iconRight={<ArrowRightIcon />}
                className="md:w-auto"
                fullWidth
              >
                Analisar minha situação
              </ButtonLink>
              <ButtonLink href="#como-funciona" size="lg" variant="secondary" fullWidth className="md:w-auto">
                Entender como funciona
              </ButtonLink>
            </div>

            <p className="mt-4 text-body-sm text-ink-500">
              Diagnóstico inicial simples e orientativo.
            </p>
          </div>

          {/*
           * Second in the DOM so a screen reader and a slow connection both
           * reach the headline first. Decorative — the message is in the text.
           */}
          <div className="relative -mx-gutter-mobile overflow-hidden border-y border-sand-200 md:mx-0 md:rounded-3xl md:border">
            <HeroScene className="aspect-[4/3] w-full md:aspect-[5/4]" />
          </div>
        </div>
      </div>
    </section>
  );
}
