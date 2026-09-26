/**
 * Textos da página para cooperativas e sindicatos (/cooperativas).
 *
 * Ficam separados dos componentes para que a equipe comercial possa revisar
 * a redação num lugar só. Nenhum número, cliente ou resultado aqui é real:
 * onde faltam dados, há marcadores {{...}} nos comentários.
 */

export const problemasDaCooperativa = [
  {
    titulo: 'O risco da carteira fica invisível',
    texto:
      'A dívida de cada associado está espalhada entre bancos, cooperativas de crédito, CPRs e revendas. Nenhum desses lugares enxerga a carteira inteira.',
  },
  {
    titulo: 'O produtor não relata a própria dificuldade',
    texto:
      'Aperto financeiro é assunto que o associado evita levar à cooperativa. Ele costuma aparecer só quando já não há margem para negociar.',
  },
  {
    titulo: 'Quando aparece, já é inadimplência ou penhora',
    texto:
      'Nesse ponto, a perda deixa de ser individual: afeta a recepção da safra, o crédito de insumos e a confiança entre os associados.',
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
      'Faixas de risco, receita comprometida e enquadramento indicativo na MP 1.376/2026, por núcleo, porte e cultura. Sempre anonimizado.',
  },
  {
    titulo: 'A instituição age antes da perda',
    texto:
      'Ações direcionadas aos núcleos mais expostos, apoio à renegociação e planejamento de crédito e de recepção com base em risco.',
  },
];

export const oQueAInstituicaoVe = [
  'Quantos associados estão em cada faixa de risco',
  'Quanto da receita projetada da carteira está comprometido com dívida',
  'Quantos parecem se enquadrar nos mecanismos da MP 1.376/2026, de forma indicativa',
  'A carteira recortada por núcleo, porte e cultura, com grupos pequenos ocultos',
  'Quem pediu, por iniciativa própria, para ser apresentado à sua instituição',
];

export const oQueAInstituicaoNaoVe = [
  'Nome, respostas ou números de qualquer associado que não tenha autorizado',
  'Qualquer segmento com menos de 10 produtores com diagnóstico',
  'Documentos enviados pelo produtor durante o diagnóstico',
  'Uma forma de alterar ou orientar o resultado que o produtor recebe',
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
    publico: 'Para cooperativas e sindicatos rurais',
    preco: null as string | null, // {{PRICING_PLACEHOLDER}}
    formaDeCobranca: 'Anual, conforme o número de associados acompanhados', // {{PRICING_PLACEHOLDER}}
    itens: [
      'Painel agregado da carteira, atualizado continuamente',
      'Recortes por núcleo, porte e cultura, com proteção de grupos pequenos',
      'Leitura indicativa de enquadramento na MP 1.376/2026',
      'Material para divulgar o diagnóstico gratuito aos associados',
    ],
  },
  {
    identificador: 'originacao-qualificada',
    nome: 'Originação qualificada',
    publico: 'Para instituições de crédito participantes',
    preco: null as string | null, // {{PRICING_PLACEHOLDER}}
    formaDeCobranca: 'Por produtor apresentado ou por operação concluída', // {{PRICING_PLACEHOLDER}}
    itens: [
      'Apenas produtores que autorizaram sua instituição, de forma específica',
      'Resumo do diagnóstico, com o consentimento visível e revogável',
      'Nenhum custo para o produtor, antes ou depois da apresentação',
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
      'Só se aquele associado autorizar, por iniciativa própria, a apresentação à sua instituição especificamente. A autorização é feita na tela dele, nunca vem marcada, e pode ser retirada a qualquer momento. Ao retirar, ele sai da sua lista.',
  },
  {
    pergunta: 'Isso substitui nosso setor de crédito?',
    resposta:
      'Não. O painel mostra onde está o risco da carteira e ajuda a priorizar. A análise de crédito, a negociação e a decisão continuam com a sua equipe e com as instituições credoras.',
  },
  {
    pergunta: 'Como funciona a originação qualificada e o consentimento do produtor?',
    resposta:
      'Depois do diagnóstico, o produtor pode escolher, instituição por instituição, se quer ser apresentado. Ele vê antes o que será compartilhado. Se disser não, nada muda para ele. A instituição recebe apenas quem a autorizou; os demais aparecem só como número.',
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
    pergunta: 'Quanto custa a licença?',
    // {{PRICING_PLACEHOLDER}} — substituir quando houver tabela de preços.
    resposta:
      'O valor é anual e depende do número de associados acompanhados. Solicite uma demonstração para receber uma proposta para a sua instituição.',
  },
];
