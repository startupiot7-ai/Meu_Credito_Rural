'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactElement } from 'react';
import { Logo } from '@/components/brand/Logo';
import {
  Alert,
  AlertCircleIcon,
  ArrowRightIcon,
  Button,
  ChevronLeftIcon,
  CloudOffIcon,
  ConfirmDialog,
  SaveIcon,
  StepProgress,
} from '@/components/ui';
import {
  TelaDaArea,
  TelaDaCultura,
  TelaDaPosseDaTerra,
  TelaDaProtecao,
  TelaDoPerfil,
} from '@/components/diagnostico/telas/TelasDaLavoura';
import { TelaDaProducao, TelaDoCusto, TelaDoPreco } from '@/components/diagnostico/telas/TelasDaSafra';
import {
  TelaDeOutrosPagamentos,
  TelaDoCafePrometido,
  TelaDoCusteio,
} from '@/components/diagnostico/telas/TelasDoCredito';
import {
  TelaDaRetiradaDaFamilia,
  TelaDeRevisao,
  TelaDoPrecoFechado,
  TelaDosAcontecimentos,
} from '@/components/diagnostico/telas/TelasDaVenda';
import type { PropsDaTela } from '@/components/diagnostico/telas/tipos';
import {
  primeiraTelaIncompleta,
  rotuloDaTela,
  telaAnterior,
  telaSeguinte,
  telasDoFluxo,
  validarTela,
} from '@/lib/diagnostico/fluxo';
import type { IdDaTela } from '@/lib/diagnostico/fluxo';
import { focarPrimeiroInvalido, preferenciaDeMovimentoReduzido } from '@/lib/foco-no-erro';
import { useConexao, useDiagnosticoSalvo } from '@/lib/useDiagnosticoSalvo';

/**
 * O questionário do diagnóstico preventivo.
 *
 * PROTÓTIPO: tudo fica no aparelho. Não há conta, servidor nem envio: "Ver
 * meu resultado" abre uma tela calculada no próprio navegador.
 *
 * O que esta tela garante:
 *  1. Uma decisão por tela, com a posição no caminho sempre visível.
 *  2. Dá para voltar, editar, sair e continuar depois.
 *  3. Uma queda de conexão não custa nada, e a tela diz isso.
 */

const telasDoQuestionario: Record<Exclude<IdDaTela, 'revisao'>, (props: PropsDaTela) => ReactElement> = {
  perfil: TelaDoPerfil,
  cultura: TelaDaCultura,
  area: TelaDaArea,
  'posse-da-terra': TelaDaPosseDaTerra,
  protecao: TelaDaProtecao,
  producao: TelaDaProducao,
  preco: TelaDoPreco,
  custo: TelaDoCusto,
  custeio: TelaDoCusteio,
  'cafe-prometido': TelaDoCafePrometido,
  'outros-pagamentos': TelaDeOutrosPagamentos,
  'preco-fechado': TelaDoPrecoFechado,
  acontecimentos: TelaDosAcontecimentos,
  'retirada-da-familia': TelaDaRetiradaDaFamilia,
};

export default function PaginaDoDiagnostico() {
  const router = useRouter();
  const {
    respostas,
    telaAtual,
    salvoEm,
    restaurado,
    voltouDeOndeParou,
    respostasAproveitadas,
    atualizarRespostas,
    irParaTela,
    recomecar,
  } = useDiagnosticoSalvo();
  const conectado = useConexao();

  const [erro, mudarErro] = useState<string | null>(null);
  const [confirmandoRecomeco, mudarConfirmandoRecomeco] = useState(false);
  const [abrindoResultado, mudarAbrindoResultado] = useState(false);
  // Conta as tentativas de avançar que falharam; cada uma pede o foco no erro.
  const [tentativasComErro, mudarTentativasComErro] = useState(0);
  const abrindoResultadoAgora = useRef(false);
  const areaDaPergunta = useRef<HTMLDivElement>(null);

  // A guarda de "abrindo o resultado" precisa voltar ao normal junto com o
  // estado, senão o botão fica preso em "Preparando" se a navegação falhar.
  function liberarAberturaDoResultado() {
    abrindoResultadoAgora.current = false;
    mudarAbrindoResultado(false);
  }

  // Trocar de tela encerra qualquer abertura em andamento.
  useEffect(() => {
    liberarAberturaDoResultado();
  }, [telaAtual]);

  // Página restaurada do cache de voltar/avançar (bfcache) pode trazer o
  // estado preso; nesse caso a guarda também é liberada.
  useEffect(() => {
    function aoMostrarPagina(evento: PageTransitionEvent) {
      if (evento.persisted) liberarAberturaDoResultado();
    }
    window.addEventListener('pageshow', aoMostrarPagina);
    return () => window.removeEventListener('pageshow', aoMostrarPagina);
  }, []);

  // Ao trocar de tela, o foco vai para a pergunta nova, para quem usa teclado
  // ou leitor de tela não ficar no fim da tela anterior.
  useEffect(() => {
    areaDaPergunta.current?.querySelector<HTMLElement>('h1')?.focus();
  }, [telaAtual]);

  // Depois do render que mostra o erro, o foco vai para o primeiro campo
  // inválido. Só roda numa tentativa que falhou (nunca na troca de tela) e
  // fica depois do efeito acima para vencer o foco no título quando
  // `verResultado` leva a uma tela incompleta.
  useEffect(() => {
    if (tentativasComErro === 0) return;
    focarPrimeiroInvalido(areaDaPergunta.current, preferenciaDeMovimentoReduzido());
  }, [tentativasComErro]);

  const telas = telasDoFluxo(respostas.perfil);
  // Se o perfil mudou e a tela atual saiu do caminho, volta para a revisão.
  const tela = telas.includes(telaAtual) ? telaAtual : 'revisao';
  const posicao = telas.indexOf(tela) + 1;
  const ehRevisao = tela === 'revisao';

  function atualizar(alteracao: Parameters<typeof atualizarRespostas>[0]) {
    mudarErro(null);
    atualizarRespostas(alteracao);
  }

  function avancar() {
    const mensagem = validarTela(tela, respostas);
    if (mensagem) {
      mudarErro(mensagem);
      mudarTentativasComErro((n) => n + 1);
      return;
    }
    mudarErro(null);
    irParaTela(telaSeguinte(tela, respostas.perfil));
  }

  function voltar() {
    mudarErro(null);
    irParaTela(telaAnterior(tela, respostas.perfil));
  }

  function verResultado() {
    // O estado só muda no próximo render; a ref barra um segundo clique antes disso.
    if (abrindoResultadoAgora.current) return;
    // Uma resposta pode ter ficado incompleta ao editar pela revisão.
    const incompleta = primeiraTelaIncompleta(respostas);
    if (incompleta !== 'revisao') {
      irParaTela(incompleta);
      mudarErro(validarTela(incompleta, respostas));
      mudarTentativasComErro((n) => n + 1);
      return;
    }
    abrindoResultadoAgora.current = true;
    mudarAbrindoResultado(true);
    router.push('/diagnostico/resultado');
  }

  const horarioSalvo = salvoEm
    ? new Date(salvoEm).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : null;

  const TelaAtual = ehRevisao ? null : telasDoQuestionario[tela];

  return (
    <div className="flex min-h-dvh flex-col bg-sand-50">
      <header className="border-b border-sand-200 bg-sand-50">
        <div className="container-page flex h-16 items-center justify-between gap-2 sm:gap-4">
          <Link href="/" aria-label="Meu Crédito Rural, página inicial" className="rounded-md">
            <Logo className="max-[359px]:[&>span:last-child]:!text-body" />
          </Link>
          <Button variant="ghost" size="sm" onClick={() => mudarConfirmandoRecomeco(true)} className="shrink-0 !px-2 sm:!px-4">
            Recomeçar
          </Button>
        </div>
      </header>

      <main id="conteudo" className="flex-1">
        <div className="container-page max-w-2xl py-6 lg:py-10">
          <StepProgress current={posicao} total={telas.length} labels={telas.map((id) => rotuloDaTela[id])} />

          {/* A conexão é um estado normal do campo, não um erro. */}
          {!conectado ? (
            <Alert tone="attention" icon={<CloudOffIcon />} title="Sua conexão caiu." className="mt-6">
              Suas respostas estão salvas neste aparelho. Pode continuar respondendo normalmente.
            </Alert>
          ) : null}

          {restaurado && respostasAproveitadas > 0 && tela === 'perfil' ? (
            <Alert tone="info" title="Aproveitamos suas respostas anteriores." className="mt-6">
              Trouxemos {respostasAproveitadas} {respostasAproveitadas === 1 ? 'resposta' : 'respostas'} do seu
              diagnóstico anterior. Confira cada uma: o diagnóstico agora olha a safra inteira, não só a dívida.
            </Alert>
          ) : null}

          {restaurado && voltouDeOndeParou && tela !== 'perfil' && conectado ? (
            <Alert tone="info" title="Você voltou de onde parou." className="mt-6">
              Encontramos respostas salvas neste aparelho{horarioSalvo ? ` às ${horarioSalvo}` : ''}. Se preferir
              começar do zero, use “Recomeçar”.
            </Alert>
          ) : null}

          <div ref={areaDaPergunta} className="mt-8">
            {!restaurado ? null : TelaAtual ? (
              // `key` recria a tela ao trocar, para o estado local de uma não vazar para outra.
              <TelaAtual key={tela} respostas={respostas} atualizar={atualizar} erro={erro} />
            ) : (
              <TelaDeRevisao respostas={respostas} aoEditar={(destino) => irParaTela(destino)} />
            )}
          </div>
        </div>
      </main>

      {/*
       * A barra de ações fica presa embaixo no celular: é onde o polegar já
       * está, e "Voltar" precisa estar tão perto quanto "Continuar".
       */}
      <div className="sticky bottom-0 border-t border-sand-200 bg-sand-50/95 backdrop-blur-sm">
        <div className="container-page max-w-2xl py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {/*
           * Resumo do erro colado nos botões: em tela curta a mensagem do campo
           * fica fora da vista e quem toca em "Continuar" não veria nada. O
           * texto completo continua junto do campo, que é quem avisa o leitor
           * de tela (role="alert"); por isso este resumo fica fora da árvore de
           * acessibilidade, para o aviso não ser lido duas vezes.
           */}
          {erro ? (
            <p
              aria-hidden="true"
              className="mb-2.5 flex items-start gap-1.5 rounded-lg bg-risk-surface px-3 py-2 text-body-sm font-medium text-risk-fg"
            >
              <AlertCircleIcon className="mt-0.5 shrink-0 text-[1.05em]" />
              <span>Responda a pergunta acima para continuar.</span>
            </p>
          ) : null}
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={voltar}
              disabled={tela === 'perfil'}
              iconLeft={<ChevronLeftIcon />}
              className="shrink-0 !px-3 min-[360px]:!px-4"
            >
              Voltar
            </Button>
            {ehRevisao ? (
              <Button onClick={verResultado} loading={abrindoResultado} loadingLabel="Preparando" fullWidth className="min-w-0 !px-3 min-[360px]:!px-5">
                Ver meu resultado
              </Button>
            ) : (
              <Button onClick={avancar} iconRight={<ArrowRightIcon />} fullWidth className="min-w-0 !px-3 min-[360px]:!px-5">
                Continuar
              </Button>
            )}
          </div>

          <p className="mt-2 flex items-center justify-center gap-1.5 text-caption text-ink-600">
            <SaveIcon aria-hidden className="text-body" />
            Suas respostas são salvas automaticamente neste aparelho.
          </p>
        </div>
      </div>

      <ConfirmDialog
        open={confirmandoRecomeco}
        onClose={() => mudarConfirmandoRecomeco(false)}
        onConfirm={() => {
          recomecar();
          liberarAberturaDoResultado();
          mudarErro(null);
          mudarConfirmandoRecomeco(false);
        }}
        title="Recomeçar o diagnóstico?"
        description="Suas respostas serão apagadas deste aparelho e você voltará à primeira pergunta. Não dá para desfazer."
        confirmLabel="Sim, recomeçar"
        cancelLabel="Continuar de onde parei"
        destructive
      />
    </div>
  );
}
