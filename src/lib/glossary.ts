/**
 * Plain-language glossary.
 *
 * Product rule: a technical term is never shown on its own. Wherever one of
 * these appears in the interface it is wrapped in `<Term>`, which attaches the
 * definition below as a tooltip and as inline text for screen readers.
 * The definitions are written for someone who has never worked in a bank.
 */

export type GlossaryEntry = {
  /** The abbreviation or term exactly as it appears in the interface. */
  term: string;
  /** What it stands for, when it is an acronym. */
  expansion?: string;
  /** One sentence, no jargon, no second technical term inside it. */
  definition: string;
};

export const glossary = {
  cpr: {
    term: 'CPR',
    expansion: 'Cédula de Produto Rural',
    definition:
      'Um compromisso financeiro ligado à sua produção rural: você recebe recursos agora e se compromete a entregar produto ou pagar um valor na colheita.',
  },
  pronaf: {
    term: 'Pronaf',
    expansion: 'Programa Nacional de Fortalecimento da Agricultura Familiar',
    definition:
      'Linha de crédito com juros menores voltada a produtores da agricultura familiar, com regras próprias de quem pode contratar.',
  },
  pronamp: {
    term: 'Pronamp',
    expansion: 'Programa Nacional de Apoio ao Médio Produtor Rural',
    definition:
      'Linha de crédito com condições específicas para o médio produtor rural, com limite de receita anual para participar.',
  },
  cet: {
    term: 'CET',
    expansion: 'Custo Efetivo Total',
    definition:
      'O custo real da dívida por ano, somando juros, taxas e seguros. É o número que permite comparar duas propostas de verdade.',
  },
  portabilidade: {
    term: 'portabilidade',
    definition:
      'Levar uma dívida que você já tem para outra instituição, que assume o saldo devedor e passa a cobrar nas condições dela.',
  },
  carencia: {
    term: 'carência',
    definition:
      'Um período combinado no qual você não paga as parcelas principais, normalmente para esperar a próxima colheita.',
  },
  repactuacao: {
    term: 'repactuação',
    definition:
      'Refazer o acordo de uma dívida que já existe, mudando prazo, parcelas ou garantias com a mesma instituição.',
  },
  saldoDevedor: {
    term: 'saldo devedor',
    definition:
      'Quanto ainda falta pagar hoje de uma dívida, contando o valor principal mais os juros que já correram.',
  },
  comprometimento: {
    term: 'comprometimento da receita',
    definition:
      'Quanto da receita que você espera receber na safra já está reservado para pagar dívidas.',
  },
  receitaBruta: {
    term: 'receita bruta projetada',
    definition:
      'O valor que a sua produção deve gerar na safra, antes de descontar custos: produção esperada multiplicada pelo preço estimado.',
  },
  garantia: {
    term: 'garantia',
    definition:
      'Um bem — como a terra, a safra ou um equipamento — vinculado à dívida como segurança de pagamento para a instituição.',
  },
} as const satisfies Record<string, GlossaryEntry>;

export type GlossaryKey = keyof typeof glossary;

/** Full sentence used in tooltips and by screen readers: "CPR — Cédula de…: …". */
export function glossaryText(key: GlossaryKey): string {
  const entry = glossary[key];
  const head = entry.expansion ? `${entry.term} — ${entry.expansion}` : entry.term;
  return `${head}: ${entry.definition}`;
}
