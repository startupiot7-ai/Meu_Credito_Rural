import { ArrowRightIcon, LockIcon, StatusBadge } from '@/components/ui';
import { formatNumber, formatPercent } from '@/lib/format';
import { formatarData } from '@/lib/institucional/formatacao';
import type { CarteiraDaInstituicao, EtapaDaOriginacao } from '@/lib/institucional/tipos';
import { BlocoDoPainel } from './BlocoDoPainel';
import { aparenciaDaFaixa } from './faixas';

const rotuloDaEtapa: Record<EtapaDaOriginacao, string> = {
  'aguardando-contato': 'Aguardando contato',
  'em-conversa': 'Em conversa',
  'proposta-apresentada': 'Proposta apresentada',
  'operacao-concluida': 'Operação concluída',
};

const ordemDasEtapas: EtapaDaOriginacao[] = [
  'aguardando-contato',
  'em-conversa',
  'proposta-apresentada',
  'operacao-concluida',
];

/**
 * Produtores que pediram, eles mesmos, para ser apresentados a instituições.
 *
 * Regra central: só aparece em lista quem autorizou ESTA instituição. Quem
 * autorizou apenas outras instituições entra somente como um número. Se o
 * produtor revogar a autorização, ele sai da lista.
 */
export function OriginacaoQualificada({
  carteira,
  className,
}: {
  carteira: CarteiraDaInstituicao;
  className?: string;
}) {
  const { originacao, nomeDaInstituicao } = carteira;

  return (
    <BlocoDoPainel
      className={className}
      identificador="originacao"
      titulo="Originação qualificada"
      descricao="Produtores que autorizaram, por iniciativa própria, ser apresentados a instituições de crédito."
    >
      {originacao.autorizaramAlgumaInstituicao === 0 ? (
        <p className="text-body-sm text-ink-600">
          Nenhum produtor da carteira autorizou apresentação a instituições até agora.
        </p>
      ) : (
        <>
          <dl className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-healthy-border bg-healthy-surface p-4">
              <dt className="text-body-sm font-medium text-healthy-fg">Autorizaram {nomeDaInstituicao}</dt>
              <dd className="mt-1 font-display text-title-lg font-bold tabular-nums text-ink-900">
                {formatNumber(originacao.autorizaramEstaInstituicao)}
              </dd>
            </div>
            <div className="rounded-xl border border-sand-200 bg-sand-100/60 p-4">
              <dt className="text-body-sm font-medium text-ink-600">Autorizaram só outras instituições</dt>
              <dd className="mt-1 font-display text-title-lg font-bold tabular-nums text-ink-900">
                {formatNumber(originacao.autorizaramSomenteOutrasInstituicoes)}
              </dd>
              <dd className="text-caption text-ink-600">Aparecem apenas como número</dd>
            </div>
            <div className="rounded-xl border border-sand-200 bg-sand-100/60 p-4">
              <dt className="text-body-sm font-medium text-ink-600">Revogaram nos últimos 90 dias</dt>
              <dd className="mt-1 font-display text-title-lg font-bold tabular-nums text-ink-900">
                {formatNumber(originacao.revogaramNosUltimos90Dias)}
              </dd>
              <dd className="text-caption text-ink-600">Saíram da lista ao revogar</dd>
            </div>
          </dl>

          <ol aria-label="Etapas das apresentações a esta instituição" className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {ordemDasEtapas.map((etapa, posicao) => (
              <li key={etapa} className="relative flex flex-col gap-1 rounded-xl border border-sand-200 bg-sand-50 p-4">
                <span className="text-caption font-medium text-ink-600">{rotuloDaEtapa[etapa]}</span>
                <span className="font-display text-title font-bold tabular-nums text-ink-900">
                  {formatNumber(originacao.quantidadePorEtapa[etapa])}
                </span>
                {posicao < ordemDasEtapas.length - 1 ? (
                  <ArrowRightIcon
                    aria-hidden
                    className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-ink-400 lg:block"
                  />
                ) : null}
              </li>
            ))}
          </ol>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left">
              <caption className="mb-3 text-left">
                <span className="flex items-center gap-2 text-body-sm font-semibold text-ink-900">
                  <LockIcon aria-hidden className="text-canopy-600" />
                  Produtores que autorizaram {nomeDaInstituicao}
                </span>
                <span className="mt-1 block text-caption font-normal text-ink-600">
                  Mais recentes primeiro. Com a integração real, nome e contato aparecem aqui porque o
                  produtor autorizou esta instituição especificamente.
                </span>
              </caption>
              <thead>
                <tr className="border-b border-sand-300 text-caption font-semibold uppercase tracking-[0.06em] text-ink-500">
                  <th scope="col" className="py-2.5 pr-4 font-semibold">Referência</th>
                  <th scope="col" className="py-2.5 pr-4 font-semibold">Faixa</th>
                  <th scope="col" className="py-2.5 pr-4 text-right font-semibold">Receita comprometida</th>
                  <th scope="col" className="py-2.5 pr-4 font-semibold">Etapa</th>
                  <th scope="col" className="py-2.5 font-semibold">Consentimento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {[...originacao.produtoresQueAutorizaramEstaInstituicao]
                  .sort((primeiro, segundo) => segundo.autorizadoEm.localeCompare(primeiro.autorizadoEm))
                  .map((produtor) => (
                    <tr key={produtor.referencia}>
                      <th scope="row" className="py-3 pr-4 font-mono text-body-sm font-medium text-ink-900">
                        {produtor.referencia}
                      </th>
                      <td className="py-3 pr-4">
                        <StatusBadge tone={aparenciaDaFaixa[produtor.faixa].tom} size="sm" className="whitespace-nowrap">
                          {aparenciaDaFaixa[produtor.faixa].rotulo}
                        </StatusBadge>
                      </td>
                      <td className="py-3 pr-4 text-right text-body-sm tabular-nums text-ink-800">
                        {formatPercent(produtor.percentualDaReceitaComprometido)}
                      </td>
                      <td className="py-3 pr-4 text-body-sm text-ink-800">{rotuloDaEtapa[produtor.etapa]}</td>
                      <td className="py-3 text-body-sm text-ink-700">
                        Ativo desde {formatarData(produtor.autorizadoEm)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {originacao.autorizaramEstaInstituicao >
            originacao.produtoresQueAutorizaramEstaInstituicao.length ? (
              <p className="mt-3 text-caption text-ink-600">
                Mostrando {originacao.produtoresQueAutorizaramEstaInstituicao.length} de{' '}
                {formatNumber(originacao.autorizaramEstaInstituicao)} produtores.
              </p>
            ) : null}
          </div>
        </>
      )}
    </BlocoDoPainel>
  );
}
