import { ChevronDownIcon } from '@/components/ui';
import { Section } from '@/components/landing/Section';
import { perguntasFrequentesInstitucionais } from '@/lib/institucional/conteudo-comercial';

/**
 * Perguntas frequentes do público institucional. Mesmo formato da página do
 * produtor (`<details>` nativo, funciona sem JavaScript), com as perguntas que
 * um gestor faz antes de levar a licença para aprovação interna.
 */
export function PerguntasFrequentesInstitucionais() {
  return (
    <Section
      id="perguntas-frequentes"
      eyebrow="Perguntas frequentes"
      title="O que as instituições perguntam antes de contratar"
    >
      <div className="max-w-3xl divide-y divide-sand-200 border-y border-sand-200">
        {perguntasFrequentesInstitucionais.map((item) => (
          <details key={item.pergunta} name="perguntas-institucionais" className="group">
            <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between gap-4 py-4 text-body-lg font-medium text-ink-900 transition-colors hover:text-canopy-700 [&::-webkit-details-marker]:hidden">
              {item.pergunta}
              <ChevronDownIcon
                aria-hidden
                className="shrink-0 text-title-sm text-ink-500 transition-transform duration-base ease-standard group-open:rotate-180"
              />
            </summary>
            <p className="pb-5 pr-8 text-body leading-relaxed text-ink-600">{item.resposta}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
