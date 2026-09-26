/**
 * Os fatores que mais pesaram no resultado. O resultado mostra no máximo três.
 *
 * Cada fator é uma função pequena que olha a conta e devolve o fator, ou
 * `null` quando ele não se aplica. A ORDEM da lista `verificacoes`, no fim do
 * arquivo, é a ordem de importância: do que muda a prioridade do produtor
 * para o que só ajuda a entender.
 *
 * Sempre que possível o gatilho compara a margem de segurança com as
 * hipóteses do próprio cenário desfavorável, em vez de criar um limite novo.
 */
import { projetarCenario, valorOuZero } from './cenarios.ts';
import {
  limiteDeSafraPrometida,
  quedaDePrecoNoCenarioDesfavoravel,
  quedaDeProducaoNoCenarioDesfavoravel,
  toleranciaDaExpectativaSobreAMedia,
} from './premissas.ts';
import { percentual, reaisAproximados, sacas } from './texto.ts';
import type {
  DadosDaSafra,
  FatorEncontrado,
  MargemDeSeguranca,
  NomeDoCenario,
  ResultadoDoCenario,
  SituacaoDaSafra,
} from './tipos.ts';

export const MAXIMO_DE_FATORES_NA_TELA = 3;

export type ContextoDosFatores = {
  dados: DadosDaSafra;
  cenarios: Record<NomeDoCenario, ResultadoDoCenario>;
  margem: MargemDeSeguranca;
  situacao: SituacaoDaSafra;
};

type Verificacao = (contexto: ContextoDosFatores) => FatorEncontrado | null;

const sobraEsperada = ({ cenarios }: ContextoDosFatores) => cenarios.esperado.recursosAposCompromissos;

/* ------------------------------------------------------------- fatores */

const sinaisDeDificuldade: Verificacao = ({ dados }) => {
  const sinais = dados.acontecimentos.filter(
    (acontecimento) =>
      acontecimento === 'parcela-atrasada' || acontecimento === 'ja-prorrogou' || acontecimento === 'ja-renegociou',
  );
  if (dados.perfil !== 'ja-tenho-custeio' || sinais.length === 0) return null;
  return {
    id: 'sinais-de-dificuldade',
    titulo: 'Já houve dificuldade para pagar',
    explicacao:
      'Parcela atrasada, prorrogação ou renegociação mostram que o dinheiro já ficou curto. Isso muda a prioridade: antes de planejar a próxima safra, vale resolver o que está em aberto.',
  };
};

const compromissosMaioresQueAReceita: Verificacao = (contexto) => {
  const esperado = contexto.cenarios.esperado;
  if (esperado.recursosAposCompromissos >= 0) return null;
  const saidas = esperado.custosPagosComRecursoProprio + esperado.compromissos;
  return {
    id: 'compromissos-maiores-que-a-receita',
    titulo: 'Os pagamentos passam do que a safra deve render',
    explicacao: `No cenário esperado, a venda do café rende ${reaisAproximados(
      esperado.receita,
    )}, e os custos pagos do bolso mais os compromissos somam ${reaisAproximados(saidas)}.`,
  };
};

const safraMuitoPrometida: Verificacao = ({ dados }) => {
  const producaoPropria = valorOuZero(dados.producaoPropriaEsperada);
  const prometidas = valorOuZero(dados.sacasPrometidas);
  const limite = limiteDeSafraPrometida.valor;
  const queda = quedaDeProducaoNoCenarioDesfavoravel.valor;
  if (producaoPropria <= 0 || limite === null || queda === null) return null;

  const parteDaSafraPrometida = prometidas / producaoPropria;
  if (parteDaSafraPrometida < limite) return null;

  // A quebra inteira sai das sacas livres, então elas caem mais que a colheita.
  const sacasLivres = producaoPropria - prometidas;
  const quedaDasSacasLivres = sacasLivres > 0 ? Math.min(1, (producaoPropria * queda) / sacasLivres) : 1;
  return {
    id: 'safra-muito-prometida',
    titulo: 'Grande parte da safra já está prometida',
    explicacao: `${primeiraMaiuscula(sacas(prometidas))} (${percentual(
      parteDaSafraPrometida,
    )} do seu café) vão para pagar insumos, CPR ou troca e precisam ser entregues mesmo numa quebra. Com ${percentual(
      queda,
    )} menos café, as sacas que sobram para vender caem ${percentual(quedaDasSacasLivres)}.`,
  };
};

const expectativaAcimaDaMedia: Verificacao = ({ dados }) => {
  const media = dados.producaoMediaHistorica.valor;
  const esperada = dados.producaoEsperadaTotal.valor;
  const tolerancia = toleranciaDaExpectativaSobreAMedia.valor;
  if (media === null || esperada === null || media <= 0 || tolerancia === null) return null;
  if (dados.producaoEsperadaTotal.origem === 'media-historica') return null;
  if (esperada <= media * (1 + tolerancia)) return null;

  // Quanto a sobra muda se a colheita vier igual à média: a mesma conta, com a média.
  const variacaoAteAMedia = media / esperada - 1;
  const semVariacao = { variacaoDaProducao: 0, variacaoDoPreco: 0, variacaoDoCusto: 0 };
  const naMedia = projetarCenario(dados, { ...semVariacao, variacaoDaProducao: variacaoAteAMedia }, 'esperado');
  const comoEspera = projetarCenario(dados, semVariacao, 'esperado');
  const perda = comoEspera.recursosAposCompromissos - naMedia.recursosAposCompromissos;

  return {
    id: 'expectativa-acima-da-media',
    titulo: 'Você espera colher mais que a sua média',
    explicacao: `Você espera ${sacas(esperada)}, e a média das últimas safras é ${sacas(
      media,
    )}. Se a colheita vier na média, a sobra cai ${reaisAproximados(perda)}.`,
  };
};

const margemDeProducaoCurta: Verificacao = (contexto) => {
  const { margem } = contexto;
  const queda = quedaDeProducaoNoCenarioDesfavoravel.valor;
  if (!margem.calculavel || queda === null || sobraEsperada(contexto) <= 0) return null;
  if (margem.quebraDeProducaoSuportada.fracao >= queda) return null;
  return {
    id: 'margem-de-producao-curta',
    titulo: 'Uma quebra pequena já acaba com a sobra',
    explicacao: `Uma colheita ${percentual(margem.quebraDeProducaoSuportada.fracao)} menor (${sacas(
      margem.quebraDeProducaoSuportada.sacas,
    )} a menos) já zera a sobra. A simulação do cenário desfavorável considera ${percentual(queda)}.`,
  };
};

const precoEmAberto: Verificacao = (contexto) => {
  const { margem } = contexto;
  const queda = quedaDePrecoNoCenarioDesfavoravel.valor;
  if (!margem.calculavel || queda === null || sobraEsperada(contexto) <= 0) return null;
  if (margem.quedaDePrecoSuportada.tipo !== 'percentual') return null;
  if (margem.quedaDePrecoSuportada.valor >= queda) return null;
  return {
    id: 'preco-em-aberto',
    titulo: 'A sobra depende muito do preço do dia',
    explicacao: `Se o preço das sacas ainda sem preço fechado cair ${percentual(
      margem.quedaDePrecoSuportada.valor,
    )}, a sobra acaba. A simulação do cenário desfavorável considera ${percentual(queda)}.`,
  };
};

/**
 * A safra fica apertada, mas nenhuma piora sozinha zera a sobra: é a
 * combinação delas que pesa. Só aparece quando os dois fatores acima não
 * apareceram, para não repetir a mesma ideia.
 */
const combinacaoDeQuedas: Verificacao = (contexto) => {
  const { margem, situacao } = contexto;
  if (situacao !== 'cobre-apertado' || !margem.calculavel) return null;
  if (margemDeProducaoCurta(contexto) || precoEmAberto(contexto)) return null;

  const quebra = percentual(margem.quebraDeProducaoSuportada.fracao);
  const preco = margem.quedaDePrecoSuportada;
  const limites =
    preco.tipo === 'percentual'
      ? `a produção pode cair até ${quebra}, ou o preço até ${percentual(preco.valor)}`
      : `a produção pode cair até ${quebra}`;
  return {
    id: 'combinacao-de-quedas',
    titulo: 'Nenhuma piora sozinha acaba com a sobra, mas juntas, sim',
    explicacao: `Sem mudar o resto, ${limites}, e ainda sobra dinheiro. O aperto aparece quando a colheita e o preço pioram ao mesmo tempo, como no cenário desfavorável.`,
  };
};

const custoDesconhecido: Verificacao = ({ dados }) => {
  if (dados.custoTotalDaSafra.valor !== null) return null;
  return {
    id: 'custo-desconhecido',
    titulo: 'O custo da safra não foi informado',
    explicacao:
      'Consideramos que o custeio e o café prometido pagam todo o custo. Saber o custo real é o que mais deixa esta conta firme.',
  };
};

const semProtecaoClimatica: Verificacao = ({ dados }) => {
  const { protecao } = dados;
  if (protecao.length === 0 || protecao.includes('nao-sei')) return null;
  const protegida =
    protecao.includes('irrigacao-em-toda-a-lavoura') || protecao.includes('seguro-rural') || protecao.includes('proagro');
  if (protegida) return null;
  return {
    id: 'sem-protecao-climatica',
    titulo: 'A lavoura está sem proteção contra o clima',
    explicacao:
      'Sem seguro rural, Proagro ou irrigação em toda a área, uma quebra por seca, geada ou granizo sai inteira da sua sobra.',
  };
};

const compromissosForaDoBanco: Verificacao = (contexto) => {
  const { dados } = contexto;
  const temCafePrometido = valorOuZero(dados.sacasPrometidas) > 0;
  const temComprasAPrazo = valorOuZero(dados.comprasAPrazoOuAdiantamento) > 0;
  if (!temCafePrometido && !temComprasAPrazo) return null;
  // Quando a safra já aparece como "muito prometida", este fator repetiria a ideia.
  if (safraMuitoPrometida(contexto)) return null;
  return {
    id: 'compromissos-fora-do-banco',
    titulo: 'Parte dos compromissos está fora do banco',
    explicacao:
      'Café prometido e compras a prazo na revenda não aparecem no extrato do banco, mas saem da mesma safra. Eles já estão nesta conta.',
  };
};

/* --------------------------------------------------------------- ordem */

/** Do que mais pesa para o que menos pesa. */
const verificacoes: Verificacao[] = [
  sinaisDeDificuldade,
  compromissosMaioresQueAReceita,
  safraMuitoPrometida,
  expectativaAcimaDaMedia,
  margemDeProducaoCurta,
  precoEmAberto,
  combinacaoDeQuedas,
  custoDesconhecido,
  semProtecaoClimatica,
  compromissosForaDoBanco,
];

export function escolherFatores(contexto: ContextoDosFatores): FatorEncontrado[] {
  const encontrados: FatorEncontrado[] = [];
  for (const verificar of verificacoes) {
    const fator = verificar(contexto);
    if (fator) encontrados.push(fator);
    if (encontrados.length === MAXIMO_DE_FATORES_NA_TELA) break;
  }
  return encontrados;
}

function primeiraMaiuscula(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
