/**
 * Situação da safra: a leitura em três níveis, mais "faltam dados".
 *
 * A regra não usa nenhum limite inventado. Ela responde duas perguntas que o
 * produtor entende, usando só as hipóteses que aparecem na tela:
 *
 *   1. No cenário esperado, sobra dinheiro depois dos custos e compromissos?
 *      Não → "não cobre".
 *   2. E no cenário desfavorável?
 *      Não → "cobre, mas fica apertada".   Sim → "cobre com folga".
 *
 * Isto não é nota nem score: é uma descrição da safra, sempre acompanhada do
 * motivo e dos números que levaram a ela.
 */
import { descreverHipotese } from './cenarios.ts';
import { reaisAproximados } from './texto.ts';
import type { DadosDaSafra, NomeDoCenario, ResultadoDoCenario, SituacaoDaSafra } from './tipos.ts';

/** O que falta para a conta existir. Vazio quando dá para calcular. */
export function listarDadosQueFaltam(dados: DadosDaSafra): string[] {
  const faltam: string[] = [];
  if (dados.perfil === null) {
    faltam.push('se você já tem custeio ou está planejando a próxima safra');
  }
  if (dados.producaoPropriaEsperada.valor === null) {
    faltam.push('quantas sacas você espera colher (ou a sua média das últimas safras)');
  }
  if (dados.precoPorSaca.valor === null) {
    faltam.push('o preço que você espera receber por saca');
  }
  // Sem custo e sem crédito, não há o que comparar com a receita.
  if (dados.custoTotalDaSafra.valor === null && dados.valorDoCusteio.valor === null) {
    faltam.push('quanto a safra custa ou quanto você vai financiar');
  }
  return faltam;
}

export function classificarSituacao(cenarios: Record<NomeDoCenario, ResultadoDoCenario>): SituacaoDaSafra {
  if (cenarios.esperado.recursosAposCompromissos < 0) return 'nao-cobre';
  if (cenarios.desfavoravel.recursosAposCompromissos < 0) return 'cobre-apertado';
  return 'cobre-com-folga';
}

/** O texto do selo. Descreve a safra, nunca a pessoa. */
export const rotuloDaSituacao: Record<SituacaoDaSafra, string> = {
  'cobre-com-folga': 'A safra cobre com folga',
  'cobre-apertado': 'A safra cobre, mas fica apertada',
  'nao-cobre': 'A safra não cobre os compromissos',
  'dados-insuficientes': 'Faltam dados para calcular',
};

function juntarComE(itens: string[]): string {
  if (itens.length <= 1) return itens.join('');
  return `${itens.slice(0, -1).join(', ')} e ${itens[itens.length - 1]}`;
}

/** "O que isso significa", numa frase. */
export function escreverFrase(
  situacao: SituacaoDaSafra,
  cenarios: Record<NomeDoCenario, ResultadoDoCenario> | null,
  dadosQueFaltam: string[],
): string {
  if (situacao === 'dados-insuficientes' || cenarios === null) {
    return `Ainda falta saber ${juntarComE(dadosQueFaltam)} para fazer a conta da sua safra.`;
  }

  const { esperado, desfavoravel } = cenarios;
  const hipotese = descreverHipotese(desfavoravel.hipoteses).toLowerCase();

  if (situacao === 'nao-cobre') {
    return `Mesmo se tudo sair como você espera, faltam ${reaisAproximados(
      esperado.recursosAposCompromissos,
    )} para pagar os custos e os compromissos desta safra.`;
  }

  if (situacao === 'cobre-apertado') {
    return `Se tudo sair como você espera, a safra paga os compromissos e sobram ${reaisAproximados(
      esperado.recursosAposCompromissos,
    )}. Mas se a safra vier pior (${hipotese}), faltam ${reaisAproximados(
      desfavoravel.recursosAposCompromissos,
    )}.`;
  }

  return `A safra paga os custos e os compromissos mesmo se vier pior que o esperado (${hipotese}). Nesse caso ainda sobram ${reaisAproximados(
    desfavoravel.recursosAposCompromissos,
  )}.`;
}
