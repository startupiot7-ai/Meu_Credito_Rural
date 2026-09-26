'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  autorizarEstatistica,
  consentimentoEstatisticoInicial,
  revogarEstatistica,
} from './consentimento-estatistico';
import type { ConsentimentoEstatistico } from './consentimento-estatistico';

const CHAVE_DO_CONSENTIMENTO_ESTATISTICO = 'mcr:consentimento-estatistico:v1';

/**
 * Guarda neste aparelho a escolha sobre estatísticas anônimas.
 *
 * PROTÓTIPO: não há servidor, então nada é enviado de fato. Na versão real, a
 * escolha precisa ser registrada no servidor, com data e versão do texto, e só
 * as respostas de quem autorizou podem entrar nas estatísticas.
 *
 * Se o armazenamento falhar ou estiver vazio, vale o estado inicial: não
 * autorizado. Na dúvida, nunca se presume um "sim".
 */
export function useConsentimentoEstatistico() {
  const [consentimento, atualizarConsentimento] = useState<ConsentimentoEstatistico>(consentimentoEstatisticoInicial);
  const [carregado, marcarComoCarregado] = useState(false);

  useEffect(() => {
    try {
      const salvo = window.localStorage.getItem(CHAVE_DO_CONSENTIMENTO_ESTATISTICO);
      if (salvo) {
        const lido = JSON.parse(salvo) as Partial<ConsentimentoEstatistico>;
        atualizarConsentimento({
          autorizado: lido.autorizado === true,
          autorizadoEm: lido.autorizado === true ? (lido.autorizadoEm ?? null) : null,
          historico: lido.historico ?? [],
        });
      }
    } catch {
      // Sem armazenamento: segue não autorizado.
    } finally {
      marcarComoCarregado(true);
    }
  }, []);

  const salvar = useCallback((novo: ConsentimentoEstatistico) => {
    atualizarConsentimento(novo);
    try {
      window.localStorage.setItem(CHAVE_DO_CONSENTIMENTO_ESTATISTICO, JSON.stringify(novo));
    } catch {
      // A escolha vale para esta visita, mesmo que não fique salva.
    }
  }, []);

  const alterar = useCallback(
    (autorizar: boolean) => {
      const agora = new Date().toISOString();
      salvar(autorizar ? autorizarEstatistica(consentimento, agora) : revogarEstatistica(consentimento, agora));
    },
    [consentimento, salvar],
  );

  return { consentimento, carregado, alterar };
}
