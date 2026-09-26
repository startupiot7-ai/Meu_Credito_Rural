import { EyeOffIcon } from '@/components/ui';
import { cn } from '@/lib/cn';
import { TAMANHO_MINIMO_DO_GRUPO } from '@/lib/institucional/privacidade';
import type { MotivoDaOcultacao } from '@/lib/institucional/privacidade';

const mensagemPorMotivo: Record<MotivoDaOcultacao, { titulo: string; explicacao: string }> = {
  'grupo-pequeno': {
    titulo: 'Grupo pequeno demais para exibir sem identificar produtores individualmente',
    explicacao: `Segmentos com menos de ${TAMANHO_MINIMO_DO_GRUPO} produtores com diagnóstico não são mostrados.`,
  },
  'protecao-contra-subtracao': {
    titulo: 'Oculto para proteger um grupo pequeno deste recorte',
    explicacao:
      'Se este segmento aparecesse, os números do grupo pequeno poderiam ser descobertos por subtração do total.',
  },
};

/**
 * O que aparece no lugar dos números de um segmento que poderia identificar
 * alguém. A proteção é visível de propósito: a instituição entende por que
 * não está vendo o dado, e isso reforça a confiança no painel.
 */
export function GrupoProtegido({
  motivo,
  className,
}: {
  motivo: MotivoDaOcultacao;
  className?: string;
}) {
  const { titulo, explicacao } = mensagemPorMotivo[motivo];

  return (
    <div
      className={cn(
        'flex items-start gap-2.5 rounded-lg border border-dashed border-sand-400 bg-sand-100 px-3 py-2.5',
        className,
      )}
    >
      <EyeOffIcon aria-hidden className="mt-0.5 shrink-0 text-body-lg text-ink-500" />
      <div>
        <p className="text-body-sm font-medium text-ink-800">{titulo}</p>
        <p className="text-caption text-ink-600">{explicacao}</p>
      </div>
    </div>
  );
}
