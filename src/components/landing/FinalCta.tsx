import { ArrowRightIcon, ButtonLink } from '@/components/ui';
import { BeamDivider } from '@/components/brand/HeroScene';

/**
 * CTA final.
 *
 * Closes on the promise the product actually makes: you do not have to carry
 * the complexity by yourself. No countdown, no scarcity, no warning about what
 * happens if you wait — the reason to start is that clarity is useful, not that
 * something bad is coming.
 */
export function FinalCta() {
  return (
    <section
      aria-labelledby="cta-final-titulo"
      className="section-y relative overflow-hidden bg-canopy-800"
    >
      {/* A last pass of the beam, low and wide, behind the words. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(70%_100%_at_50%_0%,rgba(233,174,46,0.22),transparent_70%)]"
      />

      <div className="container-page relative">
        <div className="mx-auto max-w-prose text-center">
          <BeamDivider className="mx-auto mb-10 max-w-xs" />

          <h2 id="cta-final-titulo" className="text-title-lg text-sand-50 lg:text-display">
            Você não precisa entender sozinho toda a complexidade do crédito rural.
          </h2>

          <p className="mt-5 text-body-lg leading-relaxed text-sand-200">
            Comece pelo diagnóstico inicial. São poucas perguntas, uma de cada vez, e no fim
            você sai sabendo onde está e qual pode ser o próximo passo.
          </p>

          <div className="mt-8 flex justify-center">
            <ButtonLink
              href="/diagnostico"
              size="lg"
              iconRight={<ArrowRightIcon />}
              className="bg-beam-400 text-ink-900 hover:bg-beam-300 active:bg-beam-500"
            >
              Começar meu diagnóstico
            </ButtonLink>
          </div>

          <p className="mt-4 text-body-sm text-sand-300">
            Gratuito e sem compromisso. Diagnóstico indicativo.
          </p>
        </div>
      </div>
    </section>
  );
}
