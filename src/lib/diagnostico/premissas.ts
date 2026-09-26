/**
 * TODAS as premissas numéricas do diagnóstico preventivo ficam neste arquivo.
 *
 * Nenhum outro arquivo do motor pode ter um número "de negócio" solto: se a
 * conta precisa de um percentual, de um prazo ou de um limite de faixa, ele
 * mora aqui, com nome, unidade, finalidade, fonte e justificativa.
 *
 * Os valores marcados com {{PREMISSA_A_VALIDAR}} ainda não têm fonte validada.
 * Eles são HIPÓTESES DE SIMULAÇÃO, aprovadas pela equipe para o protótipo, e
 * a tela de resultado sempre as mostra como hipótese, nunca como fato agrícola
 * ou econômico. Para achar todas: procure por PREMISSA_A_VALIDAR.
 *
 * Unidade "fração": 0,20 quer dizer 20%.
 */
import type { LinhaDeCredito, ParteComPrecoFechado, PosseDaTerra } from './tipos.ts';

export const PREMISSA_A_VALIDAR = '{{PREMISSA_A_VALIDAR}}';

export type EstadoDaPremissa = typeof PREMISSA_A_VALIDAR | 'validada';

export type Premissa = {
  nome: string;
  /** `null` quando ainda não há valor aprovado: o motor avisa e não usa. */
  valor: number | null;
  unidade: string;
  finalidade: string;
  fonte: string;
  justificativa: string;
  estado: EstadoDaPremissa;
};

/* ------------------------------------------------ hipóteses dos cenários */

export const quedaDeProducaoNoCenarioDesfavoravel: Premissa = {
  nome: 'Queda de produção no cenário desfavorável',
  valor: 0.2,
  unidade: 'fração',
  finalidade: 'Montar o cenário "se a safra vier pior que o esperado".',
  fonte: 'A buscar: Conab (séries de produtividade por UF), IBGE/PAM, Embrapa Café (bienalidade).',
  justificativa:
    'Valor provisório aprovado pela equipe para a simulação. Representa uma quebra plausível, não uma previsão.',
  estado: PREMISSA_A_VALIDAR,
};

export const quedaDePrecoNoCenarioDesfavoravel: Premissa = {
  nome: 'Queda de preço no cenário desfavorável',
  valor: 0.2,
  unidade: 'fração',
  finalidade: 'Montar o cenário desfavorável. Vale só para as sacas ainda sem preço fechado.',
  fonte: 'A buscar: Cepea/Esalq, indicador do café arábica e conilon (variação entre contratação e colheita).',
  justificativa: 'Valor provisório aprovado pela equipe para a simulação.',
  estado: PREMISSA_A_VALIDAR,
};

export const aumentoDeCustoNoCenarioDesfavoravel: Premissa = {
  nome: 'Aumento de custo no cenário desfavorável',
  valor: 0.1,
  unidade: 'fração',
  finalidade: 'Montar o cenário desfavorável. O custo a mais sai do bolso do produtor.',
  fonte: 'A buscar: Conab (custos de produção, série histórica), IPA de insumos agropecuários (FGV).',
  justificativa: 'Valor provisório aprovado pela equipe para a simulação.',
  estado: PREMISSA_A_VALIDAR,
};

export const altaDeProducaoNoCenarioFavoravel: Premissa = {
  nome: 'Alta de produção no cenário favorável',
  valor: 0.1,
  unidade: 'fração',
  finalidade: 'Montar o cenário "se a safra vier melhor que o esperado".',
  fonte: 'A buscar: Conab (séries de produtividade por UF).',
  justificativa: 'Valor provisório aprovado pela equipe para a simulação.',
  estado: PREMISSA_A_VALIDAR,
};

export const altaDePrecoNoCenarioFavoravel: Premissa = {
  nome: 'Alta de preço no cenário favorável',
  valor: 0.1,
  unidade: 'fração',
  finalidade: 'Montar o cenário favorável. Vale só para as sacas ainda sem preço fechado.',
  fonte: 'A buscar: Cepea/Esalq, indicador do café.',
  justificativa: 'Valor provisório aprovado pela equipe para a simulação.',
  estado: PREMISSA_A_VALIDAR,
};

/* ----------------------------------------------------- crédito e juros */

export const prazoDoCusteioEmMeses: Premissa = {
  nome: 'Prazo do custeio',
  valor: 12,
  unidade: 'meses',
  finalidade: 'Estimar os juros do custeio quando o produtor não sabe o valor da parcela.',
  fonte: 'A buscar: Manual de Crédito Rural (Banco Central), prazos do custeio agrícola do café.',
  justificativa: 'Valor provisório aprovado pela equipe: um ciclo de safra.',
  estado: PREMISSA_A_VALIDAR,
};

/**
 * Taxa de juros ao ano de cada linha. Ainda SEM valor: enquanto for `null`,
 * os juros do custeio não entram na conta e o resultado diz isso.
 */
export const taxaDeJurosAnualPorLinha: Record<LinhaDeCredito, Premissa> = {
  pronaf: taxaAindaSemValor('Taxa de juros do Pronaf custeio'),
  pronamp: taxaAindaSemValor('Taxa de juros do Pronamp custeio'),
  funcafe: taxaAindaSemValor('Taxa de juros do Funcafé custeio'),
  'linha-comum': taxaAindaSemValor('Taxa de juros de uma linha comum da instituição'),
  'nao-sei': taxaAindaSemValor('Taxa de juros quando a linha não é conhecida'),
};

function taxaAindaSemValor(nome: string): Premissa {
  return {
    nome,
    valor: null,
    unidade: 'fração ao ano',
    finalidade: 'Estimar os juros do custeio quando o produtor não sabe o valor da parcela.',
    fonte: 'A buscar: Plano Safra vigente, Manual de Crédito Rural (Banco Central), resoluções do CMN; Funcafé no MAPA.',
    justificativa: 'Sem valor aprovado. A taxa muda a cada Plano Safra e não pode ser inventada.',
    estado: PREMISSA_A_VALIDAR,
  };
}

/* ------------------------------------------------------- fatores */

export const toleranciaDaExpectativaSobreAMedia: Premissa = {
  nome: 'Tolerância entre a produção esperada e a média histórica',
  valor: 0.15,
  unidade: 'fração',
  finalidade: 'Apontar o fator "sua expectativa está acima da sua média".',
  fonte: 'A buscar: Conab e Embrapa Café. A bienalidade do arábica faz a produção oscilar de um ano para o outro.',
  justificativa: 'Valor provisório aprovado pela equipe. Abaixo disso, a diferença pode ser oscilação normal.',
  estado: PREMISSA_A_VALIDAR,
};

export const limiteDeSafraPrometida: Premissa = {
  nome: 'Parte da safra prometida que merece destaque',
  valor: 0.3,
  unidade: 'fração da produção própria',
  finalidade: 'Apontar o fator "grande parte da safra já está prometida".',
  fonte: 'Sem fonte agronômica: é um critério de comunicação.',
  justificativa: 'Valor provisório aprovado pela equipe.',
  estado: PREMISSA_A_VALIDAR,
};

/* ----------------------------------------------------------- parceria */

/**
 * Parte da colheita que fica com o dono da terra em cada opção de parceria.
 * As opções da tela seguem divisões comuns; os limites legais estão no
 * Estatuto da Terra e precisam de confirmação jurídica.
 */
export const parteDoDonoDaTerra: Record<PosseDaTerra, number> = {
  propria: 0,
  arrendada: 0,
  'parceria-dono-fica-com-um-quarto': 1 / 4,
  'parceria-dono-fica-com-um-terco': 1 / 3,
  'parceria-dono-fica-com-metade': 1 / 2,
  'nao-sei': 0,
};

export const fonteDaParceria =
  'A buscar: Estatuto da Terra (Lei 4.504/1964) e Decreto 59.566/1966. ' + PREMISSA_A_VALIDAR;

/* ------------------------------------------------------------- faixas */

/**
 * Uma faixa de resposta. `maximo: null` é a faixa aberta ("acima de X").
 *
 * Regra de conversão (em interpretar-respostas.ts):
 *  - faixa fechada: usamos o ponto médio;
 *  - faixa aberta: usamos o limite conhecido e avisamos que pode ser maior.
 */
export type Faixa = { id: string; rotulo: string; minimo: number; maximo: number | null };

export type ListaDeFaixas = {
  nome: string;
  unidade: string;
  fonte: string;
  justificativa: string;
  estado: EstadoDaPremissa;
  faixas: Faixa[];
};

const justificativaDasFaixas =
  'Limites provisórios, só para organizar as opções da tela. Não representam referência de mercado.';

export const faixasDePrecoPorSaca: ListaDeFaixas = {
  nome: 'Faixas de preço por saca',
  unidade: 'reais por saca',
  fonte: 'A buscar: Cepea/Esalq e cooperativas. Precisa ser atualizada a cada safra.',
  justificativa: justificativaDasFaixas,
  estado: PREMISSA_A_VALIDAR,
  faixas: [
    { id: 'preco-ate-1200', rotulo: 'Até R$ 1.200', minimo: 0, maximo: 1200 },
    { id: 'preco-1200-1600', rotulo: 'De R$ 1.200 a R$ 1.600', minimo: 1200, maximo: 1600 },
    { id: 'preco-1600-2000', rotulo: 'De R$ 1.600 a R$ 2.000', minimo: 1600, maximo: 2000 },
    { id: 'preco-2000-2400', rotulo: 'De R$ 2.000 a R$ 2.400', minimo: 2000, maximo: 2400 },
    { id: 'preco-acima-2400', rotulo: 'Acima de R$ 2.400', minimo: 2400, maximo: null },
  ],
};

export const faixasDeCustoPorHectare: ListaDeFaixas = {
  nome: 'Faixas de custo por hectare',
  unidade: 'reais por hectare por safra',
  fonte: 'A buscar: Conab (custo de produção do café por praça), CNA/Cepea Campo Futuro.',
  justificativa: justificativaDasFaixas,
  estado: PREMISSA_A_VALIDAR,
  faixas: [
    { id: 'custo-ha-ate-10mil', rotulo: 'Até R$ 10 mil', minimo: 0, maximo: 10_000 },
    { id: 'custo-ha-10-15mil', rotulo: 'De R$ 10 mil a R$ 15 mil', minimo: 10_000, maximo: 15_000 },
    { id: 'custo-ha-15-20mil', rotulo: 'De R$ 15 mil a R$ 20 mil', minimo: 15_000, maximo: 20_000 },
    { id: 'custo-ha-20-30mil', rotulo: 'De R$ 20 mil a R$ 30 mil', minimo: 20_000, maximo: 30_000 },
    { id: 'custo-ha-acima-30mil', rotulo: 'Acima de R$ 30 mil', minimo: 30_000, maximo: null },
  ],
};

export const faixasDeCustoPorSaca: ListaDeFaixas = {
  nome: 'Faixas de custo por saca',
  unidade: 'reais por saca produzida',
  fonte: 'A buscar: Conab (custo de produção do café por praça), CNA/Cepea Campo Futuro.',
  justificativa: justificativaDasFaixas,
  estado: PREMISSA_A_VALIDAR,
  faixas: [
    { id: 'custo-saca-ate-600', rotulo: 'Até R$ 600', minimo: 0, maximo: 600 },
    { id: 'custo-saca-600-900', rotulo: 'De R$ 600 a R$ 900', minimo: 600, maximo: 900 },
    { id: 'custo-saca-900-1200', rotulo: 'De R$ 900 a R$ 1.200', minimo: 900, maximo: 1200 },
    { id: 'custo-saca-1200-1500', rotulo: 'De R$ 1.200 a R$ 1.500', minimo: 1200, maximo: 1500 },
    { id: 'custo-saca-acima-1500', rotulo: 'Acima de R$ 1.500', minimo: 1500, maximo: null },
  ],
};

/**
 * Valores ligados à safra inteira: custo total, custeio, parcela de
 * investimento, compras a prazo. Uma lista só, para não multiplicar números.
 */
export const faixasDeValorDaSafra: ListaDeFaixas = {
  nome: 'Faixas de valores da safra (custo total, custeio, parcelas, compras a prazo)',
  unidade: 'reais',
  fonte: 'A buscar: limites do Pronaf e do Pronamp no Manual de Crédito Rural; perfil dos associados.',
  justificativa: justificativaDasFaixas,
  estado: PREMISSA_A_VALIDAR,
  faixas: [
    { id: 'valor-ate-50mil', rotulo: 'Até R$ 50 mil', minimo: 0, maximo: 50_000 },
    { id: 'valor-50-150mil', rotulo: 'De R$ 50 mil a R$ 150 mil', minimo: 50_000, maximo: 150_000 },
    { id: 'valor-150-400mil', rotulo: 'De R$ 150 mil a R$ 400 mil', minimo: 150_000, maximo: 400_000 },
    { id: 'valor-400mil-1mi', rotulo: 'De R$ 400 mil a R$ 1 milhão', minimo: 400_000, maximo: 1_000_000 },
    { id: 'valor-acima-1mi', rotulo: 'Acima de R$ 1 milhão', minimo: 1_000_000, maximo: null },
  ],
};

/** Valores anuais menores: arrendamento e retirada da família. */
export const faixasDeValorAnual: ListaDeFaixas = {
  nome: 'Faixas de valores por ano (arrendamento, retirada da família)',
  unidade: 'reais por ano',
  fonte: 'A buscar: perfil dos associados; a equipe define com as cooperativas.',
  justificativa: justificativaDasFaixas,
  estado: PREMISSA_A_VALIDAR,
  faixas: [
    { id: 'anual-ate-30mil', rotulo: 'Até R$ 30 mil', minimo: 0, maximo: 30_000 },
    { id: 'anual-30-60mil', rotulo: 'De R$ 30 mil a R$ 60 mil', minimo: 30_000, maximo: 60_000 },
    { id: 'anual-60-100mil', rotulo: 'De R$ 60 mil a R$ 100 mil', minimo: 60_000, maximo: 100_000 },
    { id: 'anual-acima-100mil', rotulo: 'Acima de R$ 100 mil', minimo: 100_000, maximo: null },
  ],
};

/**
 * Parte da safra com preço fechado, como fração. Cada opção da tela é uma
 * faixa; usamos o ponto médio dela.
 */
export const faixasDeParteComPrecoFechado: Record<
  Exclude<ParteComPrecoFechado, 'nao-sei'>,
  { minimo: number; maximo: number }
> = {
  nada: { minimo: 0, maximo: 0 },
  'ate-um-quarto': { minimo: 0, maximo: 0.25 },
  'de-um-quarto-a-metade': { minimo: 0.25, maximo: 0.5 },
  'mais-da-metade': { minimo: 0.5, maximo: 0.9 },
  'quase-toda': { minimo: 0.9, maximo: 1 },
};

export const fonteDaParteComPrecoFechado =
  'Limites das opções definidos pela equipe para a tela. ' + PREMISSA_A_VALIDAR;
