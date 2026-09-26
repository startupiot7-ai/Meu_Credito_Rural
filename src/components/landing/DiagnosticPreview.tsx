import { AlertCircleIcon, ButtonLink, Card, CheckCircleIcon, StepProgress } from '@/components/ui';
import { diagnosticar } from '@/lib/diagnostico/diagnosticar';
import { exemploJaTenhoCusteioApertado } from '@/lib/diagnostico/exemplos';
import { rotuloDaTela, telasDoFluxo } from '@/lib/diagnostico/fluxo';
import { percentual, reaisArredondados } from '@/lib/diagnostico/texto';
import type { NomeDoCenario } from '@/lib/diagnostico/tipos';
import { Section } from './Section';

/** O caminho de quem planeja a safra, usado só para ilustrar a barra de progresso. */
const telasDeExemplo = telasDoFluxo('planejando-safra');

/**
 * O resultado de verdade de um exemplo fictício, calculado pelo mesmo motor
 * do diagnóstico. Nada aqui é inventado para a vitrine.
 */
const resultadoDeExemplo = diagnosticar(exemploJaTenhoCusteioApertado);

const nomeCurto: Record<NomeDoCenario, string> = {
  esperado: 'Como você espera',
  desfavoravel: 'Se vier pior',
  favoravel: 'Se vier melhor',
};

/**
 * Diagnóstico (prévia) — a pergunta, depois a resposta.
 *
 * O cartão da direita mostra a forma do resultado: três cenários e a margem de
 * segurança. Não é uma nota: é uma conta que o produtor pode conferir.
 */
export function DiagnosticPreview() {
  const { cenarios, margem } = resultadoDeExemplo;

  return (
    <Section id="diagnostico" eyebrow="Diagnóstico" title="Uma pergunta por vez. Três cenários, não uma nota.">
      <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
        {/* A pergunta, do jeito que o produtor vai ver. */}
        <Card className="flex flex-col">
          <StepProgress
            current={6}
            total={telasDeExemplo.length}
            labels={telasDeExemplo.map((tela) => rotuloDaTela[tela])}
          />

          <div className="mt-6 flex-1">
            <h3 className="text-title-sm">Quantas sacas você espera colher?</h3>
            <p className="mt-2 text-body text-ink-600">Uma estimativa já serve.</p>

            <div className="mt-5 flex items-stretch overflow-hidden rounded-lg border border-sand-300 bg-sand-50">
              <span className="flex min-h-touch items-center px-4 py-3 text-body tabular-nums text-ink-900">600</span>
              <span className="ml-auto flex items-center border-l border-sand-200 bg-sand-100 px-4 text-body font-medium text-ink-600">
                sacas
              </span>
            </div>
          </div>
        </Card>

        {/* A resposta: quanto sobra ou falta em cada cenário. */}
        {cenarios && margem.calculavel ? (
          <Card className="flex flex-col">
            <h3 className="text-title-sm">O que sobra depois de pagar tudo</h3>
            <ul className="mt-5 flex flex-1 flex-col gap-4">
              {(['esperado', 'desfavoravel', 'favoravel'] as const).map((nome) => {
                const sobra = cenarios[nome].recursosAposCompromissos;
                return (
                  <li key={nome} className="flex items-start justify-between gap-3">
                    <span className="text-body text-ink-800">{nomeCurto[nome]}</span>
                    <span
                      className={
                        sobra < 0
                          ? 'flex shrink-0 items-center gap-1.5 whitespace-nowrap font-semibold tabular-nums text-risk-fg'
                          : 'flex shrink-0 items-center gap-1.5 whitespace-nowrap font-semibold tabular-nums text-healthy-fg'
                      }
                    >
                      {sobra < 0 ? <AlertCircleIcon aria-hidden /> : <CheckCircleIcon aria-hidden />}
                      {sobra < 0 ? `faltam ${reaisArredondados(-sobra)}` : `sobram ${reaisArredondados(sobra)}`}
                    </span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-5 border-t border-sand-200 pt-4 text-body-sm leading-relaxed text-ink-700">
              Margem de segurança: a colheita pode ser até{' '}
              <strong className="font-semibold">{percentual(margem.quebraDeProducaoSuportada.fracao)}</strong> menor
              antes de faltar dinheiro. Exemplo com respostas fictícias.
            </p>
          </Card>
        ) : null}
      </div>

      <div className="mt-8 flex flex-col gap-3 md:flex-row">
        <ButtonLink href="/diagnostico" size="lg">
          Simular minha safra
        </ButtonLink>
        <ButtonLink href="/diagnostico/exemplo/ja-tenho-custeio" size="lg" variant="secondary">
          Ver este exemplo completo
        </ButtonLink>
      </div>
    </Section>
  );
}
