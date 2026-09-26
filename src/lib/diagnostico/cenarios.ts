/**
 * Os três cenários de simulação da safra: esperado, desfavorável e favorável.
 *
 * Não são previsões. São a mesma conta feita com hipóteses diferentes, e as
 * hipóteses aparecem sempre na tela.
 *
 * A conta de cada cenário, em português:
 *
 *   receita            = dinheiro da venda do café que é do produtor e não está prometido
 *   custos próprios    = a parte do custo que o crédito e o café prometido não pagaram
 *   compromissos       = parcelas + compras a prazo + arrendamento + sustento da família
 *   o que sobra        = receita − custos próprios − compromissos
 *
 * Por que os custos próprios, e não o custo inteiro? Parte do adubo e do
 * defensivo já foi paga com o custeio ou com café prometido (barter, CPR).
 * Descontar o custo inteiro E a parcela do custeio contaria a mesma despesa
 * duas vezes.
 */
import {
  altaDePrecoNoCenarioFavoravel,
  altaDeProducaoNoCenarioFavoravel,
  aumentoDeCustoNoCenarioDesfavoravel,
  quedaDePrecoNoCenarioDesfavoravel,
  quedaDeProducaoNoCenarioDesfavoravel,
} from './premissas.ts';
import type { Premissa } from './premissas.ts';
import type {
  DadosDaSafra,
  HipotesesDoCenario,
  NomeDoCenario,
  NumeroComOrigem,
  ResultadoDoCenario,
} from './tipos.ts';

/** Números desconhecidos entram como zero. Quem chama já avisou o produtor. */
export function valorOuZero(numero: NumeroComOrigem): number {
  return numero.valor ?? 0;
}

function valorDaPremissa(premissa: Premissa): number {
  if (premissa.valor === null) {
    throw new Error(`A premissa "${premissa.nome}" ainda não tem valor e não pode montar um cenário.`);
  }
  return premissa.valor;
}

/* ------------------------------------------------------------ hipóteses */

export function hipotesesDosCenarios(): Record<NomeDoCenario, HipotesesDoCenario> {
  return {
    esperado: { variacaoDaProducao: 0, variacaoDoPreco: 0, variacaoDoCusto: 0 },
    desfavoravel: {
      variacaoDaProducao: -valorDaPremissa(quedaDeProducaoNoCenarioDesfavoravel),
      variacaoDoPreco: -valorDaPremissa(quedaDePrecoNoCenarioDesfavoravel),
      variacaoDoCusto: valorDaPremissa(aumentoDeCustoNoCenarioDesfavoravel),
    },
    favoravel: {
      variacaoDaProducao: valorDaPremissa(altaDeProducaoNoCenarioFavoravel),
      variacaoDoPreco: valorDaPremissa(altaDePrecoNoCenarioFavoravel),
      variacaoDoCusto: 0,
    },
  };
}

function percentualEmTexto(fracao: number): string {
  return `${Math.round(Math.abs(fracao) * 100)}%`;
}

/** "20% menos café, preço 20% menor e custo 10% maior". */
export function descreverHipotese(hipoteses: HipotesesDoCenario): string {
  const partes: string[] = [];
  const { variacaoDaProducao, variacaoDoPreco, variacaoDoCusto } = hipoteses;

  if (variacaoDaProducao < 0) partes.push(`${percentualEmTexto(variacaoDaProducao)} menos café`);
  if (variacaoDaProducao > 0) partes.push(`${percentualEmTexto(variacaoDaProducao)} mais café`);
  if (variacaoDoPreco < 0) partes.push(`preço ${percentualEmTexto(variacaoDoPreco)} menor`);
  if (variacaoDoPreco > 0) partes.push(`preço ${percentualEmTexto(variacaoDoPreco)} maior`);
  if (variacaoDoCusto > 0) partes.push(`custo ${percentualEmTexto(variacaoDoCusto)} maior`);
  if (variacaoDoCusto < 0) partes.push(`custo ${percentualEmTexto(variacaoDoCusto)} menor`);

  if (partes.length === 0) return 'Tudo como você espera';
  if (partes.length === 1) return primeiraLetraMaiuscula(partes[0]);
  const ultima = partes.pop();
  return primeiraLetraMaiuscula(`${partes.join(', ')} e ${ultima}`);
}

function primeiraLetraMaiuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/* -------------------------------------------------------------- receita */

/**
 * Sacas vendidas com preço fechado. Elas não passam das sacas livres
 * esperadas: café prometido para insumos não pode ser vendido de novo.
 */
export function calcularSacasComPrecoFechado(dados: DadosDaSafra): number {
  const producaoPropria = valorOuZero(dados.producaoPropriaEsperada);
  const sacasLivresEsperadas = Math.max(0, producaoPropria - valorOuZero(dados.sacasPrometidas));
  return Math.min(producaoPropria * valorOuZero(dados.parteComPrecoFechado), sacasLivresEsperadas);
}

/** Sacas que ainda vão ser vendidas pelo preço do dia, no cenário esperado. */
export function calcularSacasSemPrecoFechado(dados: DadosDaSafra): number {
  const sacasLivres = valorOuZero(dados.producaoPropriaEsperada) - valorOuZero(dados.sacasPrometidas);
  return sacasLivres - calcularSacasComPrecoFechado(dados);
}

/**
 * Dinheiro da venda do café neste cenário.
 *
 * As sacas prometidas precisam ser entregues de qualquer jeito. Por isso uma
 * quebra de produção sai inteira das sacas livres. Se faltar café até para os
 * contratos, as sacas ficam negativas: o produtor teria que comprar café para
 * entregar, e isso aparece como receita negativa.
 */
export function calcularReceita(dados: DadosDaSafra, hipoteses: HipotesesDoCenario): number {
  const precoEsperado = valorOuZero(dados.precoPorSaca);
  const precoDoCenario = precoEsperado * (1 + hipoteses.variacaoDoPreco);

  const producaoDoCenario = valorOuZero(dados.producaoPropriaEsperada) * (1 + hipoteses.variacaoDaProducao);
  const sacasLivres = producaoDoCenario - valorOuZero(dados.sacasPrometidas);
  const sacasComPrecoFechado = calcularSacasComPrecoFechado(dados);
  const sacasAoPrecoDoDia = sacasLivres - sacasComPrecoFechado;

  // Aproximação documentada: sacas com preço fechado entram pelo preço esperado.
  return sacasComPrecoFechado * precoEsperado + sacasAoPrecoDoDia * precoDoCenario;
}

/* --------------------------------------------------------------- custos */

/** O que já paga o custo da safra sem sair do bolso: custeio, compras a prazo e café prometido. */
export function calcularCoberturaDosCustos(dados: DadosDaSafra): number {
  const valorDoCafePrometido = valorOuZero(dados.sacasPrometidas) * valorOuZero(dados.precoPorSaca);
  return (
    valorOuZero(dados.valorDoCusteio) + valorOuZero(dados.comprasAPrazoOuAdiantamento) + valorDoCafePrometido
  );
}

/**
 * Custo da safra usado na conta. Sem custo informado, consideramos que o que
 * foi financiado paga tudo, e interpretar-respostas.ts já avisou o produtor.
 */
export function calcularCustoConsiderado(dados: DadosDaSafra): number {
  return dados.custoTotalDaSafra.valor ?? calcularCoberturaDosCustos(dados);
}

export function calcularCustosPagosComRecursoProprio(dados: DadosDaSafra, hipoteses: HipotesesDoCenario): number {
  const custoDoCenario = calcularCustoConsiderado(dados) * (1 + hipoteses.variacaoDoCusto);
  return Math.max(0, custoDoCenario - calcularCoberturaDosCustos(dados));
}

/* ---------------------------------------------------------- compromissos */

/** Tudo o que sai desta safra além dos custos. Não muda entre os cenários. */
export function calcularCompromissos(dados: DadosDaSafra): number {
  return (
    valorOuZero(dados.parcelaDoCusteio) +
    valorOuZero(dados.parcelaDeInvestimento) +
    valorOuZero(dados.comprasAPrazoOuAdiantamento) +
    valorOuZero(dados.arrendamento) +
    valorOuZero(dados.retiradaDaFamilia)
  );
}

/* ------------------------------------------------------------- cenários */

export function projetarCenario(
  dados: DadosDaSafra,
  hipoteses: HipotesesDoCenario,
  nome: NomeDoCenario,
): ResultadoDoCenario {
  const receita = calcularReceita(dados, hipoteses);
  const custosPagosComRecursoProprio = calcularCustosPagosComRecursoProprio(dados, hipoteses);
  const compromissos = calcularCompromissos(dados);

  return {
    nome,
    hipoteses,
    hipoteseEmPalavras: descreverHipotese(hipoteses),
    receita,
    custosPagosComRecursoProprio,
    compromissos,
    recursosAposCompromissos: receita - custosPagosComRecursoProprio - compromissos,
  };
}

export function projetarOsTresCenarios(dados: DadosDaSafra): Record<NomeDoCenario, ResultadoDoCenario> {
  const hipoteses = hipotesesDosCenarios();
  return {
    esperado: projetarCenario(dados, hipoteses.esperado, 'esperado'),
    desfavoravel: projetarCenario(dados, hipoteses.desfavoravel, 'desfavoravel'),
    favoravel: projetarCenario(dados, hipoteses.favoravel, 'favoravel'),
  };
}
