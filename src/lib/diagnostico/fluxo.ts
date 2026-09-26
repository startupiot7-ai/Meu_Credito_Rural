/**
 * O caminho do questionário: quais telas aparecem, em que ordem, e o que cada
 * uma precisa para deixar o produtor seguir.
 *
 * O caminho muda com o perfil: só quem já tem custeio responde "o que já
 * aconteceu nesta safra". Nenhum perfil passa de TETO_DE_TELAS, contando a
 * revisão (há teste para isso).
 */
import type { PerfilDoProdutor, RespostasDoDiagnostico, ValorInformado } from './tipos.ts';

/** Limite combinado com a equipe para o questionário não virar formulário de banco. */
export const TETO_DE_TELAS = 15;

export type IdDaTela =
  | 'perfil'
  | 'cultura'
  | 'area'
  | 'posse-da-terra'
  | 'protecao'
  | 'producao'
  | 'preco'
  | 'custo'
  | 'custeio'
  | 'cafe-prometido'
  | 'outros-pagamentos'
  | 'preco-fechado'
  | 'acontecimentos'
  | 'retirada-da-familia'
  | 'revisao';

/** Nome curto de cada tela, para a barra de progresso. Precisa ser único. */
export const rotuloDaTela: Record<IdDaTela, string> = {
  perfil: 'Sua situação',
  cultura: 'Cultura',
  area: 'Área',
  'posse-da-terra': 'A terra',
  protecao: 'Proteção',
  producao: 'Produção',
  preco: 'Preço',
  custo: 'Custo',
  custeio: 'Custeio',
  'cafe-prometido': 'Café prometido',
  'outros-pagamentos': 'Outros pagamentos',
  'preco-fechado': 'Venda',
  acontecimentos: 'Esta safra',
  'retirada-da-familia': 'Família',
  revisao: 'Revisão',
};

const telasAntesDaVenda: IdDaTela[] = [
  'perfil',
  'cultura',
  'area',
  'posse-da-terra',
  'protecao',
  'producao',
  'preco',
  'custo',
  'custeio',
  'cafe-prometido',
  'outros-pagamentos',
  'preco-fechado',
];

/** Enquanto o perfil não foi escolhido, mostramos o caminho mais longo. */
export function telasDoFluxo(perfil: PerfilDoProdutor | null): IdDaTela[] {
  const soParaQuemJaTemCusteio: IdDaTela[] = perfil === 'planejando-safra' ? [] : ['acontecimentos'];
  return [...telasAntesDaVenda, ...soParaQuemJaTemCusteio, 'retirada-da-familia', 'revisao'];
}

export function telaSeguinte(tela: IdDaTela, perfil: PerfilDoProdutor | null): IdDaTela {
  const telas = telasDoFluxo(perfil);
  const posicao = telas.indexOf(tela);
  return telas[Math.min(posicao + 1, telas.length - 1)];
}

export function telaAnterior(tela: IdDaTela, perfil: PerfilDoProdutor | null): IdDaTela {
  const telas = telasDoFluxo(perfil);
  const posicao = telas.indexOf(tela);
  return telas[Math.max(posicao - 1, 0)];
}

export function ehIdDeTela(valor: unknown): valor is IdDaTela {
  return typeof valor === 'string' && valor in rotuloDaTela;
}

/* ----------------------------------------------------------- validação */

/**
 * Um valor da tela está respondido quando é "não sei", uma faixa ou um número
 * válido. `aceitaZero` vale para quantidades que podem ser nenhuma.
 */
function valorRespondido(valor: ValorInformado | null, aceitaZero = false): boolean {
  if (valor === null) return false;
  if (valor.forma !== 'exato') return true;
  return aceitaZero ? valor.valor >= 0 : valor.valor > 0;
}

/**
 * Mensagem que impede seguir, ou `null` quando a tela está completa.
 * As mensagens dizem o que fazer, nunca o que o produtor errou.
 */
export function validarTela(tela: IdDaTela, respostas: RespostasDoDiagnostico): string | null {
  switch (tela) {
    case 'perfil':
      return respostas.perfil ? null : 'Escolha a opção que mais combina com você agora.';
    case 'cultura':
      return respostas.cultura ? null : 'Escolha a sua cultura principal.';
    case 'area':
      return valorRespondido(respostas.areaEmProducaoHectares)
        ? null
        : 'Informe a área em produção ou marque "Não sei".';
    case 'posse-da-terra':
      return respostas.posseDaTerra ? null : 'Escolha uma opção. Se não souber, escolha "Não sei dizer".';
    case 'protecao':
      return respostas.protecao.length > 0
        ? null
        : 'Marque pelo menos uma opção. Se não houver nenhuma, marque "Nenhuma dessas".';
    case 'producao':
      if (!valorRespondido(respostas.producaoEsperadaSacas)) {
        return 'Informe quantas sacas você espera colher ou marque "Não sei".';
      }
      return valorRespondido(respostas.producaoMediaSacas)
        ? null
        : 'Informe a média das últimas safras ou marque "Não sei".';
    case 'preco':
      return valorRespondido(respostas.precoPorSaca) ? null : 'Informe o preço, escolha uma faixa ou marque "Não sei".';
    case 'custo':
      if (!respostas.custoDaSafra) return 'Escolha como você prefere informar o custo.';
      if (respostas.custoDaSafra.base === 'nao-sei') return null;
      return valorRespondido(respostas.custoDaSafra.valor)
        ? null
        : 'Informe o custo, escolha uma faixa ou marque "Não sei".';
    case 'custeio':
      if (!valorRespondido(respostas.valorDoCusteio, true)) {
        return 'Informe o valor do custeio, escolha uma faixa ou marque "Não sei".';
      }
      return respostas.linhaDoCusteio ? null : 'Escolha a linha do custeio. Se não souber, escolha "Não sei".';
    case 'cafe-prometido':
      return valorRespondido(respostas.sacasPrometidas, true)
        ? null
        : 'Escolha uma opção. Se parte do café está prometida, informe quantas sacas.';
    case 'outros-pagamentos': {
      const marcados = Object.values(respostas.outrosPagamentos).filter((valor) => valor !== null);
      const todosComValor = marcados.every((valor) => valorRespondido(valor));
      return todosComValor ? null : 'Informe o valor de cada pagamento marcado, ou marque "Não sei".';
    }
    case 'preco-fechado':
      return respostas.parteComPrecoFechado ? null : 'Escolha uma opção. Se não souber, escolha "Não sei dizer".';
    case 'acontecimentos':
      return respostas.acontecimentosDaSafra.length > 0
        ? null
        : 'Marque o que aconteceu. Se nada disso aconteceu, marque "Nada disso".';
    case 'retirada-da-familia': {
      const retirada = respostas.retiradaDaFamilia;
      if (retirada?.forma === 'prefiro-nao-informar') return null;
      return valorRespondido(retirada)
        ? null
        : 'Informe um valor, escolha uma faixa, ou marque "Prefiro não informar".';
    }
    case 'revisao':
      return null;
  }
}

/** A primeira tela ainda incompleta, ou a revisão se tudo estiver respondido. */
export function primeiraTelaIncompleta(respostas: RespostasDoDiagnostico): IdDaTela {
  const telas = telasDoFluxo(respostas.perfil);
  return telas.find((tela) => validarTela(tela, respostas) !== null) ?? 'revisao';
}
