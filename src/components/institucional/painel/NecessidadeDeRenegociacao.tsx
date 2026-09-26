import { InfoIcon, StatusBadge } from '@/components/ui';
import { formatNumber, formatPercent } from '@/lib/format';
import { calcularPercentual } from '@/lib/institucional/carteira';
import type { CarteiraDaInstituicao } from '@/lib/institucional/tipos';
import { BlocoDoPainel } from './BlocoDoPainel';

/**
 * Necessidade potencial de renegociação, e a MP 1.376/2026 como bloco
 * específico — não como indicador central.
 *
 * A MP aparece como "não avaliada": seus critérios ainda estão em validação
 * jurídica (src/lib/diagnostico/mp.ts), então o painel não conta quem "se
 * enquadra". Um número desses seria um parecer que ninguém deu.
 */
export function NecessidadeDeRenegociacao({ carteira, className }: { carteira: CarteiraDaInstituicao; className?: string }) {
  const { comSinaisDeDificuldade, porPerfil } = carteira;

  return (
    <BlocoDoPainel
      className={className}
      identificador="renegociacao"
      titulo="Necessidade potencial de renegociação"
      descricao="Associados que já têm custeio e relataram parcela atrasada, prorrogação ou renegociação."
    >
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-display text-display font-bold tabular-nums text-ink-900">
          {formatNumber(comSinaisDeDificuldade)}
        </span>
        <span className="text-body-sm text-ink-600">
          produtores, {formatPercent(Math.round(calcularPercentual(comSinaisDeDificuldade, porPerfil.jaTemCusteio)))} de
          quem já tem custeio
        </span>
      </p>
      <p className="mt-3 text-body-sm leading-relaxed text-ink-700">
        O resultado de cada um já mostra prorrogação e renegociação como caminhos a entender com a instituição,
        antes do vencimento.
      </p>

      <div className="mt-5 rounded-xl border border-info-border bg-info-surface p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-body-sm font-semibold text-info-fg">
            <InfoIcon aria-hidden />
            MP 1.376/2026
          </p>
          <StatusBadge tone="info" size="sm">
            Não avaliada
          </StatusBadge>
        </div>
        <p className="mt-2 text-caption leading-relaxed text-ink-700">
          Os critérios da MP ainda estão em validação jurídica. Por isso o painel não mostra quantos produtores se
          enquadram. A confirmação depende da análise de cada operação pela instituição credora.
        </p>
      </div>
    </BlocoDoPainel>
  );
}
