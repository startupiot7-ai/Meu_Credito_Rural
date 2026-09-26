import { notFound } from 'next/navigation';
import { CabecalhoComVolta } from '@/components/diagnostico/CabecalhoComVolta';
import { VisaoDoResultado } from '@/components/diagnostico/resultado/VisaoDoResultado';
import { Alert } from '@/components/ui';
import { diagnosticar } from '@/lib/diagnostico/diagnosticar';
import { exemploJaTenhoCusteioApertado, exemploPlanejandoComFolga } from '@/lib/diagnostico/exemplos';
import type { RespostasDoDiagnostico } from '@/lib/diagnostico/tipos';

/**
 * "Ver com um exemplo": o resultado de respostas fictícias, para demonstração.
 *
 * Não lê nem grava nada no aparelho: as respostas do produtor continuam
 * intactas. A conta é a mesma de um diagnóstico de verdade.
 */
const exemplos: Record<string, { respostas: RespostasDoDiagnostico; descricao: string }> = {
  'ja-tenho-custeio': {
    respostas: exemploJaTenhoCusteioApertado,
    descricao:
      'Produtor com custeio já contratado: 20 hectares, 600 sacas esperadas, sem seguro nem irrigação, com uma parcela de investimento e parte do café prometida.',
  },
  'planejando-safra': {
    respostas: exemploPlanejandoComFolga,
    descricao:
      'Produtor planejando a próxima safra: 15 hectares, 450 sacas esperadas, com seguro e irrigação em parte, pensando em R$ 200 mil de custeio.',
  },
};

export function generateStaticParams() {
  return Object.keys(exemplos).map((exemplo) => ({ exemplo }));
}

export default async function PaginaDoExemplo({ params }: { params: Promise<{ exemplo: string }> }) {
  const { exemplo } = await params;
  const escolhido = exemplos[exemplo];
  if (!escolhido) notFound();

  const resultado = diagnosticar(escolhido.respostas);

  return (
    <div className="flex min-h-dvh flex-col bg-sand-50">
      <CabecalhoComVolta destino="/diagnostico" rotuloCurto="Voltar" rotuloCompleto="Voltar ao diagnóstico" />
      <main id="conteudo" className="flex-1">
        <div className="container-page max-w-3xl py-8 lg:py-12">
          <Alert tone="info" title="Este é um exemplo com respostas fictícias" className="mb-8">
            {escolhido.descricao} Nenhuma resposta sua foi usada ou alterada.
          </Alert>
          <VisaoDoResultado
            resultado={resultado}
            acaoPrincipal={{ rotulo: 'Fazer o meu diagnóstico', destino: '/diagnostico' }}
          />
        </div>
      </main>
    </div>
  );
}
