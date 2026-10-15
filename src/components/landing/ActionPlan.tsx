import { Card, TextLink } from '@/components/ui';
import { planoDeExemplo } from '@/lib/conteudo-da-pagina-inicial';
import { Section } from './Section';

/**
 * Plano de ação (exemplo).
 *
 * Esta seção mostra COMO é um plano, não o plano de quem lê. Por isso ela vem
 * rotulada como exemplo e todos os passos são neutros: nada aparece como
 * "concluído" nem como "seu próximo passo", para ninguém achar que já começou
 * ou que aquele plano é o seu.
 */
export function ActionPlan() {
  return (
    <Section
      id="plano-de-acao"
      eyebrow="Exemplo de plano de ação"
      title="No fim, um próximo passo. Não quinze."
    >
      <Card>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 border-b border-sand-200 pb-4">
          <span className="rounded-full border border-control-border bg-sand-100 px-2.5 py-0.5 text-caption font-semibold uppercase tracking-[0.08em] text-ink-700">
            Exemplo
          </span>
          <p className="text-body-sm text-ink-600">
            Plano ilustrativo, não é o seu. O seu é montado depois do diagnóstico, com as suas respostas.
          </p>
        </div>

        <ol className="mt-5 flex flex-col gap-5">
          {planoDeExemplo.map((step, index) => (
            <li key={step.id} className="flex items-start gap-3.5">
              <span
                aria-hidden
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-sand-200 font-display text-body font-bold text-ink-700"
              >
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-body-lg font-semibold text-ink-900">
                  <span className="sr-only">Passo {index + 1} do exemplo: </span>
                  {step.titulo}
                </h3>
                <p className="mt-1 text-body leading-relaxed text-ink-600">{step.descricao}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <div className="mt-6">
        <TextLink href="/diagnostico">Montar o plano da minha safra</TextLink>
      </div>
    </Section>
  );
}
