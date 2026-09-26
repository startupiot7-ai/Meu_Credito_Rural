import { ArrowRightIcon, ButtonLink } from '@/components/ui';
import { BeamDivider } from '@/components/brand/HeroScene';

/**
 * CTA final.
 *
 * Simplification pass: the supporting paragraph under the headline came out.
 * The headline is the whole argument, and following it with three more lines
 * about how few questions there are weakened it.
 *
 * No countdown, no scarcity, no warning about waiting — the reason to start is
 * that clarity is useful, not that something bad is coming.
 */
export function FinalCta() {
  return (
    <section
      aria-labelledby="cta-final-titulo"
      className="section-y relative overflow-hidden bg-canopy-800"
    >
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

          <div className="mt-8 flex justify-center">
            <ButtonLink href="/diagnostico" size="lg" variant="beam" iconRight={<ArrowRightIcon />}>
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
