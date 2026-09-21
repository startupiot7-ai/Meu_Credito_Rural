import { HeroScene } from '@/components/brand/HeroScene';
import { ButtonLink, ArrowRightIcon, ShieldIcon } from '@/components/ui';

/**
 * Hero — the five-second test.
 *
 * Everything above the fold answers one question: "posso entender minha dívida
 * aqui?". The headline promises visibility, not a result; the support line says
 * what the product actually does; the note under the CTA sets the expectation
 * before the click, so nobody starts the diagnostic hoping for a guarantee.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-titulo" className="relative overflow-hidden">
      <div className="container-page pb-12 pt-10 lg:pb-20 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          <div className="max-w-prose">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-canopy-600/20 bg-canopy-50 px-3.5 py-1.5 text-caption font-medium text-canopy-700">
              <ShieldIcon className="text-body" />
              Orientação independente sobre crédito rural
            </p>

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
           * The scene sits second in the DOM so a screen reader and a slow
           * connection both reach the headline first. It is decorative: the
           * message is already in the text beside it.
           */}
          <div className="relative -mx-gutter-mobile overflow-hidden rounded-none border-y border-sand-200 md:mx-0 md:rounded-3xl md:border">
            <HeroScene className="aspect-[4/3] w-full md:aspect-[5/4]" />
          </div>
        </div>
      </div>
    </section>
  );
}
