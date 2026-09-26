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
import { somarProdutoresPorSituacao, somarQuantidades } from './carteira.ts';
import { ROTULOS_DO_RESUMO } from '../consentimento/resumo-compartilhado.ts';
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
  const total = carteira.produtoresComDiagnostico;

  test('as situações da safra somam o total de produtores com diagnóstico', () => {
    assert.equal(somarProdutoresPorSituacao(carteira.produtoresPorSituacao), total);
  });

  test('as faixas de margem, a exposição climática e os perfis somam o mesmo total', () => {
    assert.equal(somarQuantidades(carteira.produtoresPorMargem), total);
    assert.equal(somarQuantidades(carteira.exposicaoClimatica), total);
    assert.equal(somarQuantidades(carteira.porPerfil), total);
  });

  test('quem está sem margem é exatamente quem não cobre no esperado', () => {
    assert.equal(carteira.produtoresPorMargem['sem-margem'], carteira.produtoresPorSituacao['nao-cobre']);
  });

  test('sinais de dificuldade só vêm de quem já tem custeio', () => {
    assert.ok(carteira.comSinaisDeDificuldade <= carteira.porPerfil.jaTemCusteio);
  });

  for (const recorte of carteira.recortes) {
    test(`o recorte "${recorte.rotulo}" soma os mesmos totais da carteira`, () => {
      const soma = (campo) => recorte.segmentos.reduce((acumulado, item) => acumulado + item[campo], 0);
      assert.equal(soma('produtoresComDiagnostico'), total);
      assert.equal(soma('comCompromissosForaDoBanco'), carteira.comCompromissosForaDoBanco);
      for (const situacao of ['cobre-com-folga', 'cobre-apertado', 'nao-cobre']) {
        const somaDaSituacao = recorte.segmentos.reduce(
          (acumulado, item) => acumulado + item.produtoresPorSituacao[situacao],
          0,
        );
        assert.equal(somaDaSituacao, carteira.produtoresPorSituacao[situacao], `situação ${situacao}`);
      }
      for (const item of recorte.segmentos) {
        assert.equal(somarProdutoresPorSituacao(item.produtoresPorSituacao), item.produtoresComDiagnostico, item.nome);
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

  test('cada pedido de conversa traz só as três linhas que o produtor viu', () => {
    const { pedidos } = carteira.pedidosDeConversa;
    assert.ok(pedidos.length <= carteira.pedidosDeConversa.autorizaramEstaInstituicao);
    for (const pedido of pedidos) {
      assert.deepEqual(
        pedido.resumo.map((linha) => linha.rotulo),
        [...ROTULOS_DO_RESUMO],
        pedido.referencia,
      );
      assert.doesNotMatch(pedido.resumo.map((linha) => linha.valor).join(' '), /R\$/);
    }
  });

  test('não existe etapa de venda nos pedidos de conversa', () => {
    for (const pedido of carteira.pedidosDeConversa.pedidos) {
      assert.deepEqual(Object.keys(pedido).sort(), ['autorizadoEm', 'referencia', 'resumo', 'situacao']);
    }
  });
});
