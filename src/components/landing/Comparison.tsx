import { Card, ComparisonBar, StatusBadge, Term } from '@/components/ui';
import { formatCurrency, formatPercent } from '@/lib/format';
import { creditScenarios } from '@/lib/mock-data';
import { Section } from './Section';

/**
 * Comparação de condições.
 *
 * Three scenarios, one measure on the bars — what you would pay per year. Two
 * measures on different scales would need two axes, which is exactly the kind
 * of chart that makes people nod without understanding, so prazo and carência
 * are written as plain text beside the bar instead of drawn.
 *
 * The highlighted row is the lighthouse pointing: "look here first". It is not
 * a recommendation to contract anything, and the caption says so.
 */
export function Comparison() {
  const maxPayment = Math.max(...creditScenarios.map((scenario) => scenario.annualPayment));

  return (
    <Section
      id="comparacao"
      eyebrow="Comparação de condições"
      title="O que muda, na prática, em cada caminho"
      description="Mesma dívida, condições diferentes. Veja o que acontece com a parcela de cada ano quando o prazo e a carência mudam."
      tone="sand"
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {creditScenarios.map((scenario) => (
          <Card
            key={scenario.id}
            variant={scenario.highlighted ? 'beam' : 'raised'}
            className="flex flex-col"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-title-sm">{scenario.name}</h3>
              {scenario.highlighted ? (
                <StatusBadge tone="attention" size="sm">
                  Vale olhar primeiro
                </StatusBadge>
              ) : null}
            </div>

            <p className="mt-2 text-body-sm leading-relaxed text-ink-600">{scenario.summary}</p>

            <div className="mt-5">
              <ComparisonBar
                label="Pagamento por ano"
                value={scenario.annualPayment}
                max={maxPayment}
                valueLabel={formatCurrency(scenario.annualPayment)}
                tone={scenario.highlighted ? 'beam' : 'canopy'}
                highlighted={scenario.highlighted}
              />
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-sand-200 pt-4">
              <div>
                <dt className="text-caption text-ink-500">Prazo</dt>
                <dd className="text-body font-medium tabular-nums text-ink-900">
                  {scenario.termYears} anos
                </dd>
              </div>
              <div>
                <dt className="text-caption text-ink-500">
                  <Term term="carencia">Carência</Term>
                </dt>
                <dd className="text-body font-medium text-ink-900">
                  {scenario.graceHarvests === 0
                    ? 'Sem carência'
                    : `${scenario.graceHarvests} safra`}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-caption text-ink-500">Da receita projetada</dt>
                <dd className="text-body font-medium tabular-nums text-ink-900">
                  {formatPercent(scenario.revenueShare, scenario.revenueShare % 1 === 0 ? 0 : 1)}
                </dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>

      <p className="mt-6 max-w-prose text-body-sm leading-relaxed text-ink-600">
        Valores ilustrativos, calculados sobre o exemplo de{' '}
        {formatCurrency(750_000)} de receita projetada e {formatCurrency(300_000)} de dívida.
        Servem para mostrar o que muda entre as condições — não são propostas, não representam
        uma simulação de crédito e não garantem aprovação. O{' '}
        <Term term="cet">CET</Term> de cada operação é informado pela instituição.
      </p>
    </Section>
  );
}
