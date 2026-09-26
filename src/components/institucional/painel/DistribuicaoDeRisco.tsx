import { StatusBadge } from '@/components/ui';
import { cn } from '@/lib/cn';
import { formatNumber, formatPercent } from '@/lib/format';
import { ORDEM_DAS_FAIXAS, calcularPercentual, somarProdutoresPorFaixa } from '@/lib/institucional/carteira';
import type { ProdutoresPorFaixa } from '@/lib/institucional/tipos';
import { aparenciaDaFaixa } from './faixas';

/**
 * Quantos produtores da carteira estão em cada faixa de risco.
 *
 * Segue as mesmas regras do gráfico de comprometimento do produtor
 * (`DebtShareChart`): uma única barra proporcional, partes separadas por um
 * espaço (a divisão é uma forma, não só uma troca de cor) e cada parte com
 * rótulo escrito, ícone e número. Assim a leitura funciona em tons de cinza e
 * para quem não distingue cores.
 *
 * A versão `compacta` cabe numa linha de tabela; os números ficam no texto
 * para leitores de tela.
 */
export function DistribuicaoDeRisco({
  produtoresPorFaixa,
  variante = 'completa',
  className,
}: {
  produtoresPorFaixa: ProdutoresPorFaixa;
  variante?: 'completa' | 'compacta';
  className?: string;
}) {
  const total = somarProdutoresPorFaixa(produtoresPorFaixa);
  const faixasComProdutores = ORDEM_DAS_FAIXAS.filter((faixa) => produtoresPorFaixa[faixa] > 0);

  const descricaoEmTexto = ORDEM_DAS_FAIXAS.map(
    (faixa) =>
      `${aparenciaDaFaixa[faixa].rotulo}: ${formatNumber(produtoresPorFaixa[faixa])} (${formatPercent(
        calcularPercentual(produtoresPorFaixa[faixa], total),
      )})`,
  ).join('; ');

  const barra = (
    <div
      aria-hidden
      className={cn(
        'flex w-full gap-0.5 overflow-hidden rounded-full bg-sand-200',
        variante === 'completa' ? 'h-6' : 'h-2.5',
      )}
    >
      {faixasComProdutores.map((faixa) => (
        <div
          key={faixa}
          className={cn('h-full first:rounded-l-full last:rounded-r-full', aparenciaDaFaixa[faixa].corDaBarra)}
          style={{ width: `${calcularPercentual(produtoresPorFaixa[faixa], total)}%` }}
        />
      ))}
    </div>
  );

  if (variante === 'compacta') {
    return (
      <div className={cn('min-w-[6rem]', className)}>
        {barra}
        <span className="sr-only">{descricaoEmTexto}</span>
      </div>
    );
  }

  return (
    <figure className={cn('m-0 flex flex-col gap-5', className)}>
      {barra}
      <figcaption className="sr-only">Distribuição dos produtores por faixa de risco</figcaption>
      <dl className="flex flex-wrap gap-x-8 gap-y-4">
        {ORDEM_DAS_FAIXAS.map((faixa) => (
          <div key={faixa} className="flex flex-col gap-2">
            <dt>
              <StatusBadge tone={aparenciaDaFaixa[faixa].tom} size="sm" className="whitespace-nowrap">
                {aparenciaDaFaixa[faixa].rotulo}
              </StatusBadge>
            </dt>
            <dd className="flex flex-col">
              <span className="font-display text-title-lg font-bold tabular-nums text-ink-900">
                {formatNumber(produtoresPorFaixa[faixa])}
              </span>
              <span className="text-body-sm tabular-nums text-ink-600">
                {formatPercent(calcularPercentual(produtoresPorFaixa[faixa], total))} dos avaliados
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
