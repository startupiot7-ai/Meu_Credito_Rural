import type { RespostasDoDiagnostico } from './tipos.ts';

/** Ponto de partida de um diagnóstico novo: nada respondido. */
export const respostasVazias: RespostasDoDiagnostico = {
  versao: 2,
  perfil: null,
  cultura: null,
  areaEmProducaoHectares: null,
  posseDaTerra: null,
  protecao: [],
  producaoEsperadaSacas: null,
  producaoMediaSacas: null,
  precoPorSaca: null,
  custoDaSafra: null,
  valorDoCusteio: null,
  linhaDoCusteio: null,
  parcelaDoCusteioNaColheita: null,
  sacasPrometidas: null,
  outrosPagamentos: {
    parcelaDeInvestimento: null,
    comprasAPrazoOuAdiantamento: null,
    arrendamento: null,
  },
  parteComPrecoFechado: null,
  acontecimentosDaSafra: [],
  retiradaDaFamilia: null,
};
