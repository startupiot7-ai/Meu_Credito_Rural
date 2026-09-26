import { LockIcon, StatusBadge } from '@/components/ui';
import { formatNumber } from '@/lib/format';
import { formatarData } from '@/lib/institucional/formatacao';
import type { CarteiraDaInstituicao } from '@/lib/institucional/tipos';
import { aparenciaDaSituacaoNoPainel } from './aparencia';
import { BlocoDoPainel } from './BlocoDoPainel';

/**
 * Produtores que pediram, eles mesmos, para esta instituição conversar com eles.
 *
 * Regras centrais:
 *  - só aparece em lista quem autorizou ESTA instituição; quem autorizou só
 *    outras entra apenas como número, e quem revoga sai da lista;
 *  - cada pedido mostra exatamente o resumo que o produtor viu antes de
 *    autorizar (situação, margem e fator principal), nunca as respostas;
 *  - não há etapas de venda ("proposta", "operação concluída"): o painel não
 *    acompanha se o produtor contratou crédito, porque o diagnóstico não
 *    existe para isso.
 */
export function PedidosDeConversa({
  carteira,
  className,
}: {
  carteira: CarteiraDaInstituicao;
  className?: string;
}) {
  const { pedidosDeConversa, nomeDaInstituicao } = carteira;
  const pedidosMaisRecentes = [...pedidosDeConversa.pedidos].sort((primeiro, segundo) =>
    segundo.autorizadoEm.localeCompare(primeiro.autorizadoEm),
  );

  return (
    <BlocoDoPainel
      className={className}
      identificador="pedidos-de-conversa"
      titulo="Pedidos de conversa"
      descricao="Produtores que autorizaram, por iniciativa própria, que esta instituição converse com eles."
    >
      {pedidosDeConversa.autorizaramAlgumaInstituicao === 0 ? (
        <p className="text-body-sm text-ink-600">Nenhum produtor da carteira pediu conversa até agora.</p>
      ) : (
        <>
          <dl className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Contagem
              rotulo={`Pediram conversa com ${nomeDaInstituicao}`}
              valor={pedidosDeConversa.autorizaramEstaInstituicao}
              destaque
            />
            <Contagem
              rotulo="Autorizaram só outras instituições"
              valor={pedidosDeConversa.autorizaramSomenteOutrasInstituicoes}
              observacao="Aparecem apenas como número"
            />
            <Contagem
              rotulo="Retiraram a autorização nos últimos 90 dias"
              valor={pedidosDeConversa.revogaramNosUltimos90Dias}
              observacao="Saíram da lista ao retirar"
            />
          </dl>

          <h3 className="mt-6 flex items-center gap-2 text-body-sm font-semibold text-ink-900">
            <LockIcon aria-hidden className="text-canopy-600" />
            Quem pediu conversa com {nomeDaInstituicao}
          </h3>
          <p className="mt-1 text-caption text-ink-600">
            Mais recentes primeiro. Cada pedido traz só o resumo que o produtor viu antes de autorizar. Com a
            integração real, nome e contato aparecem aqui porque ele autorizou esta instituição.
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {pedidosMaisRecentes.map((pedido) => (
              <li key={pedido.referencia} className="rounded-xl border border-sand-200 bg-sand-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-body-sm font-medium text-ink-900">{pedido.referencia}</span>
                  <StatusBadge tone={aparenciaDaSituacaoNoPainel[pedido.situacao].tom} size="sm" className="whitespace-nowrap">
                    {aparenciaDaSituacaoNoPainel[pedido.situacao].rotulo}
                  </StatusBadge>
                </div>
                <dl className="mt-3 flex flex-col gap-1.5 text-body-sm">
                  {pedido.resumo.slice(1).map((linha) => (
                    <div key={linha.rotulo}>
                      <dt className="text-caption text-ink-500">{linha.rotulo}</dt>
                      <dd className="text-ink-800">{linha.valor}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-3 text-caption text-ink-500">Autorizado em {formatarData(pedido.autorizadoEm)}</p>
              </li>
            ))}
          </ul>
          {pedidosDeConversa.autorizaramEstaInstituicao > pedidosMaisRecentes.length ? (
            <p className="mt-3 text-caption text-ink-600">
              Mostrando {pedidosMaisRecentes.length} de {formatNumber(pedidosDeConversa.autorizaramEstaInstituicao)}{' '}
              pedidos.
            </p>
          ) : null}
        </>
      )}
    </BlocoDoPainel>
  );
}

function Contagem({
  rotulo,
  valor,
  observacao,
  destaque,
}: {
  rotulo: string;
  valor: number;
  observacao?: string;
  destaque?: boolean;
}) {
  return (
    <div
      className={
        destaque
          ? 'rounded-xl border border-healthy-border bg-healthy-surface p-4'
          : 'rounded-xl border border-sand-200 bg-sand-100/60 p-4'
      }
    >
      <dt className={destaque ? 'text-body-sm font-medium text-healthy-fg' : 'text-body-sm font-medium text-ink-600'}>
        {rotulo}
      </dt>
      <dd className="mt-1 font-display text-title-lg font-bold tabular-nums text-ink-900">{formatNumber(valor)}</dd>
      {observacao ? <dd className="text-caption text-ink-600">{observacao}</dd> : null}
    </div>
  );
}
