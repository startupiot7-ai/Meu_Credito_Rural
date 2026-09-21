'use client';

import {
  Alert,
  CurrencyInput,
  FileUpload,
  QuantityInput,
  RadioCard,
  RadioCardGroup,
  Term,
} from '@/components/ui';
import type { UploadedFile } from '@/components/ui';
import { formatCurrency } from '@/lib/format';
import { cropOptions, debtKindOptions, lossOptions } from '@/lib/diagnostic';
import type { Answers } from '@/lib/diagnostic';
import { QuestionStep } from './QuestionStep';

/**
 * The seven steps of the diagnostic.
 *
 * Each one receives the whole answer set and a single `update` function, so a
 * step never has to know where it sits in the flow. Validation messages arrive
 * from the parent as `error` — a step does not decide when to complain.
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
    <QuestionStep
      title="O que você produz hoje?"
      help="Isso nos ajuda a usar os números certos para a sua cultura."
    >
      <RadioCardGroup legend="Escolha a sua principal cultura" error={error ?? undefined}>
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
    <QuestionStep
      title="Quantas sacas você espera colher nesta safra?"
      help="Uma estimativa já serve. Dá para ajustar depois."
      footnote="Se a safra ainda está em formação, responda com o que você espera hoje."
    >
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
    <QuestionStep
      title="Qual preço você estima receber por saca?"
      help="Use o preço que você considera realista para esta safra."
    >
      <CurrencyInput
        label="Preço estimado por saca"
        value={answers.pricePerBag}
        onValueChange={(value) => update({ pricePerBag: value })}
        error={error ?? undefined}
        autoFocus
      />

      {revenue > 0 ? (
        <div
          className="mt-5 rounded-xl border border-sand-200 bg-sand-100/70 p-4"
          aria-live="polite"
        >
          <p className="text-body-sm text-ink-600">
            Com {answers.expectedBags?.toLocaleString('pt-BR')} sacas a esse preço, sua{' '}
            <Term term="receitaBruta">receita bruta projetada</Term> fica em
          </p>
          <p className="mt-1 font-display text-title font-bold tabular-nums text-canopy-700">
            {formatCurrency(revenue)}
          </p>
        </div>
      ) : null}
    </QuestionStep>
  );
}

export function StepDebt({ answers, update, error }: StepProps) {
  // The amount and the kind belong to the same decision — "a sua dívida" — so
  // they share a screen. Anything that would be a second decision does not.
  const amountError = error && answers.debt === null ? error : undefined;
  const kindError = error && answers.debt !== null && !answers.debtKind ? error : undefined;

  return (
    <QuestionStep
      title="Quanto você deve hoje?"
      help="Some as operações que você conhece. Não precisa ser exato agora."
      footnote="Se houver operações em instituições diferentes, informe o total aproximado."
    >
      <div className="flex flex-col gap-7">
        <CurrencyInput
          label="Dívida informada"
          labelAdornment={<Term term="saldoDevedor" />}
          value={answers.debt}
          onValueChange={(value) => update({ debt: value })}
          error={amountError}
          autoFocus
        />

        <RadioCardGroup
          legend="Que tipo de operação é essa?"
          hint="Se não souber, escolha “Não sei”. Dá para confirmar depois."
          error={kindError}
        >
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
      help="Seca, geada, chuva fora de hora, praga — qualquer evento que reduziu a sua colheita."
      footnote="Perdas comprovadas são consideradas em várias alternativas de renegociação."
    >
      <RadioCardGroup legend="Houve perda de produção?" error={error ?? undefined}>
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
      title="Quer anexar algum documento agora?"
      help="É opcional. Sem documento você já recebe o diagnóstico — ele apenas fica mais preciso com um."
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

      <Alert tone="info" title="Você pode seguir sem anexar" className="mt-6">
        Se não tiver os documentos agora, siga assim mesmo. No fim mostramos exatamente qual
        documento falta e como pedi-lo.
      </Alert>
    </QuestionStep>
  );
}
