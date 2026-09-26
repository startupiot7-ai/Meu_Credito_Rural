/**
 * Consentimento 1: uso anônimo das respostas para estatísticas.
 *
 * É separado do consentimento 2 (instituições que podem conversar com o
 * produtor, em consentimento.ts). Um não depende do outro, e nenhum dos dois
 * muda o diagnóstico: ele é o mesmo, gratuito, para quem diz sim ou não.
 *
 * REGRA OBRIGATÓRIA (LGPD): começa DESLIGADO. Só uma ação explícita do
 * produtor liga, e desligar é tão fácil quanto ligar. Só quem ligou entra nos
 * números agregados do painel das cooperativas.
 *
 * Sem imports, para ser lido e testado sozinho.
 */

export type RegistroDoConsentimentoEstatistico = {
  acao: 'autorizou' | 'revogou';
  /** Momento da ação, no formato ISO. */
  em: string;
};

export type ConsentimentoEstatistico = {
  autorizado: boolean;
  /** Momento da autorização em vigor, ou `null` quando desligado. */
  autorizadoEm: string | null;
  /** Tudo o que o produtor decidiu, para ele mesmo conferir. */
  historico: RegistroDoConsentimentoEstatistico[];
};

/** Estado inicial: não autorizado. Não altere isto. */
export const consentimentoEstatisticoInicial: ConsentimentoEstatistico = {
  autorizado: false,
  autorizadoEm: null,
  historico: [],
};

export function autorizarEstatistica(consentimento: ConsentimentoEstatistico, agora: string): ConsentimentoEstatistico {
  if (consentimento.autorizado) return consentimento;
  return {
    autorizado: true,
    autorizadoEm: agora,
    historico: [...consentimento.historico, { acao: 'autorizou', em: agora }],
  };
}

export function revogarEstatistica(consentimento: ConsentimentoEstatistico, agora: string): ConsentimentoEstatistico {
  if (!consentimento.autorizado) return consentimento;
  return {
    autorizado: false,
    autorizadoEm: null,
    historico: [...consentimento.historico, { acao: 'revogou', em: agora }],
  };
}
