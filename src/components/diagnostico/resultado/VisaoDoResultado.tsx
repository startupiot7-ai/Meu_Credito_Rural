import { Alert, ButtonLink, Card, StatusBadge } from '@/components/ui';
import type { ResultadoDoDiagnostico } from '@/lib/diagnostico/tipos';
import { tomDaSituacao } from './aparencia';

/**
 * O resultado do diagnóstico preventivo.
 *
 * A regra mais importante do produto mora aqui: isto nunca pode parecer um
 * score. Não há número sozinho nem nota. O produtor recebe a leitura da safra
 * (o que encontramos), o que ela significa e UM próximo passo.
 */
export function VisaoDoResultado({
  resultado,
  acaoPrincipal,
}: {
  resultado: ResultadoDoDiagnostico;
  /** Botão do próximo passo: revisar as respostas, ou fazer o próprio diagnóstico no exemplo. */
  acaoPrincipal: { rotulo: string; destino: string };
}) {
  return (
    <article className="animate-fade-up">
      <p className="text-caption font-semibold uppercase tracking-[0.12em] text-canopy-600">
        Diagnóstico indicativo
      </p>
      <StatusBadge tone={tomDaSituacao[resultado.situacao]} className="mt-4">
        {resultado.rotuloDaSituacao}
      </StatusBadge>
      <h1 className="mt-4 text-title lg:text-title-lg">{resultado.frase}</h1>
      <p className="mt-3 max-w-prose text-body-sm text-ink-600">
        Isto é uma simulação feita com o que você informou. Não é aprovação, recomendação nem garantia de crédito.
      </p>

      <section aria-labelledby="proximo-passo" className="mt-10">
        <h2 id="proximo-passo" className="text-title">
          Próximo passo
        </h2>
        <Card variant="beam" className="mt-4">
          <h3 className="text-title-sm">{resultado.proximoPasso.titulo}</h3>
          <p className="mt-2 text-body leading-relaxed text-ink-700">{resultado.proximoPasso.descricao}</p>
          <div className="mt-6">
            <ButtonLink href={acaoPrincipal.destino}>{acaoPrincipal.rotulo}</ButtonLink>
          </div>
        </Card>
      </section>

      <Alert tone="info" title="Esta análise é indicativa" className="mt-10">
        Ela não representa aprovação, recomendação ou garantia de concessão de crédito. Foi feita com as
        informações que você forneceu e com hipóteses que ainda estão sendo validadas. Quem decide sobre
        crédito é sempre a instituição, e quem decide se contrata é você.
      </Alert>
    </article>
  );
}
