/**
 * Textos da página para cooperativas (/cooperativas).
 *
 * Ficam separados dos componentes para que a equipe comercial possa revisar
 * a redação num lugar só. Nenhum número, cliente ou resultado aqui é real:
 * onde faltam dados, há marcadores {{...}} nos comentários.
 */

export const problemasDaCooperativa = [
  {
    titulo: 'O risco da safra fica invisível',
    texto:
      'Os compromissos de cada associado estão espalhados entre bancos, cooperativas de crédito, CPRs, barter e revendas. Nenhum desses lugares enxerga se a safra inteira paga tudo.',
  },
  {
    titulo: 'O produtor não relata a própria dificuldade',
    texto:
      'Aperto financeiro é assunto que o associado evita levar à cooperativa. Ele costuma aparecer só quando já não há margem para negociar.',
  },
  {
    titulo: 'Quando aparece, já é inadimplência',
    texto:
      'O custeio foi dimensionado para uma safra cheia. Quando a safra vem menor, a perda deixa de ser individual: afeta a recepção, o crédito de insumos e a confiança entre os associados.',
  },
];

export const etapasParaAInstituicao = [
  {
    titulo: 'O associado faz o diagnóstico gratuito',
    texto:
      'No próprio celular, em poucos minutos. A ferramenta é independente: a instituição divulga o link, mas não participa das respostas nem do resultado.',
  },
  {
    titulo: 'A instituição vê a carteira agregada',
    texto:
      'Quem cobre a safra com folga, quem fica apertado num ano pior e quem já não cobre, com a margem de segurança e as exposições, por núcleo, porte e cultura. Sempre anonimizado.',
  },
  {
    titulo: 'A instituição orienta antes da perda',
    texto:
      'Conversas com os núcleos mais expostos antes do vencimento, apoio a seguro e a planejamento da safra, e um olhar mais realista sobre o risco da carteira. A decisão de crédito continua com a sua equipe.',
  },
];

export const oQueAInstituicaoVe = [
  'Quantos associados cobrem a safra com folga, apertados ou não cobrem',
  'A margem de segurança da carteira: quanto a colheita pode cair antes de faltar dinheiro',
  'Exposição ao clima, compromissos fora do banco e safra sem preço fechado',
  'A carteira recortada por núcleo, porte e cultura, com grupos pequenos ocultos',
  'Quem pediu, por iniciativa própria, para a sua instituição conversar com ele',
];

export const oQueAInstituicaoNaoVe = [
  'Nome, respostas ou números de qualquer associado que não tenha autorizado',
  'As respostas de quem autorizou: só o resumo que ele viu antes de autorizar',
  'Qualquer segmento com menos de 10 produtores com diagnóstico',
  'Documentos enviados pelo produtor durante o diagnóstico',
  'Uma forma de alterar ou orientar o resultado que o produtor recebe',
  'Uma nota de crédito ou uma decisão automática: o painel não aprova nem recusa ninguém',
];

/**
 * {{PRICING_PLACEHOLDER}}
 * Ainda não há preços definidos. A estrutura abaixo mostra o formato das
 * ofertas; quando houver valores, preencha `preco` e retire "Valor sob consulta".
 */
export const planos = [
  {
    identificador: 'licenca-institucional',
    nome: 'Licença institucional anual',
    publico: 'Para cooperativas',
    preco: null as string | null, // {{PRICING_PLACEHOLDER}}
    formaDeCobranca: 'Anual, conforme o número de associados acompanhados', // {{PRICING_PLACEHOLDER}}
    itens: [
      'Painel agregado da carteira, atualizado continuamente',
      'Recortes por núcleo, porte e cultura, com proteção de grupos pequenos',
      'Necessidade potencial de renegociação, com a MP 1.376/2026 como bloco específico',
      'Material para divulgar o diagnóstico gratuito aos associados',
    ],
  },
  {
    identificador: 'pedidos-de-conversa',
    nome: 'Pedidos de conversa',
    publico: 'Para instituições de crédito participantes',
    preco: null as string | null, // {{PRICING_PLACEHOLDER}}
    // A cobrança não pode depender de o produtor contratar crédito: isso daria
    // à instituição e a nós um interesse contra a independência do diagnóstico.
    formaDeCobranca: 'A definir, sem depender de o produtor contratar crédito', // {{PRICING_PLACEHOLDER}}
    itens: [
      'Apenas produtores que autorizaram sua instituição, de forma específica',
      'Só o resumo que o produtor viu: situação da safra, margem e fator principal',
      'Nenhum custo para o produtor, antes ou depois da conversa',
    ],
  },
];

/**
 * {{CASES_PLACEHOLDER}}
 * Nenhum caso real ainda. Quando houver, com autorização da instituição,
 * adicione aqui. Enquanto a lista estiver vazia, a seção de casos não aparece.
 */
export const casosDeInstituicoes: { instituicao: string; resumo: string; resultado: string }[] = [];

export const perguntasFrequentesInstitucionais = [
  {
    pergunta: 'Como os dados são anonimizados?',
    resposta:
      'O painel só mostra números somados. Qualquer segmento com menos de 10 produtores com diagnóstico é ocultado, e, quando necessário, um segmento vizinho também, para que o grupo pequeno não possa ser descoberto por subtração do total. Nenhuma resposta individual chega à instituição.',
  },
  {
    pergunta: 'A instituição consegue ver um associado específico?',
    resposta:
      'Só se aquele associado autorizar, por iniciativa própria, que a sua instituição converse com ele. Mesmo assim, você recebe só o resumo que ele viu: situação da safra, margem de segurança e o fator que mais pesou. A autorização nunca vem marcada e pode ser retirada a qualquer momento.',
  },
  {
    pergunta: 'Isso substitui nosso setor de crédito?',
    resposta:
      'Não. O painel mostra onde está o risco da safra na carteira e ajuda a priorizar conversas. Ele não dá nota nem decide crédito: a análise, a negociação e a decisão continuam com a sua equipe.',
  },
  {
    pergunta: 'Como funcionam os consentimentos do produtor?',
    resposta:
      'São dois, separados e desligados até ele ligar. O primeiro permite usar as respostas de forma anônima nas estatísticas do painel. O segundo, instituição por instituição, permite que uma instituição converse com ele. Se disser não a qualquer um, nada muda no diagnóstico dele.',
  },
  {
    pergunta: 'A instituição pode influenciar o resultado do diagnóstico?',
    resposta:
      'Não. As perguntas, os critérios e o resultado são os mesmos para todos os produtores, com ou sem licença. É essa independência que faz os números do painel merecerem confiança.',
  },
  {
    pergunta: 'Como os associados chegam ao diagnóstico?',
    resposta:
      'A instituição divulga o link pelos canais que já usa: técnicos de campo, reuniões de núcleo, grupos de mensagem. O diagnóstico é gratuito e funciona no celular, mesmo com conexão instável.',
  },
  {
    pergunta: 'E a MP 1.376/2026?',
    resposta:
      'Ela aparece como um bloco específico, para quem já está com dificuldade, e não como o centro do painel. Enquanto os critérios estiverem em validação jurídica, o painel não mostra quantos associados se enquadram.',
  },
  {
    pergunta: 'Quanto custa a licença?',
    // {{PRICING_PLACEHOLDER}} — substituir quando houver tabela de preços.
    resposta:
      'O valor é anual e depende do número de associados acompanhados. Solicite uma demonstração para receber uma proposta para a sua instituição.',
  },
];
