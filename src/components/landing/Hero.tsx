import { HeroScene } from '@/components/brand/HeroScene';
import { ButtonLink, ArrowRightIcon } from '@/components/ui';

/**
 * Hero — o teste dos cinco segundos.
 *
 * Pivotagem: a promessa deixou de ser "sua dívida tem caminhos" e passou a
 * ser a prevenção — ver se a safra sustenta o crédito ANTES de contratar.
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
              Antes de assumir o custeio,{' '}
              <span className="text-canopy-700">veja se a sua safra aguenta.</span>
            </h1>

            <p className="mt-5 text-body-lg leading-relaxed text-ink-600">
              Veja a safra em três cenários, descubra quanto ela pode piorar antes de faltar
              dinheiro e decida com mais segurança, antes que o problema vire dívida.
            </p>

            <div className="mt-8 flex flex-col gap-3 md:flex-row">
              <ButtonLink
                href="/diagnostico"
                size="lg"
                iconRight={<ArrowRightIcon />}
                className="md:w-auto"
                fullWidth
              >
                Simular minha safra
              </ButtonLink>
              <ButtonLink
                href="/diagnostico/exemplo/planejando-safra"
                size="lg"
                variant="secondary"
                fullWidth
                className="md:w-auto"
              >
                Ver com um exemplo
              </ButtonLink>
            </div>

            <p className="mt-4 text-body-sm text-ink-500">
              Gratuito e independente. Leva cerca de 5 minutos, sem CPF.
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
