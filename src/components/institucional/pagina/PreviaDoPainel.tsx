import { AlertCircleIcon, AlertTriangleIcon, ArrowRightIcon, ButtonLink, ChartIcon } from '@/components/ui';
import { Section } from '@/components/landing/Section';
import { CartaoDeIndicador } from '@/components/institucional/painel/CartaoDeIndicador';
import { RecortesDaCarteira } from '@/components/institucional/painel/RecortesDaCarteira';
import { formatNumber, formatPercent } from '@/lib/format';
import { calcularPercentual } from '@/lib/institucional/carteira';
import { carteiraDeDemonstracao } from '@/lib/institucional/dados-simulados';

/**
 * Prévia do painel dentro da página de vendas.
 *
 * Usa os mesmos componentes do painel real, com os mesmos dados fictícios, e
 * não uma imagem. Assim o visitante pode trocar o recorte e ver a proteção de
 * grupos pequenos funcionando.
 */
export function PreviaDoPainel() {
  const carteira = carteiraDeDemonstracao;

  return (
    <Section
      id="o-painel"
      eyebrow="O que a instituição recebe"
      title="Um painel que mostra, em segundos, onde a safra não sustenta o crédito"
      description="Quantos associados cobrem a safra com folga, quantos ficam apertados num ano pior e em quais núcleos isso se concentra."
      tone="sand"
    >
      <div className="overflow-hidden rounded-3xl border border-sand-300 bg-sand-50 shadow-lg">
        <div className="flex items-center justify-between gap-3 border-b border-sand-200 bg-sand-100 px-5 py-3">
          <span className="flex items-center gap-1.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-sand-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-sand-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-sand-400" />
          </span>
          <span className="text-caption text-ink-500">Painel institucional · exemplo com dados fictícios</span>
        </div>

        <div className="flex flex-col gap-5 p-5 md:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <CartaoDeIndicador
              icone={<ChartIcon aria-hidden />}
              rotulo="Diagnósticos concluídos"
              valor={formatNumber(carteira.produtoresComDiagnostico)}
              contexto={`${formatPercent(
                Math.round(calcularPercentual(carteira.produtoresComDiagnostico, carteira.produtoresAcompanhados)),
              )} dos associados acompanhados`}
            />
            <CartaoDeIndicador
              tom="risco"
              icone={<AlertCircleIcon aria-hidden />}
              rotulo="Não cobrem no cenário esperado"
              valor={formatNumber(carteira.produtoresPorSituacao['nao-cobre'])}
              contexto="Já falta dinheiro se tudo sair como esperam"
            />
            <CartaoDeIndicador
              icone={<AlertTriangleIcon aria-hidden />}
              rotulo="Cobrem, mas apertados"
              valor={formatNumber(carteira.produtoresPorSituacao['cobre-apertado'])}
              contexto="Faltaria dinheiro numa safra pior"
            />
          </div>
          <RecortesDaCarteira recortes={carteira.recortes} />
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-body-sm text-ink-600">
          O painel completo inclui também a margem de segurança, as exposições da carteira, a
          necessidade potencial de renegociação e os pedidos de conversa.
        </p>
        <ButtonLink href="/painel" variant="secondary" iconRight={<ArrowRightIcon />}>
          Abrir o painel de demonstração
        </ButtonLink>
      </div>
    </Section>
  );
}
