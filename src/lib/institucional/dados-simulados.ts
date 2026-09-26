/**
 * DADOS SIMULADOS — substituir pela integração real.
 *
 * Tudo neste arquivo é fictício e existe apenas para o protótipo do painel
 * institucional e da tela de consentimento. Nenhum número, nome de instituição
 * ou referência de produtor corresponde a uma organização ou pessoa real.
 *
 * A história que os números contam: uma cooperativa de café de porte médio,
 * com a maior parte dos associados em situação saudável, uma parcela relevante
 * em atenção e um grupo menor, porém concentrando muita dívida, na faixa
 * vermelha. Os totais batem entre si em todos os recortes (há teste para isso).
 *
 * Grupos pequenos foram incluídos de propósito, para exercitar a proteção de
 * privacidade do painel:
 *  - no recorte por núcleo, "Núcleo Serra" (6) e "Núcleo Vale" (8);
 *  - no recorte por cultura, "Outras culturas" (7), que força a ocultação de
 *    mais um grupo para impedir a descoberta por subtração.
 */
import type {
  CarteiraDaInstituicao,
  InstituicaoParticipante,
  RecorteDaCarteira,
} from './tipos';

const recortePorNucleo: RecorteDaCarteira = {
  identificador: 'nucleo',
  rotulo: 'Núcleo',
  segmentos: [
    {
      nome: 'Núcleo Norte',
      produtoresComDiagnostico: 268,
      produtoresPorFaixa: { saudavel: 152, atencao: 80, risco: 36 },
      receitaProjetada: 138_000_000,
      dividaInformada: 46_900_000,
    },
    {
      nome: 'Núcleo Sul',
      produtoresComDiagnostico: 231,
      produtoresPorFaixa: { saudavel: 121, atencao: 72, risco: 38 },
      receitaProjetada: 117_000_000,
      dividaInformada: 45_600_000,
    },
    {
      nome: 'Núcleo Leste',
      produtoresComDiagnostico: 187,
      produtoresPorFaixa: { saudavel: 98, atencao: 59, risco: 30 },
      receitaProjetada: 94_000_000,
      dividaInformada: 33_800_000,
    },
    {
      nome: 'Núcleo Oeste',
      produtoresComDiagnostico: 112,
      produtoresPorFaixa: { saudavel: 60, atencao: 36, risco: 16 },
      receitaProjetada: 56_000_000,
      dividaInformada: 19_300_000,
    },
    {
      nome: 'Núcleo Serra',
      produtoresComDiagnostico: 6,
      produtoresPorFaixa: { saudavel: 3, atencao: 2, risco: 1 },
      receitaProjetada: 3_100_000,
      dividaInformada: 1_300_000,
    },
    {
      nome: 'Núcleo Vale',
      produtoresComDiagnostico: 8,
      produtoresPorFaixa: { saudavel: 4, atencao: 2, risco: 2 },
      receitaProjetada: 3_900_000,
      dividaInformada: 1_100_000,
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
      produtoresPorFaixa: { saudavel: 214, atencao: 142, risco: 75 },
      receitaProjetada: 118_000_000,
      dividaInformada: 49_500_000,
    },
    {
      nome: 'De 500 a 2.000 sacas',
      produtoresComDiagnostico: 318,
      produtoresPorFaixa: { saudavel: 185, atencao: 91, risco: 42 },
      receitaProjetada: 196_000_000,
      dividaInformada: 71_000_000,
    },
    {
      nome: 'Acima de 2.000 sacas',
      produtoresComDiagnostico: 63,
      produtoresPorFaixa: { saudavel: 39, atencao: 18, risco: 6 },
      receitaProjetada: 98_000_000,
      dividaInformada: 27_500_000,
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
      produtoresPorFaixa: { saudavel: 362, atencao: 206, risco: 100 },
      receitaProjetada: 348_000_000,
      dividaInformada: 125_000_000,
    },
    {
      nome: 'Café conilon',
      produtoresComDiagnostico: 116,
      produtoresPorFaixa: { saudavel: 60, atencao: 36, risco: 20 },
      receitaProjetada: 55_500_000,
      dividaInformada: 20_600_000,
    },
    {
      nome: 'Café e outra cultura',
      produtoresComDiagnostico: 21,
      produtoresPorFaixa: { saudavel: 12, atencao: 6, risco: 3 },
      receitaProjetada: 6_600_000,
      dividaInformada: 1_800_000,
    },
    {
      nome: 'Outras culturas',
      produtoresComDiagnostico: 7,
      produtoresPorFaixa: { saudavel: 4, atencao: 3, risco: 0 },
      receitaProjetada: 1_900_000,
      dividaInformada: 600_000,
    },
  ],
};

/** A cooperativa de demonstração, com dados de sobra para o painel completo. */
export const carteiraDeDemonstracao: CarteiraDaInstituicao = {
  nomeDaInstituicao: 'Cooperativa Exemplo',
  atualizadoEm: '2026-09-25T18:00:00-03:00',
  produtoresAcompanhados: 1_240,
  produtoresComDiagnostico: 812,
  produtoresPorFaixa: { saudavel: 438, atencao: 251, risco: 123 },
  receitaProjetadaTotal: 412_000_000,
  dividaInformadaTotal: 148_000_000,
  dividaNaFaixaDeRisco: 61_400_000,
  leituraDaMp: {
    aparentementeAtendemOsCriterios: 164,
    precisamDeMaisInformacoes: 97,
    aparentementeNaoAtendem: 551,
  },
  recortes: [recortePorNucleo, recortePorPorte, recortePorCultura],
  originacao: {
    autorizaramAlgumaInstituicao: 58,
    autorizaramEstaInstituicao: 34,
    autorizaramSomenteOutrasInstituicoes: 24,
    revogaramNosUltimos90Dias: 5,
    quantidadePorEtapa: {
      'aguardando-contato': 14,
      'em-conversa': 12,
      'proposta-apresentada': 6,
      'operacao-concluida': 2,
    },
    // Referências internas fictícias. Com a integração real, o nome e o contato
    // aparecem aqui — e somente aqui — porque o produtor autorizou esta instituição.
    produtoresQueAutorizaramEstaInstituicao: [
      { referencia: 'PRD-0142', faixa: 'risco', percentualDaReceitaComprometido: 62, etapa: 'proposta-apresentada', autorizadoEm: '2026-09-02' },
      { referencia: 'PRD-0388', faixa: 'risco', percentualDaReceitaComprometido: 57, etapa: 'em-conversa', autorizadoEm: '2026-09-08' },
      { referencia: 'PRD-0217', faixa: 'atencao', percentualDaReceitaComprometido: 44, etapa: 'em-conversa', autorizadoEm: '2026-09-11' },
      { referencia: 'PRD-0905', faixa: 'atencao', percentualDaReceitaComprometido: 38, etapa: 'aguardando-contato', autorizadoEm: '2026-09-19' },
      { referencia: 'PRD-0631', faixa: 'risco', percentualDaReceitaComprometido: 71, etapa: 'aguardando-contato', autorizadoEm: '2026-09-22' },
      { referencia: 'PRD-0074', faixa: 'saudavel', percentualDaReceitaComprometido: 24, etapa: 'operacao-concluida', autorizadoEm: '2026-08-14' },
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
  produtoresPorFaixa: { saudavel: 0, atencao: 0, risco: 0 },
  receitaProjetadaTotal: 0,
  dividaInformadaTotal: 0,
  dividaNaFaixaDeRisco: 0,
  leituraDaMp: { aparentementeAtendemOsCriterios: 0, precisamDeMaisInformacoes: 0, aparentementeNaoAtendem: 0 },
  recortes: [],
  originacao: {
    autorizaramAlgumaInstituicao: 0,
    autorizaramEstaInstituicao: 0,
    autorizaramSomenteOutrasInstituicoes: 0,
    revogaramNosUltimos90Dias: 0,
    quantidadePorEtapa: {
      'aguardando-contato': 0,
      'em-conversa': 0,
      'proposta-apresentada': 0,
      'operacao-concluida': 0,
    },
    produtoresQueAutorizaramEstaInstituicao: [],
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
