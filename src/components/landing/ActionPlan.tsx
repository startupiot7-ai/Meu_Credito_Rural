import { ButtonLink, Card, CheckIcon, StatusBadge } from '@/components/ui';
import { planoDeExemplo } from '@/lib/conteudo-da-pagina-inicial';
import { Section } from './Section';

/**
 * Plano de ação (preview).
 *
 * Simplification pass: four cards, each with a title, a description, an effort
 * line and a badge. That is a plan presented as four simultaneous priorities,
 * which is the same fog in a different shape.
 *
 * Now one card, four rows, and detail on exactly one of them — the step you
 * are actually on. The others are titles only. You do not need to know how long
 * step four takes while you are still on step two.
 */
export function ActionPlan() {
  return (
    <Section
      id="plano-de-acao"
      eyebrow="Plano de ação"
      title="No fim, um próximo passo. Não quinze."
    >
      <Card>
        <ol className="flex flex-col gap-5">
          {planoDeExemplo.map((step, index) => {
            const isCurrent = step.estado === 'agora';

            return (
              <li key={step.id} className="flex items-start gap-3.5">
                <span
                  aria-hidden
                  className={
                    step.estado === 'feito'
                      ? 'grid h-8 w-8 shrink-0 place-items-center rounded-full bg-healthy-surface text-healthy-fg'
                      : isCurrent
                        ? 'grid h-8 w-8 shrink-0 place-items-center rounded-full bg-beam-400 font-display text-body font-bold text-ink-900'
                        : 'grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sand-200 font-display text-body font-bold text-ink-600'
                  }
                >
                  {step.estado === 'feito' ? <CheckIcon strokeWidth={3} /> : index + 1}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                    <h3
                      className={
                        isCurrent
                          ? 'text-body-lg font-semibold text-ink-900'
                          : 'text-body text-ink-600'
                      }
                    >
                      <span className="sr-only">
                        {step.estado === 'feito'
                          ? 'Concluído: '
                          : isCurrent
                            ? 'Próximo passo: '
                            : 'A fazer: '}
                      </span>
                      {step.titulo}
                    </h3>
                    {isCurrent ? (
                      <StatusBadge tone="attention" size="sm">
                        Seu próximo passo
                      </StatusBadge>
                    ) : null}
                  </div>

                  {/* Detail only on the step you are on. */}
                  {isCurrent ? (
                    <p className="mt-1.5 text-body leading-relaxed text-ink-600">
                      {step.descricao}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </Card>

      <div className="mt-8">
        <ButtonLink href="/diagnostico" size="lg">
          Simular minha safra
        </ButtonLink>
      </div>
    </Section>
  );
}
