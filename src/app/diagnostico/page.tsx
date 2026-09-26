'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ReactElement } from 'react';
import { Logo } from '@/components/brand/Logo';
import {
  Alert,
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
  const [avisoDeSalvo, mudarAvisoDeSalvo] = useState(false);
  const [abrindoResultado, mudarAbrindoResultado] = useState(false);
  const areaDaPergunta = useRef<HTMLDivElement>(null);

  // Ao trocar de tela, o foco vai para a pergunta nova, para quem usa teclado
  // ou leitor de tela não ficar no fim da tela anterior.
  useEffect(() => {
    areaDaPergunta.current?.querySelector<HTMLElement>('h1')?.focus();
  }, [telaAtual]);

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
      return;
    }
    mudarErro(null);
    irParaTela(telaSeguinte(tela, respostas.perfil));
  }

  function voltar() {
    mudarErro(null);
    irParaTela(telaAnterior(tela, respostas.perfil));
  }

  function avisarQueEstaSalvo() {
    mudarAvisoDeSalvo(true);
    window.setTimeout(() => mudarAvisoDeSalvo(false), 4000);
  }

  function verResultado() {
    // Uma resposta pode ter ficado incompleta ao editar pela revisão.
    const incompleta = primeiraTelaIncompleta(respostas);
    if (incompleta !== 'revisao') {
      irParaTela(incompleta);
      mudarErro(validarTela(incompleta, respostas));
      return;
    }
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
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" aria-label="Meu Crédito Rural, página inicial" className="rounded-md">
            <Logo />
          </Link>
          <Button variant="ghost" size="sm" onClick={() => mudarConfirmandoRecomeco(true)} className="shrink-0">
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
        <div className="container-page max-w-2xl py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {avisoDeSalvo ? (
            <p role="status" className="mb-3 flex items-center gap-2 text-body-sm font-medium text-healthy-fg">
              <SaveIcon className="text-body-lg" />
              Suas respostas estão salvas neste aparelho{horarioSalvo ? ` (${horarioSalvo})` : ''}. Pode fechar e
              voltar depois.
            </p>
          ) : null}

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={voltar}
              disabled={tela === 'perfil'}
              iconLeft={<ChevronLeftIcon />}
              className="shrink-0"
            >
              Voltar
            </Button>
            {ehRevisao ? (
              <Button onClick={verResultado} loading={abrindoResultado} loadingLabel="Preparando" fullWidth>
                Ver meu resultado
              </Button>
            ) : (
              <Button onClick={avancar} iconRight={<ArrowRightIcon />} fullWidth>
                Continuar
              </Button>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={avisarQueEstaSalvo}
              className="inline-flex min-h-touch items-center gap-2 rounded-md text-body-sm font-medium text-canopy-700 transition-colors hover:text-canopy-800"
            >
              <SaveIcon className="text-body-lg" />
              Salvar e continuar depois
            </button>
            <p className="text-caption text-ink-500">
              Etapa {posicao} de {telas.length}
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmandoRecomeco}
        onClose={() => mudarConfirmandoRecomeco(false)}
        onConfirm={() => {
          recomecar();
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
