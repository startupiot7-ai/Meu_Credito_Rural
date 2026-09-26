/**
 * Converte as respostas da tela em números prontos para a conta.
 *
 * Cada número sai com a sua origem ("informado", "ponto médio da faixa"…) e
 * cada aproximação feita vira uma frase em `aproximacoes`, que o resultado
 * mostra ao produtor. Nenhuma aproximação é silenciosa.
 *
 * Regras de conversão:
 *  - faixa fechada: usamos o ponto médio da faixa;
 *  - faixa aberta ("acima de X"): usamos X e avisamos que pode ser maior;
 *  - "não sei": o número fica vazio (`null`) e a consequência é explicada.
 */
import { formatCurrency, formatNumber, formatPercent } from '../format.ts';
import {
  faixasDeCustoPorHectare,
  faixasDeCustoPorSaca,
  faixasDeParteComPrecoFechado,
  faixasDePrecoPorSaca,
  faixasDeValorAnual,
  faixasDeValorDaSafra,
  parteDoDonoDaTerra,
  prazoDoCusteioEmMeses,
  taxaDeJurosAnualPorLinha,
} from './premissas.ts';
import type { Faixa, ListaDeFaixas } from './premissas.ts';
import type {
  CustoInformado,
  DadosDaSafra,
  NumeroComOrigem,
  ParteComPrecoFechado,
  RespostasDoDiagnostico,
  RetiradaDaFamilia,
  ValorInformado,
} from './tipos.ts';

const naoRespondido: NumeroComOrigem = { valor: null, origem: 'nao-respondido' };
const naoSabe: NumeroComOrigem = { valor: null, origem: 'nao-sei' };
const naoSeAplica: NumeroComOrigem = { valor: 0, origem: 'nao-se-aplica' };

/* ------------------------------------------------------------ faixas */

export function encontrarFaixa(lista: ListaDeFaixas, identificador: string): Faixa {
  const faixa = lista.faixas.find((item) => item.id === identificador);
  if (!faixa) {
    // Só acontece por erro de programação: a tela oferece apenas faixas desta lista.
    throw new Error(`A faixa "${identificador}" não existe em "${lista.nome}".`);
  }
  return faixa;
}

/** O número que representa a faixa na conta: o ponto médio, ou o limite da faixa aberta. */
export function numeroQueRepresentaAFaixa(faixa: Faixa): number {
  if (faixa.maximo === null) return faixa.minimo;
  return (faixa.minimo + faixa.maximo) / 2;
}

/**
 * Converte um valor da tela em número com origem.
 *
 * `descricao` é como o campo aparece na frase de aproximação, por exemplo
 * "o preço por saca". Campos sem faixas (como sacas) não passam `lista`.
 */
export function converterValor(
  valor: ValorInformado | null,
  descricao: string,
  aproximacoes: string[],
  lista?: ListaDeFaixas,
): NumeroComOrigem {
  if (valor === null) return naoRespondido;
  if (valor.forma === 'nao-sei') return naoSabe;
  if (valor.forma === 'exato') return { valor: valor.valor, origem: 'informado' };

  if (!lista) {
    throw new Error(`O campo "${descricao}" não aceita resposta por faixa.`);
  }
  const faixa = encontrarFaixa(lista, valor.faixa);
  const numero = numeroQueRepresentaAFaixa(faixa);

  if (faixa.maximo === null) {
    aproximacoes.push(
      `Para ${descricao} usamos ${formatCurrency(numero)}, o início da faixa "${faixa.rotulo}". O valor real pode ser maior.`,
    );
    return { valor: numero, origem: 'limite-da-faixa-aberta' };
  }

  aproximacoes.push(
    `Para ${descricao} usamos ${formatCurrency(numero)}, o meio da faixa "${faixa.rotulo}" que você escolheu.`,
  );
  return { valor: numero, origem: 'ponto-medio-da-faixa' };
}

/* ------------------------------------------------------------ produção */

function interpretarProducaoEsperada(
  respostas: RespostasDoDiagnostico,
  producaoMediaHistorica: NumeroComOrigem,
  aproximacoes: string[],
): NumeroComOrigem {
  const esperada = converterValor(respostas.producaoEsperadaSacas, 'a produção esperada', aproximacoes);
  if (esperada.valor !== null) return esperada;

  // Sem expectativa, a própria média do produtor é a melhor referência que temos.
  if (producaoMediaHistorica.valor !== null) {
    aproximacoes.push(
      `Como você não sabe quanto espera colher, usamos a sua média das últimas safras: ${formatNumber(
        producaoMediaHistorica.valor,
      )} sacas.`,
    );
    return { valor: producaoMediaHistorica.valor, origem: 'media-historica' };
  }
  return esperada;
}

function calcularProducaoPropria(
  producaoEsperadaTotal: NumeroComOrigem,
  respostas: RespostasDoDiagnostico,
  aproximacoes: string[],
): NumeroComOrigem {
  if (producaoEsperadaTotal.valor === null) return producaoEsperadaTotal;

  if (respostas.posseDaTerra === 'nao-sei') {
    aproximacoes.push('Como você não sabe dizer a situação da terra, consideramos que toda a colheita é sua.');
  }
  const parteDoDono = respostas.posseDaTerra ? parteDoDonoDaTerra[respostas.posseDaTerra] : 0;
  if (parteDoDono === 0) return producaoEsperadaTotal;

  return { valor: producaoEsperadaTotal.valor * (1 - parteDoDono), origem: 'calculado' };
}

/* --------------------------------------------------------------- custo */

const avisoDeCustoDesconhecido =
  'Como não sabemos o custo da safra, consideramos que o custeio e o café prometido pagam todo o custo. Se você gastar além disso, a sobra real é menor.';

function calcularCustoTotal(
  custo: CustoInformado | null,
  areaEmHectares: NumeroComOrigem,
  producaoEsperadaTotal: NumeroComOrigem,
  aproximacoes: string[],
): NumeroComOrigem {
  if (custo === null || custo.base === 'nao-sei') {
    aproximacoes.push(avisoDeCustoDesconhecido);
    return naoSabe;
  }

  if (custo.base === 'total-da-safra') {
    const total = converterValor(custo.valor, 'o custo da safra', aproximacoes, faixasDeValorDaSafra);
    if (total.valor === null) aproximacoes.push(avisoDeCustoDesconhecido);
    return total;
  }

  if (custo.base === 'por-hectare') {
    const porHectare = converterValor(custo.valor, 'o custo por hectare', aproximacoes, faixasDeCustoPorHectare);
    return multiplicarCusto(porHectare, areaEmHectares, 'a área em produção', aproximacoes);
  }

  // Por saca: multiplicamos pela produção esperada da lavoura inteira, que é
  // o que o produtor gasta para produzir. O custo fica fixo nos cenários.
  const porSaca = converterValor(custo.valor, 'o custo por saca', aproximacoes, faixasDeCustoPorSaca);
  return multiplicarCusto(porSaca, producaoEsperadaTotal, 'a produção esperada', aproximacoes);
}

function multiplicarCusto(
  custoUnitario: NumeroComOrigem,
  quantidade: NumeroComOrigem,
  nomeDaQuantidade: string,
  aproximacoes: string[],
): NumeroComOrigem {
  if (custoUnitario.valor === null) {
    aproximacoes.push(avisoDeCustoDesconhecido);
    return naoSabe;
  }
  if (quantidade.valor === null) {
    aproximacoes.push(`Sem ${nomeDaQuantidade}, não deu para chegar ao custo total. ${avisoDeCustoDesconhecido}`);
    return naoSabe;
  }
  return { valor: custoUnitario.valor * quantidade.valor, origem: 'calculado' };
}

/* ------------------------------------------------------------- crédito */

function calcularParcelaDoCusteio(
  respostas: RespostasDoDiagnostico,
  valorDoCusteio: NumeroComOrigem,
  aproximacoes: string[],
): NumeroComOrigem {
  // Quem já tem custeio e sabe a parcela: vale o número do contrato.
  if (respostas.perfil === 'ja-tenho-custeio') {
    const informada = converterValor(
      respostas.parcelaDoCusteioNaColheita,
      'a parcela do custeio',
      aproximacoes,
      faixasDeValorDaSafra,
    );
    if (informada.valor !== null) return informada;
  }

  if (valorDoCusteio.valor === null) return valorDoCusteio;

  const taxa = taxaDeJurosAnualPorLinha[respostas.linhaDoCusteio ?? 'nao-sei'].valor;
  const prazo = prazoDoCusteioEmMeses.valor;
  if (taxa === null || prazo === null) {
    aproximacoes.push(
      'Os juros do custeio não entraram na conta, porque a taxa de cada linha ainda está sendo confirmada. A parcela real será maior que o valor do custeio.',
    );
    return { valor: valorDoCusteio.valor, origem: 'estimado-sem-juros' };
  }

  // Juros simples sobre o prazo: aproximação suficiente para um ciclo de safra.
  const juros = valorDoCusteio.valor * taxa * (prazo / 12);
  return { valor: valorDoCusteio.valor + juros, origem: 'calculado' };
}

/* ------------------------------------------------ compromissos e venda */

function converterPagamentoOpcional(
  valor: ValorInformado | null,
  descricao: string,
  lista: ListaDeFaixas,
  aproximacoes: string[],
): NumeroComOrigem {
  if (valor === null) return naoSeAplica;
  const convertido = converterValor(valor, descricao, aproximacoes, lista);
  if (convertido.valor === null) {
    aproximacoes.push(`Você tem ${descricao}, mas não sabe o valor. Ele não entrou na conta, então a sobra real é menor.`);
  }
  return convertido;
}

function interpretarSacasPrometidas(valor: ValorInformado | null, aproximacoes: string[]): NumeroComOrigem {
  if (valor === null) return { valor: 0, origem: 'nao-respondido' };
  const sacas = converterValor(valor, 'as sacas prometidas', aproximacoes);
  if (sacas.valor === null) {
    aproximacoes.push(
      'Não sabemos quantas sacas estão prometidas para insumos ou CPR. Se houver, a sobra real é menor.',
    );
  }
  return sacas;
}

function interpretarParteComPrecoFechado(
  parte: ParteComPrecoFechado | null,
  aproximacoes: string[],
): NumeroComOrigem {
  if (parte === null) return { valor: 0, origem: 'nao-respondido' };
  if (parte === 'nao-sei') {
    aproximacoes.push('Consideramos que nenhuma saca tem preço fechado, então toda a safra fica sujeita ao preço do dia.');
    return { valor: 0, origem: 'nao-sei' };
  }
  if (parte === 'nada') return { valor: 0, origem: 'informado' };

  const { minimo, maximo } = faixasDeParteComPrecoFechado[parte];
  const pontoMedio = (minimo + maximo) / 2;
  aproximacoes.push(
    `Para a parte da safra com preço fechado usamos ${formatPercent(Math.round(pontoMedio * 100))}, o meio da opção que você escolheu. Essas sacas entram pelo preço que você espera.`,
  );
  return { valor: pontoMedio, origem: 'ponto-medio-da-faixa' };
}

function interpretarRetiradaDaFamilia(retirada: RetiradaDaFamilia | null, aproximacoes: string[]): NumeroComOrigem {
  if (retirada === null) return { valor: 0, origem: 'nao-respondido' };
  if (retirada.forma === 'prefiro-nao-informar' || retirada.forma === 'nao-sei') {
    aproximacoes.push('O sustento da família não entrou na conta. Na vida real, ele também sai desta safra.');
    return { valor: 0, origem: retirada.forma === 'nao-sei' ? 'nao-sei' : 'nao-respondido' };
  }
  return converterValor(retirada, 'a retirada da família', aproximacoes, faixasDeValorAnual);
}

/* ------------------------------------------------------------- entrada */

export function interpretarRespostas(respostas: RespostasDoDiagnostico): DadosDaSafra {
  const aproximacoes: string[] = [];

  const area = converterValor(respostas.areaEmProducaoHectares, 'a área em produção', aproximacoes);
  const producaoMediaHistorica = converterValor(respostas.producaoMediaSacas, 'a média das últimas safras', aproximacoes);
  const producaoEsperadaTotal = interpretarProducaoEsperada(respostas, producaoMediaHistorica, aproximacoes);
  const producaoPropriaEsperada = calcularProducaoPropria(producaoEsperadaTotal, respostas, aproximacoes);
  const precoPorSaca = converterValor(respostas.precoPorSaca, 'o preço por saca', aproximacoes, faixasDePrecoPorSaca);
  const custoTotalDaSafra = calcularCustoTotal(respostas.custoDaSafra, area, producaoEsperadaTotal, aproximacoes);
  const valorDoCusteio = converterValor(respostas.valorDoCusteio, 'o valor do custeio', aproximacoes, faixasDeValorDaSafra);
  const parcelaDoCusteio = calcularParcelaDoCusteio(respostas, valorDoCusteio, aproximacoes);

  const { parcelaDeInvestimento, comprasAPrazoOuAdiantamento, arrendamento } = respostas.outrosPagamentos;

  return {
    perfil: respostas.perfil,
    producaoEsperadaTotal,
    producaoPropriaEsperada,
    producaoMediaHistorica,
    precoPorSaca,
    custoTotalDaSafra,
    valorDoCusteio,
    parcelaDoCusteio,
    sacasPrometidas: interpretarSacasPrometidas(respostas.sacasPrometidas, aproximacoes),
    parteComPrecoFechado: interpretarParteComPrecoFechado(respostas.parteComPrecoFechado, aproximacoes),
    parcelaDeInvestimento: converterPagamentoOpcional(
      parcelaDeInvestimento,
      'parcela de investimento',
      faixasDeValorDaSafra,
      aproximacoes,
    ),
    comprasAPrazoOuAdiantamento: converterPagamentoOpcional(
      comprasAPrazoOuAdiantamento,
      'compras a prazo ou adiantamento',
      faixasDeValorDaSafra,
      aproximacoes,
    ),
    arrendamento: converterPagamentoOpcional(arrendamento, 'arrendamento', faixasDeValorAnual, aproximacoes),
    retiradaDaFamilia: interpretarRetiradaDaFamilia(respostas.retiradaDaFamilia, aproximacoes),
    protecao: respostas.protecao,
    acontecimentos: respostas.acontecimentosDaSafra,
    aproximacoes,
  };
}
