import { Card, EyeOffIcon, LockIcon, ScaleIcon, ShieldIcon } from '@/components/ui';
import { Section } from './Section';

/**
 * Segurança e confiança.
 *
 * Trust here is built by being specific about limits, not by showing badges and
 * padlock icons. Each card states something we will not do. A producer deciding
 * whether to type their debt into a website deserves that in writing, before
 * the form, not in a terms page afterwards.
 */

const commitments = [
  {
    Icon: ScaleIcon,
    title: 'Não somos banco nem cooperativa',
    description:
      'Não concedemos crédito, não cobramos dívidas e não temos interesse em qual instituição você escolhe. Nossa função é orientar.',
  },
  {
    Icon: EyeOffIcon,
    title: 'Não prometemos aprovação',
    description:
      'O diagnóstico é indicativo e trabalha com base nas informações fornecidas por você. Quem analisa e decide é sempre a instituição financeira.',
  },
  {
    Icon: LockIcon,
    title: 'Seus dados são seus',
    description:
      'As respostas do diagnóstico ficam salvas no seu próprio aparelho enquanto você responde. Você pode apagar tudo quando quiser.',
  },
  {
    Icon: ShieldIcon,
    title: 'Linguagem sem letra miúda',
    description:
      'Todo termo técnico aparece com a explicação junto. Se algo só puder ser dito em linguagem de contrato, dizemos também em português comum.',
  },
];

export function Trust() {
  return (
    <Section
      id="seguranca"
      eyebrow="Segurança e confiança"
      title="O que podemos fazer — e o que não podemos"
      description="Preferimos ser claros sobre os limites antes de você começar. Confiança se constrói assim."
      tone="sand"
    >
      <ul className="grid gap-4 md:grid-cols-2">
        {commitments.map(({ Icon, title, description }) => (
          <li key={title}>
            <Card className="flex h-full items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-canopy-50 text-title text-canopy-600">
                <Icon />
              </span>
              <div>
                <h3 className="text-body-lg font-semibold text-ink-900">{title}</h3>
                <p className="mt-1.5 text-body-sm leading-relaxed text-ink-600">{description}</p>
              </div>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}
