import { Section } from './Section';

/**
 * Como funciona — five steps, lit one after the other.
 *
 * The beam runs down the list: each step carries a little more light than the
 * one before it, which is the lighthouse metaphor doing actual work — the path
 * becomes visible a stretch at a time, not all at once. The journey itself is
 * Entender → Diagnosticar → Medir → Comparar → Agir.
 */

const steps = [
  {
    title: 'Conte sua situação',
    description:
      'Perguntas simples, uma de cada vez: o que você planta, quanto espera colher e quanto deve hoje.',
    stage: 'Entender',
  },
  {
    title: 'Entenda seu diagnóstico',
    description:
      'Mostramos o que encontramos nas suas respostas e o que isso significa, em português claro.',
    stage: 'Diagnosticar',
  },
  {
    title: 'Veja o peso da dívida',
    description:
      'Quanto da receita projetada da safra já está comprometida — e o que essa porcentagem quer dizer na prática.',
    stage: 'Medir',
  },
  {
    title: 'Compare alternativas',
    description:
      'Prazo, parcela por ano e carência lado a lado, para você ver o que muda em cada caminho possível.',
    stage: 'Comparar',
  },
  {
    title: 'Saiba qual pode ser o próximo passo',
    description:
      'Uma ação clara para seguir, com os documentos certos em mãos. A decisão continua sendo sua.',
    stage: 'Agir',
  },
];

export function HowItWorks() {
  return (
    <Section
      id="como-funciona"
      eyebrow="Como funciona"
      title="Cinco etapas, do escuro até o próximo passo"
      description="Você não precisa ter tudo organizado para começar. Cada etapa acrescenta um pouco de clareza à anterior."
    >
      <ol className="relative flex flex-col gap-0">
        {steps.map((step, index) => {
          // Progressive illumination: opacity of the marker's glow rises with
          // the index, so the list reads as a beam travelling down the path.
          const light = 0.12 + index * 0.22;

          return (
            <li key={step.title} className="relative flex gap-4 pb-8 last:pb-0 sm:gap-6">
              {/* The path itself, connecting the points. */}
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

              <div className="min-w-0 flex-1 pt-1.5">
                <p className="text-caption font-semibold uppercase tracking-[0.12em] text-canopy-600">
                  {step.stage}
                </p>
                <h3 className="mt-1 text-title-sm">
                  <span className="sr-only">Etapa {index + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-1.5 max-w-prose text-body leading-relaxed text-ink-600">
                  {step.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
