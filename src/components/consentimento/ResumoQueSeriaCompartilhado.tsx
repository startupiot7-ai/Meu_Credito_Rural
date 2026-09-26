import { cropOptions, debtKindOptions, lossOptions } from '@/lib/diagnostic';
import type { Answers } from '@/lib/diagnostic';
import { debtToRevenueRatio, formatCurrency, formatNumber, formatPercent } from '@/lib/format';

/**
 * Mostra ao produtor, com os números dele, exatamente o que uma instituição
 * autorizada receberia. Consentimento só é informado quando a pessoa vê o que
 * está autorizando.
 */
export function ResumoQueSeriaCompartilhado({ respostas }: { respostas: Answers }) {
  const receitaProjetada = (respostas.expectedBags ?? 0) * (respostas.pricePerBag ?? 0);
  const comprometimento = debtToRevenueRatio(respostas.debt ?? 0, receitaProjetada);
  const rotuloDe = <Valor extends string>(
    opcoes: { value: Valor; label: string }[],
    valor: Valor | null,
  ) => opcoes.find((opcao) => opcao.value === valor)?.label ?? 'Não informado';

  const linhas = [
    { rotulo: 'Cultura', valor: rotuloDe(cropOptions, respostas.crop) },
    {
      rotulo: 'Produção esperada',
      valor: respostas.expectedBags ? `${formatNumber(respostas.expectedBags)} sacas` : 'Não informado',
    },
    {
      rotulo: 'Dívida informada',
      valor: respostas.debt ? formatCurrency(respostas.debt) : 'Não informado',
    },
    { rotulo: 'Tipo de operação', valor: rotuloDe(debtKindOptions, respostas.debtKind) },
    {
      rotulo: 'Receita comprometida com a dívida',
      valor: comprometimento === null ? 'Não calculado' : formatPercent(Math.round(comprometimento)),
    },
    { rotulo: 'Perdas recentes na lavoura', valor: rotuloDe(lossOptions, respostas.hadLosses) },
  ];

  return (
    <dl className="divide-y divide-sand-200 rounded-xl border border-sand-200 bg-sand-50">
      {linhas.map((linha) => (
        <div key={linha.rotulo} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3">
          <dt className="text-body-sm text-ink-600">{linha.rotulo}</dt>
          <dd className="text-body font-medium tabular-nums text-ink-900">{linha.valor}</dd>
        </div>
      ))}
    </dl>
  );
}
