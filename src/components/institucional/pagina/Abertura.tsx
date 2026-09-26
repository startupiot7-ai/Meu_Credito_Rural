import { ArrowRightIcon, ButtonLink } from '@/components/ui';
import { formatNumber } from '@/lib/format';
import { carteiraDeDemonstracao } from '@/lib/institucional/dados-simulados';
import { DistribuicaoDeRisco } from '@/components/institucional/painel/DistribuicaoDeRisco';

/**
 * Abertura da página institucional.
 *
 * Começa pelo risco da organização, não pelo problema do produtor: é essa a
 * pergunta que o gestor precisa responder internamente para justificar a licença.
 */
export function Abertura() {
  const carteira = carteiraDeDemonstracao;

  return (
    <section aria-labelledby="abertura-titulo" className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_70%_0%,rgba(233,174,46,0.12),transparent_70%)]"
      />
      <div className="container-page relative pb-14 pt-10 lg:pb-20 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <p className="mb-4 text-caption font-semibold uppercase tracking-[0.12em] text-canopy-600">
              Para cooperativas e sindicatos rurais
            </p>
            <h1 id="abertura-titulo" className="text-display leading-[1.1] lg:text-display-lg">
              Você sabe quantos dos seus associados estão a um ano ruim de não conseguir pagar a
              próxima safra?
            </h1>
            <p className="mt-5 max-w-prose text-body-lg leading-relaxed text-ink-600">
              O Meu Crédito Rural mostra a saúde financeira da sua carteira de associados, de forma
              agregada e anonimizada, antes que o risco vire inadimplência.
            </p>
            <div className="mt-8 flex flex-col gap-3 md:flex-row">
              <ButtonLink href="#demonstracao" size="lg" iconRight={<ArrowRightIcon />}>
                Solicitar demonstração
              </ButtonLink>
              <ButtonLink href="/painel" size="lg" variant="secondary">
                Ver o painel de exemplo
              </ButtonLink>
            </div>
          </div>

          <figure className="m-0 rounded-3xl border border-sand-200 bg-sand-50 p-6 shadow-lg">
            <figcaption className="flex items-baseline justify-between gap-4">
              <span className="text-body-sm font-semibold text-ink-900">Carteira por faixa de risco</span>
              <span className="text-caption text-ink-500">Exemplo com dados fictícios</span>
            </figcaption>
            <p className="mt-4 flex items-baseline gap-2">
              <span className="font-display text-display-lg font-bold tabular-nums text-ink-900">
                {formatNumber(carteira.produtoresPorFaixa.risco)}
              </span>
              <span className="text-body-sm text-ink-600">
                de {formatNumber(carteira.produtoresComDiagnostico)} associados avaliados em risco
                elevado
              </span>
            </p>
            <DistribuicaoDeRisco produtoresPorFaixa={carteira.produtoresPorFaixa} className="mt-6" />
          </figure>
        </div>
      </div>
    </section>
  );
}
