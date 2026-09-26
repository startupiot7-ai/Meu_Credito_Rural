'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  autorizarInstituicao,
  consentimentoInicial,
  revogarInstituicao,
  revogarTodasAsInstituicoes,
} from './consentimento';
import type { ConsentimentoDeOriginacao } from './consentimento';

/**
 * Versão 2: o que é compartilhado passou a ser o resumo do diagnóstico
 * preventivo (situação, margem e fator principal). Uma autorização dada na
 * versão 1 valia para outro conteúdo, então ela NÃO é herdada: todas as
 * instituições voltam a ficar desligadas, e a tela explica o motivo.
 */
const CHAVE_DO_CONSENTIMENTO = 'mcr:consentimento-originacao:v2';
const CHAVE_DO_CONSENTIMENTO_ANTIGO = 'mcr:consentimento-originacao:v1';

/**
 * Guarda as autorizações do produtor neste dispositivo.
 *
 * PROTÓTIPO: na versão real, o consentimento precisa ser registrado no
 * servidor, com data e versão do texto apresentado, para valer como prova.
 * Aqui ele fica só no navegador, como as respostas do diagnóstico.
 *
 * Se o armazenamento falhar ou estiver vazio, o estado é sempre o inicial:
 * nenhuma instituição autorizada. Na dúvida, nunca se presume um "sim".
 */
export function useConsentimentoDeOriginacao() {
  const [consentimento, atualizarConsentimento] =
    useState<ConsentimentoDeOriginacao>(consentimentoInicial);
  const [carregado, marcarComoCarregado] = useState(false);
  /** Havia autorização na versão antiga, que não vale para o conteúdo novo. */
  const [haviaAutorizacaoAntiga, marcarAutorizacaoAntiga] = useState(false);

  useEffect(() => {
    try {
      const antigo = window.localStorage.getItem(CHAVE_DO_CONSENTIMENTO_ANTIGO);
      const antigoLido = antigo ? (JSON.parse(antigo) as Partial<ConsentimentoDeOriginacao>) : null;
      marcarAutorizacaoAntiga(Object.keys(antigoLido?.autorizacoesAtivas ?? {}).length > 0);

      const salvo = window.localStorage.getItem(CHAVE_DO_CONSENTIMENTO);
      if (salvo) {
        const lido = JSON.parse(salvo) as Partial<ConsentimentoDeOriginacao>;
        atualizarConsentimento({
          autorizacoesAtivas: lido.autorizacoesAtivas ?? {},
          historico: lido.historico ?? [],
        });
      }
    } catch {
      // Sem armazenamento: segue com nenhuma autorização.
    } finally {
      marcarComoCarregado(true);
    }
  }, []);

  const salvar = useCallback((novoConsentimento: ConsentimentoDeOriginacao) => {
    atualizarConsentimento(novoConsentimento);
    try {
      window.localStorage.setItem(CHAVE_DO_CONSENTIMENTO, JSON.stringify(novoConsentimento));
    } catch {
      // A escolha vale para esta visita, mesmo que não fique salva.
    }
  }, []);

  const autorizar = useCallback(
    (identificadorDaInstituicao: string) =>
      salvar(autorizarInstituicao(consentimento, identificadorDaInstituicao, new Date().toISOString())),
    [consentimento, salvar],
  );

  const revogar = useCallback(
    (identificadorDaInstituicao: string) =>
      salvar(revogarInstituicao(consentimento, identificadorDaInstituicao, new Date().toISOString())),
    [consentimento, salvar],
  );

  const revogarTodas = useCallback(
    () => salvar(revogarTodasAsInstituicoes(consentimento, new Date().toISOString())),
    [consentimento, salvar],
  );

  return { consentimento, carregado, haviaAutorizacaoAntiga, autorizar, revogar, revogarTodas };
}
