'use client';

import { useId } from 'react';
import { cn } from '@/lib/cn';

/**
 * Interruptor de autorização para UMA instituição.
 *
 * REGRA OBRIGATÓRIA (LGPD): este controle representa um consentimento
 * explícito. Ele nunca pode aparecer ligado sem que o produtor o tenha ligado.
 * Por isso `autorizado` é obrigatório e não tem valor padrão: quem usa o
 * componente precisa passar o estado real, que começa em `false`
 * (veja `consentimentoInicial`). Não adicione `autorizado = true` como padrão.
 *
 * O estado aparece em texto ("Autorizado" / "Não autorizado"), e não só pela
 * cor ou pela posição do botão.
 */
export function InterruptorDeConsentimento({
  nomeDaInstituicao,
  tipoDeInstituicao,
  autorizado,
  autorizadoDesde,
  aoAlterar,
}: {
  nomeDaInstituicao: string;
  tipoDeInstituicao: string;
  autorizado: boolean;
  /** Texto já formatado, como "26/09/2026". */
  autorizadoDesde?: string;
  aoAlterar: (autorizar: boolean) => void;
}) {
  const identificadorDoRotulo = useId();
  const identificadorDaDescricao = useId();

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 rounded-xl border-2 p-4 transition-colors duration-base ease-standard',
        autorizado ? 'border-canopy-600 bg-canopy-50' : 'border-sand-300 bg-sand-50',
      )}
    >
      <div className="min-w-0">
        <p id={identificadorDoRotulo} className="text-body font-medium text-ink-900">
          {nomeDaInstituicao}
        </p>
        <p id={identificadorDaDescricao} className="text-body-sm text-ink-600">
          {tipoDeInstituicao} ·{' '}
          {autorizado ? (
            <span className="font-medium text-canopy-700">
              Autorizado{autorizadoDesde ? ` desde ${autorizadoDesde}` : ''}
            </span>
          ) : (
            <span>Não autorizado</span>
          )}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={autorizado}
        aria-labelledby={identificadorDoRotulo}
        aria-describedby={identificadorDaDescricao}
        onClick={() => aoAlterar(!autorizado)}
        className={cn(
          'relative inline-flex h-8 w-14 shrink-0 items-center rounded-full border-2 transition-colors duration-base ease-standard',
          // Área de toque de 44px mesmo com o desenho menor.
          'before:absolute before:-inset-2 before:content-[""]',
          autorizado ? 'border-canopy-600 bg-canopy-600' : 'border-sand-400 bg-sand-200',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'inline-block h-6 w-6 rounded-full bg-sand-50 shadow-sm transition-transform duration-base ease-standard',
            autorizado ? 'translate-x-6' : 'translate-x-0.5',
          )}
        />
      </button>
    </div>
  );
}
