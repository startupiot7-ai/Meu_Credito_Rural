/**
 * Textos das opções do questionário.
 *
 * Ficam fora dos componentes para que a revisão, o resumo do consentimento e
 * os testes usem exatamente as mesmas palavras que o produtor viu.
 */
import type {
  AcontecimentoDaSafra,
  Cultura,
  LinhaDeCredito,
  ParteComPrecoFechado,
  PerfilDoProdutor,
  PosseDaTerra,
  ProtecaoDaLavoura,
} from './tipos.ts';

export type Opcao<Valor extends string> = { valor: Valor; rotulo: string; descricao?: string };

export const opcoesDePerfil: Opcao<PerfilDoProdutor>[] = [
  {
    valor: 'ja-tenho-custeio',
    rotulo: 'Já tenho custeio e quero entender minha situação',
    descricao: 'A safra está em andamento e já existe um financiamento para pagar.',
  },
  {
    valor: 'planejando-safra',
    rotulo: 'Estou planejando a próxima safra',
    descricao: 'Quero ver se um novo custeio cabe na safra antes de contratar.',
  },
];

export const opcoesDeCultura: Opcao<Cultura>[] = [
  { valor: 'cafe-arabica', rotulo: 'Café arábica' },
  { valor: 'cafe-conilon', rotulo: 'Café conilon (robusta)' },
  {
    valor: 'outra',
    rotulo: 'Outra cultura',
    descricao: 'A conta funciona, mas as faixas de preço e custo foram pensadas para o café.',
  },
];

export const opcoesDePosseDaTerra: Opcao<PosseDaTerra>[] = [
  { valor: 'propria', rotulo: 'Minha' },
  { valor: 'arrendada', rotulo: 'Arrendada', descricao: 'Pago um valor pelo uso da terra.' },
  { valor: 'parceria-dono-fica-com-um-quarto', rotulo: 'Em parceria: o dono fica com 1/4 da colheita' },
  { valor: 'parceria-dono-fica-com-um-terco', rotulo: 'Em parceria: o dono fica com 1/3 da colheita' },
  { valor: 'parceria-dono-fica-com-metade', rotulo: 'Em parceria: o dono fica com metade (meia)' },
  { valor: 'nao-sei', rotulo: 'Não sei dizer' },
];

export const opcoesDeProtecao: Opcao<ProtecaoDaLavoura>[] = [
  { valor: 'irrigacao-em-toda-a-lavoura', rotulo: 'Irrigação em toda a lavoura' },
  { valor: 'irrigacao-em-parte', rotulo: 'Irrigação em parte da lavoura' },
  {
    valor: 'seguro-rural',
    rotulo: 'Seguro rural',
    descricao: 'Contrato com uma seguradora que paga parte da perda.',
  },
  {
    valor: 'proagro',
    rotulo: 'Proagro',
    descricao: 'Programa do governo, ligado ao custeio, que cobre perdas por clima ou praga.',
  },
  { valor: 'pretendo-contratar-seguro', rotulo: 'Ainda não tenho, mas pretendo contratar seguro' },
  { valor: 'nenhuma', rotulo: 'Nenhuma dessas' },
  { valor: 'nao-sei', rotulo: 'Não sei dizer' },
];

/** Opções que, marcadas, desmarcam todas as outras. */
export const protecoesExclusivas: ProtecaoDaLavoura[] = ['nenhuma', 'nao-sei'];

export const opcoesDeLinhaDeCredito: Opcao<LinhaDeCredito>[] = [
  { valor: 'pronaf', rotulo: 'Pronaf', descricao: 'Linha para a agricultura familiar.' },
  { valor: 'pronamp', rotulo: 'Pronamp', descricao: 'Linha para o médio produtor.' },
  { valor: 'funcafe', rotulo: 'Funcafé', descricao: 'Recursos do fundo do café.' },
  { valor: 'linha-comum', rotulo: 'Linha comum da instituição' },
  { valor: 'nao-sei', rotulo: 'Não sei', descricao: 'Tudo bem. Dá para confirmar depois, no contrato.' },
];

export const opcoesDeParteComPrecoFechado: Opcao<ParteComPrecoFechado>[] = [
  { valor: 'nada', rotulo: 'Nada ainda', descricao: 'Vou vender pelo preço do dia.' },
  { valor: 'ate-um-quarto', rotulo: 'Até 1/4 da safra' },
  { valor: 'de-um-quarto-a-metade', rotulo: 'De 1/4 até a metade' },
  { valor: 'mais-da-metade', rotulo: 'Mais da metade' },
  { valor: 'quase-toda', rotulo: 'Quase toda a safra' },
  { valor: 'nao-sei', rotulo: 'Não sei dizer' },
];

export const opcoesDeAcontecimentos: Opcao<AcontecimentoDaSafra>[] = [
  { valor: 'perda-por-clima-ou-praga', rotulo: 'Tive perda por seca, geada, granizo ou praga' },
  { valor: 'parcela-atrasada', rotulo: 'Tenho parcela atrasada' },
  { valor: 'ja-prorrogou', rotulo: 'Já prorroguei uma parcela' },
  { valor: 'ja-renegociou', rotulo: 'Já renegociei uma dívida' },
  { valor: 'nada-disso', rotulo: 'Nada disso' },
];

export const acontecimentosExclusivos: AcontecimentoDaSafra[] = ['nada-disso'];

export function rotuloDaOpcao<Valor extends string>(opcoes: Opcao<Valor>[], valor: Valor | null): string {
  return opcoes.find((opcao) => opcao.valor === valor)?.rotulo ?? '—';
}

/**
 * Marca ou desmarca uma opção de múltipla escolha.
 *
 * Opções como "Nenhuma dessas" ou "Nada disso" não fazem sentido junto com as
 * outras: marcar uma delas limpa o resto, e marcar qualquer outra limpa ela.
 */
export function alternarEscolha<Valor extends string>(
  escolhidas: Valor[],
  opcao: Valor,
  exclusivas: Valor[],
): Valor[] {
  if (escolhidas.includes(opcao)) {
    return escolhidas.filter((escolhida) => escolhida !== opcao);
  }
  if (exclusivas.includes(opcao)) return [opcao];
  return [...escolhidas.filter((escolhida) => !exclusivas.includes(escolhida)), opcao];
}
