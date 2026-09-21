'use client';

import { useState } from 'react';
import { ButtonLink, Card, CurrencyInput, DebtShareChart, QuantityInput } from '@/components/ui';
import { formatCurrency, formatNumber } from '@/lib/format';
import { simulatorDefaults } from '@/lib/mock-data';
import { Section } from './Section';

/**
 * Simulador de impacto da dívida.
 *
 * Simplification pass. What came out:
 *  - the per-field hints ("Quantas sacas você espera colher nesta safra") —
 *    the label plus the unit already says it;
 *  - the separate "Receita bruta projetada" card, with its own big number and
 *    three-line explanation. Two big numbers competed for the same glance, and
 *    only one of them is the point. The revenue is now the plain multiplication
 *    written out — "500 sacas × R$ 1.500 = R$ 750.000" — which is both shorter
 *    and more convincing than the paragraph explaining it was;
 *  - the "saldo devedor" and "comprometimento" tooltips. Terms the producer
 *    has to go looking for are worse than plain words in the sentence.
 *
 * PROTOTYPE: the arithmetic is the simple one (sacas × preço = receita;
 * dívida ÷ receita = comprometimento). The real engine will take cost of
 * production, cycle and culture into account.
 */
export function Simulator() {
  const [bags, setBags] = useState<number | null>(simulatorDefaults.expectedBags);
  const [price, setPrice] = useState<number | null>(simulatorDefaults.pricePerBag);
  const [debt, setDebt] = useState<number | null>(simulatorDefaults.debt);

  const revenue = (bags ?? 0) * (price ?? 0);

  return (
    <Section
      id="simulador"
      eyebrow="Simulador"
      title="Quanto da sua safra já está comprometido?"
      description="Troque pelos seus números. A conta acontece no seu aparelho — nada é enviado."
    >
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <Card>
          <div className="flex flex-col gap-5">
            <QuantityInput
              label="Produção esperada"
              suffix="sacas"
              value={bags}
              onValueChange={setBags}
            />
            <CurrencyInput label="Preço por saca" value={price} onValueChange={setPrice} />
            <CurrencyInput label="Quanto você deve hoje" value={debt} onValueChange={setDebt} />
          </div>
        </Card>

        <Card variant="beam" className="flex flex-col justify-center">
          {/* The multiplication, written out. Shorter than explaining it. */}
          {revenue > 0 ? (
            <p className="mb-5 text-body text-ink-600">
              {formatNumber(bags ?? 0)} sacas × {formatCurrency(price ?? 0)} ={' '}
              <strong className="font-semibold tabular-nums text-ink-900">
                {formatCurrency(revenue)}
              </strong>{' '}
              esperados na safra.
            </p>
          ) : null}

          <DebtShareChart revenue={revenue} debt={debt ?? 0} />
        </Card>
      </div>

      <div className="mt-8">
        <ButtonLink href="/diagnostico" size="lg">
          Analisar minha situação
        </ButtonLink>
      </div>
    </Section>
  );
}
