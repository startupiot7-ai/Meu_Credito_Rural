'use client';

import { useCallback, useEffect, useState } from 'react';
import type { IdDaTela } from './diagnostico/fluxo.ts';
import {
  CHAVE_DO_DIAGNOSTICO,
  CHAVE_DO_DIAGNOSTICO_ANTIGO,
  lerEstadoSalvo,
  migrarDaVersao1,
  serializarEstado,
} from './diagnostico/persistencia.ts';
import type { EstadoSalvo } from './diagnostico/persistencia.ts';
import { respostasVazias } from './diagnostico/respostas-vazias.ts';
import type { RespostasDoDiagnostico } from './diagnostico/tipos.ts';

const estadoInicial: EstadoSalvo = { versao: 2, respostas: respostasVazias, telaAtual: 'perfil', salvoEm: null };

/**
 * Guarda o diagnóstico neste aparelho, a cada resposta.
 *
 * A conexão no campo cai. Se o navegador fechar ou o telefone tocar no meio
 * de uma pergunta, as respostas continuam aqui na volta.
 *
 * Todo acesso ao `localStorage` fica dentro de try/catch: navegação privada e
 * dados bloqueados fazem ele lançar erro, e um diagnóstico que trava é pior
 * do que um que esquece.
 */
export function useDiagnosticoSalvo() {
  const [estado, atualizarEstado] = useState<EstadoSalvo>(estadoInicial);
  /** Falso até a primeira leitura terminar, para nunca mostrar o valor vazio como se fosse o salvo. */
  const [restaurado, marcarComoRestaurado] = useState(false);
  const [voltouDeOndeParou, marcarVolta] = useState(false);
  /** Quantas respostas do diagnóstico antigo foram aproveitadas (0 quando nenhuma). */
  const [respostasAproveitadas, marcarAproveitadas] = useState(0);

  useEffect(() => {
    try {
      const salvo = lerEstadoSalvo(window.localStorage.getItem(CHAVE_DO_DIAGNOSTICO));
      if (salvo) {
        atualizarEstado(salvo);
        marcarVolta(true);
      } else {
        const migrado = migrarDaVersao1(window.localStorage.getItem(CHAVE_DO_DIAGNOSTICO_ANTIGO));
        if (migrado) {
          atualizarEstado(migrado.estado);
          marcarAproveitadas(migrado.respostasAproveitadas);
        }
      }
    } catch {
      // Sem armazenamento: o diagnóstico funciona, só não sobrevive a um recarregamento.
    } finally {
      marcarComoRestaurado(true);
    }
  }, []);

  /*
   * O próximo estado é calculado antes e gravado fora do atualizador do React:
   * atualizadores precisam ser puros, e em desenvolvimento o React os chama
   * duas vezes, o que gravaria duas vezes.
   */
  const gravar = useCallback((proximo: EstadoSalvo) => {
    const comHorario = { ...proximo, salvoEm: new Date().toISOString() };
    atualizarEstado(comHorario);
    try {
      window.localStorage.setItem(CHAVE_DO_DIAGNOSTICO, serializarEstado(comHorario));
    } catch {
      // Vale para esta visita, mesmo sem ficar salvo.
    }
  }, []);

  const atualizarRespostas = useCallback(
    (alteracao: Partial<RespostasDoDiagnostico>) => {
      gravar({ ...estado, respostas: { ...estado.respostas, ...alteracao } });
    },
    [estado, gravar],
  );

  const irParaTela = useCallback(
    (telaAtual: IdDaTela) => {
      gravar({ ...estado, telaAtual });
    },
    [estado, gravar],
  );

  /** Recomeçar é pedido explícito do produtor: apaga as duas versões deste aparelho. */
  const recomecar = useCallback(() => {
    atualizarEstado(estadoInicial);
    marcarVolta(false);
    marcarAproveitadas(0);
    try {
      window.localStorage.removeItem(CHAVE_DO_DIAGNOSTICO);
      window.localStorage.removeItem(CHAVE_DO_DIAGNOSTICO_ANTIGO);
    } catch {
      // Nada a limpar se o armazenamento nunca esteve disponível.
    }
  }, []);

  return {
    respostas: estado.respostas,
    telaAtual: estado.telaAtual,
    salvoEm: estado.salvoEm,
    restaurado,
    voltouDeOndeParou,
    respostasAproveitadas,
    atualizarRespostas,
    irParaTela,
    recomecar,
  };
}

/**
 * Diz se o navegador acredita estar conectado. Usado para avisar "Sua conexão
 * caiu. Suas respostas estão salvas neste aparelho." — o aviso tranquiliza
 * mais do que alarma.
 */
export function useConexao() {
  // Começa como conectado, para o aviso nunca piscar numa conexão boa.
  const [conectado, marcarConexao] = useState(true);

  useEffect(() => {
    const atualizar = () => marcarConexao(window.navigator.onLine);
    atualizar();
    window.addEventListener('online', atualizar);
    window.addEventListener('offline', atualizar);
    return () => {
      window.removeEventListener('online', atualizar);
      window.removeEventListener('offline', atualizar);
    };
  }, []);

  return conectado;
}
