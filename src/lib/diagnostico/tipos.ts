/**
 * Vocabulário do diagnóstico preventivo da safra.
 *
 * O caminho de um diagnóstico tem quatro formas de dado, nesta ordem:
 *
 *   RespostasDoDiagnostico  o que o produtor escolheu na tela (com faixas e "não sei")
 *        ↓ interpretar-respostas.ts
 *   DadosDaSafra            números prontos para a conta, cada um com a sua origem
 *        ↓ cenarios.ts
 *   ResultadoDoCenario      a conta feita para cada cenário (esperado, desfavorável, favorável)
 *        ↓ diagnosticar.ts
 *   ResultadoDoDiagnostico  o que a tela de resultado mostra
 *
 * Só tipos neste arquivo: nenhuma regra e nenhum número.
 */

/* ------------------------------------------------------------ respostas */

export type PerfilDoProdutor =
  /** "Já tenho custeio e quero entender minha situação." */
  | 'ja-tenho-custeio'
  /** "Estou planejando a próxima safra." */
  | 'planejando-safra';

export type Cultura = 'cafe-arabica' | 'cafe-conilon' | 'outra';

/**
 * Relação com a terra. A parceria já vem com a divisão da colheita, porque é
 * ela que muda a conta: a parte do dono da terra não é receita do produtor.
 */
export type PosseDaTerra =
  | 'propria'
  | 'arrendada'
  | 'parceria-dono-fica-com-um-quarto'
  | 'parceria-dono-fica-com-um-terco'
  | 'parceria-dono-fica-com-metade'
  | 'nao-sei';

/** O que protege a lavoura contra o clima. O produtor pode marcar mais de uma. */
export type ProtecaoDaLavoura =
  | 'irrigacao-em-toda-a-lavoura'
  | 'irrigacao-em-parte'
  | 'seguro-rural'
  | 'proagro'
  | 'pretendo-contratar-seguro'
  | 'nenhuma'
  | 'nao-sei';

export type LinhaDeCredito = 'pronaf' | 'pronamp' | 'funcafe' | 'linha-comum' | 'nao-sei';

/** Quanto da safra já tem preço fechado (venda antecipada, contrato). */
export type ParteComPrecoFechado =
  | 'nada'
  | 'ate-um-quarto'
  | 'de-um-quarto-a-metade'
  | 'mais-da-metade'
  | 'quase-toda'
  | 'nao-sei';

/** Só para quem já tem custeio: o que já aconteceu nesta safra. */
export type AcontecimentoDaSafra =
  | 'perda-por-clima-ou-praga'
  | 'parcela-atrasada'
  | 'ja-prorrogou'
  | 'ja-renegociou'
  | 'nada-disso';

/**
 * Como o produtor respondeu a uma pergunta de valor.
 * `null` no lugar de um `ValorInformado` quer dizer "ainda não respondeu".
 */
export type ValorInformado =
  | { forma: 'exato'; valor: number }
  /** `faixa` é o identificador de uma faixa definida em premissas.ts. */
  | { forma: 'faixa'; faixa: string }
  | { forma: 'nao-sei' };

/** Retirada da família aceita também "prefiro não informar". */
export type RetiradaDaFamilia = ValorInformado | { forma: 'prefiro-nao-informar' };

/**
 * O custo pode ser informado de três jeitos, porque cada produtor faz a
 * conta de um jeito: por hectare, por saca ou o total da safra. `valor: null`
 * quer dizer que ele já escolheu a forma, mas ainda não respondeu o valor.
 */
export type CustoInformado =
  | { base: 'por-hectare'; valor: ValorInformado | null }
  | { base: 'por-saca'; valor: ValorInformado | null }
  | { base: 'total-da-safra'; valor: ValorInformado | null }
  | { base: 'nao-sei' };

/**
 * Outros pagamentos que saem desta safra. `null` quer dizer que o produtor
 * não marcou aquele item: ele não tem esse pagamento.
 */
export type OutrosPagamentos = {
  parcelaDeInvestimento: ValorInformado | null;
  comprasAPrazoOuAdiantamento: ValorInformado | null;
  arrendamento: ValorInformado | null;
};

export type RespostasDoDiagnostico = {
  versao: 2;
  perfil: PerfilDoProdutor | null;
  cultura: Cultura | null;
  areaEmProducaoHectares: ValorInformado | null;
  posseDaTerra: PosseDaTerra | null;
  protecao: ProtecaoDaLavoura[];
  producaoEsperadaSacas: ValorInformado | null;
  producaoMediaSacas: ValorInformado | null;
  precoPorSaca: ValorInformado | null;
  custoDaSafra: CustoInformado | null;
  /** Quanto pegou (perfil A) ou pensa em pegar (perfil B) de custeio. */
  valorDoCusteio: ValorInformado | null;
  linhaDoCusteio: LinhaDeCredito | null;
  /** Só perfil A, opcional: quanto vai pagar na colheita, já com juros. */
  parcelaDoCusteioNaColheita: ValorInformado | null;
  /** Sacas prometidas para pagar insumos, CPR ou troca. Zero quando não há. */
  sacasPrometidas: ValorInformado | null;
  outrosPagamentos: OutrosPagamentos;
  parteComPrecoFechado: ParteComPrecoFechado | null;
  /** Só perfil A. */
  acontecimentosDaSafra: AcontecimentoDaSafra[];
  retiradaDaFamilia: RetiradaDaFamilia | null;
};

/* ------------------------------------------------------ dados da safra */

/** De onde veio um número usado na conta. É o que permite explicar cada um. */
export type OrigemDoNumero =
  | 'informado'
  | 'ponto-medio-da-faixa'
  | 'limite-da-faixa-aberta'
  | 'media-historica'
  | 'calculado'
  | 'estimado-sem-juros'
  | 'nao-sei'
  | 'nao-respondido'
  | 'nao-se-aplica';

export type NumeroComOrigem = { valor: number | null; origem: OrigemDoNumero };

/** As respostas já convertidas em números, prontas para a conta. */
export type DadosDaSafra = {
  /** `null` quando o produtor ainda não escolheu: o diagnóstico não é calculado. */
  perfil: PerfilDoProdutor | null;
  /** Produção esperada da lavoura inteira, em sacas. */
  producaoEsperadaTotal: NumeroComOrigem;
  /** A parte da produção esperada que é do produtor (sem a parte do dono da terra). */
  producaoPropriaEsperada: NumeroComOrigem;
  producaoMediaHistorica: NumeroComOrigem;
  precoPorSaca: NumeroComOrigem;
  /** Custo de produção da safra inteira, em reais, no cenário esperado. */
  custoTotalDaSafra: NumeroComOrigem;
  valorDoCusteio: NumeroComOrigem;
  /** O que sai na colheita para quitar o custeio, com juros quando possível. */
  parcelaDoCusteio: NumeroComOrigem;
  sacasPrometidas: NumeroComOrigem;
  /** Fração da produção própria com preço fechado, de 0 a 1. */
  parteComPrecoFechado: NumeroComOrigem;
  parcelaDeInvestimento: NumeroComOrigem;
  comprasAPrazoOuAdiantamento: NumeroComOrigem;
  arrendamento: NumeroComOrigem;
  retiradaDaFamilia: NumeroComOrigem;
  protecao: ProtecaoDaLavoura[];
  acontecimentos: AcontecimentoDaSafra[];
  /** Frases que explicam cada aproximação feita, para mostrar no resultado. */
  aproximacoes: string[];
};

/* ------------------------------------------------------------ cenários */

export type NomeDoCenario = 'esperado' | 'desfavoravel' | 'favoravel';

/** Variações aplicadas sobre o esperado. -0,2 = 20% a menos. */
export type HipotesesDoCenario = {
  variacaoDaProducao: number;
  variacaoDoPreco: number;
  variacaoDoCusto: number;
};

export type ResultadoDoCenario = {
  nome: NomeDoCenario;
  hipoteses: HipotesesDoCenario;
  /** A hipótese em palavras, para a tela: "20% menos café, preço 20% menor…". */
  hipoteseEmPalavras: string;
  /** Dinheiro da venda do café neste cenário. */
  receita: number;
  /** Parte do custo que não foi paga com crédito nem com café prometido. */
  custosPagosComRecursoProprio: number;
  /** Parcelas, compras a prazo, arrendamento e retirada da família. */
  compromissos: number;
  /** Receita − custos pagos com recurso próprio − compromissos. Negativo = falta. */
  recursosAposCompromissos: number;
};

/* ---------------------------------------------------- margem e resultado */

export type QuedaDePrecoSuportada =
  | { tipo: 'percentual'; valor: number }
  /** Nenhuma saca está exposta ao preço de mercado, ou a sobra aguenta qualquer queda. */
  | { tipo: 'preco-nao-ameaca-o-pagamento' };

export type MargemDeSeguranca =
  | {
      calculavel: true;
      /** Quanto a produção pode cair (fração e sacas) antes de a sobra chegar a zero. */
      quebraDeProducaoSuportada: { fracao: number; sacas: number };
      quedaDePrecoSuportada: QuedaDePrecoSuportada;
      /** `null` quando não há custo para comparar. */
      aumentoDeCustoSuportado: number | null;
      /**
       * Quanto a média histórica fica abaixo da produção esperada (fração).
       * `null` sem média, ou quando a média não fica abaixo.
       */
      mediaHistoricaAbaixoDaEsperada: number | null;
    }
  | { calculavel: false; motivo: string };

export type SituacaoDaSafra =
  | 'cobre-com-folga'
  | 'cobre-apertado'
  | 'nao-cobre'
  | 'dados-insuficientes';

export type IdDoFator =
  | 'sinais-de-dificuldade'
  | 'compromissos-maiores-que-a-receita'
  | 'safra-muito-prometida'
  | 'expectativa-acima-da-media'
  | 'margem-de-producao-curta'
  | 'preco-em-aberto'
  | 'combinacao-de-quedas'
  | 'custo-desconhecido'
  | 'sem-protecao-climatica'
  | 'compromissos-fora-do-banco';

export type FatorEncontrado = { id: IdDoFator; titulo: string; explicacao: string };

export type IdDoProximoPasso =
  | 'descobrir-dado-que-falta'
  | 'comunicar-perda-ao-seguro'
  | 'entender-prorrogacao-e-renegociacao'
  | 'revisar-plano-antes-de-contratar'
  | 'revisar-safra-prometida'
  | 'entender-formas-de-garantir-preco'
  | 'avaliar-seguro-ou-proagro'
  | 'firmar-os-numeros'
  | 'guardar-e-refazer';

export type ProximoPasso = { id: IdDoProximoPasso; titulo: string; descricao: string };

/**
 * Um critério da MP 1.376/2026, a ser preenchido depois da validação
 * jurídica. Enquanto houver critério sem validação, a MP não é avaliada.
 */
export type CriterioDaMp = {
  nome: string;
  /** O texto da regra, como a validação jurídica definir. */
  regra: string;
  /** Que informação do produtor a regra precisa. */
  dadoNecessario: string;
  /** Artigo da MP ou norma de onde a regra vem. */
  fonte: string;
  validado: boolean;
};

export type LeituraDaMpNoDiagnostico = {
  estado: 'nao-avaliada';
  motivo: string;
  criteriosPendentes: string[];
};

/** Uma premissa do motor como ela aparece na tela: sempre como hipótese. */
export type PremissaExibida = { nome: string; valorEmPalavras: string; aValidar: boolean };

export type ResultadoDoDiagnostico = {
  situacao: SituacaoDaSafra;
  /** Rótulo curto do selo de situação. Descreve a safra, nunca a pessoa. */
  rotuloDaSituacao: string;
  /** "O que isso significa", numa frase. */
  frase: string;
  /** O que falta para calcular. Vazio quando a conta foi feita. */
  dadosQueFaltam: string[];
  /** `null` quando faltam dados para calcular. */
  cenarios: Record<NomeDoCenario, ResultadoDoCenario> | null;
  margem: MargemDeSeguranca;
  /** No máximo três, do que mais pesou para o que menos pesou. */
  fatores: FatorEncontrado[];
  aproximacoes: string[];
  premissasUsadas: PremissaExibida[];
  proximoPasso: ProximoPasso;
  /** Mostrar o bloco de renegociação e da MP (só quando já há dificuldade). */
  mostrarCaminhosDeRenegociacao: boolean;
  /** Leitura da MP, só quando os caminhos de renegociação aparecem. */
  mp: LeituraDaMpNoDiagnostico | null;
};
