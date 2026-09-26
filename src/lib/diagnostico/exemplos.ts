/**
 * Respostas prontas para o botão "ver com um exemplo" da tela de início.
 *
 * DADOS FICTÍCIOS, para demonstração. Não representam nenhum produtor real
 * nem valores de referência de mercado. Os testes (diagnosticar.test.mjs)
 * garantem que cada exemplo continua mostrando a situação que promete.
 */
import { respostasVazias } from './respostas-vazias.ts';
import type { RespostasDoDiagnostico } from './tipos.ts';

/**
 * Perfil A, safra apertada: 600 sacas esperadas numa lavoura de 20 ha, sem
 * seguro nem irrigação, com parcela de investimento e café prometido. Cobre
 * no cenário esperado, mas não no desfavorável.
 */
export const exemploJaTenhoCusteioApertado: RespostasDoDiagnostico = {
  ...respostasVazias,
  perfil: 'ja-tenho-custeio',
  cultura: 'cafe-arabica',
  areaEmProducaoHectares: { forma: 'exato', valor: 20 },
  posseDaTerra: 'propria',
  protecao: ['nenhuma'],
  producaoEsperadaSacas: { forma: 'exato', valor: 600 },
  producaoMediaSacas: { forma: 'exato', valor: 500 },
  precoPorSaca: { forma: 'exato', valor: 1600 },
  custoDaSafra: { base: 'por-hectare', valor: { forma: 'exato', valor: 20_000 } },
  valorDoCusteio: { forma: 'exato', valor: 250_000 },
  linhaDoCusteio: 'pronamp',
  parcelaDoCusteioNaColheita: { forma: 'exato', valor: 275_000 },
  sacasPrometidas: { forma: 'exato', valor: 80 },
  outrosPagamentos: {
    parcelaDeInvestimento: { forma: 'exato', valor: 150_000 },
    comprasAPrazoOuAdiantamento: { forma: 'exato', valor: 40_000 },
    arrendamento: null,
  },
  parteComPrecoFechado: 'ate-um-quarto',
  acontecimentosDaSafra: ['nada-disso'],
  retiradaDaFamilia: { forma: 'exato', valor: 100_000 },
};

/**
 * Perfil B, safra com folga: 450 sacas esperadas em 15 ha, com seguro e
 * irrigação em parte, custo informado por saca e preço por faixa. Cobre
 * mesmo no cenário desfavorável.
 */
export const exemploPlanejandoComFolga: RespostasDoDiagnostico = {
  ...respostasVazias,
  perfil: 'planejando-safra',
  cultura: 'cafe-arabica',
  areaEmProducaoHectares: { forma: 'exato', valor: 15 },
  posseDaTerra: 'propria',
  protecao: ['irrigacao-em-parte', 'seguro-rural'],
  producaoEsperadaSacas: { forma: 'exato', valor: 450 },
  producaoMediaSacas: { forma: 'exato', valor: 440 },
  precoPorSaca: { forma: 'faixa', faixa: 'preco-1600-2000' },
  custoDaSafra: { base: 'por-saca', valor: { forma: 'exato', valor: 700 } },
  valorDoCusteio: { forma: 'exato', valor: 200_000 },
  linhaDoCusteio: 'pronaf',
  sacasPrometidas: { forma: 'exato', valor: 0 },
  parteComPrecoFechado: 'nada',
  retiradaDaFamilia: { forma: 'prefiro-nao-informar' },
};
