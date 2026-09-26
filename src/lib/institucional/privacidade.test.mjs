/**
 * Testes da proteção de privacidade do painel institucional.
 *
 * Rodam direto no Node (`npm test`), sem biblioteca extra.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  TAMANHO_MINIMO_DO_GRUPO,
  grupoTemTamanhoSeguro,
  protegerSegmentosPequenos,
} from './privacidade.ts';
import { somarProdutoresPorFaixa } from './carteira.ts';
import { carteiraDeDemonstracao } from './dados-simulados.ts';

function segmento(nome, produtoresComDiagnostico) {
  return { nome, produtoresComDiagnostico };
}

function nomesOcultos(resultado) {
  return resultado.filter((item) => !item.podeSerExibido).map((item) => item.segmento.nome);
}

describe('tamanho mínimo do grupo', () => {
  test('grupo com o tamanho mínimo pode ser exibido', () => {
    assert.equal(grupoTemTamanhoSeguro(TAMANHO_MINIMO_DO_GRUPO), true);
  });

  test('grupo com um produtor a menos que o mínimo não pode ser exibido', () => {
    assert.equal(grupoTemTamanhoSeguro(TAMANHO_MINIMO_DO_GRUPO - 1), false);
  });
});

describe('proteção de segmentos pequenos', () => {
  test('não oculta nada quando todos os grupos têm tamanho seguro', () => {
    const resultado = protegerSegmentosPequenos([segmento('A', 40), segmento('B', 12)]);
    assert.deepEqual(nomesOcultos(resultado), []);
  });

  test('oculta o grupo pequeno e também o menor grupo visível, para impedir a descoberta por subtração', () => {
    const resultado = protegerSegmentosPequenos([
      segmento('Grande', 300),
      segmento('Médio', 45),
      segmento('Pequeno', 4),
    ]);
    const pequeno = resultado.find((item) => item.segmento.nome === 'Pequeno');
    const medio = resultado.find((item) => item.segmento.nome === 'Médio');

    assert.equal(pequeno.podeSerExibido, false);
    assert.equal(pequeno.motivo, 'grupo-pequeno');
    assert.equal(medio.podeSerExibido, false);
    assert.equal(medio.motivo, 'protecao-contra-subtracao');
    assert.equal(resultado.find((item) => item.segmento.nome === 'Grande').podeSerExibido, true);
  });

  test('dois grupos pequenos que somados já têm tamanho seguro não ocultam mais ninguém', () => {
    const resultado = protegerSegmentosPequenos([
      segmento('Grande', 300),
      segmento('Pequeno 1', 6),
      segmento('Pequeno 2', 8),
    ]);
    assert.deepEqual(nomesOcultos(resultado), ['Pequeno 1', 'Pequeno 2']);
  });

  test('dois grupos pequenos que somados continuam pequenos ocultam também o menor visível', () => {
    const resultado = protegerSegmentosPequenos([
      segmento('Grande', 300),
      segmento('Médio', 30),
      segmento('Pequeno 1', 3),
      segmento('Pequeno 2', 4),
    ]);
    assert.deepEqual(nomesOcultos(resultado), ['Médio', 'Pequeno 1', 'Pequeno 2']);
  });

  test('mantém a ordem original dos segmentos', () => {
    const resultado = protegerSegmentosPequenos([segmento('B', 50), segmento('A', 5), segmento('C', 90)]);
    assert.deepEqual(
      resultado.map((item) => item.segmento.nome),
      ['B', 'A', 'C'],
    );
  });
});

describe('dados simulados da cooperativa de demonstração', () => {
  const carteira = carteiraDeDemonstracao;

  test('as faixas de risco somam o total de produtores com diagnóstico', () => {
    assert.equal(somarProdutoresPorFaixa(carteira.produtoresPorFaixa), carteira.produtoresComDiagnostico);
  });

  test('a leitura da MP soma o total de produtores com diagnóstico', () => {
    const { aparentementeAtendemOsCriterios, precisamDeMaisInformacoes, aparentementeNaoAtendem } =
      carteira.leituraDaMp;
    assert.equal(
      aparentementeAtendemOsCriterios + precisamDeMaisInformacoes + aparentementeNaoAtendem,
      carteira.produtoresComDiagnostico,
    );
  });

  for (const recorte of carteira.recortes) {
    test(`o recorte "${recorte.rotulo}" soma os mesmos totais da carteira`, () => {
      const soma = (campo) => recorte.segmentos.reduce((total, item) => total + item[campo], 0);
      assert.equal(soma('produtoresComDiagnostico'), carteira.produtoresComDiagnostico);
      assert.equal(soma('receitaProjetada'), carteira.receitaProjetadaTotal);
      assert.equal(soma('dividaInformada'), carteira.dividaInformadaTotal);
      for (const faixa of ['saudavel', 'atencao', 'risco']) {
        const somaDaFaixa = recorte.segmentos.reduce(
          (total, item) => total + item.produtoresPorFaixa[faixa],
          0,
        );
        assert.equal(somaDaFaixa, carteira.produtoresPorFaixa[faixa], `faixa ${faixa}`);
      }
      for (const item of recorte.segmentos) {
        assert.equal(somarProdutoresPorFaixa(item.produtoresPorFaixa), item.produtoresComDiagnostico, item.nome);
      }
    });
  }

  test('o recorte por núcleo oculta os dois núcleos pequenos, e só eles', () => {
    const porNucleo = carteira.recortes.find((recorte) => recorte.identificador === 'nucleo');
    assert.deepEqual(nomesOcultos(protegerSegmentosPequenos(porNucleo.segmentos)), [
      'Núcleo Serra',
      'Núcleo Vale',
    ]);
  });

  test('o recorte por cultura oculta o grupo pequeno e o menor grupo visível', () => {
    const porCultura = carteira.recortes.find((recorte) => recorte.identificador === 'cultura');
    const resultado = protegerSegmentosPequenos(porCultura.segmentos);
    assert.deepEqual(nomesOcultos(resultado), ['Café e outra cultura', 'Outras culturas']);
  });

  test('a etapa da originação soma quem autorizou esta instituição', () => {
    const { quantidadePorEtapa, autorizaramEstaInstituicao } = carteira.originacao;
    const soma = Object.values(quantidadePorEtapa).reduce((total, valor) => total + valor, 0);
    assert.equal(soma, autorizaramEstaInstituicao);
  });
});
