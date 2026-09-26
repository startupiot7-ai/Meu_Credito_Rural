'use client';

import { useId } from 'react';
import { Checkbox, CurrencyInput, QuantityInput, RadioCard, RadioCardGroup } from '@/components/ui';
import type { ListaDeFaixas } from '@/lib/diagnostico/premissas';
import type { ValorInformado } from '@/lib/diagnostico/tipos';

/**
 * Um valor em reais que o produtor pode responder de três jeitos:
 * digitando, escolhendo uma faixa ou dizendo "não sei".
 *
 * Digitar desmarca a faixa, e escolher uma faixa apaga o que foi digitado:
 * só uma forma vale de cada vez.
 */
export function CampoDeValor({
  pergunta,
  rotuloDoCampo,
  faixas,
  valor,
  aoMudar,
  erro,
  desativado,
}: {
  /** A pergunta do grupo de faixas, lida por leitores de tela. */
  pergunta: string;
  /** Rótulo do campo de digitar, como "Preço por saca". */
  rotuloDoCampo: string;
  faixas: ListaDeFaixas;
  valor: ValorInformado | null;
  aoMudar: (valor: ValorInformado | null) => void;
  erro?: string;
  desativado?: boolean;
}) {
  const nomeDoGrupo = useId();
  const valorDigitado = valor?.forma === 'exato' ? valor.valor : null;

  return (
    <div className="flex flex-col gap-6">
      <CurrencyInput
        label={rotuloDoCampo}
        hint="Se souber, digite o valor aproximado."
        value={valorDigitado}
        onValueChange={(numero) => aoMudar(numero === null ? null : { forma: 'exato', valor: numero })}
        disabled={desativado}
      />

      <RadioCardGroup legend={pergunta} hideLegend hint="Ou escolha uma faixa:" error={erro}>
        {faixas.faixas.map((faixa) => (
          <RadioCard
            key={faixa.id}
            name={nomeDoGrupo}
            value={faixa.id}
            checked={valor?.forma === 'faixa' && valor.faixa === faixa.id}
            onChange={() => aoMudar({ forma: 'faixa', faixa: faixa.id })}
            label={faixa.rotulo}
            disabled={desativado}
          />
        ))}
        <RadioCard
          name={nomeDoGrupo}
          value="nao-sei"
          checked={valor?.forma === 'nao-sei'}
          onChange={() => aoMudar({ forma: 'nao-sei' })}
          label="Não sei"
          description="Tudo bem. A conta segue e mostramos o que isso muda."
          disabled={desativado}
        />
      </RadioCardGroup>
    </div>
  );
}

/**
 * Uma quantidade (sacas, hectares) que o produtor digita ou marca "não sei".
 * Não tem faixas: é um número que ele costuma saber de cabeça.
 */
export function CampoDeQuantidade({
  rotulo,
  unidade,
  dica,
  valor,
  aoMudar,
  erro,
  focarAoAbrir,
}: {
  rotulo: string;
  unidade: string;
  dica?: string;
  valor: ValorInformado | null;
  aoMudar: (valor: ValorInformado | null) => void;
  erro?: string;
  focarAoAbrir?: boolean;
}) {
  const naoSabe = valor?.forma === 'nao-sei';
  const numero = valor?.forma === 'exato' ? valor.valor : null;

  return (
    <div className="flex flex-col gap-2">
      <QuantityInput
        label={rotulo}
        hint={dica}
        suffix={unidade}
        value={numero}
        onValueChange={(digitado) => aoMudar(digitado === null ? null : { forma: 'exato', valor: digitado })}
        error={erro}
        disabled={naoSabe}
        autoFocus={focarAoAbrir}
      />
      <Checkbox
        checked={naoSabe}
        onChange={(marcado) => aoMudar(marcado ? { forma: 'nao-sei' } : null)}
        label="Não sei"
      />
    </div>
  );
}
