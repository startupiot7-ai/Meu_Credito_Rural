'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  autorizarInstituicao,
  consentimentoInicial,
  revogarInstituicao,
  revogarTodasAsInstituicoes,
} from './consentimento';
import type { ConsentimentoDeOriginacao } from './consentimento';

const CHAVE_NO_DISPOSITIVO = 'mcr:consentimento-originacao:v1';

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

  useEffect(() => {
    try {
      const salvo = window.localStorage.getItem(CHAVE_NO_DISPOSITIVO);
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
      window.localStorage.setItem(CHAVE_NO_DISPOSITIVO, JSON.stringify(novoConsentimento));
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

  return { consentimento, carregado, autorizar, revogar, revogarTodas };
}
