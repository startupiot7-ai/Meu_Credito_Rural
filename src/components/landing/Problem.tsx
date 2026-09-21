import { Card } from '@/components/ui';
import { Section } from './Section';

/**
 * O problema — starts where the producer is, not with legislation.
 *
 * Three sentences they have said out loud themselves. Naming the difficulty
 * accurately is what earns the right to offer help; it is not an attempt to
 * make anyone feel worse about their situation, and none of the three is
 * phrased as a consequence or a threat.
 */

const pains = [
  {
    quote: '"Eu sei que devo, mas não sei exatamente quanto nem para quando."',
    explanation:
      'Contratos de safras diferentes, em instituições diferentes, cada um com uma regra. O valor total quase nunca está em um lugar só.',
  },
  {
    quote: '"Me falaram que existe uma alternativa, mas não sei se serve para mim."',
    explanation:
      'As linhas e os programas têm critérios específicos. Sem saber quais são, fica difícil avaliar se o seu caso se encaixa.',
  },
  {
    quote: '"Quando eu pergunto, a resposta vem em uma linguagem que eu não uso."',
    explanation:
      'Sigla, cláusula, taxa. A informação existe, mas chega em um formato que não ajuda a decidir nada.',
  },
];

export function Problem() {
  return (
    <Section
      id="o-problema"
      eyebrow="O problema"
      title="A dificuldade raramente é a dívida em si. É a neblina em volta dela."
      description="Antes de decidir qualquer coisa, o produtor precisa enxergar onde está. E é exatamente aí que a informação costuma faltar."
      tone="sand"
    >
      <ul className="grid gap-4 md:grid-cols-3">
        {pains.map((pain) => (
          <li key={pain.quote}>
            <Card className="h-full">
              <p className="font-display text-body-lg font-semibold leading-snug text-canopy-800">
                {pain.quote}
              </p>
              <p className="mt-3 text-body-sm leading-relaxed text-ink-600">{pain.explanation}</p>
            </Card>
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-prose text-body-lg leading-relaxed text-ink-700">
        Nenhuma dessas perguntas exige um contador para ser respondida. Exige que a informação
        seja organizada e traduzida — e é isso que fazemos aqui.
      </p>
    </Section>
  );
}
