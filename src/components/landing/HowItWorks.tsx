import { Section } from './Section';

/**
 * Como funciona — five steps, lit one after the other.
 *
 * Simplification pass: every step used to carry three layers — a stage label
 * (ENTENDER, DIAGNOSTICAR…), a title, and a three-line description. The stage
 * label repeated what the title already said, and the description repeated it
 * again at length. One title plus one short line each is what survived, so the
 * whole path can be taken in at a glance instead of read.
 *
 * The beam still travels down the list: each marker carries slightly more
 * light than the one above it.
 */

const steps = [
  { title: 'Conte sua situação', line: 'O que você planta, quanto espera colher, quanto deve.' },
  { title: 'Entenda seu diagnóstico', line: 'O que encontramos nas suas respostas, em português claro.' },
  { title: 'Veja o peso da dívida', line: 'Quanto da safra já está comprometido.' },
  { title: 'Compare alternativas', line: 'O que muda em cada caminho possível.' },
  { title: 'Saiba qual pode ser o próximo passo', line: 'Uma ação clara. A decisão continua sendo sua.' },
];

export function HowItWorks() {
  return (
    <Section id="como-funciona" eyebrow="Como funciona" title="Do escuro até o próximo passo">
      <ol className="flex flex-col">
        {steps.map((step, index) => {
          // Progressive illumination: the glow rises with the index, so the
          // list reads as a beam travelling down the path.
          const light = 0.1 + index * 0.13;

          return (
            <li key={step.title} className="relative flex gap-4 pb-7 last:pb-0 sm:gap-5">
              {index < steps.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute left-[1.375rem] top-12 h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-beam-300 to-sand-300"
                />
              ) : null}

              <span
                aria-hidden
                style={{ boxShadow: `0 0 0 6px rgba(233, 174, 46, ${light.toFixed(2)})` }}
                className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-canopy-600/25 bg-sand-50 font-display text-title-sm font-bold text-canopy-700"
              >
                {index + 1}
              </span>

              <div className="min-w-0 flex-1 pt-2">
                <h3 className="text-body-lg font-semibold text-ink-900">
                  <span className="sr-only">Etapa {index + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-1 max-w-prose text-body text-ink-600">{step.line}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
