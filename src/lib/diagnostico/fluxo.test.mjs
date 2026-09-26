/**
 * Testes do caminho do questionário, da validação, da persistência e da revisão.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { exemploJaTenhoCusteioApertado, exemploPlanejandoComFolga } from './exemplos.ts';
import {
  primeiraTelaIncompleta,
  rotuloDaTela,
  TETO_DE_TELAS,
  telaAnterior,
  telaSeguinte,
  telasDoFluxo,
  validarTela,
} from './fluxo.ts';
import { alternarEscolha } from './opcoes.ts';
import {
  CHAVE_DO_DIAGNOSTICO,
  lerEstadoSalvo,
  migrarDaVersao1,
  serializarEstado,
} from './persistencia.ts';
import { respostasVazias } from './respostas-vazias.ts';
import { resumirRespostas } from './resumo-das-respostas.ts';

describe('caminho das telas', () => {
  test('nenhum perfil passa do teto de 15 telas, contando a revisão', () => {
    for (const perfil of ['ja-tenho-custeio', 'planejando-safra', null]) {
      assert.ok(telasDoFluxo(perfil).length <= TETO_DE_TELAS, String(perfil));
    }
    assert.equal(telasDoFluxo('ja-tenho-custeio').length, 15);
    assert.equal(telasDoFluxo('planejando-safra').length, 14);
  });

  test('só quem já tem custeio responde o que aconteceu nesta safra', () => {
    assert.ok(telasDoFluxo('ja-tenho-custeio').includes('acontecimentos'));
    assert.ok(!telasDoFluxo('planejando-safra').includes('acontecimentos'));
  });

  test('o caminho começa no perfil e termina na revisão', () => {
    const telas = telasDoFluxo('planejando-safra');
    assert.equal(telas[0], 'perfil');
    assert.equal(telas.at(-1), 'revisao');
    assert.equal(telaAnterior('perfil', null), 'perfil');
    assert.equal(telaSeguinte('revisao', null), 'revisao');
    assert.equal(telaSeguinte('preco-fechado', 'planejando-safra'), 'retirada-da-familia');
    assert.equal(telaSeguinte('preco-fechado', 'ja-tenho-custeio'), 'acontecimentos');
  });

  test('os rótulos da barra de progresso não se repetem', () => {
    const rotulos = Object.values(rotuloDaTela);
    assert.equal(new Set(rotulos).size, rotulos.length);
  });
});

describe('validação', () => {
  test('cada tela de um diagnóstico em branco pede resposta, menos outros pagamentos e revisão', () => {
    for (const tela of telasDoFluxo(null)) {
      const mensagem = validarTela(tela, respostasVazias);
      if (tela === 'outros-pagamentos' || tela === 'revisao') assert.equal(mensagem, null, tela);
      else assert.equal(typeof mensagem, 'string', tela);
    }
  });

  test('os dois exemplos passam em todas as telas', () => {
    for (const respostas of [exemploJaTenhoCusteioApertado, exemploPlanejandoComFolga]) {
      for (const tela of telasDoFluxo(respostas.perfil)) {
        assert.equal(validarTela(tela, respostas), null, `${respostas.perfil}: ${tela}`);
      }
      assert.equal(primeiraTelaIncompleta(respostas), 'revisao');
    }
  });

  test('"não sei" conta como resposta', () => {
    const respostas = { ...respostasVazias, precoPorSaca: { forma: 'nao-sei' } };
    assert.equal(validarTela('preco', respostas), null);
  });

  test('produção zero não passa, mas zero sacas prometidas sim', () => {
    const respostas = {
      ...respostasVazias,
      producaoEsperadaSacas: { forma: 'exato', valor: 0 },
      producaoMediaSacas: { forma: 'nao-sei' },
      sacasPrometidas: { forma: 'exato', valor: 0 },
    };
    assert.equal(typeof validarTela('producao', respostas), 'string');
    assert.equal(validarTela('cafe-prometido', respostas), null);
  });

  test('pagamento marcado precisa de valor ou "não sei"', () => {
    const marcadoSemValor = {
      ...respostasVazias,
      outrosPagamentos: { ...respostasVazias.outrosPagamentos, arrendamento: { forma: 'exato', valor: 0 } },
    };
    assert.equal(typeof validarTela('outros-pagamentos', marcadoSemValor), 'string');
  });

  test('escolher a forma do custo sem informar o valor não deixa seguir', () => {
    const semValor = { ...respostasVazias, custoDaSafra: { base: 'por-saca', valor: null } };
    assert.equal(typeof validarTela('custo', semValor), 'string');
    const naoSabe = { ...respostasVazias, custoDaSafra: { base: 'nao-sei' } };
    assert.equal(validarTela('custo', naoSabe), null);
  });

  test('"prefiro não informar" a retirada da família é aceito', () => {
    const respostas = { ...respostasVazias, retiradaDaFamilia: { forma: 'prefiro-nao-informar' } };
    assert.equal(validarTela('retirada-da-familia', respostas), null);
  });
});

describe('múltipla escolha com opção exclusiva', () => {
  test('"Nenhuma dessas" limpa as outras, e marcar outra limpa "Nenhuma dessas"', () => {
    const exclusivas = ['nenhuma', 'nao-sei'];
    assert.deepEqual(alternarEscolha(['seguro-rural', 'proagro'], 'nenhuma', exclusivas), ['nenhuma']);
    assert.deepEqual(alternarEscolha(['nenhuma'], 'proagro', exclusivas), ['proagro']);
    assert.deepEqual(alternarEscolha(['proagro'], 'proagro', exclusivas), []);
  });
});

describe('persistência', () => {
  test('grava e lê de volta sem perder nada', () => {
    const estado = { versao: 2, respostas: exemploPlanejandoComFolga, telaAtual: 'custo', salvoEm: '2026-09-26T12:00:00.000Z' };
    assert.deepEqual(lerEstadoSalvo(serializarEstado(estado)), estado);
  });

  test('a chave é a da versão 2', () => {
    assert.equal(CHAVE_DO_DIAGNOSTICO, 'mcr:diagnostico:v2');
  });

  test('texto quebrado ou de outra versão vira null', () => {
    assert.equal(lerEstadoSalvo('{quebrado'), null);
    assert.equal(lerEstadoSalvo(JSON.stringify({ versao: 1, respostas: {} })), null);
    assert.equal(lerEstadoSalvo(null), null);
  });

  test('campo novo que não existia na gravação fica no valor vazio', () => {
    const antigo = { versao: 2, respostas: { perfil: 'planejando-safra' }, telaAtual: 'cultura', salvoEm: null };
    const lido = lerEstadoSalvo(JSON.stringify(antigo));
    assert.deepEqual(lido.respostas.outrosPagamentos, respostasVazias.outrosPagamentos);
    assert.deepEqual(lido.respostas.protecao, []);
  });

  test('tela que não existe mais leva à primeira tela incompleta', () => {
    const antigo = { versao: 2, respostas: { perfil: 'planejando-safra' }, telaAtual: 'documentos', salvoEm: null };
    assert.equal(lerEstadoSalvo(JSON.stringify(antigo)).telaAtual, 'cultura');
  });
});

describe('migração do diagnóstico antigo', () => {
  const v1 = JSON.stringify({
    answers: { crop: 'arabica', expectedBags: 500, pricePerBag: 1500, debt: 300000, debtKind: 'custeio' },
    step: 5,
  });

  test('aproveita cultura, sacas e preço e começa pelo perfil', () => {
    const migrado = migrarDaVersao1(v1);
    assert.equal(migrado.respostasAproveitadas, 3);
    assert.equal(migrado.estado.telaAtual, 'perfil');
    assert.equal(migrado.estado.respostas.cultura, 'cafe-arabica');
    assert.deepEqual(migrado.estado.respostas.producaoEsperadaSacas, { forma: 'exato', valor: 500 });
    assert.deepEqual(migrado.estado.respostas.precoPorSaca, { forma: 'exato', valor: 1500 });
  });

  test('não aproveita a dívida antiga: saldo total não é a parcela da safra', () => {
    const { respostas } = migrarDaVersao1(v1).estado;
    assert.equal(respostas.valorDoCusteio, null);
    assert.equal(respostas.parcelaDoCusteioNaColheita, null);
    assert.equal(respostas.perfil, null);
  });

  test('"café e outra cultura" não vira um tipo de café adivinhado', () => {
    const migrado = migrarDaVersao1(JSON.stringify({ answers: { crop: 'cafe-e-outras', expectedBags: 100 } }));
    assert.equal(migrado.estado.respostas.cultura, null);
    assert.equal(migrado.respostasAproveitadas, 1);
  });

  test('sem nada útil, não migra', () => {
    assert.equal(migrarDaVersao1(JSON.stringify({ answers: { debt: 1000 } })), null);
    assert.equal(migrarDaVersao1('quebrado'), null);
  });
});

describe('revisão', () => {
  test('mostra só as telas do perfil e escreve as respostas por extenso', () => {
    const linhas = resumirRespostas(exemploPlanejandoComFolga);
    assert.ok(!linhas.some((linha) => linha.tela === 'acontecimentos'));
    const preco = linhas.find((linha) => linha.rotulo === 'Preço por saca');
    assert.equal(preco.valor, 'De R$ 1.600 a R$ 2.000');
    const retirada = linhas.find((linha) => linha.tela === 'retirada-da-familia');
    assert.equal(retirada.valor, 'Prefiro não informar');
  });

  test('quem já tem custeio vê a parcela e o que aconteceu', () => {
    const linhas = resumirRespostas(exemploJaTenhoCusteioApertado);
    assert.ok(linhas.some((linha) => linha.rotulo === 'Parcela na colheita'));
    assert.ok(linhas.some((linha) => linha.tela === 'acontecimentos'));
  });
});
