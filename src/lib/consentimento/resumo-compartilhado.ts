/**
 * O que uma instituição autorizada recebe: um resumo da leitura, nunca as
 * respostas.
 *
 * DECISÃO DA EQUIPE (opção B restrita): só a situação da safra, a margem de
 * segurança resumida e o fator que mais pesou. Ficam de fora, de propósito:
 * os valores informados (produção, preço, custo, custeio, dívidas), a
 * retirada da família e qualquer resposta escrita pelo produtor.
 *
 * O produtor vê exatamente estas linhas antes de autorizar. Se esta lista
 * mudar, a versão do consentimento precisa mudar também
 * (CHAVE_DO_CONSENTIMENTO em useConsentimentoDeOriginacao.ts), porque a
 * autorização antiga não cobre o conteúdo novo.
 */
import type { ResultadoDoDiagnostico } from '../diagnostico/tipos.ts';

export type LinhaCompartilhada = { rotulo: string; valor: string };

export const ROTULOS_DO_RESUMO = ['Situação da safra', 'Margem de segurança', 'O que mais pesou'] as const;

/** "A colheita pode ser até 28% menor antes de faltar dinheiro". */
export function descreverMargemEmPercentual(percentual: number): string {
  if (percentual === 0) return 'Sem margem: já falta no cenário esperado';
  return `A colheita pode ser até ${percentual}% menor antes de faltar dinheiro`;
}

function descreverMargem(resultado: ResultadoDoDiagnostico): string {
  const { margem } = resultado;
  if (!margem.calculavel) return 'Não calculada';
  return descreverMargemEmPercentual(Math.round(margem.quebraDeProducaoSuportada.fracao * 100));
}

export function montarResumoCompartilhado(resultado: ResultadoDoDiagnostico): LinhaCompartilhada[] {
  const [situacao, margem, fatorPrincipal] = ROTULOS_DO_RESUMO;
  return [
    { rotulo: situacao, valor: resultado.rotuloDaSituacao },
    { rotulo: margem, valor: descreverMargem(resultado) },
    { rotulo: fatorPrincipal, valor: resultado.fatores[0]?.titulo ?? 'Nada chamou atenção' },
  ];
}
