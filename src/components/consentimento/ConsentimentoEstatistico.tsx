'use client';

import { Card } from '@/components/ui';
import { useConsentimentoEstatistico } from '@/lib/consentimento/useConsentimentoEstatistico';
import { formatarData } from '@/lib/institucional/formatacao';
import { InterruptorDeConsentimento } from './InterruptorDeConsentimento';

/**
 * Consentimento 1: uso anônimo das respostas para estatísticas.
 *
 * Fica separado do pedido de conversa com instituições, começa desligado e
 * diz, antes do interruptor, o que entra e o que não entra. Dizer não, ou não
 * responder, não muda nada no diagnóstico.
 */
export function ConsentimentoEstatistico({ className }: { className?: string }) {
  const { consentimento, carregado, alterar } = useConsentimentoEstatistico();
  if (!carregado) return null;

  return (
    <Card variant="flat" className={className}>
      <p className="text-caption font-semibold uppercase tracking-[0.12em] text-ink-500">Opcional</p>
      <h2 className="mt-1 text-title-sm">Ajudar com estatísticas anônimas</h2>
      <p className="mt-2 text-body-sm leading-relaxed text-ink-600">
        Se você autorizar, suas respostas podem entrar, sem nome e somadas às de muitos produtores, nos números que
        cooperativas usam para entender o risco da safra na região. Grupos com menos de 10 produtores nunca
        aparecem. Não autorizar não muda nada no seu diagnóstico.
      </p>
      <div className="mt-4">
        <InterruptorDeConsentimento
          titulo="Uso anônimo das minhas respostas"
          detalhe="Só em números somados"
          autorizado={consentimento.autorizado}
          autorizadoDesde={consentimento.autorizadoEm ? formatarData(consentimento.autorizadoEm) : undefined}
          aoAlterar={alterar}
        />
      </div>
    </Card>
  );
}
