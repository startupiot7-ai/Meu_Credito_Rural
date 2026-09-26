/**
 * Testes do formulário "Solicitar demonstração" da página para cooperativas.
 */
import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import {
  solicitacaoEmBranco,
  solicitacaoEstaValida,
  validarSolicitacaoDeDemonstracao,
} from './validar-solicitacao-de-demonstracao.ts';

const solicitacaoCompleta = {
  nome: 'Pessoa de Teste',
  cargo: 'Gerente de crédito',
  instituicao: 'Cooperativa Exemplo',
  tipoDeInstituicao: 'cooperativa',
  email: 'gerencia@cooperativa.exemplo.com.br',
  telefone: '(35) 99999-0000',
  quantidadeDeAssociados: '',
};

describe('validação da solicitação de demonstração', () => {
  test('um formulário completo é aceito, mesmo sem o número de associados', () => {
    const erros = validarSolicitacaoDeDemonstracao(solicitacaoCompleta);
    assert.equal(solicitacaoEstaValida(erros), true);
  });

  test('um formulário em branco pede todos os campos obrigatórios', () => {
    const erros = validarSolicitacaoDeDemonstracao(solicitacaoEmBranco);
    assert.deepEqual(Object.keys(erros).sort(), [
      'cargo',
      'email',
      'instituicao',
      'nome',
      'telefone',
      'tipoDeInstituicao',
    ]);
    assert.equal(erros.quantidadeDeAssociados, undefined);
  });

  test('recusa e-mail sem domínio', () => {
    const erros = validarSolicitacaoDeDemonstracao({ ...solicitacaoCompleta, email: 'gerencia@' });
    assert.match(erros.email, /formato/);
  });

  test('aceita telefone fixo com DDD e recusa telefone sem DDD', () => {
    assert.equal(
      validarSolicitacaoDeDemonstracao({ ...solicitacaoCompleta, telefone: '(35) 3333-0000' }).telefone,
      undefined,
    );
    assert.match(
      validarSolicitacaoDeDemonstracao({ ...solicitacaoCompleta, telefone: '99999-0000' }).telefone,
      /DDD/,
    );
  });

  test('campos preenchidos só com espaços contam como vazios', () => {
    const erros = validarSolicitacaoDeDemonstracao({ ...solicitacaoCompleta, nome: '   ' });
    assert.equal(erros.nome, 'Informe seu nome.');
  });
});
