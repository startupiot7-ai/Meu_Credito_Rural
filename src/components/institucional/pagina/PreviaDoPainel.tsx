import { AlertCircleIcon, ArrowRightIcon, ButtonLink, ChartIcon, ScaleIcon } from '@/components/ui';
import { Section } from '@/components/landing/Section';
import { CartaoDeIndicador } from '@/components/institucional/painel/CartaoDeIndicador';
import { RecortesDaCarteira } from '@/components/institucional/painel/RecortesDaCarteira';
import { formatNumber, formatPercent } from '@/lib/format';
import { calcularPercentual } from '@/lib/institucional/carteira';
import { carteiraDeDemonstracao } from '@/lib/institucional/dados-simulados';
import { formatarMoedaAbreviada } from '@/lib/institucional/formatacao';

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
      title="Um painel que mostra, em segundos, onde está o risco da carteira"
      description="Quantos associados estão em cada faixa, quanto da receita já está comprometido e em quais núcleos o problema se concentra."
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
              rotulo="Em risco elevado"
              valor={formatNumber(carteira.produtoresPorFaixa.risco)}
              contexto={`${formatarMoedaAbreviada(carteira.dividaNaFaixaDeRisco)} em dívidas nessa faixa`}
            />
            <CartaoDeIndicador
              icone={<ScaleIcon aria-hidden />}
              rotulo="Enquadramento indicativo na MP"
              valor={formatNumber(carteira.leituraDaMp.aparentementeAtendemOsCriterios)}
              contexto="Com base nas respostas fornecidas"
            />
          </div>
          <RecortesDaCarteira recortes={carteira.recortes} />
        </div>
      </div>

      <div className="mt-6 flex flex-col items-start gap-3 md:flex-row md:items-center md:justify-between">
        <p className="text-body-sm text-ink-600">
          O painel completo inclui também a receita comprometida, a leitura da MP 1.376/2026 e a
          originação qualificada.
        </p>
        <ButtonLink href="/painel" variant="secondary" iconRight={<ArrowRightIcon />}>
          Abrir o painel de demonstração
        </ButtonLink>
      </div>
    </Section>
  );
}
