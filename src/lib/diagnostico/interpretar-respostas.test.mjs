/**
 * Testes da conversão das respostas (faixas, "não sei", três formas de custo).
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { converterValor, interpretarRespostas } from './interpretar-respostas.ts';
import { faixasDePrecoPorSaca } from './premissas.ts';
import { respostasVazias } from './respostas-vazias.ts';

const exato = (valor) => ({ forma: 'exato', valor });
const faixa = (id) => ({ forma: 'faixa', faixa: id });
const naoSei = { forma: 'nao-sei' };

/** Conta com frações (como 1/3) deixa resíduos mínimos; a tela sempre arredonda. */
function quaseIgual(atual, esperado) {
  assert.ok(Math.abs(atual - esperado) < 1e-6, `${atual} deveria ser ${esperado}`);
}

function respostas(alteracoes) {
  return { ...respostasVazias, perfil: 'planejando-safra', ...alteracoes };
}

describe('conversão de faixas', () => {
  test('faixa fechada vira o ponto médio, e a aproximação é explicada', () => {
    const aproximacoes = [];
    const numero = converterValor(faixa('preco-1600-2000'), 'o preço por saca', aproximacoes, faixasDePrecoPorSaca);
    assert.deepEqual(numero, { valor: 1800, origem: 'ponto-medio-da-faixa' });
    assert.equal(aproximacoes.length, 1);
    assert.match(aproximacoes[0], /meio da faixa/);
  });

  test('faixa aberta usa o limite conhecido e avisa que pode ser maior', () => {
    const aproximacoes = [];
    const numero = converterValor(faixa('preco-acima-2400'), 'o preço por saca', aproximacoes, faixasDePrecoPorSaca);
    assert.deepEqual(numero, { valor: 2400, origem: 'limite-da-faixa-aberta' });
    assert.match(aproximacoes[0], /pode ser maior/);
  });

  test('valor exato não gera aproximação', () => {
    const aproximacoes = [];
    assert.deepEqual(converterValor(exato(1500), 'o preço', aproximacoes, faixasDePrecoPorSaca), {
      valor: 1500,
      origem: 'informado',
    });
    assert.equal(aproximacoes.length, 0);
  });

  test('"não sei" deixa o número vazio', () => {
    assert.deepEqual(converterValor(naoSei, 'o preço', [], faixasDePrecoPorSaca), { valor: null, origem: 'nao-sei' });
  });

  test('faixa inexistente é erro de programação', () => {
    assert.throws(() => converterValor(faixa('nao-existe'), 'o preço', [], faixasDePrecoPorSaca));
  });
});

describe('produção', () => {
  test('sem produção esperada, usa a média histórica e explica', () => {
    const dados = interpretarRespostas(respostas({ producaoEsperadaSacas: naoSei, producaoMediaSacas: exato(400) }));
    assert.deepEqual(dados.producaoEsperadaTotal, { valor: 400, origem: 'media-historica' });
    assert.ok(dados.aproximacoes.some((frase) => /média das últimas safras/.test(frase)));
  });

  test('na parceria, a parte do dono da terra sai da produção própria', () => {
    const dados = interpretarRespostas(
      respostas({ producaoEsperadaSacas: exato(900), posseDaTerra: 'parceria-dono-fica-com-um-terco' }),
    );
    assert.equal(dados.producaoEsperadaTotal.valor, 900);
    quaseIgual(dados.producaoPropriaEsperada.valor, 600);
  });
});

describe('custo nas três formas', () => {
  test('por hectare multiplica pela área', () => {
    const dados = interpretarRespostas(
      respostas({ areaEmProducaoHectares: exato(10), custoDaSafra: { base: 'por-hectare', valor: exato(15000) } }),
    );
    assert.deepEqual(dados.custoTotalDaSafra, { valor: 150000, origem: 'calculado' });
  });

  test('por saca multiplica pela produção esperada da lavoura', () => {
    const dados = interpretarRespostas(
      respostas({ producaoEsperadaSacas: exato(500), custoDaSafra: { base: 'por-saca', valor: exato(800) } }),
    );
    assert.equal(dados.custoTotalDaSafra.valor, 400000);
  });

  test('total da safra vale como informado', () => {
    const dados = interpretarRespostas(respostas({ custoDaSafra: { base: 'total-da-safra', valor: exato(320000) } }));
    assert.deepEqual(dados.custoTotalDaSafra, { valor: 320000, origem: 'informado' });
  });

  test('por hectare sem área não inventa custo e explica', () => {
    const dados = interpretarRespostas(respostas({ custoDaSafra: { base: 'por-hectare', valor: exato(15000) } }));
    assert.equal(dados.custoTotalDaSafra.valor, null);
    assert.ok(dados.aproximacoes.some((frase) => /Sem a área em produção/.test(frase)));
  });

  test('custo "não sei" explica a suposição usada', () => {
    const dados = interpretarRespostas(respostas({ custoDaSafra: { base: 'nao-sei' } }));
    assert.equal(dados.custoTotalDaSafra.valor, null);
    assert.ok(dados.aproximacoes.some((frase) => /pagam todo o custo/.test(frase)));
  });
});

describe('parcela do custeio', () => {
  test('sem taxa validada, a parcela é o próprio custeio e o resultado avisa', () => {
    const dados = interpretarRespostas(respostas({ valorDoCusteio: exato(200000), linhaDoCusteio: 'pronaf' }));
    assert.deepEqual(dados.parcelaDoCusteio, { valor: 200000, origem: 'estimado-sem-juros' });
    assert.ok(dados.aproximacoes.some((frase) => /juros do custeio não entraram/.test(frase)));
  });

  test('quem já tem custeio e sabe a parcela usa o valor do contrato', () => {
    const dados = interpretarRespostas(
      respostas({
        perfil: 'ja-tenho-custeio',
        valorDoCusteio: exato(200000),
        parcelaDoCusteioNaColheita: exato(221000),
      }),
    );
    assert.deepEqual(dados.parcelaDoCusteio, { valor: 221000, origem: 'informado' });
  });
});

describe('outros compromissos', () => {
  test('item não marcado não entra na conta e não gera aviso', () => {
    const dados = interpretarRespostas(respostas({}));
    assert.deepEqual(dados.arrendamento, { valor: 0, origem: 'nao-se-aplica' });
    assert.equal(dados.aproximacoes.filter((frase) => /arrendamento/.test(frase)).length, 0);
  });

  test('item marcado sem valor é avisado', () => {
    const dados = interpretarRespostas(
      respostas({ outrosPagamentos: { ...respostasVazias.outrosPagamentos, arrendamento: naoSei } }),
    );
    assert.equal(dados.arrendamento.valor, null);
    assert.ok(dados.aproximacoes.some((frase) => /arrendamento, mas não sabe o valor/.test(frase)));
  });

  test('"prefiro não informar" a retirada da família fica fora da conta, com aviso', () => {
    const dados = interpretarRespostas(respostas({ retiradaDaFamilia: { forma: 'prefiro-nao-informar' } }));
    assert.equal(dados.retiradaDaFamilia.valor, 0);
    assert.ok(dados.aproximacoes.some((frase) => /sustento da família/.test(frase)));
  });

  test('parte com preço fechado usa o meio da opção', () => {
    const dados = interpretarRespostas(respostas({ parteComPrecoFechado: 'de-um-quarto-a-metade' }));
    assert.equal(dados.parteComPrecoFechado.valor, 0.375);
  });
});
