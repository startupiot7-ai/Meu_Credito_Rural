/**
 * Ponto de entrada do motor: das respostas ao resultado completo.
 *
 * É só a ordem das etapas; cada regra mora no seu arquivo:
 *   interpretar-respostas → cenarios → margem-de-seguranca → situacao
 *   → fatores → proximo-passo → mp
 *
 * Função pura: mesma resposta, mesmo resultado. Não depende de React, de tela
 * nem de armazenamento, e roda direto no Node.
 */
import { projetarOsTresCenarios } from './cenarios.ts';
import { escolherFatores } from './fatores.ts';
import { interpretarRespostas } from './interpretar-respostas.ts';
import { calcularMargemDeSeguranca } from './margem-de-seguranca.ts';
import { lerMp } from './mp.ts';
import {
  altaDePrecoNoCenarioFavoravel,
  altaDeProducaoNoCenarioFavoravel,
  aumentoDeCustoNoCenarioDesfavoravel,
  limiteDeSafraPrometida,
  PREMISSA_A_VALIDAR,
  quedaDePrecoNoCenarioDesfavoravel,
  quedaDeProducaoNoCenarioDesfavoravel,
  toleranciaDaExpectativaSobreAMedia,
} from './premissas.ts';
import type { Premissa } from './premissas.ts';
import { escolherProximoPasso, precisaDeCaminhosDeRenegociacao } from './proximo-passo.ts';
import { classificarSituacao, escreverFrase, listarDadosQueFaltam, rotuloDaSituacao } from './situacao.ts';
import { percentual } from './texto.ts';
import type { PremissaExibida, RespostasDoDiagnostico, ResultadoDoDiagnostico } from './tipos.ts';

/**
 * As premissas que a tela mostra como hipótese em todo resultado. O prazo do
 * custeio fica de fora enquanto as taxas de juros não tiverem valor, porque
 * até lá ele não entra em nenhuma conta.
 */
const premissasDaTela: Premissa[] = [
  quedaDeProducaoNoCenarioDesfavoravel,
  quedaDePrecoNoCenarioDesfavoravel,
  aumentoDeCustoNoCenarioDesfavoravel,
  altaDeProducaoNoCenarioFavoravel,
  altaDePrecoNoCenarioFavoravel,
  toleranciaDaExpectativaSobreAMedia,
  limiteDeSafraPrometida,
];

function exibirPremissa(premissa: Premissa): PremissaExibida {
  return {
    nome: premissa.nome,
    valorEmPalavras: premissa.valor === null ? 'ainda sem valor' : percentual(premissa.valor),
    aValidar: premissa.estado === PREMISSA_A_VALIDAR,
  };
}

export function diagnosticar(respostas: RespostasDoDiagnostico): ResultadoDoDiagnostico {
  const dados = interpretarRespostas(respostas);
  const dadosQueFaltam = listarDadosQueFaltam(dados);
  const premissasUsadas = premissasDaTela.map(exibirPremissa);

  if (dadosQueFaltam.length > 0) {
    const situacao = 'dados-insuficientes';
    return {
      situacao,
      rotuloDaSituacao: rotuloDaSituacao[situacao],
      frase: escreverFrase(situacao, null, dadosQueFaltam),
      dadosQueFaltam,
      cenarios: null,
      margem: { calculavel: false, motivo: 'Faltam dados para fazer a conta.' },
      fatores: [],
      aproximacoes: dados.aproximacoes,
      premissasUsadas,
      proximoPasso: escolherProximoPasso({ dados, situacao, fatores: [], dadosQueFaltam }),
      mostrarCaminhosDeRenegociacao: false,
      mp: null,
    };
  }

  const cenarios = projetarOsTresCenarios(dados);
  const margem = calcularMargemDeSeguranca(dados, cenarios.esperado);
  const situacao = classificarSituacao(cenarios);
  const fatores = escolherFatores({ dados, cenarios, margem, situacao });
  const mostrarCaminhosDeRenegociacao = precisaDeCaminhosDeRenegociacao(dados, situacao);

  return {
    situacao,
    rotuloDaSituacao: rotuloDaSituacao[situacao],
    frase: escreverFrase(situacao, cenarios, dadosQueFaltam),
    dadosQueFaltam,
    cenarios,
    margem,
    fatores,
    aproximacoes: dados.aproximacoes,
    premissasUsadas,
    proximoPasso: escolherProximoPasso({ dados, situacao, fatores, dadosQueFaltam }),
    mostrarCaminhosDeRenegociacao,
    mp: mostrarCaminhosDeRenegociacao ? lerMp() : null,
  };
}
