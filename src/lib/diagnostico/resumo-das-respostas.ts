/**
 * As respostas escritas por extenso, para a tela de revisão.
 *
 * Cada linha diz em qual tela a resposta pode ser editada. O produtor revê o
 * que informou com as mesmas palavras das opções, sem ter que lembrar.
 */
import { formatCurrency, formatNumber } from '../format.ts';
import { telasDoFluxo } from './fluxo.ts';
import type { IdDaTela } from './fluxo.ts';
import {
  opcoesDeAcontecimentos,
  opcoesDeCultura,
  opcoesDeLinhaDeCredito,
  opcoesDeParteComPrecoFechado,
  opcoesDePerfil,
  opcoesDePosseDaTerra,
  opcoesDeProtecao,
  rotuloDaOpcao,
} from './opcoes.ts';
import {
  faixasDeCustoPorHectare,
  faixasDeCustoPorSaca,
  faixasDePrecoPorSaca,
  faixasDeValorAnual,
  faixasDeValorDaSafra,
} from './premissas.ts';
import type { ListaDeFaixas } from './premissas.ts';
import type { RespostasDoDiagnostico, ValorInformado } from './tipos.ts';

export type LinhaDoResumo = { tela: IdDaTela; rotulo: string; valor: string };

type Unidade = 'reais' | 'sacas' | 'hectares';

/** "R$ 1.600", "De R$ 1.600 a R$ 2.000", "Não sei" ou "—". */
export function descreverValor(valor: ValorInformado | null, unidade: Unidade, lista?: ListaDeFaixas): string {
  if (valor === null) return '—';
  if (valor.forma === 'nao-sei') return 'Não sei';
  if (valor.forma === 'faixa') {
    return lista?.faixas.find((faixa) => faixa.id === valor.faixa)?.rotulo ?? '—';
  }
  if (unidade === 'reais') return formatCurrency(valor.valor);
  return `${formatNumber(valor.valor)} ${unidade}`;
}

function descreverVarias<Valor extends string>(
  opcoes: { valor: Valor; rotulo: string }[],
  escolhidas: Valor[],
): string {
  if (escolhidas.length === 0) return '—';
  return escolhidas.map((escolhida) => rotuloDaOpcao(opcoes, escolhida)).join('; ');
}

function descreverCusto(respostas: RespostasDoDiagnostico): string {
  const custo = respostas.custoDaSafra;
  if (custo === null) return '—';
  if (custo.base === 'nao-sei') return 'Não sei';
  if (custo.base === 'por-hectare') return `${descreverValor(custo.valor, 'reais', faixasDeCustoPorHectare)} por hectare`;
  if (custo.base === 'por-saca') return `${descreverValor(custo.valor, 'reais', faixasDeCustoPorSaca)} por saca`;
  return `${descreverValor(custo.valor, 'reais', faixasDeValorDaSafra)} na safra toda`;
}

function descreverSacasPrometidas(valor: ValorInformado | null): string {
  if (valor?.forma === 'exato' && valor.valor === 0) return 'Nenhuma';
  return descreverValor(valor, 'sacas');
}

function descreverOutrosPagamentos(respostas: RespostasDoDiagnostico): string {
  const { parcelaDeInvestimento, comprasAPrazoOuAdiantamento, arrendamento } = respostas.outrosPagamentos;
  const partes = [
    parcelaDeInvestimento && `Investimento: ${descreverValor(parcelaDeInvestimento, 'reais', faixasDeValorDaSafra)}`,
    comprasAPrazoOuAdiantamento &&
      `Compras a prazo: ${descreverValor(comprasAPrazoOuAdiantamento, 'reais', faixasDeValorDaSafra)}`,
    arrendamento && `Arrendamento: ${descreverValor(arrendamento, 'reais', faixasDeValorAnual)}`,
  ].filter(Boolean);
  return partes.length > 0 ? partes.join('; ') : 'Nenhum';
}

function descreverRetirada(respostas: RespostasDoDiagnostico): string {
  const retirada = respostas.retiradaDaFamilia;
  if (retirada?.forma === 'prefiro-nao-informar') return 'Prefiro não informar';
  return descreverValor(retirada, 'reais', faixasDeValorAnual);
}

export function resumirRespostas(respostas: RespostasDoDiagnostico): LinhaDoResumo[] {
  const linhas: LinhaDoResumo[] = [
    { tela: 'perfil', rotulo: 'Sua situação', valor: rotuloDaOpcao(opcoesDePerfil, respostas.perfil) },
    { tela: 'cultura', rotulo: 'Cultura principal', valor: rotuloDaOpcao(opcoesDeCultura, respostas.cultura) },
    { tela: 'area', rotulo: 'Área em produção', valor: descreverValor(respostas.areaEmProducaoHectares, 'hectares') },
    { tela: 'posse-da-terra', rotulo: 'A terra', valor: rotuloDaOpcao(opcoesDePosseDaTerra, respostas.posseDaTerra) },
    { tela: 'protecao', rotulo: 'Proteção contra o clima', valor: descreverVarias(opcoesDeProtecao, respostas.protecao) },
    { tela: 'producao', rotulo: 'Produção esperada', valor: descreverValor(respostas.producaoEsperadaSacas, 'sacas') },
    { tela: 'producao', rotulo: 'Média das últimas safras', valor: descreverValor(respostas.producaoMediaSacas, 'sacas') },
    { tela: 'preco', rotulo: 'Preço por saca', valor: descreverValor(respostas.precoPorSaca, 'reais', faixasDePrecoPorSaca) },
    { tela: 'custo', rotulo: 'Custo da safra', valor: descreverCusto(respostas) },
    { tela: 'custeio', rotulo: 'Custeio', valor: descreverValor(respostas.valorDoCusteio, 'reais', faixasDeValorDaSafra) },
    { tela: 'custeio', rotulo: 'Linha do custeio', valor: rotuloDaOpcao(opcoesDeLinhaDeCredito, respostas.linhaDoCusteio) },
  ];

  if (respostas.perfil === 'ja-tenho-custeio' && respostas.parcelaDoCusteioNaColheita) {
    linhas.push({
      tela: 'custeio',
      rotulo: 'Parcela na colheita',
      valor: descreverValor(respostas.parcelaDoCusteioNaColheita, 'reais', faixasDeValorDaSafra),
    });
  }

  linhas.push(
    { tela: 'cafe-prometido', rotulo: 'Café prometido', valor: descreverSacasPrometidas(respostas.sacasPrometidas) },
    { tela: 'outros-pagamentos', rotulo: 'Outros pagamentos', valor: descreverOutrosPagamentos(respostas) },
    {
      tela: 'preco-fechado',
      rotulo: 'Parte com preço fechado',
      valor: rotuloDaOpcao(opcoesDeParteComPrecoFechado, respostas.parteComPrecoFechado),
    },
    {
      tela: 'acontecimentos',
      rotulo: 'O que aconteceu nesta safra',
      valor: descreverVarias(opcoesDeAcontecimentos, respostas.acontecimentosDaSafra),
    },
    { tela: 'retirada-da-familia', rotulo: 'Retirada da família', valor: descreverRetirada(respostas) },
  );

  // Só mostra as linhas das telas que existem no caminho deste perfil.
  const telasDoPerfil = telasDoFluxo(respostas.perfil);
  return linhas.filter((linha) => telasDoPerfil.includes(linha.tela));
}
