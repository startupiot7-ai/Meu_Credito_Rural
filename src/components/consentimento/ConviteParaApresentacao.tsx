'use client';

import { ButtonLink, Card } from '@/components/ui';
import { quantidadeDeInstituicoesAutorizadas } from '@/lib/consentimento/consentimento';
import { useConsentimentoDeOriginacao } from '@/lib/consentimento/useConsentimentoDeOriginacao';

/**
 * Convite discreto, no fim da tela de resultado, para a etapa opcional de
 * apresentação a instituições.
 *
 * Fica depois do próximo passo e do aviso de diagnóstico indicativo, com
 * aparência secundária: o resultado continua sendo do produtor, e a
 * apresentação a instituições nunca compete com ele.
 *
 * Quando já existe alguma autorização, o mesmo lugar vira o caminho para
 * rever ou retirar, que precisa estar sempre à vista.
 */
export function ConviteParaApresentacao({ className }: { className?: string }) {
  const { consentimento, carregado } = useConsentimentoDeOriginacao();

  if (!carregado) return null;

  const quantidadeAutorizada = quantidadeDeInstituicoesAutorizadas(consentimento);

  return (
    <Card variant="flat" className={className}>
      {quantidadeAutorizada > 0 ? (
        <>
          <h2 className="text-title-sm">
            {quantidadeAutorizada === 1
              ? 'Você autorizou 1 instituição a conhecer o seu caso'
              : `Você autorizou ${quantidadeAutorizada} instituições a conhecer o seu caso`}
          </h2>
          <p className="mt-2 text-body-sm leading-relaxed text-ink-600">
            Você pode rever ou retirar essa autorização quando quiser. A retirada vale na hora.
          </p>
          <ButtonLink href="/diagnostico/consentimento" variant="secondary" size="sm" className="mt-4">
            Rever ou retirar autorização
          </ButtonLink>
        </>
      ) : (
        <>
          <p className="text-caption font-semibold uppercase tracking-[0.12em] text-ink-500">Opcional</p>
          <h2 className="mt-1 text-title-sm">Apresentar seu caso a instituições de crédito</h2>
          <p className="mt-2 text-body-sm leading-relaxed text-ink-600">
            Se quiser, você pode autorizar que o resumo deste diagnóstico seja apresentado a
            instituições participantes, para buscar condições melhores. Não autorizar não muda nada
            no seu diagnóstico.
          </p>
          <ButtonLink href="/diagnostico/consentimento" variant="ghost" size="sm" className="mt-3 -ml-3">
            Entender e decidir
          </ButtonLink>
        </>
      )}
    </Card>
  );
}
