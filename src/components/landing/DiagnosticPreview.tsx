import { AlertTriangleIcon, ButtonLink, Card, CheckCircleIcon, StepProgress } from '@/components/ui';
import { rotuloDaTela, telasDoFluxo } from '@/lib/diagnostico/fluxo';
import { sampleFindings } from '@/lib/mock-data';
import { Section } from './Section';

/** O caminho de quem planeja a safra, usado só para ilustrar a barra de progresso. */
const telasDeExemplo = telasDoFluxo('planejando-safra');

/**
 * Diagnóstico (preview) — the question, then the answer.
 *
 * Simplification pass: the section led with a four-line paragraph explaining
 * that there is no long form and no mysterious score. The two frames below it
 * already demonstrate exactly that, so the paragraph went. The findings card
 * also carried a nested "O que isso significa" box, duplicating the real
 * results screen inside a preview of it — cut, along with one finding, so the
 * list can be read rather than scanned.
 */
export function DiagnosticPreview() {
  const preview = sampleFindings.slice(0, 3);

  return (
    <Section
      id="diagnostico"
      eyebrow="Diagnóstico"
      title="Uma pergunta por vez. Uma resposta que você confere."
    >
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        {/* The question, exactly as the producer will see it. */}
        <Card className="flex flex-col">
          <StepProgress current={2} total={telasDeExemplo.length} labels={telasDeExemplo.map((tela) => rotuloDaTela[tela])} />

          <div className="mt-6 flex-1">
            <h3 className="text-title-sm">Quantas sacas você espera colher?</h3>
            <p className="mt-2 text-body text-ink-600">Uma estimativa já serve.</p>

            <div className="mt-5 flex items-stretch overflow-hidden rounded-lg border border-sand-300 bg-sand-50">
              <span className="flex min-h-touch items-center px-4 py-3 text-body tabular-nums text-ink-900">
                500
              </span>
              <span className="ml-auto flex items-center border-l border-sand-200 bg-sand-100 px-4 text-body font-medium text-ink-600">
                sacas
              </span>
            </div>
          </div>
        </Card>

        {/* The reasoning. Explicitly not a score. */}
        <Card className="flex flex-col">
          <h3 className="text-title-sm">O que encontramos</h3>

          <ul className="mt-5 flex flex-1 flex-col gap-4">
            {preview.map((finding) => (
              <li key={finding.text} className="flex items-start gap-2.5">
                <span
                  className={
                    finding.kind === 'confirmed'
                      ? 'mt-0.5 shrink-0 text-body-lg text-healthy-solid'
                      : 'mt-0.5 shrink-0 text-body-lg text-attention-fg'
                  }
                >
                  {finding.kind === 'confirmed' ? <CheckCircleIcon /> : <AlertTriangleIcon />}
                </span>
                <span className="text-body leading-relaxed text-ink-800">
                  <span className="sr-only">
                    {finding.kind === 'confirmed' ? 'Confirmado: ' : 'Pendente: '}
                  </span>
                  {finding.text}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-8">
        <ButtonLink href="/diagnostico" size="lg">
          Ver o diagnóstico completo
        </ButtonLink>
      </div>
    </Section>
  );
}
