import { CheckCircleIcon, LockIcon, XIcon } from '@/components/ui';
import { Section } from '@/components/landing/Section';
import { GrupoProtegido } from '@/components/institucional/painel/GrupoProtegido';
import { oQueAInstituicaoNaoVe, oQueAInstituicaoVe } from '@/lib/institucional/conteudo-comercial';

/**
 * Privacidade apresentada como parte do produto, não como nota de rodapé.
 *
 * Para a instituição, isso também é valor: associados confiam no diagnóstico
 * justamente porque a cooperativa não enxerga a situação individual deles.
 */
export function PrivacidadeELimites() {
  return (
    <Section
      id="privacidade"
      eyebrow="Privacidade e limites"
      title="A instituição enxerga a carteira. O associado, só se ele autorizar."
      description="É essa garantia que faz o associado responder com sinceridade, e é por isso que os números do painel são confiáveis."
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-healthy-border bg-healthy-surface p-6">
          <h3 className="flex items-center gap-2 text-title-sm text-healthy-fg">
            <CheckCircleIcon aria-hidden />
            O que a instituição vê
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {oQueAInstituicaoVe.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-body text-ink-800">
                <CheckCircleIcon aria-hidden className="mt-1 shrink-0 text-healthy-solid" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-sand-300 bg-sand-100 p-6">
          <h3 className="flex items-center gap-2 text-title-sm">
            <LockIcon aria-hidden className="text-ink-600" />
            O que a instituição não vê
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {oQueAInstituicaoNaoVe.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-body text-ink-800">
                <XIcon aria-hidden className="mt-1 shrink-0 text-ink-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-sand-200 bg-sand-50 p-6 shadow-card">
          <h3 className="text-title-sm">Grupos pequenos ficam ocultos</h3>
          <p className="mt-2 text-body-sm leading-relaxed text-ink-600">
            Em um núcleo com poucos produtores, até um número somado pode apontar para alguém. O
            painel troca esses números por este aviso:
          </p>
          <GrupoProtegido motivo="grupo-pequeno" className="mt-4" />
        </div>
        <div className="rounded-2xl border border-sand-200 bg-sand-50 p-6 shadow-card">
          <h3 className="text-title-sm">A autorização é do produtor</h3>
          <ul className="mt-3 flex flex-col gap-2 text-body-sm leading-relaxed text-ink-700">
            <li>Específica: ele escolhe instituição por instituição.</li>
            <li>Explícita: nada vem marcado, e dizer não não muda o diagnóstico dele.</li>
            <li>Revogável: ele retira a autorização quando quiser, e sai da sua lista.</li>
            <li>Separada: nunca vem junto com outros termos de uso.</li>
          </ul>
        </div>
      </div>
    </Section>
  );
}
