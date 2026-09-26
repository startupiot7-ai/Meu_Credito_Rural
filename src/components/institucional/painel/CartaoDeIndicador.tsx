import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Um número da carteira, com o que ele significa logo abaixo.
 *
 * Mesmo para o público institucional, o número nunca aparece sozinho: sempre
 * vem com o rótulo e uma linha de contexto.
 */
export function CartaoDeIndicador({
  rotulo,
  valor,
  contexto,
  icone,
  tom = 'neutro',
  className,
}: {
  rotulo: string;
  valor: ReactNode;
  contexto?: ReactNode;
  icone?: ReactNode;
  /** `risco` destaca o indicador que pede ação. Use no máximo uma vez por linha. */
  tom?: 'neutro' | 'risco';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-2xl border p-5',
        tom === 'risco'
          ? 'border-risk-border bg-risk-surface'
          : 'border-sand-200 bg-sand-50 shadow-card',
        className,
      )}
    >
      <p
        className={cn(
          'flex items-center gap-2 text-body-sm font-medium',
          tom === 'risco' ? 'text-risk-fg' : 'text-ink-600',
        )}
      >
        {icone ? <span className="text-body-lg">{icone}</span> : null}
        {rotulo}
      </p>
      <p className="font-display text-display font-bold tabular-nums text-ink-900">{valor}</p>
      {contexto ? <p className="text-body-sm text-ink-600">{contexto}</p> : null}
    </div>
  );
}
