import { ComparisonBar, StatusBadge } from '@/components/ui';
import { formatNumber, formatPercent } from '@/lib/format';
import { calcularPercentual } from '@/lib/institucional/carteira';
import type { CarteiraDaInstituicao } from '@/lib/institucional/tipos';
import { BlocoDoPainel } from './BlocoDoPainel';

/**
 * Quantos produtores parecem se enquadrar nos mecanismos da MP 1.376/2026.
 *
 * Mesma cautela da tela de resultado do produtor: é uma leitura indicativa,
 * feita a partir das respostas. Quem confirma a elegibilidade é a instituição
 * financeira, operação por operação.
 */
export function LeituraDaMp({
  carteira,
  className,
}: {
  carteira: CarteiraDaInstituicao;
  className?: string;
}) {
  const { aparentementeAtendemOsCriterios, precisamDeMaisInformacoes, aparentementeNaoAtendem } =
    carteira.leituraDaMp;
  const total = carteira.produtoresComDiagnostico;

  const linhas = [
    { rotulo: 'Aparentemente atendem aos critérios', quantidade: aparentementeAtendemOsCriterios },
    { rotulo: 'Faltam informações para indicar', quantidade: precisamDeMaisInformacoes },
    { rotulo: 'Aparentemente não atendem', quantidade: aparentementeNaoAtendem },
  ];

  return (
    <BlocoDoPainel
      className={className}
      identificador="leitura-da-mp"
      titulo="Enquadramento na MP 1.376/2026"
      descricao="Indicativo, com base nas respostas fornecidas pelos produtores."
      selo={
        <StatusBadge tone="info" size="sm">
          Indicativo
        </StatusBadge>
      }
    >
      <p className="flex flex-wrap items-baseline gap-x-2">
        <span className="font-display text-display font-bold tabular-nums text-ink-900">
          {formatNumber(aparentementeAtendemOsCriterios)}
        </span>
        <span className="text-body-sm text-ink-600">
          produtores, {formatPercent(Math.round(calcularPercentual(aparentementeAtendemOsCriterios, total)))}{' '}
          dos avaliados, aparentemente atendem aos critérios
        </span>
      </p>

      <div className="mt-6 flex flex-col gap-4">
        {linhas.map((linha) => (
          <ComparisonBar
            key={linha.rotulo}
            label={linha.rotulo}
            value={linha.quantidade}
            max={total}
            valueLabel={`${formatNumber(linha.quantidade)} · ${formatPercent(
              Math.round(calcularPercentual(linha.quantidade, total)),
            )}`}
          />
        ))}
      </div>

      <p className="mt-6 border-t border-sand-200 pt-4 text-caption leading-relaxed text-ink-600">
        Não é uma verificação de elegibilidade. A confirmação depende da análise de cada operação
        pela instituição financeira credora.
      </p>
    </BlocoDoPainel>
  );
}
