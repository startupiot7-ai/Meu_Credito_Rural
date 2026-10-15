/**
 * Consentimento do produtor para que instituições conversem com ele
 * ("pedidos de conversa"). É o consentimento 2, separado do consentimento
 * de uso anônimo para estatísticas (consentimento-estatistico.ts).
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

const ehObjetoSimples = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === 'object' && valor !== null && !Array.isArray(valor);

/**
 * Reconstrói o consentimento a partir de um valor lido do armazenamento, que
 * pode estar corrompido ou adulterado. Na dúvida, não há autorização: só
 * entram autorizações com data em texto e registros de histórico completos.
 */
export function consentimentoDeValorSalvo(valor: unknown): ConsentimentoDeOriginacao {
  if (!ehObjetoSimples(valor)) return { autorizacoesAtivas: {}, historico: [] };

  const autorizacoesAtivas: Record<string, string> = {};
  if (ehObjetoSimples(valor.autorizacoesAtivas)) {
    for (const [instituicao, momento] of Object.entries(valor.autorizacoesAtivas)) {
      if (typeof momento === 'string' && momento !== '') autorizacoesAtivas[instituicao] = momento;
    }
  }

  const historico: RegistroDeConsentimento[] = [];
  if (Array.isArray(valor.historico)) {
    for (const registro of valor.historico) {
      if (
        ehObjetoSimples(registro) &&
        typeof registro.identificadorDaInstituicao === 'string' &&
        (registro.acao === 'autorizou' || registro.acao === 'revogou') &&
        typeof registro.em === 'string'
      ) {
        historico.push({
          identificadorDaInstituicao: registro.identificadorDaInstituicao,
          acao: registro.acao,
          em: registro.em,
        });
      }
    }
  }

  return { autorizacoesAtivas, historico };
}

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
