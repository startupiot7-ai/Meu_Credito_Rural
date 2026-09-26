import { AlertTriangleIcon, EyeOffIcon, ScaleIcon } from '@/components/ui';
import { Section } from '@/components/landing/Section';
import { problemasDaCooperativa } from '@/lib/institucional/conteudo-comercial';

const iconesNaOrdem = [EyeOffIcon, ScaleIcon, AlertTriangleIcon];

export function ProblemaDaCooperativa() {
  return (
    <Section
      id="o-problema"
      eyebrow="O problema para a cooperativa"
      title="O risco da carteira costuma aparecer quando já virou perda coletiva"
      tone="sand"
    >
      <ol className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {problemasDaCooperativa.map((problema, posicao) => {
          const Icone = iconesNaOrdem[posicao];
          return (
            <li key={problema.titulo} className="rounded-2xl border border-sand-200 bg-sand-50 p-6 shadow-card">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-canopy-50 text-title-sm text-canopy-600">
                <Icone aria-hidden />
              </span>
              <h3 className="mt-4 text-title-sm">{problema.titulo}</h3>
              <p className="mt-2 text-body leading-relaxed text-ink-600">{problema.texto}</p>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
