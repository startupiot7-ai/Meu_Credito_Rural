import { AlertCircleIcon, Card, CheckCircleIcon } from '@/components/ui';
import { cn } from '@/lib/cn';
import { reaisArredondados } from '@/lib/diagnostico/texto';
import type { NomeDoCenario, ResultadoDoCenario } from '@/lib/diagnostico/tipos';

const apresentacao: Record<NomeDoCenario, { titulo: string; explicacao: string }> = {
  esperado: {
    titulo: 'Se a safra vier como você espera',
    explicacao: 'A conta com os números que você informou.',
  },
  desfavoravel: {
    titulo: 'Se a safra vier pior que o esperado',
    explicacao:
      'Menos café e preço menor tiram receita, e o custo a mais sai do seu bolso. Os pagamentos continuam os mesmos, por isso a sobra encolhe mais rápido que a colheita.',
  },
  favoravel: {
    titulo: 'Se a safra vier melhor que o esperado',
    explicacao: 'Não é promessa: mostra só quanto a sobra muda se o ano ajudar.',
  },
};

const ordem: NomeDoCenario[] = ['esperado', 'desfavoravel', 'favoravel'];

/** Os três cenários de simulação, cada um com a hipótese escrita por extenso. */
export function CenariosDaSafra({ cenarios }: { cenarios: Record<NomeDoCenario, ResultadoDoCenario> }) {
  return (
    <div className="flex flex-col gap-4">
      {ordem.map((nome) => (
        <CartaoDoCenario key={nome} cenario={cenarios[nome]} />
      ))}
      <p className="text-caption text-ink-500">
        Valores arredondados para o milhar. São cenários de simulação, não previsões.
      </p>
    </div>
  );
}

function CartaoDoCenario({ cenario }: { cenario: ResultadoDoCenario }) {
  const { titulo, explicacao } = apresentacao[cenario.nome];
  const sobra = cenario.recursosAposCompromissos;
  const falta = sobra < 0;

  return (
    <section aria-label={titulo}>
      <Card>
        <h3 className="text-title-sm">{titulo}</h3>
        <p className="mt-1 text-body-sm text-ink-600">
          {cenario.nome === 'esperado' ? (
            cenario.hipoteseEmPalavras
          ) : (
            <>
              Hipótese da simulação, ainda a validar:{' '}
              <strong className="font-medium">{cenario.hipoteseEmPalavras.toLowerCase()}</strong>.
            </>
          )}
        </p>

        <dl className="mt-4 flex flex-col gap-2 text-body-sm">
          <LinhaDoCenario rotulo="Venda do café" valor={reaisArredondados(cenario.receita)} />
          <LinhaDoCenario
            rotulo="Custos pagos do seu bolso"
            valor={`− ${reaisArredondados(cenario.custosPagosComRecursoProprio)}`}
          />
          <LinhaDoCenario rotulo="Parcelas e outros pagamentos" valor={`− ${reaisArredondados(cenario.compromissos)}`} />
        </dl>

        {/* Ícone e texto dizem o mesmo que a cor: "sobram" ou "faltam". */}
        <p
          className={cn(
            'mt-4 flex items-center gap-2 border-t border-sand-200 pt-3 text-body font-semibold',
            falta ? 'text-risk-fg' : 'text-healthy-fg',
          )}
        >
          {falta ? <AlertCircleIcon aria-hidden /> : <CheckCircleIcon aria-hidden />}
          {falta ? `Faltam ${reaisArredondados(-sobra)}` : `Sobram ${reaisArredondados(sobra)}`}
        </p>
        <p className="mt-2 text-body-sm leading-relaxed text-ink-600">{explicacao}</p>
      </Card>
    </section>
  );
}

function LinhaDoCenario({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-ink-600">{rotulo}</dt>
      <dd className="shrink-0 whitespace-nowrap tabular-nums text-ink-900">{valor}</dd>
    </div>
  );
}
