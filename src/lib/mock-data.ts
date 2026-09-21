/**
 * Sample data for the front-end prototype.
 *
 * MOCK DATA — none of this comes from a server and none of it is a real
 * analysis. It exists so the interface can be reviewed end to end before the
 * diagnostic engine is built. Anything that looks like a calculation here is a
 * placeholder with the same *shape* as the real result, never the real logic.
 *
 * The figures follow the reference case used across the product brief:
 * 500 sacas · R$ 1.500/saca · receita bruta projetada R$ 750.000 ·
 * dívida informada R$ 300.000 · comprometimento 40%.
 */

/* ------------------------------------------------- debt impact simulator */

export const simulatorDefaults = {
  /** Sacas de café esperadas na safra. */
  expectedBags: 500,
  /** Preço estimado por saca, em reais. */
  pricePerBag: 1500,
  /** Dívida rural informada pelo produtor, em reais. */
  debt: 300_000,
} as const;

/* ---------------------------------------------------- conditions compare */

export type CreditScenario = {
  id: string;
  /** Short pt-BR name, e.g. "Condição atual". */
  name: string;
  /** Annual payment in reais — the single measure being compared. */
  annualPayment: number;
  /**
   * One plain line carrying term and grace period as words. Replaces the old
   * three-column table: read as a sentence, not decoded as data.
   */
  plain: string;
  /** Whether this row is the one worth looking at first. */
  highlighted?: boolean;
};

/**
 * MOCK: three shapes a renegotiation *could* take. These are illustrations of
 * how conditions differ, not offers and not predictions.
 */
export const creditScenarios: CreditScenario[] = [
  {
    id: 'atual',
    name: 'Condição atual',
    annualPayment: 120_000,
    plain: 'O que está contratado hoje: 3 anos para terminar de pagar.',
  },
  {
    id: 'alongamento',
    name: 'Prazo mais longo',
    annualPayment: 78_000,
    plain:
      'A mesma dívida em 6 anos. A parcela de cada ano cai, e o total pago ao longo do tempo tende a subir.',
    highlighted: true,
  },
  {
    id: 'carencia',
    name: 'Prazo maior com carência',
    annualPayment: 88_000,
    plain:
      'Uma safra sem pagar a parcela principal — a carência — e depois 6 anos de parcelas menores.',
  },
];

/* ------------------------------------------------------- action plan preview */

export type ActionStep = {
  id: string;
  title: string;
  description: string;
  /** Roughly how long this step takes, in the producer's words. */
  effort: string;
  state: 'done' | 'current' | 'upcoming';
};

/** MOCK: the shape of a plan, so the section can show what "agir" looks like. */
export const actionPlan: ActionStep[] = [
  {
    id: 'reunir',
    title: 'Reúna os documentos da dívida',
    description:
      'O contrato e o extrato mais recente de cada operação. Se estiverem no papel, uma foto legível já serve.',
    effort: 'cerca de 15 minutos',
    state: 'done',
  },
  {
    id: 'confirmar',
    title: 'Confirme o saldo devedor com a instituição',
    description:
      'Peça o valor atualizado por escrito. É esse número que sustenta qualquer conversa sobre alternativas.',
    effort: 'uma ligação ou visita',
    state: 'current',
  },
  {
    id: 'comparar',
    title: 'Compare as condições possíveis',
    description:
      'Com o saldo confirmado, dá para ver o que muda em cada alternativa: parcela por ano, prazo e carência.',
    effort: 'cerca de 10 minutos',
    state: 'upcoming',
  },
  {
    id: 'conversar',
    title: 'Leve a conversa para a instituição',
    description:
      'Você chega com os números organizados e sabendo o que perguntar. A decisão continua sendo da instituição.',
    effort: 'no seu tempo',
    state: 'upcoming',
  },
];

/* ---------------------------------------------------------------- FAQ */

export type FaqItem = { question: string; answer: string };

export const faq: FaqItem[] = [
  {
    question: 'O Meu Crédito Rural é um banco?',
    answer:
      'Não. Não emprestamos dinheiro nem cobramos dívidas. Ajudamos você a entender a sua situação e quais caminhos existem.',
  },
  {
    question: 'Vocês renegociam minha dívida?',
    answer:
      'Não. Quem renegocia é a instituição com quem você tem a dívida. Nós organizamos os números para você chegar nessa conversa sabendo o que perguntar.',
  },
  {
    question: 'O diagnóstico garante que tenho direito a renegociação?',
    answer:
      'Não garante. Ele é indicativo e trabalha com as informações que você forneceu. A análise e a decisão final são sempre da instituição financeira.',
  },
  {
    question: 'O que é CPR?',
    answer:
      'Cédula de Produto Rural: você recebe recursos agora e se compromete a entregar produto ou pagar um valor na colheita.',
  },
  {
    question: 'Preciso entender de finanças para usar?',
    answer:
      'Não. Se você sabe quanto espera colher e quanto deve, já dá para começar. Cada termo técnico vem explicado na mesma frase.',
  },
  {
    question: 'Quais informações preciso ter em mãos?',
    answer:
      'Uma estimativa de quanto você espera colher, o preço por saca e quanto deve hoje. Contrato e extrato ajudam depois, mas não são necessários para começar.',
  },
];

/* -------------------------------------------------- diagnostic results mock */

export type Finding = {
  /** "confirmed" renders ✅, "pending" renders ⚠. Nothing else exists. */
  kind: 'confirmed' | 'pending';
  text: string;
};

/**
 * MOCK: the transparent reasoning shown on the results screen.
 *
 * Deliberately *not* a score. Each line is something the producer told us or
 * something we still need, written so they can check it themselves.
 */
export const sampleFindings: Finding[] = [
  {
    kind: 'confirmed',
    text: 'Você informou perdas de produção no período analisado.',
  },
  {
    kind: 'confirmed',
    text: 'A redução estimada de receita supera o critério analisado.',
  },
  {
    kind: 'confirmed',
    text: 'A dívida informada está dentro da faixa avaliada para alternativas de alongamento de prazo.',
  },
  {
    kind: 'pending',
    text: 'Ainda precisamos confirmar um documento: o extrato atualizado da operação.',
  },
];
