import { AlertTriangleIcon, Card, InfoIcon, StatusBadge } from '@/components/ui';
import type {
  FatorEncontrado,
  LeituraDaMpNoDiagnostico,
  PremissaExibida,
} from '@/lib/diagnostico/tipos';

/** Até três fatores, do que mais pesou para o que menos pesou. */
export function FatoresEncontrados({ fatores }: { fatores: FatorEncontrado[] }) {
  if (fatores.length === 0) {
    return (
      <Card>
        <p className="text-body leading-relaxed text-ink-800">
          Nada nos seus números chamou atenção além do que os cenários já mostram.
        </p>
      </Card>
    );
  }
  return (
    <ol className="flex flex-col gap-3">
      {fatores.map((fator) => (
        <li key={fator.id}>
          <Card>
            <h3 className="flex items-start gap-2 text-body font-semibold text-ink-900">
              <AlertTriangleIcon aria-hidden className="mt-0.5 shrink-0 text-attention-fg" />
              {fator.titulo}
            </h3>
            <p className="mt-2 text-body-sm leading-relaxed text-ink-700">{fator.explicacao}</p>
          </Card>
        </li>
      ))}
    </ol>
  );
}

/**
 * O que foi aproximado e quais hipóteses a simulação usou. Fica sempre
 * visível: um resultado sem as suas premissas não dá para conferir.
 */
export function HipotesesEAproximacoes({
  aproximacoes,
  premissas,
}: {
  aproximacoes: string[];
  premissas: PremissaExibida[];
}) {
  return (
    <Card variant="flat">
      {aproximacoes.length > 0 ? (
        <>
          <h3 className="text-body font-semibold text-ink-900">Números aproximados nesta simulação</h3>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-body-sm leading-relaxed text-ink-700">
            {aproximacoes.map((frase) => (
              <li key={frase}>{frase}</li>
            ))}
          </ul>
        </>
      ) : null}

      <h3 className={aproximacoes.length > 0 ? 'mt-6 text-body font-semibold text-ink-900' : 'text-body font-semibold text-ink-900'}>
        Hipóteses usadas
      </h3>
      <p className="mt-1 text-body-sm text-ink-600">
        São hipóteses de simulação, ainda em validação com fontes como Conab, Cepea e Embrapa.
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {premissas.map((premissa) => (
          <li key={premissa.nome} className="flex flex-wrap items-center justify-between gap-2 text-body-sm">
            <span className="text-ink-700">
              {premissa.nome}: <strong className="font-semibold text-ink-900">{premissa.valorEmPalavras}</strong>
            </span>
            {premissa.aValidar ? (
              <StatusBadge tone="info" size="sm">
                A validar
              </StatusBadge>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/**
 * Só aparece para quem já tem custeio e já está com dificuldade. A MP é uma
 * das saídas possíveis, não o centro: e enquanto os critérios não forem
 * validados, o texto não diz se ela se aplica.
 */
export function CaminhosDeRenegociacao({ mp }: { mp: LeituraDaMpNoDiagnostico | null }) {
  return (
    <Card>
      <p className="text-body leading-relaxed text-ink-800">
        Prorrogar uma parcela ou renegociar a dívida são caminhos que existem no crédito rural, por exemplo
        quando a safra frustra. Cada instituição analisa o caso: procure a sua antes do vencimento e peça por
        escrito as opções que existem para você.
      </p>
      {mp ? (
        <div className="mt-5 rounded-xl border border-info-border bg-info-surface p-4">
          <p className="flex items-start gap-2 text-body-sm font-semibold text-info-fg">
            <InfoIcon aria-hidden className="mt-0.5 shrink-0" />
            MP 1.376/2026: ainda não avaliada
          </p>
          <p className="mt-2 text-body-sm leading-relaxed text-ink-700">{mp.motivo}</p>
          {mp.criteriosPendentes.length > 0 ? (
            <p className="mt-2 text-body-sm text-ink-600">
              Em confirmação: {mp.criteriosPendentes.join('; ').toLowerCase()}.
            </p>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
