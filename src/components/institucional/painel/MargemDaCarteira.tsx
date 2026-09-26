import { ComparisonBar } from '@/components/ui';
import { formatNumber, formatPercent } from '@/lib/format';
import { ORDEM_DAS_FAIXAS_DE_MARGEM, calcularPercentual } from '@/lib/institucional/carteira';
import type { CarteiraDaInstituicao, FaixaDaMargem } from '@/lib/institucional/tipos';
import { BlocoDoPainel } from './BlocoDoPainel';

const rotuloDaFaixaDeMargem: Record<FaixaDaMargem, string> = {
  'sem-margem': 'Sem margem: já não cobre no esperado',
  'ate-10': 'A colheita pode cair até 10%',
  'de-10-a-20': 'Pode cair de 10% a 20%',
  'de-20-a-30': 'Pode cair de 20% a 30%',
  'acima-de-30': 'Pode cair mais de 30%',
};

/**
 * Margem de segurança da carteira: quantos associados aguentam quanto de
 * quebra de produção antes de faltar dinheiro. Quanto mais gente nas
 * primeiras faixas, mais a carteira depende de uma safra boa.
 */
export function MargemDaCarteira({ carteira, className }: { carteira: CarteiraDaInstituicao; className?: string }) {
  const total = carteira.produtoresComDiagnostico;

  return (
    <BlocoDoPainel
      className={className}
      identificador="margem-da-carteira"
      titulo="Margem de segurança da carteira"
      descricao="Quanto a colheita de cada associado pode cair antes de faltar dinheiro para custos e parcelas."
    >
      <div className="flex flex-col gap-4">
        {ORDEM_DAS_FAIXAS_DE_MARGEM.map((faixa) => (
          <ComparisonBar
            key={faixa}
            label={rotuloDaFaixaDeMargem[faixa]}
            value={carteira.produtoresPorMargem[faixa]}
            max={total}
            valueLabel={`${formatNumber(carteira.produtoresPorMargem[faixa])} · ${formatPercent(
              Math.round(calcularPercentual(carteira.produtoresPorMargem[faixa], total)),
            )}`}
          />
        ))}
      </div>
      <p className="mt-6 border-t border-sand-200 pt-4 text-caption leading-relaxed text-ink-600">
        Faixas só para agrupar no painel. A margem de cada produtor é calculada com os números dele, sem premissa.
      </p>
    </BlocoDoPainel>
  );
}
