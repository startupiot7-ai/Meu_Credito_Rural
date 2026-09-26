import { StatusBadge } from '@/components/ui';
import { cn } from '@/lib/cn';
import { formatNumber, formatPercent } from '@/lib/format';
import { ORDEM_DAS_SITUACOES, calcularPercentual, somarProdutoresPorSituacao } from '@/lib/institucional/carteira';
import type { ProdutoresPorSituacao } from '@/lib/institucional/tipos';
import { aparenciaDaSituacaoNoPainel } from './aparencia';

/**
 * Quantos produtores da carteira estão em cada situação da safra: cobre com
 * folga, cobre mas apertado, ou não cobre no cenário esperado.
 *
 * Uma única barra proporcional, partes separadas por um
 * espaço (a divisão é uma forma, não só uma troca de cor) e cada parte com
 * rótulo escrito, ícone e número. Assim a leitura funciona em tons de cinza e
 * para quem não distingue cores.
 *
 * A versão `compacta` cabe numa linha de tabela; os números ficam no texto
 * para leitores de tela.
 */
export function DistribuicaoPorSituacao({
  produtoresPorSituacao,
  variante = 'completa',
  className,
}: {
  produtoresPorSituacao: ProdutoresPorSituacao;
  variante?: 'completa' | 'compacta';
  className?: string;
}) {
  const total = somarProdutoresPorSituacao(produtoresPorSituacao);
  const situacoesComProdutores = ORDEM_DAS_SITUACOES.filter((situacao) => produtoresPorSituacao[situacao] > 0);

  const descricaoEmTexto = ORDEM_DAS_SITUACOES.map(
    (situacao) =>
      `${aparenciaDaSituacaoNoPainel[situacao].rotulo}: ${formatNumber(produtoresPorSituacao[situacao])} (${formatPercent(
        calcularPercentual(produtoresPorSituacao[situacao], total),
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
      {situacoesComProdutores.map((situacao) => (
        <div
          key={situacao}
          className={cn('h-full first:rounded-l-full last:rounded-r-full', aparenciaDaSituacaoNoPainel[situacao].corDaBarra)}
          style={{ width: `${calcularPercentual(produtoresPorSituacao[situacao], total)}%` }}
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
      <figcaption className="sr-only">Distribuição dos produtores por situação da safra</figcaption>
      <dl className="flex flex-wrap gap-x-8 gap-y-4">
        {ORDEM_DAS_SITUACOES.map((situacao) => (
          <div key={situacao} className="flex flex-col gap-2">
            <dt>
              <StatusBadge tone={aparenciaDaSituacaoNoPainel[situacao].tom} size="sm" className="whitespace-nowrap">
                {aparenciaDaSituacaoNoPainel[situacao].rotulo}
              </StatusBadge>
            </dt>
            <dd className="flex flex-col">
              <span className="font-display text-title-lg font-bold tabular-nums text-ink-900">
                {formatNumber(produtoresPorSituacao[situacao])}
              </span>
              <span className="text-body-sm tabular-nums text-ink-600">
                {formatPercent(calcularPercentual(produtoresPorSituacao[situacao], total))} dos avaliados
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
