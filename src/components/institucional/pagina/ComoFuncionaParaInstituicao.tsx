import { Section } from '@/components/landing/Section';
import { etapasParaAInstituicao } from '@/lib/institucional/conteudo-comercial';

export function ComoFuncionaParaInstituicao() {
  return (
    <Section
      id="como-funciona"
      eyebrow="Como funciona para a instituição"
      title="O associado usa uma ferramenta gratuita. A instituição enxerga o padrão."
    >
      <ol className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
        {etapasParaAInstituicao.map((etapa, posicao) => (
          <li key={etapa.titulo} className="flex flex-col gap-3 border-t-2 border-canopy-600 pt-5">
            <span className="font-display text-title font-bold text-canopy-600">
              {String(posicao + 1).padStart(2, '0')}
            </span>
            <h3 className="text-title-sm">{etapa.titulo}</h3>
            <p className="text-body leading-relaxed text-ink-600">{etapa.texto}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
