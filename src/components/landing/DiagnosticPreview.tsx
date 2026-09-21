import {
  AlertTriangleIcon,
  ButtonLink,
  Card,
  CheckCircleIcon,
  StepProgress,
} from '@/components/ui';
import { sampleFindings } from '@/lib/mock-data';
import { Section } from './Section';

/**
 * Diagnóstico (preview) — shows the real thing, not a promise of it.
 *
 * Two frames side by side: a question exactly as it is asked, and the reasoning
 * exactly as it comes back. The point of the preview is to remove the fear of
 * starting: the producer sees that it is one plain question at a time and that
 * the answer is a list they can check themselves, not a score handed down.
 */
export function DiagnosticPreview() {
  return (
    <Section
      id="diagnostico"
      eyebrow="Diagnóstico"
      title="Uma pergunta por vez. E uma resposta que você consegue conferir."
      description="Nada de formulário longo nem de nota misteriosa no final. Você responde no seu ritmo e vê exatamente o que foi considerado."
      tone="sand"
    >
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        {/* Frame 1 — the question, as the producer will actually see it. */}
        <Card className="flex flex-col">
          <StepProgress
            current={2}
            total={6}
            labels={['Sua lavoura', 'Sua produção', 'Sua dívida', 'Documentos', 'Histórico', 'Revisão']}
          />

          <div className="mt-6 flex-1">
            <h3 className="text-title-sm">Quantas sacas você espera colher nesta safra?</h3>
            <p className="mt-2 text-body-sm text-ink-600">
              Uma estimativa já serve. Dá para ajustar depois.
            </p>

            <div className="mt-5 flex items-stretch overflow-hidden rounded-lg border border-sand-300 bg-sand-50">
              <span className="flex min-h-touch items-center px-4 py-3 text-body tabular-nums text-ink-900">
                500
              </span>
              <span className="ml-auto flex items-center border-l border-sand-200 bg-sand-100 px-4 text-body font-medium text-ink-600">
                sacas
              </span>
            </div>
          </div>

          <p className="mt-6 text-caption text-ink-500">
            Exemplo da tela de perguntas. Suas respostas ficam salvas neste dispositivo.
          </p>
        </Card>

        {/* Frame 2 — the reasoning. Explicitly not a score. */}
        <Card className="flex flex-col">
          <h3 className="text-title-sm">O que encontramos</h3>
          <p className="mt-1.5 text-body-sm text-ink-600">
            Com base nas informações fornecidas por você.
          </p>

          <ul className="mt-5 flex flex-1 flex-col gap-3.5">
            {sampleFindings.map((finding) => (
              <li key={finding.text} className="flex items-start gap-2.5">
                <span
                  className={
                    finding.kind === 'confirmed'
                      ? 'mt-0.5 shrink-0 text-body-lg text-healthy-solid'
                      : 'mt-0.5 shrink-0 text-body-lg text-attention-fg'
                  }
                >
                  {finding.kind === 'confirmed' ? <CheckCircleIcon /> : <AlertTriangleIcon />}
                  <span className="sr-only">
                    {finding.kind === 'confirmed' ? 'Confirmado: ' : 'Pendente: '}
                  </span>
                </span>
                <span className="text-body leading-relaxed text-ink-800">{finding.text}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 rounded-xl border border-sand-200 bg-sand-100/70 p-4">
            <p className="text-body-sm font-semibold text-ink-900">O que isso significa</p>
            <p className="mt-1.5 text-body-sm leading-relaxed text-ink-600">
              Sua situação tem pontos em comum com os critérios de alternativas que envolvem
              alongamento de prazo. Isso não garante aprovação — é o ponto de partida da
              conversa com a instituição.
            </p>
          </div>
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
