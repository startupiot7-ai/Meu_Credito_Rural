/**
 * The diagnostic questionnaire — structure, validation and the mock analysis.
 *
 * PROTOTYPE: there is no server. Answers live in the browser, and `analyse()`
 * below is a placeholder that produces a result with the same *shape* the real
 * engine will return — a list of findings the producer can check, plain-language
 * meaning, and one next step. It is not a real credit analysis.
 *
 * Design rule encoded here: one question per step. A step never asks for two
 * unrelated decisions, because "uma decisão por vez" is what keeps this usable
 * for someone who is anxious about the subject.
 */

import { debtToRevenueRatio, riskLevelFromRatio } from './format';
import type { RiskLevel } from './format';
import type { Finding } from './mock-data';

export const STORAGE_KEY = 'mcr:diagnostico:v1';

export type CropType = 'arabica' | 'conilon' | 'cafe-e-outras' | 'outra';
export type LossAnswer = 'sim' | 'nao' | 'nao-sei';
export type DebtKind = 'custeio' | 'investimento' | 'cpr' | 'varias' | 'nao-sei';

export type Answers = {
  crop: CropType | null;
  /** Sacas esperadas na safra. */
  expectedBags: number | null;
  /** Preço estimado por saca, em reais. */
  pricePerBag: number | null;
  /** Dívida informada, em reais. */
  debt: number | null;
  debtKind: DebtKind | null;
  hadLosses: LossAnswer | null;
  /** Names of the documents attached in this session, for the review screen. */
  documentNames: string[];
};

export const emptyAnswers: Answers = {
  crop: null,
  expectedBags: null,
  pricePerBag: null,
  debt: null,
  debtKind: null,
  hadLosses: null,
  documentNames: [],
};

/** Step order. The labels are what the progress indicator shows. */
export const stepLabels = [
  'Sua lavoura',
  'Sua produção',
  'Seu preço',
  'Sua dívida',
  'Histórico',
  'Documentos',
  'Revisão',
] as const;

export const TOTAL_STEPS = stepLabels.length;

/**
 * Validation per step, returning a pt-BR message or `null`.
 *
 * Messages say what to do, never what the producer did wrong: "Informe quantas
 * sacas você espera colher" rather than "Campo obrigatório".
 */
export function validateStep(step: number, answers: Answers): string | null {
  switch (step) {
    case 1:
      return answers.crop ? null : 'Escolha uma opção para seguir.';
    case 2:
      if (answers.expectedBags === null) return 'Informe quantas sacas você espera colher.';
      if (answers.expectedBags <= 0) return 'A produção esperada precisa ser maior que zero.';
      return null;
    case 3:
      if (answers.pricePerBag === null) return 'Informe o preço que você estima por saca.';
      if (answers.pricePerBag <= 0) return 'O preço estimado precisa ser maior que zero.';
      return null;
    case 4:
      if (answers.debt === null) return 'Informe quanto você deve hoje.';
      if (answers.debt <= 0) return 'O valor da dívida precisa ser maior que zero.';
      if (!answers.debtKind) return 'Escolha o tipo de operação. Se não souber, escolha "Não sei".';
      return null;
    case 5:
      return answers.hadLosses ? null : 'Escolha uma opção para seguir.';
    case 6:
      // Documents are optional on purpose: a producer without them at hand can
      // still reach a useful result, and we say which one is still missing.
      return null;
    default:
      return null;
  }
}

export type Analysis = {
  revenue: number;
  ratio: number | null;
  level: RiskLevel;
  findings: Finding[];
  /** Plain-language paragraph: "o que isso significa". */
  meaning: string;
  /** The single next step. */
  nextStep: { title: string; description: string };
};

const cropLabels: Record<CropType, string> = {
  arabica: 'café arábica',
  conilon: 'café conilon',
  'cafe-e-outras': 'café e outra cultura',
  outra: 'outra cultura',
};

export const cropOptions: { value: CropType; label: string; description: string }[] = [
  { value: 'arabica', label: 'Café arábica', description: '' },
  { value: 'conilon', label: 'Café conilon (robusta)', description: '' },
  { value: 'cafe-e-outras', label: 'Café e outra cultura', description: '' },
  {
    value: 'outra',
    label: 'Outra cultura',
    description: 'Hoje atendemos principalmente cafeicultores, mas seguimos com você.',
  },
];

export const debtKindOptions: { value: DebtKind; label: string; description: string }[] = [
  {
    value: 'custeio',
    label: 'Custeio da safra',
    description: 'Para bancar a safra: insumos, mão de obra, tratos.',
  },
  {
    value: 'investimento',
    label: 'Investimento',
    description: 'Máquinas, benfeitorias, irrigação, formação de lavoura.',
  },
  {
    value: 'cpr',
    label: 'CPR',
    // The one option whose label is an acronym: the gloss stays, inline.
    description: 'Cédula de Produto Rural — você recebeu recursos e paga na colheita.',
  },
  { value: 'varias', label: 'Mais de um tipo', description: '' },
  {
    value: 'nao-sei',
    label: 'Não sei dizer',
    description: 'Tudo bem. Dá para confirmar depois.',
  },
];

export const lossOptions: { value: LossAnswer; label: string; description: string }[] = [
  { value: 'sim', label: 'Sim, tive perdas', description: '' },
  { value: 'nao', label: 'Não tive perdas relevantes', description: '' },
  { value: 'nao-sei', label: 'Não sei dizer', description: '' },
];

/**
 * MOCK ANALYSIS — placeholder logic, real output shape.
 *
 * Every finding is traceable to something the producer typed, which is the
 * whole point: the result must never be a number they cannot argue with.
 */
export function analyse(answers: Answers): Analysis {
  const revenue = (answers.expectedBags ?? 0) * (answers.pricePerBag ?? 0);
  const debt = answers.debt ?? 0;
  const ratio = debtToRevenueRatio(debt, revenue);
  const level = ratio === null ? 'attention' : riskLevelFromRatio(ratio);

  const findings: Finding[] = [];

  if (answers.crop) {
    findings.push({
      kind: 'confirmed',
      text: `Você informou que produz ${cropLabels[answers.crop]}.`,
    });
  }

  if (revenue > 0) {
    findings.push({
      kind: 'confirmed',
      text: `Sua receita bruta projetada para a safra é de ${revenue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
      })}, a partir da produção e do preço que você estimou.`,
    });
  }

  if (answers.hadLosses === 'sim') {
    findings.push({
      kind: 'confirmed',
      text: 'Você informou perdas de produção no período analisado.',
    });
    findings.push({
      kind: 'confirmed',
      text: 'A redução estimada de receita supera o critério analisado.',
    });
  } else if (answers.hadLosses === 'nao-sei') {
    findings.push({
      kind: 'pending',
      text: 'Ainda precisamos confirmar se houve perda de produção nas últimas safras.',
    });
  }

  if (answers.debtKind === 'nao-sei' || answers.debtKind === 'varias') {
    findings.push({
      kind: 'pending',
      text: 'Ainda precisamos identificar o tipo de cada operação para comparar as alternativas certas.',
    });
  }

  if (answers.documentNames.length === 0) {
    findings.push({
      kind: 'pending',
      text: 'Ainda precisamos confirmar um documento: o extrato atualizado da operação.',
    });
  } else {
    findings.push({
      kind: 'confirmed',
      text: `Você anexou ${answers.documentNames.length} documento${
        answers.documentNames.length > 1 ? 's' : ''
      } para análise.`,
    });
  }

  const meaning =
    ratio === null
      ? 'Com base nas informações fornecidas, ainda falta um dado para medir o peso da dívida sobre a receita da safra.'
      : level === 'risk'
        ? 'Com base nas informações fornecidas, uma parcela elevada da receita projetada está comprometida com a dívida. Isso não define o seu caso sozinho, mas é o tipo de situação em que vale entender quais alternativas de prazo e carência podem ser avaliadas.'
        : level === 'attention'
          ? 'Com base nas informações fornecidas, sua dívida representa uma parcela relevante da receita projetada. Vamos entender quais alternativas podem ser avaliadas antes da próxima safra.'
          : 'Com base nas informações fornecidas, a dívida ocupa uma parcela menor da receita projetada. Ainda assim, vale acompanhar a cada safra e conhecer as alternativas antes de precisar delas.';

  const nextStep =
    answers.documentNames.length === 0
      ? {
          title: 'Peça o extrato atualizado da sua operação',
          description:
            'Solicite à instituição o saldo devedor atualizado por escrito. É esse documento que confirma o número usado em qualquer conversa sobre alternativas.',
        }
      : {
          title: 'Confirme o saldo devedor com a instituição',
          description:
            'Com o documento em mãos, confirme o valor atualizado. A partir dele dá para comparar as condições possíveis com números reais.',
        };

  return { revenue, ratio, level, findings, meaning, nextStep };
}
