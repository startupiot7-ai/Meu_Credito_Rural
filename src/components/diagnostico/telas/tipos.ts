import type { RespostasDoDiagnostico } from '@/lib/diagnostico/tipos';

/**
 * O que toda tela recebe. A tela não sabe onde está no caminho: ela mostra a
 * pergunta, grava a resposta com `atualizar` e exibe o `erro` que o fluxo
 * mandar. Quem decide quando reclamar é a validação, não a tela.
 */
export type PropsDaTela = {
  respostas: RespostasDoDiagnostico;
  atualizar: (alteracao: Partial<RespostasDoDiagnostico>) => void;
  erro: string | null;
};
