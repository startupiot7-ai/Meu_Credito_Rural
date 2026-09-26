'use client';

import { useMemo, useState } from 'react';
import { ButtonLink, Card, CurrencyInput, QuantityInput, StatusBadge } from '@/components/ui';
import { aparenciaDaSituacao } from '@/components/diagnostico/resultado/aparencia';
import { valoresIniciaisDaSimulacao } from '@/lib/conteudo-da-pagina-inicial';
import { descreverHipotese, hipotesesDosCenarios } from '@/lib/diagnostico/cenarios';
import { simularRapido } from '@/lib/diagnostico/simulacao-rapida';
import { percentual, reaisArredondados } from '@/lib/diagnostico/texto';
import { Section } from './Section';

/** A hipótese do cenário pior vem das premissas do motor, nunca escrita à mão aqui. */
const hipoteseDoCenarioPior = descreverHipotese(hipotesesDosCenarios().desfavoravel).toLowerCase();

/**
 * Simulação rápida da safra.
 *
 * Quatro números e a MESMA conta do diagnóstico completo (simularRapido chama
 * diagnosticar). Não há régua de "percentual da receita comprometida": a
 * pergunta é se a safra paga custos e parcelas como você espera e num ano
 * pior. A conta acontece no aparelho — nada é enviado.
 */
export function Simulator() {
  const [sacas, mudarSacas] = useState<number | null>(valoresIniciaisDaSimulacao.producaoEsperadaSacas);
  const [preco, mudarPreco] = useState<number | null>(valoresIniciaisDaSimulacao.precoPorSaca);
  const [custo, mudarCusto] = useState<number | null>(valoresIniciaisDaSimulacao.custoTotalDaSafra);
  const [custeio, mudarCusteio] = useState<number | null>(valoresIniciaisDaSimulacao.valorDoCusteio);

  const resultado = useMemo(
    () =>
      simularRapido({
        producaoEsperadaSacas: sacas,
        precoPorSaca: preco,
        custoTotalDaSafra: custo,
        valorDoCusteio: custeio,
      }),
    [sacas, preco, custo, custeio],
  );
  const { cenarios, margem } = resultado;

  return (
    <Section
      id="simulador"
      eyebrow="Simulação rápida"
      title="Sua safra aguenta um ano pior?"
      description="Troque pelos seus números. A conta acontece no seu aparelho — nada é enviado."
    >
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        <Card>
          <div className="flex flex-col gap-5">
            <QuantityInput label="Produção esperada" suffix="sacas" value={sacas} onValueChange={mudarSacas} />
            <CurrencyInput label="Preço por saca" value={preco} onValueChange={mudarPreco} />
            <CurrencyInput
              label="Custo da safra"
              hint="Adubo, defensivo, mão de obra e colheita."
              value={custo}
              onValueChange={mudarCusto}
            />
            <CurrencyInput label="Custeio que você pensa em pegar" value={custeio} onValueChange={mudarCusteio} />
          </div>
        </Card>

        <div aria-live="polite" className="flex">
          <Card variant="beam" className="flex w-full flex-col justify-center">
            <StatusBadge tone={aparenciaDaSituacao[resultado.situacao]} className="self-start">
              {resultado.rotuloDaSituacao}
            </StatusBadge>

            {cenarios ? (
              <dl className="mt-5 flex flex-col gap-3 text-body">
                <LinhaDoResultado rotulo="Se a safra vier como você espera" sobra={cenarios.esperado.recursosAposCompromissos} />
                <LinhaDoResultado rotulo="Se vier pior" sobra={cenarios.desfavoravel.recursosAposCompromissos} />
              </dl>
            ) : (
              <p className="mt-4 text-body text-ink-700">{resultado.frase}</p>
            )}

            {margem.calculavel && margem.quebraDeProducaoSuportada.fracao > 0 ? (
              <p className="mt-5 text-body-sm leading-relaxed text-ink-700">
                A colheita pode ser até{' '}
                <strong className="font-semibold">{percentual(margem.quebraDeProducaoSuportada.fracao)}</strong> menor
                antes de faltar dinheiro.
              </p>
            ) : null}

            <p className="mt-5 border-t border-beam-200 pt-4 text-caption leading-relaxed text-ink-600">
              &quot;Pior&quot; é uma hipótese de simulação, ainda a validar: {hipoteseDoCenarioPior}. Esta
              conta rápida não inclui café prometido, outros pagamentos nem o sustento da família; o diagnóstico
              completo inclui.
            </p>
          </Card>
        </div>
      </div>

      <div className="mt-8">
        <ButtonLink href="/diagnostico" size="lg">
          Fazer o diagnóstico completo
        </ButtonLink>
      </div>
    </Section>
  );
}

function LinhaDoResultado({ rotulo, sobra }: { rotulo: string; sobra: number }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-3">
      <dt className="text-ink-700">{rotulo}</dt>
      <dd className={sobra < 0 ? 'font-semibold tabular-nums text-risk-fg' : 'font-semibold tabular-nums text-healthy-fg'}>
        {sobra < 0 ? `faltam ${reaisArredondados(-sobra)}` : `sobram ${reaisArredondados(sobra)}`}
      </dd>
    </div>
  );
}
