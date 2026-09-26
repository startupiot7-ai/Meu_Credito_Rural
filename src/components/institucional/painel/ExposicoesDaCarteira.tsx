import { formatNumber, formatPercent } from '@/lib/format';
import { calcularPercentual } from '@/lib/institucional/carteira';
import type { CarteiraDaInstituicao } from '@/lib/institucional/tipos';
import { BlocoDoPainel } from './BlocoDoPainel';

/**
 * O que deixa a carteira mais exposta a um ano ruim: falta de proteção
 * climática, compromissos que não aparecem no banco e preço ainda em aberto.
 * Cada número vem com o que ele quer dizer, nunca sozinho.
 */
export function ExposicoesDaCarteira({ carteira, className }: { carteira: CarteiraDaInstituicao; className?: string }) {
  const total = carteira.produtoresComDiagnostico;
  const parte = (quantidade: number) => formatPercent(Math.round(calcularPercentual(quantidade, total)));
  const { exposicaoClimatica, porPerfil } = carteira;

  const exposicoes = [
    {
      titulo: 'Sem proteção contra o clima',
      valor: exposicaoClimatica.semProtecao,
      contexto: `Sem seguro, Proagro nem irrigação. Outros ${formatNumber(
        exposicaoClimatica.protecaoParcial,
      )} têm só irrigação em parte.`,
    },
    {
      titulo: 'Com compromissos fora do banco',
      valor: carteira.comCompromissosForaDoBanco,
      contexto: 'Café prometido (barter, CPR) ou compras a prazo que saem da mesma safra.',
    },
    {
      titulo: 'Sem nenhuma parte da safra com preço fechado',
      valor: total - carteira.comPrecoFechado,
      contexto: 'Toda a safra depende do preço do dia na hora de vender.',
    },
  ];

  return (
    <BlocoDoPainel
      className={className}
      identificador="exposicoes"
      titulo="O que mais expõe a carteira"
      descricao="Entre quem concluiu o diagnóstico e autorizou o uso anônimo para estatísticas."
    >
      <dl className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {exposicoes.map((exposicao) => (
          <div key={exposicao.titulo} className="rounded-xl border border-sand-200 bg-sand-50 p-4">
            <dt className="text-body-sm font-medium text-ink-700">{exposicao.titulo}</dt>
            <dd className="mt-1 font-display text-title-lg font-bold tabular-nums text-ink-900">
              {formatNumber(exposicao.valor)} <span className="text-body-sm font-normal text-ink-600">({parte(exposicao.valor)})</span>
            </dd>
            <dd className="mt-1 text-caption leading-relaxed text-ink-600">{exposicao.contexto}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-body-sm text-ink-700">
        {formatNumber(porPerfil.jaTemCusteio)} já têm custeio nesta safra e {formatNumber(porPerfil.planejandoSafra)}{' '}
        estão planejando a próxima.
      </p>
    </BlocoDoPainel>
  );
}
