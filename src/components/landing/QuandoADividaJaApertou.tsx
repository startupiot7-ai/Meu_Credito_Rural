import { ButtonLink, Card } from '@/components/ui';
import { Section } from './Section';

/**
 * Para quem já está com dificuldade.
 *
 * Pivotagem: a renegociação deixou de ser o centro da página e virou um
 * caminho para quem já chegou lá. A MP 1.376/2026 aparece só como uma
 * possibilidade para casos específicos, sem prometer enquadramento: os
 * critérios dela ainda estão em validação jurídica.
 */
export function QuandoADividaJaApertou() {
  return (
    <Section
      id="quando-ja-apertou"
      eyebrow="Se a dívida já apertou"
      title="Quando a conta já não fecha, ainda há caminhos"
      tone="sand"
    >
      <Card className="max-w-prose">
        <p className="text-body leading-relaxed text-ink-800">
          Quem já tem custeio também pode fazer o diagnóstico. Se a safra não cobre os pagamentos, ou se já houve
          atraso, o resultado mostra que prorrogação e renegociação existem e o que perguntar à instituição antes do
          vencimento.
        </p>
        <p className="mt-4 text-body-sm leading-relaxed text-ink-600">
          Medidas como a MP 1.376/2026 podem se aplicar a casos específicos. Os critérios dela ainda estão sendo
          confirmados, então o diagnóstico não diz se ela vale para você: quem confirma é a instituição.
        </p>
        <div className="mt-6">
          <ButtonLink href="/diagnostico" variant="secondary">
            Já tenho custeio: ver minha situação
          </ButtonLink>
        </div>
      </Card>
    </Section>
  );
}
