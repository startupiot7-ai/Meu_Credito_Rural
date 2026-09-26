/**
 * Simulação rápida da página inicial: quatro números e a mesma conta do
 * diagnóstico completo.
 *
 * Não é outra regra. Montamos respostas de quem está planejando a safra com
 * o que foi digitado e passamos pelo mesmo `diagnosticar()`. O que a
 * simulação rápida não pergunta (café prometido, outros pagamentos, sustento
 * da família) entra como zero, e a tela diz isso.
 */
import { diagnosticar } from './diagnosticar.ts';
import { respostasVazias } from './respostas-vazias.ts';
import type { RespostasDoDiagnostico, ResultadoDoDiagnostico } from './tipos.ts';

export type NumerosDaSimulacaoRapida = {
  producaoEsperadaSacas: number | null;
  precoPorSaca: number | null;
  custoTotalDaSafra: number | null;
  valorDoCusteio: number | null;
};

export function montarRespostasDaSimulacaoRapida(numeros: NumerosDaSimulacaoRapida): RespostasDoDiagnostico {
  const exatoOuNaoSei = (valor: number | null) =>
    valor === null ? ({ forma: 'nao-sei' } as const) : ({ forma: 'exato', valor } as const);

  return {
    ...respostasVazias,
    perfil: 'planejando-safra',
    producaoEsperadaSacas: exatoOuNaoSei(numeros.producaoEsperadaSacas),
    precoPorSaca: exatoOuNaoSei(numeros.precoPorSaca),
    custoDaSafra: { base: 'total-da-safra', valor: exatoOuNaoSei(numeros.custoTotalDaSafra) },
    valorDoCusteio: exatoOuNaoSei(numeros.valorDoCusteio),
    sacasPrometidas: { forma: 'exato', valor: 0 },
  };
}

export function simularRapido(numeros: NumerosDaSimulacaoRapida): ResultadoDoDiagnostico {
  return diagnosticar(montarRespostasDaSimulacaoRapida(numeros));
}
