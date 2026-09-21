'use client';

import { Button, Card } from '@/components/ui';
import { formatCurrency, formatNumber } from '@/lib/format';
import { cropOptions, debtKindOptions, lossOptions } from '@/lib/diagnostic';
import type { Answers } from '@/lib/diagnostic';
import { QuestionStep } from './QuestionStep';

/**
 * Revisão — the last screen before the result.
 *
 * Recognition over recall: everything the producer said, in one place, each
 * line editable from here. Nobody should have to remember what they typed four
 * screens ago in order to trust the outcome.
 */
export function StepReview({
  answers,
  onEdit,
}: {
  answers: Answers;
  /** Jumps back to a specific step. */
  onEdit: (step: number) => void;
}) {
  const revenue = (answers.expectedBags ?? 0) * (answers.pricePerBag ?? 0);

  const rows = [
    {
      step: 1,
      label: 'Cultura',
      value: cropOptions.find((option) => option.value === answers.crop)?.label ?? '—',
    },
    {
      step: 2,
      label: 'Produção esperada',
      value: answers.expectedBags ? `${formatNumber(answers.expectedBags)} sacas` : '—',
    },
    {
      step: 3,
      label: 'Preço estimado por saca',
      value: answers.pricePerBag ? formatCurrency(answers.pricePerBag) : '—',
    },
    {
      step: 4,
      label: 'Dívida informada',
      value: answers.debt ? formatCurrency(answers.debt) : '—',
    },
    {
      step: 4,
      label: 'Tipo de operação',
      value: debtKindOptions.find((option) => option.value === answers.debtKind)?.label ?? '—',
    },
    {
      step: 5,
      label: 'Perda de produção',
      value: lossOptions.find((option) => option.value === answers.hadLosses)?.label ?? '—',
    },
    {
      step: 6,
      label: 'Documentos anexados',
      value:
        answers.documentNames.length > 0
          ? answers.documentNames.join(', ')
          : 'Nenhum documento anexado',
    },
  ];

  return (
    <QuestionStep
      title="Confira o que você informou"
      help="Se algo estiver diferente, é só editar. Nada é enviado até você pedir o diagnóstico."
    >
      <Card>
        <dl className="divide-y divide-sand-200">
          {rows.map((row) => (
            <div
              key={`${row.step}-${row.label}`}
              className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <dt className="text-body-sm text-ink-600">{row.label}</dt>
                <dd className="mt-0.5 break-words text-body font-medium text-ink-900">
                  {row.value}
                </dd>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(row.step)}
                className="-mr-2 shrink-0 px-3"
              >
                Editar
                <span className="sr-only"> {row.label.toLowerCase()}</span>
              </Button>
            </div>
          ))}
        </dl>
      </Card>

      {revenue > 0 ? (
        <p className="mt-5 text-body-sm leading-relaxed text-ink-600">
          Com esses números, sua receita bruta projetada é de{' '}
          <strong className="font-semibold text-ink-900">{formatCurrency(revenue)}</strong>. É
          sobre ela que vamos medir o peso da dívida.
        </p>
      ) : null}
    </QuestionStep>
  );
}
