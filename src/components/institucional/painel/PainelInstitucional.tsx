'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircleIcon, ChartIcon, CompassIcon, ScaleIcon } from '@/components/ui';
import { cn } from '@/lib/cn';
import { formatNumber, formatPercent } from '@/lib/format';
import { calcularPercentual } from '@/lib/institucional/carteira';
import { carteiraDeDemonstracao, carteiraSemDiagnosticos } from '@/lib/institucional/dados-simulados';
import { formatarDataComHora, formatarMoedaAbreviada } from '@/lib/institucional/formatacao';
import { grupoTemTamanhoSeguro } from '@/lib/institucional/privacidade';
import type { CarteiraDaInstituicao } from '@/lib/institucional/tipos';
import { BlocoDoPainel } from './BlocoDoPainel';
import { CabecalhoDoPainel } from './CabecalhoDoPainel';
import { CartaoDeIndicador } from './CartaoDeIndicador';
import { DistribuicaoDeRisco } from './DistribuicaoDeRisco';
import { LeituraDaMp } from './LeituraDaMp';
import { LimitesDoPainel } from './LimitesDoPainel';
import { OriginacaoQualificada } from './OriginacaoQualificada';
import { PainelCarregando } from './PainelCarregando';
import { PainelVazio } from './PainelVazio';
import { ReceitaComprometida } from './ReceitaComprometida';
import { RecortesDaCarteira } from './RecortesDaCarteira';

/**
 * Qual versão do protótipo mostrar. Na versão real, isso vem do servidor;
 * aqui é escolhido pelo endereço (`/painel?estado=vazio`) para que cada estado
 * possa ser revisado e fotografado.
 */
export type EstadoDoPainel = 'com-dados' | 'vazio' | 'carregando';

const carteiraPorEstado: Record<EstadoDoPainel, CarteiraDaInstituicao> = {
  'com-dados': carteiraDeDemonstracao,
  vazio: carteiraSemDiagnosticos,
  carregando: carteiraDeDemonstracao,
};

export function PainelInstitucional({ estado }: { estado: EstadoDoPainel }) {
  const carteira = carteiraPorEstado[estado];
  const [dadosCarregados, marcarDadosCarregados] = useState(false);

  useEffect(() => {
    marcarDadosCarregados(false);
    if (estado === 'carregando') return;
    // PROTÓTIPO: pausa proposital para que o estado de carregamento apareça.
    const espera = window.setTimeout(() => marcarDadosCarregados(true), 700);
    return () => window.clearTimeout(espera);
  }, [estado]);

  return (
    <div className="flex min-h-dvh flex-col">
      <CabecalhoDoPainel nomeDaInstituicao={carteira.nomeDaInstituicao} />

      <main id="conteudo" className="container-page max-w-screen-xl flex-1 py-8 lg:py-10">
        {!dadosCarregados ? (
          <PainelCarregando />
        ) : !grupoTemTamanhoSeguro(carteira.produtoresComDiagnostico) ? (
          <PainelVazio
            produtoresAcompanhados={carteira.produtoresAcompanhados}
            produtoresComDiagnostico={carteira.produtoresComDiagnostico}
          />
        ) : (
          <PainelComDados carteira={carteira} />
        )}
      </main>

      <NavegacaoEntreEstados estadoAtual={estado} />
    </div>
  );
}

function PainelComDados({ carteira }: { carteira: CarteiraDaInstituicao }) {
  const percentualComDiagnostico = calcularPercentual(
    carteira.produtoresComDiagnostico,
    carteira.produtoresAcompanhados,
  );
  const percentualEmRisco = calcularPercentual(
    carteira.produtoresPorFaixa.risco,
    carteira.produtoresComDiagnostico,
  );
  const percentualQueAtendeMp = calcularPercentual(
    carteira.leituraDaMp.aparentementeAtendemOsCriterios,
    carteira.produtoresComDiagnostico,
  );

  return (
    <div className="flex animate-fade-up flex-col gap-6">
      <div>
        <h1 className="text-title-lg lg:text-display">Saúde financeira da carteira</h1>
        <p className="mt-2 text-body-sm text-ink-600">
          Atualizado em {formatarDataComHora(carteira.atualizadoEm)} · Números agregados e anonimizados
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CartaoDeIndicador
          icone={<CompassIcon aria-hidden />}
          rotulo="Produtores acompanhados"
          valor={formatNumber(carteira.produtoresAcompanhados)}
          contexto="Associados cadastrados pela instituição"
        />
        <CartaoDeIndicador
          icone={<ChartIcon aria-hidden />}
          rotulo="Diagnósticos concluídos"
          valor={formatNumber(carteira.produtoresComDiagnostico)}
          contexto={`${formatPercent(Math.round(percentualComDiagnostico))} dos acompanhados`}
        />
        <CartaoDeIndicador
          tom="risco"
          icone={<AlertCircleIcon aria-hidden />}
          rotulo="Em risco elevado"
          valor={formatNumber(carteira.produtoresPorFaixa.risco)}
          contexto={`${formatPercent(Math.round(percentualEmRisco))} dos avaliados · ${formatarMoedaAbreviada(
            carteira.dividaNaFaixaDeRisco,
          )} em dívidas`}
        />
        <CartaoDeIndicador
          icone={<ScaleIcon aria-hidden />}
          rotulo="Enquadramento indicativo na MP"
          valor={formatNumber(carteira.leituraDaMp.aparentementeAtendemOsCriterios)}
          contexto={`${formatPercent(Math.round(percentualQueAtendeMp))} dos avaliados, com base nas respostas`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <BlocoDoPainel
          identificador="distribuicao"
          titulo="Distribuição por faixa de risco"
          descricao="Comprometimento da receita projetada com dívida, entre quem concluiu o diagnóstico."
          className="lg:col-span-7"
        >
          <DistribuicaoDeRisco produtoresPorFaixa={carteira.produtoresPorFaixa} />
          <p className="mt-6 border-t border-sand-200 pt-4 text-caption leading-relaxed text-ink-600">
            Mesma leitura que o produtor recebe: saudável abaixo de 30% da receita comprometida,
            atenção entre 30% e 50%, risco elevado a partir de 50%.
          </p>
        </BlocoDoPainel>
        <ReceitaComprometida carteira={carteira} className="lg:col-span-5" />
      </div>

      <RecortesDaCarteira recortes={carteira.recortes} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <LeituraDaMp carteira={carteira} className="lg:col-span-5" />
        <OriginacaoQualificada carteira={carteira} className="lg:col-span-7" />
      </div>

      <LimitesDoPainel />
    </div>
  );
}

/** PROTÓTIPO: atalhos para revisar os estados do painel. Remover na versão real. */
function NavegacaoEntreEstados({ estadoAtual }: { estadoAtual: EstadoDoPainel }) {
  const opcoes: { estado: EstadoDoPainel; rotulo: string }[] = [
    { estado: 'com-dados', rotulo: 'Com dados' },
    { estado: 'vazio', rotulo: 'Sem diagnósticos' },
    { estado: 'carregando', rotulo: 'Carregando' },
  ];

  return (
    <nav aria-label="Estados do protótipo" className="border-t border-sand-200 bg-sand-100">
      <div className="container-page flex max-w-screen-xl flex-wrap items-center gap-x-4 gap-y-2 py-4 text-caption text-ink-600">
        <span>Estados do protótipo:</span>
        {opcoes.map((opcao) => (
          <Link
            key={opcao.estado}
            href={opcao.estado === 'com-dados' ? '/painel' : `/painel?estado=${opcao.estado}`}
            aria-current={opcao.estado === estadoAtual ? 'page' : undefined}
            className={cn(
              'rounded-md underline-offset-4 hover:text-ink-900 hover:underline',
              opcao.estado === estadoAtual && 'font-semibold text-ink-900',
            )}
          >
            {opcao.rotulo}
          </Link>
        ))}
      </div>
    </nav>
  );
}
