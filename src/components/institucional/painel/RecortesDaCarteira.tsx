'use client';

import { useId, useState } from 'react';
import { cn } from '@/lib/cn';
import { formatNumber, formatPercent } from '@/lib/format';
import { calcularPercentual } from '@/lib/institucional/carteira';
import { TAMANHO_MINIMO_DO_GRUPO, protegerSegmentosPequenos } from '@/lib/institucional/privacidade';
import type { RecorteDaCarteira } from '@/lib/institucional/tipos';
import { BlocoDoPainel } from './BlocoDoPainel';
import { DistribuicaoPorSituacao } from './DistribuicaoPorSituacao';
import { GrupoProtegido } from './GrupoProtegido';

/**
 * A carteira dividida por núcleo, porte ou cultura.
 *
 * É aqui que a privacidade corre mais risco: quanto mais fino o recorte, menor
 * o grupo. Por isso toda linha passa por `protegerSegmentosPequenos` antes de
 * chegar à tela, e nenhum número de um segmento oculto é renderizado — nem
 * escondido com CSS, nem em texto para leitor de tela.
 */
export function RecortesDaCarteira({ recortes }: { recortes: RecorteDaCarteira[] }) {
  const nomeDoGrupoDeOpcoes = useId();
  const [recorteEscolhido, escolherRecorte] = useState(recortes[0]?.identificador);
  const recorte = recortes.find((item) => item.identificador === recorteEscolhido) ?? recortes[0];

  if (!recorte) return null;

  const linhas = protegerSegmentosPequenos(recorte.segmentos);

  return (
    <BlocoDoPainel
      identificador="recortes"
      titulo="Onde está o risco na carteira"
      descricao={`Segmentos com menos de ${TAMANHO_MINIMO_DO_GRUPO} produtores com diagnóstico ficam ocultos para não identificar ninguém.`}
    >
      <fieldset className="mb-5 border-0 p-0">
        <legend className="mb-2 text-body-sm font-medium text-ink-700">Recortar a carteira por</legend>
        <div className="inline-flex flex-wrap gap-1 rounded-xl border border-sand-200 bg-sand-100 p-1">
          {recortes.map((opcao) => (
            <label key={opcao.identificador} className="relative">
              <input
                type="radio"
                name={nomeDoGrupoDeOpcoes}
                value={opcao.identificador}
                checked={opcao.identificador === recorte.identificador}
                onChange={() => escolherRecorte(opcao.identificador)}
                className="peer sr-only"
              />
              <span
                className={cn(
                  'block cursor-pointer rounded-lg px-4 py-2 text-body-sm font-medium text-ink-600',
                  'transition-colors duration-base ease-standard hover:text-ink-900',
                  'peer-checked:bg-sand-50 peer-checked:text-canopy-700 peer-checked:shadow-xs',
                  'peer-focus-visible:ring-2 peer-focus-visible:ring-beam-500',
                )}
              >
                {opcao.rotulo}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="-mx-5 overflow-x-auto px-5 md:-mx-6 md:px-6">
        <table className="w-full min-w-[38rem] border-collapse text-left">
          <caption className="sr-only">
            Carteira por {recorte.rotulo.toLowerCase()}, com a distribuição por situação da safra
          </caption>
          <thead>
            <tr className="border-b border-sand-300 text-caption font-semibold uppercase tracking-[0.06em] text-ink-500">
              <th scope="col" className="py-2.5 pr-4 font-semibold">{recorte.rotulo}</th>
              <th scope="col" className="py-2.5 pr-4 text-right font-semibold">Avaliados</th>
              <th scope="col" className="w-[28%] py-2.5 pr-4 font-semibold">Situação da safra</th>
              <th scope="col" className="py-2.5 pr-4 text-right font-semibold">Não cobrem</th>
              <th scope="col" className="py-2.5 text-right font-semibold">Fora do banco</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200">
            {linhas.map((linha) => {
              const { segmento } = linha;

              if (!linha.podeSerExibido) {
                return (
                  <tr key={segmento.nome}>
                    <th scope="row" className="py-3 pr-4 text-body-sm font-medium text-ink-700">
                      {segmento.nome}
                    </th>
                    <td colSpan={4} className="py-3">
                      <GrupoProtegido motivo={linha.motivo} />
                    </td>
                  </tr>
                );
              }

              const naoCobrem = segmento.produtoresPorSituacao['nao-cobre'];
              const avaliados = segmento.produtoresComDiagnostico;
              const percentualQueNaoCobre = Math.round(calcularPercentual(naoCobrem, avaliados));
              const percentualForaDoBanco = Math.round(
                calcularPercentual(segmento.comCompromissosForaDoBanco, avaliados),
              );

              return (
                <tr key={segmento.nome}>
                  <th scope="row" className="py-3 pr-4 text-body-sm font-medium text-ink-900">
                    {segmento.nome}
                  </th>
                  <td className="py-3 pr-4 text-right text-body-sm tabular-nums text-ink-800">
                    {formatNumber(segmento.produtoresComDiagnostico)}
                  </td>
                  <td className="py-3 pr-4">
                    <DistribuicaoPorSituacao produtoresPorSituacao={segmento.produtoresPorSituacao} variante="compacta" />
                  </td>
                  <td className="py-3 pr-4 text-right text-body-sm tabular-nums text-ink-800">
                    {formatNumber(naoCobrem)}{' '}
                    <span className="text-ink-500">({formatPercent(percentualQueNaoCobre)})</span>
                  </td>
                  <td className="py-3 text-right text-body-sm tabular-nums text-ink-800">
                    {formatPercent(percentualForaDoBanco)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </BlocoDoPainel>
  );
}
