'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircleIcon, AlertTriangleIcon, ChartIcon, CompassIcon } from '@/components/ui';
import { cn } from '@/lib/cn';
import { formatNumber, formatPercent } from '@/lib/format';
import { calcularPercentual } from '@/lib/institucional/carteira';
import { carteiraDeDemonstracao, carteiraSemDiagnosticos } from '@/lib/institucional/dados-simulados';
import { formatarDataComHora } from '@/lib/institucional/formatacao';
import { grupoTemTamanhoSeguro } from '@/lib/institucional/privacidade';
import type { CarteiraDaInstituicao } from '@/lib/institucional/tipos';
import { descreverHipotese, hipotesesDosCenarios } from '@/lib/diagnostico/cenarios';
import { BlocoDoPainel } from './BlocoDoPainel';
import { CabecalhoDoPainel } from './CabecalhoDoPainel';
import { CartaoDeIndicador } from './CartaoDeIndicador';
import { DistribuicaoPorSituacao } from './DistribuicaoPorSituacao';
import { ExposicoesDaCarteira } from './ExposicoesDaCarteira';
import { LimitesDoPainel } from './LimitesDoPainel';
import { MargemDaCarteira } from './MargemDaCarteira';
import { NecessidadeDeRenegociacao } from './NecessidadeDeRenegociacao';
import { PainelCarregando } from './PainelCarregando';
import { PainelVazio } from './PainelVazio';
import { PedidosDeConversa } from './PedidosDeConversa';
import { RecortesDaCarteira } from './RecortesDaCarteira';

/**
 * Qual versão do protótipo mostrar. Na versão real, isso vem do servidor;
 * aqui é escolhido pelo endereço (`/painel?estado=vazio`) para que cada estado
 * possa ser revisado e fotografado.
 */
export type EstadoDoPainel = 'com-dados' | 'vazio' | 'carregando';

/** A hipótese do cenário pior vem das premissas do motor, a mesma que o produtor vê. */
const hipoteseDoCenarioPior = descreverHipotese(hipotesesDosCenarios().desfavoravel).toLowerCase();

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
  const total = carteira.produtoresComDiagnostico;
  const percentual = (parte: number, de: number) => formatPercent(Math.round(calcularPercentual(parte, de)));
  const naoCobrem = carteira.produtoresPorSituacao['nao-cobre'];
  const apertados = carteira.produtoresPorSituacao['cobre-apertado'];

  return (
    <div className="flex animate-fade-up flex-col gap-6">
      <div>
        <h1 className="text-title-lg lg:text-display">Risco da safra na carteira</h1>
        <p className="mt-2 text-body-sm text-ink-600">
          Atualizado em {formatarDataComHora(carteira.atualizadoEm)} · Números agregados e anonimizados de quem
          autorizou o uso para estatísticas
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
          rotulo="Diagnósticos nas estatísticas"
          valor={formatNumber(total)}
          contexto={`${percentual(total, carteira.produtoresAcompanhados)} dos acompanhados`}
        />
        <CartaoDeIndicador
          tom="risco"
          icone={<AlertCircleIcon aria-hidden />}
          rotulo="Não cobrem no cenário esperado"
          valor={formatNumber(naoCobrem)}
          contexto={`${percentual(naoCobrem, total)} dos avaliados: já falta dinheiro se tudo sair como esperam`}
        />
        <CartaoDeIndicador
          icone={<AlertTriangleIcon aria-hidden />}
          rotulo="Cobrem, mas apertados"
          valor={formatNumber(apertados)}
          contexto={`${percentual(apertados, total)} dos avaliados: faltaria dinheiro numa safra pior`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <BlocoDoPainel
          identificador="distribuicao"
          titulo="Situação da safra"
          descricao="Se a safra paga custos e parcelas como o produtor espera, e num cenário pior."
          className="lg:col-span-7"
        >
          <DistribuicaoPorSituacao produtoresPorSituacao={carteira.produtoresPorSituacao} />
          <p className="mt-6 border-t border-sand-200 pt-4 text-caption leading-relaxed text-ink-600">
            Mesma leitura que o produtor recebe. &quot;Pior&quot; é uma hipótese de simulação, ainda a validar:{' '}
            {hipoteseDoCenarioPior}.
          </p>
        </BlocoDoPainel>
        <MargemDaCarteira carteira={carteira} className="lg:col-span-5" />
      </div>

      <ExposicoesDaCarteira carteira={carteira} />

      <RecortesDaCarteira recortes={carteira.recortes} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <NecessidadeDeRenegociacao carteira={carteira} className="lg:col-span-5" />
        <PedidosDeConversa carteira={carteira} className="lg:col-span-7" />
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
