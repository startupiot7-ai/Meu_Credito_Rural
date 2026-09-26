/**
 * Regras do formulário "Solicitar demonstração".
 *
 * As mensagens dizem o que fazer, não o que a pessoa errou, como no restante
 * do produto. Sem imports, para ser testado direto no Node.
 */

export type TipoDeInstituicao = 'cooperativa' | 'sindicato' | 'instituicao-de-credito' | 'outro';

export type SolicitacaoDeDemonstracao = {
  nome: string;
  cargo: string;
  instituicao: string;
  tipoDeInstituicao: TipoDeInstituicao | '';
  email: string;
  telefone: string;
  /** Opcional: ajuda a preparar a demonstração, mas não é exigido. */
  quantidadeDeAssociados: string;
};

export type ErrosDaSolicitacao = Partial<Record<keyof SolicitacaoDeDemonstracao, string>>;

export const solicitacaoEmBranco: SolicitacaoDeDemonstracao = {
  nome: '',
  cargo: '',
  instituicao: '',
  tipoDeInstituicao: '',
  email: '',
  telefone: '',
  quantidadeDeAssociados: '',
};

const formatoDeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validarSolicitacaoDeDemonstracao(
  solicitacao: SolicitacaoDeDemonstracao,
): ErrosDaSolicitacao {
  const erros: ErrosDaSolicitacao = {};

  if (!solicitacao.nome.trim()) erros.nome = 'Informe seu nome.';
  if (!solicitacao.cargo.trim()) erros.cargo = 'Informe seu cargo na instituição.';
  if (!solicitacao.instituicao.trim()) erros.instituicao = 'Informe o nome da instituição.';
  if (!solicitacao.tipoDeInstituicao) erros.tipoDeInstituicao = 'Escolha o tipo de instituição.';

  if (!solicitacao.email.trim()) {
    erros.email = 'Informe um e-mail para a resposta.';
  } else if (!formatoDeEmail.test(solicitacao.email.trim())) {
    erros.email = 'Confira o e-mail: ele precisa ter o formato nome@instituicao.com.br.';
  }

  // Telefone com DDD: 10 dígitos (fixo) ou 11 (celular).
  const digitosDoTelefone = solicitacao.telefone.replace(/\D/g, '');
  if (!digitosDoTelefone) {
    erros.telefone = 'Informe um telefone com DDD.';
  } else if (digitosDoTelefone.length < 10 || digitosDoTelefone.length > 11) {
    erros.telefone = 'Confira o telefone: use o DDD e o número, como (35) 99999-0000.';
  }

  return erros;
}

export function solicitacaoEstaValida(erros: ErrosDaSolicitacao): boolean {
  return Object.keys(erros).length === 0;
}
