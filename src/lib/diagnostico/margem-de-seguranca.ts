/**
 * Margem de segurança: quanto a safra pode piorar antes de faltar dinheiro.
 *
 * Diferente dos cenários, a margem NÃO usa nenhuma premissa. É o ponto de
 * virada calculado só com os números do produtor: a partir de quanto de
 * quebra, de queda de preço ou de aumento de custo a sobra do cenário
 * esperado chega a zero. Cada um é calculado sozinho, com os outros dois
 * como o produtor espera.
 */
import {
  calcularCoberturaDosCustos,
  calcularCustoConsiderado,
  calcularSacasSemPrecoFechado,
  valorOuZero,
} from './cenarios.ts';
import type { DadosDaSafra, MargemDeSeguranca, QuedaDePrecoSuportada, ResultadoDoCenario } from './tipos.ts';

/**
 * Quebra de produção suportada.
 *
 * Cada saca a menos é uma saca livre a menos, porque as prometidas precisam
 * ser entregues de qualquer jeito. Então cada saca perdida tira exatamente
 * um preço de saca da sobra:  quebra = sobra ÷ (produção própria × preço).
 */
function calcularQuebraSuportada(sobra: number, producaoPropria: number, preco: number) {
  const valorDaProducao = producaoPropria * preco;
  const fracao = Math.min(1, sobra / valorDaProducao);
  return { fracao, sacas: fracao * producaoPropria };
}

/**
 * Queda de preço suportada. Só as sacas ainda sem preço fechado sentem a
 * queda:  queda = sobra ÷ (sacas ao preço do dia × preço).
 */
function calcularQuedaDePrecoSuportada(dados: DadosDaSafra, sobra: number, preco: number): QuedaDePrecoSuportada {
  const sacasAoPrecoDoDia = calcularSacasSemPrecoFechado(dados);
  if (sacasAoPrecoDoDia <= 0) return { tipo: 'preco-nao-ameaca-o-pagamento' };

  const fracao = sobra / (sacasAoPrecoDoDia * preco);
  // Acima de 100%, nem com o café valendo zero faltaria dinheiro.
  if (fracao >= 1) return { tipo: 'preco-nao-ameaca-o-pagamento' };
  return { tipo: 'percentual', valor: fracao };
}

/**
 * Aumento de custo suportado. O custo a mais sai do bolso. Se o crédito já
 * era maior que o custo, essa folga absorve o aumento primeiro:
 *   aumento = (sobra + folga do crédito) ÷ custo.
 */
function calcularAumentoDeCustoSuportado(dados: DadosDaSafra, sobra: number): number | null {
  const custo = calcularCustoConsiderado(dados);
  if (custo <= 0) return null;
  if (sobra <= 0) return 0;

  const folgaDoCredito = Math.max(0, calcularCoberturaDosCustos(dados) - custo);
  return (sobra + folgaDoCredito) / custo;
}

/** Quanto a média histórica fica abaixo do esperado, como fração do esperado. */
function calcularDistanciaDaMedia(dados: DadosDaSafra): number | null {
  const media = dados.producaoMediaHistorica.valor;
  const esperada = dados.producaoEsperadaTotal.valor;
  if (media === null || esperada === null || esperada <= 0) return null;
  // Se a produção esperada veio da própria média, não há o que comparar.
  if (dados.producaoEsperadaTotal.origem === 'media-historica') return null;
  if (media >= esperada) return null;
  return (esperada - media) / esperada;
}

export function calcularMargemDeSeguranca(
  dados: DadosDaSafra,
  cenarioEsperado: ResultadoDoCenario,
): MargemDeSeguranca {
  const producaoPropria = valorOuZero(dados.producaoPropriaEsperada);
  const preco = valorOuZero(dados.precoPorSaca);
  if (producaoPropria <= 0 || preco <= 0) {
    return { calculavel: false, motivo: 'Sem produção e preço, não dá para medir a margem.' };
  }

  // Sobra negativa quer dizer margem zero: já falta no cenário esperado.
  const sobra = Math.max(0, cenarioEsperado.recursosAposCompromissos);

  return {
    calculavel: true,
    quebraDeProducaoSuportada: calcularQuebraSuportada(sobra, producaoPropria, preco),
    quedaDePrecoSuportada: calcularQuedaDePrecoSuportada(dados, sobra, preco),
    aumentoDeCustoSuportado: calcularAumentoDeCustoSuportado(dados, sobra),
    mediaHistoricaAbaixoDaEsperada: calcularDistanciaDaMedia(dados),
  };
}
