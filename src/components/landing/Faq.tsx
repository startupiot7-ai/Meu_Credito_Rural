import { ChevronDownIcon } from '@/components/ui';
import { perguntasFrequentes } from '@/lib/conteudo-da-pagina-inicial';
import { Section } from './Section';

/**
 * Perguntas frequentes.
 *
 * Built on native `<details>` / `<summary>`: zero JavaScript, keyboard
 * accessible and expandable by the browser's own find-in-page. On a weak
 * connection this section works before any script has loaded, which is exactly
 * when someone is most likely to be checking whether we are a scam.
 *
 * The first answers begin with "Não." on purpose. Saying plainly what
 * we are not is the fastest way to be believed about what we are.
 */
export function Faq() {
  return (
    <Section
      id="perguntas-frequentes"
      eyebrow="Perguntas frequentes"
      title="As dúvidas que aparecem antes de começar"
    >
      <div className="max-w-prose divide-y divide-sand-200 border-y border-sand-200">
        {perguntasFrequentes.map((item) => (
          <details key={item.pergunta} name="faq" className="group">
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
