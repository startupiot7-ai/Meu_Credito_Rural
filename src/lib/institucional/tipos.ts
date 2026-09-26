/**
 * Vocabulário da área institucional.
 *
 * Tudo aqui descreve a carteira de uma cooperativa de forma agregada. Não
 * existe, de propósito, um tipo que represente um produtor identificado — a
 * única exceção é `PedidoDeConversa`, de quem autorizou ESTA instituição, e
 * mesmo assim só com o resumo que o produtor viu antes de autorizar.
 *
 * Só entram nos números os produtores que concluíram o diagnóstico E
 * autorizaram o uso anônimo das respostas para estatísticas (consentimento 1).
 */
import type { LinhaCompartilhada } from '../consentimento/resumo-compartilhado.ts';
import type { SituacaoDaSafra } from '../diagnostico/tipos.ts';

/**
 * As três situações da safra, as mesmas que o produtor vê no resultado dele.
 * "Faltam dados" não entra no painel: sem conta, não há situação para somar.
 */
export type SituacaoNoPainel = Exclude<SituacaoDaSafra, 'dados-insuficientes'>;

export type ProdutoresPorSituacao = Record<SituacaoNoPainel, number>;

/**
 * Faixas de exibição da margem de segurança (quanto a colheita pode cair
 * antes de faltar dinheiro). São só para agrupar no painel: não mudam o
 * diagnóstico de ninguém. "Sem margem" é quem já não cobre no esperado.
 */
export type FaixaDaMargem = 'sem-margem' | 'ate-10' | 'de-10-a-20' | 'de-20-a-30' | 'acima-de-30';

export type ProdutoresPorMargem = Record<FaixaDaMargem, number>;

export type ExposicaoClimatica = {
  /** Seguro rural, Proagro ou irrigação em toda a lavoura. */
  protegidos: number;
  /** Só irrigação em parte da lavoura. */
  protecaoParcial: number;
  semProtecao: number;
  naoSouberamDizer: number;
};

/** Um pedaço da carteira: um núcleo, uma faixa de porte, uma cultura. */
export type SegmentoDaCarteira = {
  nome: string;
  produtoresComDiagnostico: number;
  produtoresPorSituacao: ProdutoresPorSituacao;
  /** Com café prometido (barter, CPR) ou compras a prazo na revenda. */
  comCompromissosForaDoBanco: number;
};

/** Uma forma de dividir a carteira em segmentos. */
export type RecorteDaCarteira = {
  identificador: 'nucleo' | 'porte' | 'cultura';
  rotulo: string;
  segmentos: SegmentoDaCarteira[];
};

/**
 * Produtor que pediu, de forma específica e revogável, para ESTA instituição
 * conversar com ele. Não há etapa de venda: o painel não acompanha "proposta"
 * nem "operação concluída", porque o diagnóstico não existe para vender crédito.
 */
export type PedidoDeConversa = {
  referencia: string;
  situacao: SituacaoNoPainel;
  /** Exatamente as linhas que o produtor viu antes de autorizar. */
  resumo: LinhaCompartilhada[];
  /** Data da autorização, no formato ISO. */
  autorizadoEm: string;
};

export type PedidosDeConversa = {
  /** Autorizaram ser apresentados a pelo menos uma instituição participante. */
  autorizaramAlgumaInstituicao: number;
  /** Destes, quantos incluíram esta instituição na autorização. */
  autorizaramEstaInstituicao: number;
  /** Autorizaram outras instituições, mas não esta. Aparecem só como número. */
  autorizaramSomenteOutrasInstituicoes: number;
  /** Retiraram a autorização nos últimos 90 dias. */
  revogaramNosUltimos90Dias: number;
  pedidos: PedidoDeConversa[];
};

export type CarteiraDaInstituicao = {
  nomeDaInstituicao: string;
  /** Data da última atualização dos números, no formato ISO. */
  atualizadoEm: string;
  /** Associados cadastrados pela instituição para acompanhamento. */
  produtoresAcompanhados: number;
  /** Concluíram o diagnóstico e autorizaram o uso anônimo para estatísticas. */
  produtoresComDiagnostico: number;
  produtoresPorSituacao: ProdutoresPorSituacao;
  produtoresPorMargem: ProdutoresPorMargem;
  exposicaoClimatica: ExposicaoClimatica;
  comCompromissosForaDoBanco: number;
  /** Já têm parte da safra com preço fechado. */
  comPrecoFechado: number;
  porPerfil: { jaTemCusteio: number; planejandoSafra: number };
  /** Já têm custeio e relataram parcela atrasada, prorrogação ou renegociação. */
  comSinaisDeDificuldade: number;
  recortes: RecorteDaCarteira[];
  pedidosDeConversa: PedidosDeConversa;
};

/** Instituição que o produtor pode autorizar a conversar com ele. */
export type InstituicaoParticipante = {
  identificador: string;
  nome: string;
  tipo: string;
};
