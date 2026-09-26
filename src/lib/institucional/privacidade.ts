/**
 * Regras de privacidade do painel institucional.
 *
 * A instituição licenciada enxerga padrões da carteira, nunca pessoas. Um
 * número agregado deixa de ser anônimo quando o grupo é pequeno: se um núcleo
 * tem 4 produtores, "1 em faixa vermelha" praticamente aponta para alguém.
 * Por isso qualquer segmento abaixo de um tamanho mínimo é ocultado na tela.
 *
 * Este arquivo não importa nada de propósito: é a regra pura, que pode ser
 * lida, testada e auditada sozinha.
 */

/**
 * Menor grupo que o painel mostra. Abaixo disso, o segmento aparece com a
 * mensagem "Grupo pequeno demais para exibir sem identificar produtores
 * individualmente".
 */
export const TAMANHO_MINIMO_DO_GRUPO = 10;

export function grupoTemTamanhoSeguro(quantidadeDeProdutores: number): boolean {
  return quantidadeDeProdutores >= TAMANHO_MINIMO_DO_GRUPO;
}

export type MotivoDaOcultacao =
  /** O próprio segmento é pequeno demais. */
  | 'grupo-pequeno'
  /**
   * O segmento tem tamanho seguro, mas precisa ser ocultado junto com um grupo
   * pequeno. Senão, bastaria subtrair os segmentos visíveis do total da
   * carteira para descobrir os números do grupo pequeno.
   */
  | 'protecao-contra-subtracao';

export type SegmentoProtegido<Segmento> =
  | { segmento: Segmento; podeSerExibido: true }
  | { segmento: Segmento; podeSerExibido: false; motivo: MotivoDaOcultacao };

/**
 * Decide, para cada segmento de um recorte, se ele pode aparecer na tela.
 *
 * 1. Todo segmento abaixo de `TAMANHO_MINIMO_DO_GRUPO` é ocultado.
 * 2. Enquanto a soma dos segmentos ocultos ainda for menor que o mínimo, o
 *    menor segmento visível também é ocultado. Assim, quem subtrai os segmentos
 *    visíveis do total da carteira só descobre um grupo que já tem tamanho
 *    seguro, e não o grupo pequeno.
 *
 * A ordem original dos segmentos é mantida no resultado.
 */
export function protegerSegmentosPequenos<Segmento extends { produtoresComDiagnostico: number }>(
  segmentos: Segmento[],
): SegmentoProtegido<Segmento>[] {
  const motivoPorPosicao = new Map<number, MotivoDaOcultacao>();

  segmentos.forEach((segmento, posicao) => {
    if (!grupoTemTamanhoSeguro(segmento.produtoresComDiagnostico)) {
      motivoPorPosicao.set(posicao, 'grupo-pequeno');
    }
  });

  const existeGrupoPequeno = motivoPorPosicao.size > 0;

  if (existeGrupoPequeno) {
    const posicoesVisiveisDoMenorParaOMaior = segmentos
      .map((segmento, posicao) => ({ posicao, tamanho: segmento.produtoresComDiagnostico }))
      .filter(({ posicao }) => !motivoPorPosicao.has(posicao))
      .sort((primeiro, segundo) => primeiro.tamanho - segundo.tamanho)
      .map(({ posicao }) => posicao);

    const somarOcultos = () =>
      [...motivoPorPosicao.keys()].reduce(
        (soma, posicao) => soma + segmentos[posicao].produtoresComDiagnostico,
        0,
      );

    for (const posicao of posicoesVisiveisDoMenorParaOMaior) {
      if (grupoTemTamanhoSeguro(somarOcultos())) break;
      motivoPorPosicao.set(posicao, 'protecao-contra-subtracao');
    }
  }

  return segmentos.map((segmento, posicao) => {
    const motivo = motivoPorPosicao.get(posicao);
    return motivo
      ? { segmento, podeSerExibido: false, motivo }
      : { segmento, podeSerExibido: true };
  });
}
