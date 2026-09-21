import { Card, ComparisonBar } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { creditScenarios } from '@/lib/mock-data';
import { Section } from './Section';

/**
 * Comparação de condições.
 *
 * Simplification pass, and this section was the worst offender: three cards,
 * each carrying a name, a description, a bar, the yearly payment, the term, the
 * grace period and the share of revenue — more than eighteen data points asking
 * to be compared at once.
 *
 * It is now one card, three rows, and a single measure: what you would pay each
 * year. Term and grace period moved into the one-line description, where they
 * are read as words instead of decoded as a table — and where "carência" can
 * carry its plain meaning in the same breath.
 */
export function Comparison() {
  const maxPayment = Math.max(...creditScenarios.map((scenario) => scenario.annualPayment));

  return (
    <Section
      id="comparacao"
      eyebrow="Comparação"
      title="O que muda em cada caminho"
      description="Mesma dívida, condições diferentes. Valores de exemplo — não são propostas."
      tone="sand"
    >
      <Card className="flex flex-col gap-7">
        {creditScenarios.map((scenario) => (
          <div key={scenario.id}>
            <ComparisonBar
              label={scenario.name}
              value={scenario.annualPayment}
              max={maxPayment}
              valueLabel={`${formatCurrency(scenario.annualPayment)} por ano`}
              highlighted={scenario.highlighted}
            />
            <p className="mt-2 text-body text-ink-600">{scenario.plain}</p>
          </div>
        ))}
      </Card>

      <p className="mt-5 max-w-prose text-body-sm leading-relaxed text-ink-600">
        Exemplo sobre {formatCurrency(750_000)} de receita e {formatCurrency(300_000)} de
        dívida. Serve para mostrar o que muda entre as condições: não é uma simulação de
        crédito e não garante aprovação.
      </p>
    </Section>
  );
}
