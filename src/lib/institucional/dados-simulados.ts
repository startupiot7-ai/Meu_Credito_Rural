/**
 * DADOS SIMULADOS — substituir pela integração real.
 *
 * Tudo neste arquivo é fictício e existe apenas para o protótipo do painel
 * institucional e da tela de consentimento. Nenhum número, nome de instituição
 * ou referência de produtor corresponde a uma organização ou pessoa real.
 *
 * A história que os números contam: uma cooperativa de café de porte médio,
 * com a maior parte dos associados cobrindo a safra com folga, uma parcela
 * relevante que só cobre se tudo sair como espera, e um grupo menor que já não
 * cobre no cenário esperado. Os totais batem entre si em todos os recortes
 * (há teste para isso).
 *
 * Grupos pequenos foram incluídos de propósito, para exercitar a proteção de
 * privacidade do painel:
 *  - no recorte por núcleo, "Núcleo Serra" (6) e "Núcleo Vale" (8);
 *  - no recorte por cultura, "Outras culturas" (7), que força a ocultação de
 *    mais um grupo para impedir a descoberta por subtração.
 */
import { descreverMargemEmPercentual, ROTULOS_DO_RESUMO } from '../consentimento/resumo-compartilhado.ts';
import { rotuloDaSituacao } from '../diagnostico/situacao.ts';
import type {
  CarteiraDaInstituicao,
  InstituicaoParticipante,
  PedidoDeConversa,
  RecorteDaCarteira,
  SituacaoNoPainel,
} from './tipos.ts';

const recortePorNucleo: RecorteDaCarteira = {
  identificador: 'nucleo',
  rotulo: 'Núcleo',
  segmentos: [
    {
      nome: 'Núcleo Norte',
      produtoresComDiagnostico: 268,
      produtoresPorSituacao: { 'cobre-com-folga': 152, 'cobre-apertado': 80, 'nao-cobre': 36 },
      comCompromissosForaDoBanco: 112,
    },
    {
      nome: 'Núcleo Sul',
      produtoresComDiagnostico: 231,
      produtoresPorSituacao: { 'cobre-com-folga': 121, 'cobre-apertado': 72, 'nao-cobre': 38 },
      comCompromissosForaDoBanco: 98,
    },
    {
      nome: 'Núcleo Leste',
      produtoresComDiagnostico: 187,
      produtoresPorSituacao: { 'cobre-com-folga': 98, 'cobre-apertado': 59, 'nao-cobre': 30 },
      comCompromissosForaDoBanco: 80,
    },
    {
      nome: 'Núcleo Oeste',
      produtoresComDiagnostico: 112,
      produtoresPorSituacao: { 'cobre-com-folga': 60, 'cobre-apertado': 36, 'nao-cobre': 16 },
      comCompromissosForaDoBanco: 45,
    },
    {
      nome: 'Núcleo Serra',
      produtoresComDiagnostico: 6,
      produtoresPorSituacao: { 'cobre-com-folga': 3, 'cobre-apertado': 2, 'nao-cobre': 1 },
      comCompromissosForaDoBanco: 3,
    },
    {
      nome: 'Núcleo Vale',
      produtoresComDiagnostico: 8,
      produtoresPorSituacao: { 'cobre-com-folga': 4, 'cobre-apertado': 2, 'nao-cobre': 2 },
      comCompromissosForaDoBanco: 4,
    },
  ],
};

const recortePorPorte: RecorteDaCarteira = {
  identificador: 'porte',
  rotulo: 'Porte da produção',
  segmentos: [
    {
      nome: 'Até 500 sacas',
      produtoresComDiagnostico: 431,
      produtoresPorSituacao: { 'cobre-com-folga': 214, 'cobre-apertado': 142, 'nao-cobre': 75 },
      comCompromissosForaDoBanco: 190,
    },
    {
      nome: 'De 500 a 2.000 sacas',
      produtoresComDiagnostico: 318,
      produtoresPorSituacao: { 'cobre-com-folga': 185, 'cobre-apertado': 91, 'nao-cobre': 42 },
      comCompromissosForaDoBanco: 128,
    },
    {
      nome: 'Acima de 2.000 sacas',
      produtoresComDiagnostico: 63,
      produtoresPorSituacao: { 'cobre-com-folga': 39, 'cobre-apertado': 18, 'nao-cobre': 6 },
      comCompromissosForaDoBanco: 24,
    },
  ],
};

const recortePorCultura: RecorteDaCarteira = {
  identificador: 'cultura',
  rotulo: 'Cultura',
  segmentos: [
    {
      nome: 'Café arábica',
      produtoresComDiagnostico: 668,
      produtoresPorSituacao: { 'cobre-com-folga': 362, 'cobre-apertado': 206, 'nao-cobre': 100 },
      comCompromissosForaDoBanco: 281,
    },
    {
      nome: 'Café conilon',
      produtoresComDiagnostico: 116,
      produtoresPorSituacao: { 'cobre-com-folga': 60, 'cobre-apertado': 36, 'nao-cobre': 20 },
      comCompromissosForaDoBanco: 50,
    },
    {
      nome: 'Café e outra cultura',
      produtoresComDiagnostico: 21,
      produtoresPorSituacao: { 'cobre-com-folga': 12, 'cobre-apertado': 6, 'nao-cobre': 3 },
      comCompromissosForaDoBanco: 8,
    },
    {
      nome: 'Outras culturas',
      produtoresComDiagnostico: 7,
      produtoresPorSituacao: { 'cobre-com-folga': 4, 'cobre-apertado': 3, 'nao-cobre': 0 },
      comCompromissosForaDoBanco: 3,
    },
  ],
};

/**
 * Um pedido de conversa fictício, montado com as mesmas frases do resumo que
 * o produtor vê na tela de consentimento.
 */
function pedidoFicticio(
  referencia: string,
  situacao: SituacaoNoPainel,
  margemEmPercentual: number,
  fatorPrincipal: string,
  autorizadoEm: string,
): PedidoDeConversa {
  const [rotuloDaSituacaoNoResumo, rotuloDaMargem, rotuloDoFator] = ROTULOS_DO_RESUMO;
  return {
    referencia,
    situacao,
    resumo: [
      { rotulo: rotuloDaSituacaoNoResumo, valor: rotuloDaSituacao[situacao] },
      { rotulo: rotuloDaMargem, valor: descreverMargemEmPercentual(margemEmPercentual) },
      { rotulo: rotuloDoFator, valor: fatorPrincipal },
    ],
    autorizadoEm,
  };
}

/** A cooperativa de demonstração, com dados de sobra para o painel completo. */
export const carteiraDeDemonstracao: CarteiraDaInstituicao = {
  nomeDaInstituicao: 'Cooperativa Exemplo',
  atualizadoEm: '2026-09-25T18:00:00-03:00',
  produtoresAcompanhados: 1_240,
  produtoresComDiagnostico: 812,
  produtoresPorSituacao: { 'cobre-com-folga': 438, 'cobre-apertado': 251, 'nao-cobre': 123 },
  produtoresPorMargem: { 'sem-margem': 123, 'ate-10': 97, 'de-10-a-20': 154, 'de-20-a-30': 186, 'acima-de-30': 252 },
  exposicaoClimatica: { protegidos: 301, protecaoParcial: 208, semProtecao: 257, naoSouberamDizer: 46 },
  comCompromissosForaDoBanco: 342,
  comPrecoFechado: 276,
  porPerfil: { jaTemCusteio: 517, planejandoSafra: 295 },
  comSinaisDeDificuldade: 88,
  recortes: [recortePorNucleo, recortePorPorte, recortePorCultura],
  pedidosDeConversa: {
    autorizaramAlgumaInstituicao: 58,
    autorizaramEstaInstituicao: 34,
    autorizaramSomenteOutrasInstituicoes: 24,
    revogaramNosUltimos90Dias: 5,
    // Referências internas fictícias. Com a integração real, o nome e o contato
    // aparecem aqui — e somente aqui — porque o produtor autorizou esta instituição.
    pedidos: [
      pedidoFicticio('PRD-0631', 'nao-cobre', 0, 'Já houve dificuldade para pagar', '2026-09-22'),
      pedidoFicticio('PRD-0905', 'cobre-apertado', 14, 'Grande parte da safra já está prometida', '2026-09-19'),
      pedidoFicticio('PRD-0217', 'cobre-apertado', 22, 'Você espera colher mais que a sua média', '2026-09-11'),
      pedidoFicticio('PRD-0388', 'nao-cobre', 0, 'Os pagamentos passam do que a safra deve render', '2026-09-08'),
      pedidoFicticio('PRD-0142', 'cobre-apertado', 9, 'Uma quebra pequena já acaba com a sobra', '2026-09-02'),
      pedidoFicticio('PRD-0074', 'cobre-com-folga', 41, 'Nada chamou atenção', '2026-08-14'),
    ],
  },
};

/**
 * Uma cooperativa que acabou de contratar: cadastrou associados, mas nenhum
 * concluiu o diagnóstico ainda. Usada para o estado vazio do painel.
 */
export const carteiraSemDiagnosticos: CarteiraDaInstituicao = {
  ...carteiraDeDemonstracao,
  produtoresAcompanhados: 186,
  produtoresComDiagnostico: 0,
  produtoresPorSituacao: { 'cobre-com-folga': 0, 'cobre-apertado': 0, 'nao-cobre': 0 },
  produtoresPorMargem: { 'sem-margem': 0, 'ate-10': 0, 'de-10-a-20': 0, 'de-20-a-30': 0, 'acima-de-30': 0 },
  exposicaoClimatica: { protegidos: 0, protecaoParcial: 0, semProtecao: 0, naoSouberamDizer: 0 },
  comCompromissosForaDoBanco: 0,
  comPrecoFechado: 0,
  porPerfil: { jaTemCusteio: 0, planejandoSafra: 0 },
  comSinaisDeDificuldade: 0,
  recortes: [],
  pedidosDeConversa: {
    autorizaramAlgumaInstituicao: 0,
    autorizaramEstaInstituicao: 0,
    autorizaramSomenteOutrasInstituicoes: 0,
    revogaramNosUltimos90Dias: 0,
    pedidos: [],
  },
};

/**
 * Instituições que o produtor pode autorizar na tela de consentimento.
 * Nomes fictícios: a lista real de participantes ainda será definida.
 * O identificador da primeira coincide com a cooperativa do painel.
 */
export const instituicoesParticipantes: InstituicaoParticipante[] = [
  { identificador: 'cooperativa-exemplo', nome: 'Cooperativa Exemplo', tipo: 'Cooperativa de café' },
  { identificador: 'cooperativa-de-credito-exemplo', nome: 'Cooperativa de Crédito Exemplo', tipo: 'Cooperativa de crédito' },
  { identificador: 'banco-exemplo', nome: 'Banco Exemplo', tipo: 'Banco' },
];
