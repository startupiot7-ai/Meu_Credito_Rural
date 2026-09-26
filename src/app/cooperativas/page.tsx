import type { Metadata } from 'next';
import { Abertura } from '@/components/institucional/pagina/Abertura';
import { CabecalhoInstitucional } from '@/components/institucional/pagina/CabecalhoInstitucional';
import { ComoFuncionaParaInstituicao } from '@/components/institucional/pagina/ComoFuncionaParaInstituicao';
import { PerguntasFrequentesInstitucionais } from '@/components/institucional/pagina/PerguntasFrequentesInstitucionais';
import { PlanosECasos } from '@/components/institucional/pagina/PlanosECasos';
import { PreviaDoPainel } from '@/components/institucional/pagina/PreviaDoPainel';
import { PrivacidadeELimites } from '@/components/institucional/pagina/PrivacidadeELimites';
import { ProblemaDaCooperativa } from '@/components/institucional/pagina/ProblemaDaCooperativa';
import { RodapeInstitucional } from '@/components/institucional/pagina/RodapeInstitucional';
import { SolicitarDemonstracao } from '@/components/institucional/pagina/SolicitarDemonstracao';

export const metadata: Metadata = {
  title: 'Para cooperativas',
  description:
    'Entenda, de forma agregada e anonimizada, quanto da safra dos seus associados sustenta o crédito, antes que o risco vire inadimplência.',
};

/**
 * Página de apresentação para cooperativas.
 *
 * É um público diferente do produtor: gestores que avaliam a licença anual.
 * Esta página não substitui nem altera a página do produtor (`/`).
 */
export default function PaginaParaCooperativas() {
  return (
    <>
      <CabecalhoInstitucional />
      <main id="conteudo">
        <Abertura />
        <ProblemaDaCooperativa />
        <ComoFuncionaParaInstituicao />
        <PreviaDoPainel />
        <PrivacidadeELimites />
        <PlanosECasos />
        <PerguntasFrequentesInstitucionais />
        <SolicitarDemonstracao />
      </main>
      <RodapeInstitucional />
    </>
  );
}
