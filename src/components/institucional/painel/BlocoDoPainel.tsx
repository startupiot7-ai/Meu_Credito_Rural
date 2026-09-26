import type { ReactNode } from 'react';
import { Card } from '@/components/ui';
import { cn } from '@/lib/cn';

/**
 * Moldura comum de cada bloco do painel: título, uma linha dizendo o que o
 * bloco responde e o conteúdo. Todos os blocos seguem a mesma ordem, para o
 * gestor aprender a ler o painel uma vez só.
 */
export function BlocoDoPainel({
  identificador,
  titulo,
  descricao,
  selo,
  children,
  className,
}: {
  identificador: string;
  titulo: string;
  descricao?: ReactNode;
  /** Um selo curto ao lado do título, como "Indicativo". */
  selo?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const identificadorDoTitulo = `${identificador}-titulo`;

  return (
    <section aria-labelledby={identificadorDoTitulo} className={cn('min-w-0', className)}>
      <Card className="h-full">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 max-w-prose">
            <h2 id={identificadorDoTitulo} className="text-title-sm">
              {titulo}
            </h2>
            {descricao ? <p className="mt-1 text-body-sm text-ink-600">{descricao}</p> : null}
          </div>
          {selo ? <div className="shrink-0">{selo}</div> : null}
        </div>
        {children}
      </Card>
    </section>
  );
}
