import { ButtonLink, Card, CheckIcon, StatusBadge } from '@/components/ui';
import { actionPlan } from '@/lib/mock-data';
import { Section } from './Section';

/**
 * Plano de ação (preview).
 *
 * The end of the journey — "agir". One step is marked as the current one, and
 * only that one. A plan with four simultaneous priorities is not a plan; it is
 * the same fog in a different shape.
 */
export function ActionPlan() {
  return (
    <Section
      id="plano-de-acao"
      eyebrow="Plano de ação"
      title="No fim, um próximo passo. Não quinze."
      description="O diagnóstico termina com uma ação clara para agora e a lista do que vem depois, para você seguir no seu tempo."
    >
      <ol className="flex flex-col gap-3">
        {actionPlan.map((step, index) => (
          <li key={step.id}>
            <Card
              variant={step.state === 'current' ? 'beam' : 'raised'}
              className="flex items-start gap-4"
            >
              <span
                aria-hidden
                className={
                  step.state === 'done'
                    ? 'grid h-9 w-9 shrink-0 place-items-center rounded-full border border-healthy-border bg-healthy-surface text-healthy-fg'
                    : step.state === 'current'
                      ? 'grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-beam-500 bg-beam-100 font-display text-body font-bold text-beam-800'
                      : 'grid h-9 w-9 shrink-0 place-items-center rounded-full border border-sand-300 bg-sand-100 font-display text-body font-bold text-ink-400'
                }
              >
                {step.state === 'done' ? <CheckIcon strokeWidth={3} /> : index + 1}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-body-lg font-semibold text-ink-900">
                    <span className="sr-only">
                      {step.state === 'done'
                        ? 'Concluído: '
                        : step.state === 'current'
                          ? 'Próximo passo: '
                          : 'A fazer: '}
                    </span>
                    {step.title}
                  </h3>
                  {step.state === 'current' ? (
                    <StatusBadge tone="attention" size="sm">
                      Seu próximo passo
                    </StatusBadge>
                  ) : null}
                  {step.state === 'done' ? (
                    <StatusBadge tone="healthy" size="sm">
                      Concluído
                    </StatusBadge>
                  ) : null}
                </div>

                <p className="mt-1.5 text-body-sm leading-relaxed text-ink-600">
                  {step.description}
                </p>
                <p className="mt-2 text-caption text-ink-500">Leva {step.effort}.</p>
              </div>
            </Card>
          </li>
        ))}
      </ol>

      <div className="mt-8">
        <ButtonLink href="/diagnostico" size="lg">
          Montar meu plano
        </ButtonLink>
      </div>
    </Section>
  );
}
