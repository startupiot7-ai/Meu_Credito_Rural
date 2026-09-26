/**
 * O próximo passo: sempre UM, nunca uma lista.
 *
 * As regras são lidas de cima para baixo e a primeira que se aplica vence.
 * A ordem vai do mais urgente (falta um dado, há prazo de seguro correndo, já
 * há dificuldade) para o mais tranquilo (a safra cobre com folga).
 *
 * Regra de independência: nenhum passo diz "contrate" nem indica instituição.
 * O diagnóstico ajuda a decidir; quem decide é o produtor.
 */
import type {
  DadosDaSafra,
  FatorEncontrado,
  IdDoFator,
  ProximoPasso,
  SituacaoDaSafra,
} from './tipos.ts';

export type ContextoDoProximoPasso = {
  dados: DadosDaSafra;
  situacao: SituacaoDaSafra;
  fatores: FatorEncontrado[];
  dadosQueFaltam: string[];
};

/** Quem já tem custeio e já teve dificuldade, ou já não cobre, precisa ver os caminhos de renegociação. */
export function precisaDeCaminhosDeRenegociacao(dados: DadosDaSafra, situacao: SituacaoDaSafra): boolean {
  if (dados.perfil !== 'ja-tenho-custeio') return false;
  const jaTeveDificuldade = dados.acontecimentos.some(
    (acontecimento) =>
      acontecimento === 'parcela-atrasada' || acontecimento === 'ja-prorrogou' || acontecimento === 'ja-renegociou',
  );
  return jaTeveDificuldade || situacao === 'nao-cobre';
}

function temFator(fatores: FatorEncontrado[], id: IdDoFator): boolean {
  return fatores.some((fator) => fator.id === id);
}

/**
 * Pegar custeio para pagar um custo que já existe só troca a forma de pagar.
 * O que pesa de verdade é o custeio acima do custo: vira parcela sem virar
 * produção. Só dá para saber quando o custo foi informado.
 */
function custeioPassaDoCusto(dados: DadosDaSafra): boolean {
  const custo = dados.custoTotalDaSafra.valor;
  const custeio = dados.valorDoCusteio.valor;
  return custo !== null && custeio !== null && custeio > custo;
}

function temSeguroOuProagro(dados: DadosDaSafra): boolean {
  return dados.protecao.includes('seguro-rural') || dados.protecao.includes('proagro');
}

export function escolherProximoPasso(contexto: ContextoDoProximoPasso): ProximoPasso {
  const { dados, situacao, fatores, dadosQueFaltam } = contexto;
  const planejando = dados.perfil === 'planejando-safra';

  if (situacao === 'dados-insuficientes') {
    return {
      id: 'descobrir-dado-que-falta',
      titulo: 'Complete o que falta para fazer a conta',
      descricao: `Falta saber ${dadosQueFaltam[0]}. Se não souber o preço, a sua cooperativa ou um comprador da região informa o preço do dia.`,
    };
  }

  // Seguro e Proagro têm prazo para comunicar a perda: isso vem antes de tudo.
  if (dados.acontecimentos.includes('perda-por-clima-ou-praga') && temSeguroOuProagro(dados)) {
    return {
      id: 'comunicar-perda-ao-seguro',
      titulo: 'Comunique a perda ao seguro ou ao Proagro',
      descricao:
        'Perdas por clima ou praga precisam ser comunicadas dentro do prazo do contrato para serem analisadas. Procure a seguradora ou a instituição do seu custeio o quanto antes.',
    };
  }

  if (precisaDeCaminhosDeRenegociacao(dados, situacao)) {
    return {
      id: 'entender-prorrogacao-e-renegociacao',
      titulo: 'Sua prioridade agora é entender as opções de prorrogação e renegociação',
      descricao:
        'Converse com a instituição do seu custeio antes do vencimento. Leve estes números e peça por escrito quais opções existem para o seu caso.',
    };
  }

  if (situacao === 'nao-cobre') {
    return {
      id: 'revisar-plano-antes-de-contratar',
      titulo: 'Revise o plano antes de contratar',
      descricao: custeioPassaDoCusto(dados)
        ? 'Com os números de hoje, a safra não paga os custos e os compromissos. O custeio que você pensa em pegar passa do custo da safra: a diferença vira dívida sem virar café. Um valor mais perto do custo pesa menos na colheita.'
        : 'Com os números de hoje, a safra não paga os custos e os compromissos. Antes de assumir esse custeio, confira o custo, a produção esperada e os outros pagamentos.',
    };
  }

  if (situacao === 'cobre-apertado') {
    if (temFator(fatores, 'safra-muito-prometida')) {
      return {
        id: 'revisar-safra-prometida',
        titulo: planejando
          ? 'Antes de contratar esse valor, revise quanto da safra já está comprometido'
          : 'Evite prometer mais café antes da colheita',
        descricao:
          'O café prometido precisa ser entregue mesmo numa quebra. Quanto mais sacas já estão prometidas, menos sobra para pagar o resto se a colheita vier menor.',
      };
    }
    if (temFator(fatores, 'preco-em-aberto')) {
      return {
        id: 'entender-formas-de-garantir-preco',
        titulo: 'Entenda as formas de garantir o preço de parte da safra',
        descricao:
          'Boa parte da sua sobra depende do preço do dia. Venda antecipada e contratos com cooperativa ou trading fixam o preço de uma parte, mas também têm regras e riscos: pergunte antes de fechar.',
      };
    }
    if (temFator(fatores, 'sem-protecao-climatica')) {
      return {
        id: 'avaliar-seguro-ou-proagro',
        titulo: 'Veja se o seguro rural ou o Proagro cabem no seu plano',
        descricao:
          'Numa safra apertada, uma quebra por clima é o que mais pesa. Pergunte quanto custa e o que cada proteção cobre antes de decidir.',
      };
    }
    return {
      id: 'firmar-os-numeros',
      titulo: planejando
        ? 'Confirme os números que mais pesam antes de contratar'
        : 'Confirme os números que mais pesam antes de assumir novos compromissos',
      descricao:
        'A safra fica apertada no cenário desfavorável. Confirme o custo, o preço e o que já está prometido. Com eles firmes, refaça esta simulação.',
    };
  }

  return {
    id: 'guardar-e-refazer',
    titulo: 'Refaça a simulação quando os números estiverem confirmados',
    descricao:
      'Com o que você informou, a safra cobre com folga. Quando tiver o preço e o custo confirmados, refaça a conta para conferir.',
  };
}
