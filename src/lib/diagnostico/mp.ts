/**
 * MP 1.376/2026 — regra especializada, não o centro do diagnóstico.
 *
 * ESTADO: NÃO AVALIADA. Nenhum critério da MP foi validado juridicamente, e o
 * sistema não afirma nada sobre elegibilidade. A leitura só aparece para quem
 * já tem custeio e já está com dificuldade (ver proximo-passo.ts).
 *
 * COMO PREENCHER, depois da validação jurídica:
 *  1. Para cada critério abaixo, escreva `regra` e `fonte` (artigo da MP) e
 *     confirme se o `dadoNecessario` está certo. Acrescente critérios se faltar.
 *  2. Se o dado ainda não é perguntado no diagnóstico, ele precisa virar
 *     pergunta antes de a regra ser usada.
 *  3. Marque `validado: true` só depois da validação.
 *  4. Quando todos estiverem validados, a verificação de cada critério ainda
 *     precisa ser programada. Até lá, a leitura continua "não avaliada".
 */
import type { CriterioDaMp, LeituraDaMpNoDiagnostico } from './tipos.ts';

export const CRITERIO_A_VALIDAR = '{{CRITERIO_A_VALIDAR}}';

export const criteriosDaMp: CriterioDaMp[] = [
  {
    nome: 'Data de contratação da operação',
    regra: CRITERIO_A_VALIDAR,
    dadoNecessario: 'Quando o custeio foi contratado. Ainda não é perguntado no diagnóstico.',
    fonte: CRITERIO_A_VALIDAR,
    validado: false,
  },
  {
    nome: 'Fonte do recurso',
    regra: CRITERIO_A_VALIDAR,
    dadoNecessario:
      'De onde vem o recurso do crédito. O diagnóstico só pergunta a linha (Pronaf, Pronamp, Funcafé, linha comum), o que pode não bastar.',
    fonte: CRITERIO_A_VALIDAR,
    validado: false,
  },
  {
    nome: 'Situação da parcela',
    regra: CRITERIO_A_VALIDAR,
    dadoNecessario:
      'Se a parcela está em dia, atrasada, prorrogada ou renegociada. O diagnóstico pergunta isso a quem já tem custeio, sem data de referência.',
    fonte: CRITERIO_A_VALIDAR,
    validado: false,
  },
  {
    nome: 'Demais condições de elegibilidade',
    regra: CRITERIO_A_VALIDAR,
    dadoNecessario: CRITERIO_A_VALIDAR,
    fonte: CRITERIO_A_VALIDAR,
    validado: false,
  },
];

export function lerMp(criterios: CriterioDaMp[] = criteriosDaMp): LeituraDaMpNoDiagnostico {
  const pendentes = criterios.filter((criterio) => !criterio.validado);
  if (pendentes.length > 0) {
    return {
      estado: 'nao-avaliada',
      motivo:
        'Os critérios da MP 1.376/2026 ainda estão em validação jurídica. Por isso não dizemos se ela se aplica ao seu caso: pergunte à instituição do seu custeio.',
      criteriosPendentes: pendentes.map((criterio) => criterio.nome),
    };
  }
  return {
    estado: 'nao-avaliada',
    motivo: 'Os critérios foram validados, mas a verificação automática ainda não foi programada.',
    criteriosPendentes: [],
  };
}
