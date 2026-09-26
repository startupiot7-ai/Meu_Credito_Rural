import { DebtShareChart } from '@/components/ui';
import { formatPercent } from '@/lib/format';
import { calcularPercentual } from '@/lib/institucional/carteira';
import { formatarMoedaAbreviada } from '@/lib/institucional/formatacao';
import type { CarteiraDaInstituicao } from '@/lib/institucional/tipos';
import { BlocoDoPainel } from './BlocoDoPainel';

/**
 * Quanto da receita projetada da carteira já está comprometido com dívida.
 *
 * Reaproveita o mesmo gráfico que o produtor vê no próprio diagnóstico, agora
 * com a soma da carteira. Só existem valores somados aqui: nenhum valor
 * individual é exibido.
 */
export function ReceitaComprometida({
  carteira,
  className,
}: {
  carteira: CarteiraDaInstituicao;
  className?: string;
}) {
  const percentualDosProdutoresEmRisco = calcularPercentual(
    carteira.produtoresPorFaixa.risco,
    carteira.produtoresComDiagnostico,
  );
  const percentualDaDividaEmRisco = calcularPercentual(
    carteira.dividaNaFaixaDeRisco,
    carteira.dividaInformadaTotal,
  );

  return (
    <BlocoDoPainel
      className={className}
      identificador="receita-comprometida"
      titulo="Receita da carteira comprometida com dívida"
      descricao="Soma da receita projetada e das dívidas informadas por quem concluiu o diagnóstico."
    >
      <DebtShareChart
        revenue={carteira.receitaProjetadaTotal}
        debt={carteira.dividaInformadaTotal}
        showExplanation={false}
      />

      <div className="mt-6 rounded-xl border border-risk-border bg-risk-surface p-4">
        <p className="text-body-sm font-semibold text-risk-fg">Concentração na faixa vermelha</p>
        <p className="mt-1 text-body text-ink-800">
          <strong className="tabular-nums">
            {formatPercent(Math.round(percentualDosProdutoresEmRisco))}
          </strong>{' '}
          dos produtores avaliados concentram{' '}
          <strong className="tabular-nums">
            {formatPercent(Math.round(percentualDaDividaEmRisco))}
          </strong>{' '}
          da dívida informada, ou{' '}
          <strong className="tabular-nums">
            {formatarMoedaAbreviada(carteira.dividaNaFaixaDeRisco)}
          </strong>
          .
        </p>
      </div>
    </BlocoDoPainel>
  );
}
