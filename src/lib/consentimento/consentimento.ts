/**
 * Consentimento do produtor para a originação qualificada.
 *
 * REGRA OBRIGATÓRIA (LGPD): o consentimento começa DESLIGADO para todas as
 * instituições. Só uma ação explícita do produtor, instituição por
 * instituição, liga uma autorização. Nunca crie um estado inicial com alguma
 * instituição autorizada, nem "autorize todas" como atalho.
 *
 * Retirar a autorização precisa ser tão fácil quanto dar: uma ação só, com
 * efeito imediato.
 *
 * Sem imports, para ser lido e testado sozinho.
 */

export type AcaoDoProdutor = 'autorizou' | 'revogou';

export type RegistroDeConsentimento = {
  identificadorDaInstituicao: string;
  acao: AcaoDoProdutor;
  /** Momento da ação, no formato ISO. */
  em: string;
};

export type ConsentimentoDeOriginacao = {
  /** Instituição -> momento em que foi autorizada. Ausente = não autorizada. */
  autorizacoesAtivas: Record<string, string>;
  /** Histórico de tudo o que o produtor decidiu, para ele mesmo conferir. */
  historico: RegistroDeConsentimento[];
};

/** Estado inicial: nenhuma instituição autorizada. Não altere isto. */
export const consentimentoInicial: ConsentimentoDeOriginacao = {
  autorizacoesAtivas: {},
  historico: [],
};

export function instituicaoEstaAutorizada(
  consentimento: ConsentimentoDeOriginacao,
  identificadorDaInstituicao: string,
): boolean {
  return identificadorDaInstituicao in consentimento.autorizacoesAtivas;
}

export function quantidadeDeInstituicoesAutorizadas(consentimento: ConsentimentoDeOriginacao): number {
  return Object.keys(consentimento.autorizacoesAtivas).length;
}

export function autorizarInstituicao(
  consentimento: ConsentimentoDeOriginacao,
  identificadorDaInstituicao: string,
  agora: string,
): ConsentimentoDeOriginacao {
  if (instituicaoEstaAutorizada(consentimento, identificadorDaInstituicao)) return consentimento;
  return {
    autorizacoesAtivas: { ...consentimento.autorizacoesAtivas, [identificadorDaInstituicao]: agora },
    historico: [
      ...consentimento.historico,
      { identificadorDaInstituicao, acao: 'autorizou', em: agora },
    ],
  };
}

export function revogarInstituicao(
  consentimento: ConsentimentoDeOriginacao,
  identificadorDaInstituicao: string,
  agora: string,
): ConsentimentoDeOriginacao {
  if (!instituicaoEstaAutorizada(consentimento, identificadorDaInstituicao)) return consentimento;
  const autorizacoesQueContinuam = { ...consentimento.autorizacoesAtivas };
  delete autorizacoesQueContinuam[identificadorDaInstituicao];
  return {
    autorizacoesAtivas: autorizacoesQueContinuam,
    historico: [
      ...consentimento.historico,
      { identificadorDaInstituicao, acao: 'revogou', em: agora },
    ],
  };
}

/** Retira todas as autorizações de uma vez. Existe só no sentido de revogar. */
export function revogarTodasAsInstituicoes(
  consentimento: ConsentimentoDeOriginacao,
  agora: string,
): ConsentimentoDeOriginacao {
  return Object.keys(consentimento.autorizacoesAtivas).reduce(
    (consentimentoAtual, identificador) => revogarInstituicao(consentimentoAtual, identificador, agora),
    consentimento,
  );
}
