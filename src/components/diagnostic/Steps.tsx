'use client';

import {
  CurrencyInput,
  FileUpload,
  QuantityInput,
  RadioCard,
  RadioCardGroup,
} from '@/components/ui';
import type { UploadedFile } from '@/components/ui';
import { formatCurrency, formatNumber } from '@/lib/format';
import { cropOptions, debtKindOptions, lossOptions } from '@/lib/diagnostic';
import type { Answers } from '@/lib/diagnostic';
import { QuestionStep } from './QuestionStep';

/**
 * The seven steps of the diagnostic.
 *
 * Simplification pass. Three things came out of every screen:
 *  - the radio group legend that repeated the heading word for word (it is
 *    still there for screen readers, just not shown twice);
 *  - the footnotes under the controls, which were reassurance about a question
 *    that was not frightening in the first place;
 *  - the "saldo devedor" tooltip. The label now says "Quanto você deve hoje",
 *    which is the same thing in words the producer already uses.
 *
 * Each step still receives the whole answer set and one `update` function, and
 * validation messages still arrive from the parent as `error` — a step does not
 * decide when to complain.
 */

export type StepProps = {
  answers: Answers;
  update: (patch: Partial<Answers>) => void;
  error: string | null;
  /** Documents attached in this session. Not persisted: files are not serialisable. */
  documents: UploadedFile[];
  setDocuments: (files: UploadedFile[]) => void;
};

export function StepCrop({ answers, update, error }: StepProps) {
  return (
    <QuestionStep title="O que você produz hoje?">
      <RadioCardGroup legend="O que você produz hoje?" hideLegend error={error ?? undefined}>
        {cropOptions.map((option) => (
          <RadioCard
            key={option.value}
            name="crop"
            value={option.value}
            checked={answers.crop === option.value}
            onChange={(value) => update({ crop: value as Answers['crop'] })}
            label={option.label}
            description={option.description}
          />
        ))}
      </RadioCardGroup>
    </QuestionStep>
  );
}

export function StepProduction({ answers, update, error }: StepProps) {
  return (
    <QuestionStep title="Quantas sacas você espera colher?" help="Uma estimativa já serve.">
      <QuantityInput
        label="Produção esperada"
        suffix="sacas"
        value={answers.expectedBags}
        onValueChange={(value) => update({ expectedBags: value })}
        error={error ?? undefined}
        autoFocus
      />
    </QuestionStep>
  );
}

export function StepPrice({ answers, update, error }: StepProps) {
  const revenue = (answers.expectedBags ?? 0) * (answers.pricePerBag ?? 0);

  return (
    <QuestionStep title="Qual preço você espera por saca?">
      <CurrencyInput
        label="Preço por saca"
        value={answers.pricePerBag}
        onValueChange={(value) => update({ pricePerBag: value })}
        error={error ?? undefined}
        autoFocus
      />

      {/* The multiplication, written out as soon as both numbers exist. */}
      {revenue > 0 ? (
        <p className="mt-5 text-body-lg leading-relaxed text-ink-700" aria-live="polite">
          {formatNumber(answers.expectedBags ?? 0)} sacas × {formatCurrency(answers.pricePerBag ?? 0)} ={' '}
          <strong className="font-semibold tabular-nums text-canopy-700">
            {formatCurrency(revenue)}
          </strong>{' '}
          esperados nesta safra.
        </p>
      ) : null}
    </QuestionStep>
  );
}

export function StepDebt({ answers, update, error }: StepProps) {
  // Amount and kind are two halves of one thing — "a sua dívida" — so they
  // share a screen. Anything that would be a second decision does not.
  const amountError = error && answers.debt === null ? error : undefined;
  const kindError = error && answers.debt !== null && !answers.debtKind ? error : undefined;

  return (
    <QuestionStep
      title="Quanto você deve hoje?"
      help="Some as operações que você conhece. Não precisa ser exato."
    >
      <div className="flex flex-col gap-8">
        <CurrencyInput
          label="Quanto você deve"
          value={answers.debt}
          onValueChange={(value) => update({ debt: value })}
          error={amountError}
          autoFocus
        />

        <RadioCardGroup legend="Que tipo de operação é essa?" error={kindError}>
          {debtKindOptions.map((option) => (
            <RadioCard
              key={option.value}
              name="debtKind"
              value={option.value}
              checked={answers.debtKind === option.value}
              onChange={(value) => update({ debtKind: value as Answers['debtKind'] })}
              label={option.label}
              description={option.description}
            />
          ))}
        </RadioCardGroup>
      </div>
    </QuestionStep>
  );
}

export function StepHistory({ answers, update, error }: StepProps) {
  return (
    <QuestionStep
      title="Você teve perda de produção nas últimas safras?"
      help="Seca, geada, chuva fora de hora, praga — o que reduziu a colheita."
      footnote="Perdas comprovadas contam em várias alternativas de renegociação."
    >
      <RadioCardGroup
        legend="Você teve perda de produção nas últimas safras?"
        hideLegend
        error={error ?? undefined}
      >
        {lossOptions.map((option) => (
          <RadioCard
            key={option.value}
            name="hadLosses"
            value={option.value}
            checked={answers.hadLosses === option.value}
            onChange={(value) => update({ hadLosses: value as Answers['hadLosses'] })}
            label={option.label}
            description={option.description}
          />
        ))}
      </RadioCardGroup>
    </QuestionStep>
  );
}

export function StepDocuments({ update, documents, setDocuments }: StepProps) {
  return (
    <QuestionStep
      title="Quer anexar algum documento?"
      help="É opcional. Sem documento você já recebe o diagnóstico."
      footnote="No fim mostramos qual documento falta e como pedir."
    >
      <FileUpload
        label="Contrato ou extrato da operação"
        hint="Se estiver no papel, uma foto legível já serve."
        files={documents}
        onFilesChange={(files) => {
          setDocuments(files);
          update({ documentNames: files.map((file) => file.name) });
        }}
      />
    </QuestionStep>
  );
}
