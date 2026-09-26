import { EyeOffIcon, LockIcon, ScaleIcon, ShieldIcon } from '@/components/ui';
import { Section } from './Section';

/**
 * Segurança e confiança.
 *
 * Simplification pass: four cards with three-line paragraphs became four lines.
 * The titles were already the commitment; the paragraphs restated them. Every
 * limit that has to be stated is still stated — not being a bank, not promising
 * approval, the decision belonging to the institution — just in one breath each.
 *
 * Trust here comes from being specific about limits, not from badges.
 */

const commitments = [
  {
    Icon: ScaleIcon,
    title: 'Não somos banco nem cooperativa',
    line: 'Não emprestamos dinheiro e não cobramos dívidas.',
  },
  {
    Icon: ShieldIcon,
    title: 'Não empurramos crédito',
    line: 'O diagnóstico não recomenda contratar nem indica instituição. Nenhuma instituição influencia o resultado.',
  },
  {
    Icon: EyeOffIcon,
    title: 'Não prometemos aprovação',
    line: 'A análise é indicativa. Quem analisa o crédito é a instituição; quem decide se contrata é você.',
  },
  {
    Icon: LockIcon,
    title: 'Seus dados são seus',
    line: 'Sem CPF. As respostas ficam no seu aparelho e você apaga quando quiser.',
  },
];

export function Trust() {
  return (
    <Section
      id="seguranca"
      eyebrow="Segurança e confiança"
      title="O que podemos fazer — e o que não podemos"
      tone="sand"
    >
      <ul className="grid gap-6 md:grid-cols-2 md:gap-x-10">
        {commitments.map(({ Icon, title, line }) => (
          <li key={title} className="flex items-start gap-3.5">
            <span className="mt-0.5 shrink-0 text-title text-canopy-600">
              <Icon />
            </span>
            <div>
              <h3 className="text-body-lg font-semibold text-ink-900">{title}</h3>
              <p className="mt-1 text-body text-ink-600">{line}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
