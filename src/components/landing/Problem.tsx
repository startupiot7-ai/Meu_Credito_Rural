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

// Situações comuns, descritas sem aspas: não são depoimentos de produtores reais.
const quotes = [
  'O custeio foi contratado contando com uma safra cheia, e veio a seca.',
  'Parte do café já estava prometida para a revenda antes da colheita.',
  'A conta só pareceu não fechar quando a parcela venceu.',
];

export function Problem() {
  return (
    <Section
      id="o-problema"
      eyebrow="O problema"
      title="A dívida quase sempre começa antes: na conta que não considerou um ano ruim."
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
