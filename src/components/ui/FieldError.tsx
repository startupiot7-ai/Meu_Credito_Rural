import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { AlertCircleIcon } from './Icon';

/**
 * FieldError — a única forma visual de mostrar um erro junto de um campo.
 *
 * Ícone + texto (a cor nunca é o único sinal). Todo erro de campo, em campo
 * de texto, grupo de opções ou caixa de marcação, passa por aqui, para ter o
 * mesmo tamanho, a mesma cor e o mesmo ícone em toda parte.
 *
 * `id` deve ser ligado ao campo com `aria-describedby`. O erro interrompe a
 * leitura (`role="alert"`), então o resumo visual da barra fixa do
 * questionário fica fora da árvore de acessibilidade para não repetir.
 */
export function FieldError({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p id={id} role="alert" className={cn('flex items-start gap-1.5 text-body-sm text-risk-fg', className)}>
      <AlertCircleIcon aria-hidden className="mt-0.5 shrink-0 text-[1.05em]" />
      <span>{children}</span>
    </p>
  );
}
