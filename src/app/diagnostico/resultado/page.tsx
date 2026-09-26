'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import {
  Alert,
  AlertTriangleIcon,
  ButtonLink,
  Card,
  CheckCircleIcon,
  ChevronLeftIcon,
  ComparisonBar,
  DebtShareChart,
  Skeleton,
  SkeletonCard,
  SkeletonRegion,
  SkeletonText,
  StateView,
} from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { analyse } from '@/lib/diagnostic';
import type { Analysis } from '@/lib/diagnostic';
import { creditScenarios } from '@/lib/mock-data';
import { useSavedAnswers } from '@/lib/useSavedAnswers';

/**
 * Results screen.
 *
 * The hardest rule in the product lives here: this must never read like a
 * credit score. There is no number standing alone, no grade, no "742". What the
 * producer gets is the reasoning itself —
 *
 *   O que encontramos  → a checkable list (✅ confirmado / ⚠ pendente)
 *   O que isso significa → the same thing said in plain language
 *   Próximo passo        → exactly one action
 *
 * PROTOTYPE: `analyse()` is placeholder logic over the locally-stored answers.
 * The loading state is simulated so the skeletons can be reviewed.
 */
export default function ResultPage() {
  const { answers, restored } = useSavedAnswers();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    if (!restored) return;
    if (!answers.crop) return;
    // PROTOTYPE: a deliberate pause so the loading state is reachable.
    const timer = window.setTimeout(() => setAnalysis(analyse(answers)), 900);
    return () => window.clearTimeout(timer);
  }, [restored, answers]);

  const hasAnswers = restored && Boolean(answers.crop);
  const maxPayment = Math.max(...creditScenarios.map((scenario) => scenario.annualPayment));

  return (
    <div className="flex min-h-dvh flex-col bg-sand-50">
      <header className="border-b border-sand-200 bg-sand-50">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" aria-label="Meu Crédito Rural, página inicial" className="rounded-md">
            <Logo />
          </Link>
          <ButtonLink
            href="/diagnostico"
            variant="ghost"
            size="sm"
            iconLeft={<ChevronLeftIcon />}
            className="shrink-0"
          >
            <span className="md:hidden">Voltar</span>
            <span className="hidden md:inline">Voltar às perguntas</span>
          </ButtonLink>
        </div>
      </header>

      <main id="conteudo" className="flex-1">
        <div className="container-page max-w-3xl py-8 lg:py-12">
          {!restored ? (
            <SkeletonRegion label="Carregando seu diagnóstico">
              <Skeleton className="h-9 w-3/4" />
              <SkeletonText className="mt-5" lines={2} />
              <SkeletonCard className="mt-8" />
              <SkeletonCard className="mt-4" />
            </SkeletonRegion>
          ) : !hasAnswers ? (
            /* Empty state: someone landed here without answering anything. */
            <StateView
              variant="empty"
              title="Ainda não temos suas respostas"
              description="O diagnóstico é montado a partir do que você informa. São poucas perguntas, uma de cada vez, e dá para parar e voltar quando quiser."
              action={<ButtonLink href="/diagnostico">Começar meu diagnóstico</ButtonLink>}
            />
          ) : !analysis ? (
            <SkeletonRegion label="Preparando seu diagnóstico">
              <p className="text-body text-ink-600">Organizando o que você informou…</p>
              <Skeleton className="mt-5 h-9 w-2/3" />
              <SkeletonCard className="mt-8" />
              <SkeletonCard className="mt-4" />
            </SkeletonRegion>
          ) : (
            <article className="animate-fade-up">
              <p className="text-caption font-semibold uppercase tracking-[0.12em] text-canopy-600">
                Diagnóstico indicativo
              </p>
              <h1 className="mt-3 text-title-lg lg:text-display">
                O que dá para enxergar da sua situação
              </h1>
              <p className="mt-4 max-w-prose text-body-lg leading-relaxed text-ink-600">
                Tudo abaixo vem do que você informou. Não é uma nota nem uma aprovação.
              </p>

              {/* 1. What we found — the reasoning, checkable line by line. */}
              <section aria-labelledby="encontramos" className="mt-10">
                <h2 id="encontramos" className="text-title">
                  O que encontramos
                </h2>
                <Card className="mt-4">
                  <ul className="flex flex-col gap-4">
                    {analysis.findings.map((finding) => (
                      <li key={finding.text} className="flex items-start gap-3">
                        <span
                          className={
                            finding.kind === 'confirmed'
                              ? 'mt-0.5 shrink-0 text-title-sm text-healthy-solid'
                              : 'mt-0.5 shrink-0 text-title-sm text-attention-fg'
                          }
                        >
                          {finding.kind === 'confirmed' ? (
                            <CheckCircleIcon />
                          ) : (
                            <AlertTriangleIcon />
                          )}
                        </span>
                        <span className="text-body leading-relaxed text-ink-800">
                          <span className="sr-only">
                            {finding.kind === 'confirmed'
                              ? 'Confirmado: '
                              : 'Ainda pendente: '}
                          </span>
                          {finding.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </section>

              {/* 2. The measure, always with its explanation attached. */}
              <section aria-labelledby="peso" className="mt-10">
                <h2 id="peso" className="text-title">
                  O peso da dívida na sua safra
                </h2>
                <Card className="mt-4">
                  <DebtShareChart revenue={analysis.revenue} debt={answers.debt ?? 0} />
                </Card>
              </section>

              {/* 3. What it means — the same thing, in plain language. */}
              <section aria-labelledby="significa" className="mt-10">
                <h2 id="significa" className="text-title">
                  O que isso significa
                </h2>
                <Card className="mt-4">
                  <p className="text-body leading-relaxed text-ink-800">{analysis.meaning}</p>
                </Card>
              </section>

              {/* 4. The alternatives, as illustrations rather than offers. */}
              <section aria-labelledby="alternativas" className="mt-10">
                <h2 id="alternativas" className="text-title">
                  Caminhos que podem ser avaliados
                </h2>
                <p className="mt-2 max-w-prose text-body-sm text-ink-600">
                  Valores de exemplo. Não são propostas e não garantem aprovação.
                </p>
                <Card className="mt-4">
                  <div className="flex flex-col gap-5">
                    {creditScenarios.map((scenario) => (
                      <div key={scenario.id}>
                        <ComparisonBar
                          label={scenario.name}
                          value={scenario.annualPayment}
                          max={maxPayment}
                          valueLabel={`${formatCurrency(scenario.annualPayment)} por ano`}
                          highlighted={scenario.highlighted}
                        />
                        <p className="mt-1.5 text-body-sm text-ink-600">{scenario.plain}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>

              {/* 5. One next step. Not fifteen. */}
              <section aria-labelledby="proximo-passo" className="mt-10">
                <h2 id="proximo-passo" className="text-title">
                  Próximo passo
                </h2>
                <Card variant="beam" className="mt-4">
                  <h3 className="text-title-sm">{analysis.nextStep.title}</h3>
                  <p className="mt-2 text-body leading-relaxed text-ink-700">
                    {analysis.nextStep.description}
                  </p>
                  <div className="mt-6 flex flex-col gap-3 md:flex-row">
                    <ButtonLink href="/diagnostico">Revisar minhas respostas</ButtonLink>
                    <ButtonLink href="/#comparacao" variant="secondary">
                      Ver as condições lado a lado
                    </ButtonLink>
                  </div>
                </Card>
              </section>

              {/* The disclaimer stays in full: this is substance, not expression. */}
              <Alert tone="info" title="Este é um diagnóstico indicativo" className="mt-10">
                Montado com base no que você informou, ele mostra possíveis caminhos a avaliar.
                Não somos uma instituição financeira: a análise e a decisão sobre qualquer
                renegociação são sempre da instituição com quem você tem a dívida.
              </Alert>
            </article>
          )}
        </div>
      </main>
    </div>
  );
}
