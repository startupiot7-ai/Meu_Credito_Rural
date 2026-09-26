import type { ReactNode } from 'react';
import { Alert, ButtonLink, Card, StatusBadge } from '@/components/ui';
import type { ResultadoDoDiagnostico } from '@/lib/diagnostico/tipos';
import { aparenciaDaSituacao } from './aparencia';
import { BlocoDaMargem } from './BlocoDaMargem';
import { CaminhosDeRenegociacao, FatoresEncontrados, HipotesesEAproximacoes } from './BlocosDeLeitura';
import { CenariosDaSafra } from './CenariosDaSafra';

/**
 * O resultado do diagnóstico preventivo.
 *
 * A regra mais importante do produto mora aqui: isto nunca pode parecer um
 * score. Não há número sozinho nem nota. A ordem da tela é a do raciocínio:
 *
 *   frase-síntese          o que isso significa, numa linha
 *   O que encontramos      os três cenários e a margem de segurança
 *   O que mais pesou       até três fatores
 *   O que fazer agora      UM próximo passo
 *   aviso                  indicativo, não é aprovação nem recomendação
 */
export function VisaoDoResultado({
  resultado,
  acaoPrincipal,
}: {
  resultado: ResultadoDoDiagnostico;
  /** Botão do próximo passo: revisar as respostas, ou fazer o próprio diagnóstico no exemplo. */
  acaoPrincipal: { rotulo: string; destino: string };
}) {
  const { cenarios } = resultado;

  return (
    <article className="animate-fade-up">
      <p className="text-caption font-semibold uppercase tracking-[0.12em] text-canopy-600">
        Diagnóstico indicativo
      </p>
      <StatusBadge tone={aparenciaDaSituacao[resultado.situacao]} className="mt-4">
        {resultado.rotuloDaSituacao}
      </StatusBadge>
      <h1 className="mt-4 text-title lg:text-title-lg">{resultado.frase}</h1>
      <p className="mt-3 max-w-prose text-body-sm text-ink-600">
        Isto é uma simulação feita com o que você informou. Não é aprovação, recomendação nem garantia de crédito.
      </p>

      {cenarios ? (
        <Secao id="encontramos" titulo="O que encontramos">
          <CenariosDaSafra cenarios={cenarios} />
          <h3 className="mt-8 text-title-sm">Sua margem de segurança</h3>
          <p className="mt-1 text-body-sm text-ink-600">Quanto a safra pode piorar antes de faltar dinheiro.</p>
          <div className="mt-4">
            <BlocoDaMargem margem={resultado.margem} desfavoravel={cenarios.desfavoravel} />
          </div>
        </Secao>
      ) : (
        <Secao id="encontramos" titulo="O que ainda falta">
          <Card>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-body leading-relaxed text-ink-800">
              {resultado.dadosQueFaltam.map((falta) => (
                <li key={falta}>{falta}</li>
              ))}
            </ul>
          </Card>
        </Secao>
      )}

      {cenarios ? (
        <Secao id="pesou" titulo="O que mais pesou">
          <FatoresEncontrados fatores={resultado.fatores} />
        </Secao>
      ) : null}

      {resultado.mostrarCaminhosDeRenegociacao ? (
        <Secao id="renegociacao" titulo="Se já está difícil pagar">
          <CaminhosDeRenegociacao mp={resultado.mp} />
        </Secao>
      ) : null}

      <Secao id="proximo-passo" titulo="O que fazer agora">
        <Card variant="beam">
          <h3 className="text-title-sm">{resultado.proximoPasso.titulo}</h3>
          <p className="mt-2 text-body leading-relaxed text-ink-700">{resultado.proximoPasso.descricao}</p>
          <div className="mt-6">
            <ButtonLink href={acaoPrincipal.destino}>{acaoPrincipal.rotulo}</ButtonLink>
          </div>
        </Card>
      </Secao>

      <Secao id="hipoteses" titulo="Como esta conta foi feita">
        <HipotesesEAproximacoes aproximacoes={resultado.aproximacoes} premissas={resultado.premissasUsadas} />
      </Secao>

      <Alert tone="info" title="Esta análise é indicativa" className="mt-10">
        Ela não representa aprovação, recomendação ou garantia de concessão de crédito. Foi feita com as
        informações que você forneceu e com hipóteses que ainda estão sendo validadas. Quem decide sobre
        crédito é sempre a instituição, e quem decide se contrata é você.
      </Alert>
    </article>
  );
}

function Secao({ id, titulo, children }: { id: string; titulo: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-10">
      <h2 id={id} className="text-title">
        {titulo}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
