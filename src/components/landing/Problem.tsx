import { Section } from './Section';

/**
 * O problema — three sentences producers have said out loud.
 *
 * Simplification pass: each quote used to carry an explanatory paragraph
 * underneath, and the section closed with another one. Both were the abstract
 * restatement of something the quote already said concretely — which is
 * exactly the move this pass exists to undo. The quotes stand alone now, and
 * the cards became plain text so nothing competes with them.
 */

const quotes = [
  '"Eu sei que devo, mas não sei exatamente quanto nem para quando."',
  '"Me falaram que existe uma alternativa, mas não sei se serve para mim."',
  '"Quando eu pergunto, a resposta vem numa linguagem que eu não uso."',
];

export function Problem() {
  return (
    <Section
      id="o-problema"
      eyebrow="O problema"
      title="A dificuldade raramente é a dívida. É a neblina em volta dela."
      tone="sand"
    >
      <ul className="flex flex-col gap-6 md:flex-row md:gap-8">
        {quotes.map((quote) => (
          <li
            key={quote}
            className="border-l-2 border-beam-300 pl-5 font-display text-body-lg font-semibold leading-snug text-canopy-800 md:flex-1 md:text-title-sm"
          >
            {quote}
          </li>
        ))}
      </ul>
    </Section>
  );
}
