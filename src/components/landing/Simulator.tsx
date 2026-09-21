'use client';

import { useState } from 'react';
import {
  ButtonLink,
  Card,
  CurrencyInput,
  DebtShareChart,
  QuantityInput,
  Term,
} from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { simulatorDefaults } from '@/lib/mock-data';
import { Section } from './Section';

/**
 * Simulador de impacto da dívida.
 *
 * The one place on the landing page where the producer touches their own
 * numbers, which is what turns an abstract promise into something they can
 * check. It runs entirely in the browser — three inputs, one multiplication,
 * one division — so it works offline and costs almost nothing to load.
 *
 * PROTOTYPE: the arithmetic is intentionally the simple one (sacas × preço =
 * receita bruta; dívida ÷ receita = comprometimento). The real engine will take
 * cost of production, cycle and culture into account.
 *
 * Rule enforced here: the percentage is never shown on its own. The sentence
 * that explains what it means is part of the chart component itself.
 */
export function Simulator() {
  const [bags, setBags] = useState<number | null>(simulatorDefaults.expectedBags);
  const [price, setPrice] = useState<number | null>(simulatorDefaults.pricePerBag);
  const [debt, setDebt] = useState<number | null>(simulatorDefaults.debt);

  const revenue = (bags ?? 0) * (price ?? 0);

  return (
    <Section
      id="simulador"
      eyebrow="Simulador de impacto da dívida"
      title="Quanto da sua safra já está comprometido?"
      description="Ajuste os três números abaixo com a sua realidade. O cálculo acontece no seu aparelho — nada é enviado e nada fica guardado."
    >
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-6">
        <Card>
          <h3 className="text-title-sm">Seus números</h3>
          <p className="mt-1.5 text-body-sm text-ink-600">
            Estimativas servem. O objetivo é enxergar a ordem de grandeza.
          </p>

          <div className="mt-6 flex flex-col gap-5">
            <QuantityInput
              label="Produção esperada"
              hint="Quantas sacas você espera colher nesta safra."
              suffix="sacas"
              value={bags}
              onValueChange={setBags}
            />
            <CurrencyInput
              label="Preço estimado por saca"
              hint="O valor que você espera receber por saca."
              value={price}
              onValueChange={setPrice}
            />
            <CurrencyInput
              label="Dívida informada"
              hint="Quanto você deve hoje, somando as operações que conhece."
              labelAdornment={<Term term="saldoDevedor" />}
              value={debt}
              onValueChange={setDebt}
            />
          </div>
        </Card>

        <div className="flex flex-col gap-5">
          <Card>
            <h3 className="text-title-sm">
              <Term term="receitaBruta">Receita bruta projetada</Term>
            </h3>
            <p className="mt-3 font-display text-display font-bold tabular-nums text-canopy-700">
              {revenue > 0 ? formatCurrency(revenue) : '—'}
            </p>
            <p className="mt-2 text-body-sm leading-relaxed text-ink-600">
              É o resultado de multiplicar a produção esperada pelo preço estimado. Ainda não
              desconta os custos da safra.
            </p>
          </Card>

          <Card variant="beam">
            <h3 className="text-title-sm">
              <Term term="comprometimento">Comprometimento da receita</Term>
            </h3>
            <DebtShareChart className="mt-4" revenue={revenue} debt={debt ?? 0} />
          </Card>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center">
        <ButtonLink href="/diagnostico" size="lg">
          Analisar minha situação
        </ButtonLink>
        <p className="text-body-sm text-ink-500">
          O simulador mostra o peso da dívida. O diagnóstico mostra os caminhos.
        </p>
      </div>
    </Section>
  );
}
