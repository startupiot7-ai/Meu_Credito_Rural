import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * A moldura de toda tela do questionário.
 *
 * Uma pergunta, uma explicação curta, a resposta e nada mais. Como a moldura
 * é sempre igual, o produtor só precisa ler o que mudou de uma tela para a
 * outra — é isso que torna "uma decisão por tela" leve.
 */
export function TelaDePergunta({
  titulo,
  ajuda,
  children,
  observacao,
  className,
}: {
  titulo: string;
  /** Uma linha que diminui o peso da pergunta, como "uma estimativa já serve". */
  ajuda?: ReactNode;
  children: ReactNode;
  /** Texto pequeno debaixo da resposta. */
  observacao?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('animate-fade-up', className)}>
      {/*
       * O fluxo foca este título a cada troca de tela, para leitores de tela
       * anunciarem a pergunta nova. Ninguém chega nele pelo Tab, por isso o
       * contorno de foco é dispensado aqui.
       */}
      <h1 tabIndex={-1} className="text-title focus:outline-none lg:text-title-lg">
        {titulo}
      </h1>
      {ajuda ? <p className="mt-2.5 text-body leading-relaxed text-ink-600">{ajuda}</p> : null}

      <div className="mt-7">{children}</div>

      {observacao ? <p className="mt-5 text-body-sm text-ink-500">{observacao}</p> : null}
    </div>
  );
}
