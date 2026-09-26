import { CheckIcon } from '@/components/ui';
import { Section } from '@/components/landing/Section';
import { casosDeInstituicoes, planos } from '@/lib/institucional/conteudo-comercial';

/**
 * Planos e casos.
 *
 * {{PRICING_PLACEHOLDER}} Não há preços definidos: enquanto `preco` for nulo,
 * o cartão mostra "Valor sob consulta". Nenhum valor é inventado aqui.
 *
 * {{CASES_PLACEHOLDER}} A lista de casos está vazia; a parte de casos só
 * aparece quando houver pelo menos um caso real, autorizado pela instituição.
 */
export function PlanosECasos() {
  return (
    <Section
      id="planos"
      eyebrow="Planos"
      title="Uma licença para a cooperativa. Nenhum custo para o produtor."
      description="O diagnóstico é gratuito para o associado, sempre. Quem contrata é a instituição que quer enxergar a própria carteira."
      tone="sand"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {planos.map((plano, posicao) => (
          <article
            key={plano.identificador}
            className={
              posicao === 0
                ? 'flex flex-col rounded-2xl border-2 border-beam-300 bg-beam-50 p-6 shadow-card md:p-8'
                : 'flex flex-col rounded-2xl border border-sand-200 bg-sand-50 p-6 shadow-card md:p-8'
            }
          >
            <p className="text-caption font-semibold uppercase tracking-[0.1em] text-canopy-600">{plano.publico}</p>
            <h3 className="mt-2 text-title">{plano.nome}</h3>
            <p className="mt-4 font-display text-title-lg font-bold text-ink-900">
              {plano.preco ?? 'Valor sob consulta'}
            </p>
            <p className="text-body-sm text-ink-600">{plano.formaDeCobranca}</p>
            <ul className="mt-6 flex flex-col gap-3 border-t border-sand-300/70 pt-6">
              {plano.itens.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-body text-ink-800">
                  <CheckIcon aria-hidden className="mt-1 shrink-0 text-canopy-600" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {casosDeInstituicoes.length > 0 ? (
        <div className="mt-12">
          <h3 className="text-title-sm">Instituições que já usam</h3>
          <ul className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
            {casosDeInstituicoes.map((caso) => (
              <li key={caso.instituicao} className="rounded-2xl border border-sand-200 bg-sand-50 p-6">
                <p className="text-body font-semibold text-ink-900">{caso.instituicao}</p>
                <p className="mt-2 text-body-sm text-ink-600">{caso.resumo}</p>
                <p className="mt-3 text-body-sm font-medium text-canopy-700">{caso.resultado}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Section>
  );
}
