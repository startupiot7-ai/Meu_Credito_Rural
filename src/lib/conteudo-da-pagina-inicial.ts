/**
 * Textos e números de exemplo da página inicial.
 *
 * Os números da simulação rápida são FICTÍCIOS: só preenchem os campos para
 * a conta aparecer na primeira visita. Não são referência de mercado.
 */

/** Números de partida da simulação rápida. Mostram uma safra apertada de propósito. */
export const valoresIniciaisDaSimulacao = {
  producaoEsperadaSacas: 500,
  precoPorSaca: 1500,
  custoTotalDaSafra: 500_000,
  valorDoCusteio: 300_000,
} as const;

/* ------------------------------------------------------ plano de ação */

export type PassoDoPlano = {
  id: string;
  titulo: string;
  descricao: string;
  /** Quanto tempo o passo leva, nas palavras do produtor. */
  esforco: string;
  estado: 'feito' | 'agora' | 'depois';
};

/** Como é um plano: passos em ordem, com detalhe só no passo atual. */
export const planoDeExemplo: PassoDoPlano[] = [
  {
    id: 'contar',
    titulo: 'Conte como é a sua safra',
    descricao: 'Produção, preço, custo e o custeio que você pensa em pegar.',
    esforco: 'cerca de 5 minutos',
    estado: 'feito',
  },
  {
    id: 'prometido',
    titulo: 'Confira o que já está prometido',
    descricao:
      'Barter, CPR e compras a prazo na revenda saem da mesma safra que o custeio. Somados, mostram quanto sobra de verdade.',
    esforco: 'uma conversa com a revenda ou a cooperativa',
    estado: 'agora',
  },
  {
    id: 'pior',
    titulo: 'Veja se a safra aguenta um ano pior',
    descricao: 'Menos café, preço menor e custo maior ao mesmo tempo.',
    esforco: 'na hora, no resultado',
    estado: 'depois',
  },
  {
    id: 'decidir',
    titulo: 'Decida com os números na mão',
    descricao: 'Contratar, ajustar o valor ou esperar: a decisão é sua.',
    esforco: 'no seu tempo',
    estado: 'depois',
  },
];

/* ------------------------------------------------ perguntas frequentes */

export type PerguntaFrequente = { pergunta: string; resposta: string };

export const perguntasFrequentes: PerguntaFrequente[] = [
  {
    pergunta: 'O Meu Crédito Rural é um banco?',
    resposta:
      'Não. Não emprestamos dinheiro, não cobramos dívidas e não ganhamos com o crédito que você contrata. Ajudamos você a ver se a safra sustenta o crédito.',
  },
  {
    pergunta: 'Vocês recomendam contratar crédito?',
    resposta:
      'Não. O diagnóstico mostra o que acontece com a sua safra em três cenários. Contratar, ajustar o valor ou esperar é decisão sua. Nenhuma instituição influencia o resultado.',
  },
  {
    pergunta: 'O resultado é uma nota de crédito?',
    resposta:
      'Não. Não existe nota nem score. Você vê quanto sobra ou falta se a safra vier como espera, pior ou melhor, e quanto ela pode piorar antes de faltar dinheiro.',
  },
  {
    pergunta: 'E se eu já estou com dificuldade para pagar?',
    resposta:
      'O diagnóstico também serve para quem já tem custeio. Se a conta já não fecha, ele mostra que prorrogação e renegociação existem e o que perguntar à instituição. Medidas como a MP 1.376/2026 podem se aplicar a casos específicos; os critérios dela ainda estão sendo confirmados.',
  },
  {
    pergunta: 'Preciso de CPF ou documentos?',
    resposta:
      'Não. O diagnóstico não pede CPF, nome nem endereço, e as respostas ficam no seu aparelho. Você apaga quando quiser.',
  },
  {
    pergunta: 'Quais informações preciso ter em mãos?',
    resposta:
      'Quanto espera colher, a média das últimas safras, o preço que espera, o custo da lavoura e o custeio. Se não souber algum número, dá para escolher uma faixa ou responder "não sei".',
  },
  {
    pergunta: 'De onde vêm as hipóteses dos cenários?',
    resposta:
      'São hipóteses de simulação, como "20% menos café", ainda em validação com fontes como Conab, Cepea e Embrapa. Elas aparecem sempre no resultado, para você conferir.',
  },
  {
    pergunta: 'O que é CPR e barter?',
    resposta:
      'CPR é a Cédula de Produto Rural: você recebe recursos agora e se compromete a entregar café ou pagar na colheita. Barter é trocar parte da safra por insumos. Nos dois casos, parte do café já tem dono antes de ser colhido.',
  },
];
