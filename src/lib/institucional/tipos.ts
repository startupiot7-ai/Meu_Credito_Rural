/**
 * Vocabulário da área institucional.
 *
 * Tudo aqui descreve a carteira de uma cooperativa ou sindicato de forma
 * agregada. Não existe, de propósito, um tipo que represente um produtor
 * identificado — a única exceção é `ProdutorQueAutorizouEstaInstituicao`,
 * usado somente para quem deu consentimento específico a esta instituição.
 */

/** As três faixas usadas em todo o produto: verde, amarelo e vermelho. */
export type FaixaDeRisco = 'saudavel' | 'atencao' | 'risco';

export type ProdutoresPorFaixa = Record<FaixaDeRisco, number>;

/** Um pedaço da carteira: um núcleo, uma faixa de porte, uma cultura. */
export type SegmentoDaCarteira = {
  nome: string;
  produtoresComDiagnostico: number;
  produtoresPorFaixa: ProdutoresPorFaixa;
  /** Soma da receita projetada informada pelos produtores do segmento, em reais. */
  receitaProjetada: number;
  /** Soma das dívidas informadas pelos produtores do segmento, em reais. */
  dividaInformada: number;
};

/** Uma forma de dividir a carteira em segmentos. */
export type RecorteDaCarteira = {
  identificador: 'nucleo' | 'porte' | 'cultura';
  rotulo: string;
  segmentos: SegmentoDaCarteira[];
};

/**
 * Leitura indicativa da MP 1.376/2026, feita a partir das respostas do
 * diagnóstico. Não é uma verificação de elegibilidade.
 */
export type LeituraIndicativaDaMp = {
  aparentementeAtendemOsCriterios: number;
  precisamDeMaisInformacoes: number;
  aparentementeNaoAtendem: number;
};

export type EtapaDaOriginacao =
  | 'aguardando-contato'
  | 'em-conversa'
  | 'proposta-apresentada'
  | 'operacao-concluida';

/**
 * Produtor que autorizou, de forma específica e revogável, ser apresentado a
 * ESTA instituição. Só nesse caso ele deixa de ser apenas um número agregado.
 */
export type ProdutorQueAutorizouEstaInstituicao = {
  referencia: string;
  faixa: FaixaDeRisco;
  percentualDaReceitaComprometido: number;
  etapa: EtapaDaOriginacao;
  /** Data do consentimento, no formato ISO. */
  autorizadoEm: string;
};

export type OriginacaoQualificada = {
  /** Autorizaram ser apresentados a pelo menos uma instituição participante. */
  autorizaramAlgumaInstituicao: number;
  /** Destes, quantos incluíram esta instituição na autorização. */
  autorizaramEstaInstituicao: number;
  /** Autorizaram outras instituições, mas não esta. Aparecem só como número. */
  autorizaramSomenteOutrasInstituicoes: number;
  /** Retiraram a autorização nos últimos 90 dias. */
  revogaramNosUltimos90Dias: number;
  quantidadePorEtapa: Record<EtapaDaOriginacao, number>;
  produtoresQueAutorizaramEstaInstituicao: ProdutorQueAutorizouEstaInstituicao[];
};

export type CarteiraDaInstituicao = {
  nomeDaInstituicao: string;
  /** Data da última atualização dos números, no formato ISO. */
  atualizadoEm: string;
  /** Associados cadastrados pela instituição para acompanhamento. */
  produtoresAcompanhados: number;
  produtoresComDiagnostico: number;
  produtoresPorFaixa: ProdutoresPorFaixa;
  receitaProjetadaTotal: number;
  dividaInformadaTotal: number;
  /** Parte da dívida total que está com produtores da faixa vermelha. */
  dividaNaFaixaDeRisco: number;
  leituraDaMp: LeituraIndicativaDaMp;
  recortes: RecorteDaCarteira[];
  originacao: OriginacaoQualificada;
};

/** Instituição que pode receber produtores pela originação qualificada. */
export type InstituicaoParticipante = {
  identificador: string;
  nome: string;
  tipo: string;
};
