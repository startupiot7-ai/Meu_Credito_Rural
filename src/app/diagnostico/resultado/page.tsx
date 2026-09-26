'use client';

import { useMemo } from 'react';
import { ConviteParaApresentacao } from '@/components/consentimento/ConviteParaApresentacao';
import { CabecalhoComVolta } from '@/components/diagnostico/CabecalhoComVolta';
import { VisaoDoResultado } from '@/components/diagnostico/resultado/VisaoDoResultado';
import { ButtonLink, Skeleton, SkeletonCard, SkeletonRegion, SkeletonText, StateView } from '@/components/ui';
import { diagnosticar } from '@/lib/diagnostico/diagnosticar';
import { primeiraTelaIncompleta } from '@/lib/diagnostico/fluxo';
import { useDiagnosticoSalvo } from '@/lib/useDiagnosticoSalvo';

/**
 * Tela de resultado, calculada no próprio navegador a partir das respostas
 * guardadas neste aparelho. Nada é enviado.
 */
export default function PaginaDoResultado() {
  const { respostas, restaurado } = useDiagnosticoSalvo();
  const respondeuTudo = restaurado && primeiraTelaIncompleta(respostas) === 'revisao';
  const resultado = useMemo(() => (respondeuTudo ? diagnosticar(respostas) : null), [respondeuTudo, respostas]);

  return (
    <div className="flex min-h-dvh flex-col bg-sand-50">
      <CabecalhoComVolta destino="/diagnostico" rotuloCurto="Voltar" rotuloCompleto="Voltar às perguntas" />

      <main id="conteudo" className="flex-1">
        <div className="container-page max-w-3xl py-8 lg:py-12">
          {!restaurado ? (
            <SkeletonRegion label="Carregando seu diagnóstico">
              <Skeleton className="h-9 w-3/4" />
              <SkeletonText className="mt-5" lines={2} />
              <SkeletonCard className="mt-8" />
            </SkeletonRegion>
          ) : !resultado ? (
            // Alguém chegou aqui sem terminar as perguntas.
            <StateView
              variant="empty"
              title="Ainda faltam algumas respostas"
              description="O resultado é montado com o que você informa. As perguntas são uma de cada vez, e dá para parar e voltar quando quiser."
              action={<ButtonLink href="/diagnostico">Continuar o diagnóstico</ButtonLink>}
            />
          ) : (
            <>
              <VisaoDoResultado
                resultado={resultado}
                acaoPrincipal={{ rotulo: 'Revisar minhas respostas', destino: '/diagnostico' }}
              />
              {/* Etapa opcional, depois de tudo o que é do produtor. */}
              <ConviteParaApresentacao className="mt-6" />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
