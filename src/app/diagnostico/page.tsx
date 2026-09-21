'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import {
  Alert,
  Button,
  ArrowRightIcon,
  ChevronLeftIcon,
  CloudOffIcon,
  ConfirmDialog,
  SaveIcon,
  StepProgress,
} from '@/components/ui';
import type { UploadedFile } from '@/components/ui';
import {
  StepCrop,
  StepDebt,
  StepDocuments,
  StepHistory,
  StepPrice,
  StepProduction,
} from '@/components/diagnostic/Steps';
import type { StepProps } from '@/components/diagnostic/Steps';
import { StepReview } from '@/components/diagnostic/StepReview';
import { TOTAL_STEPS, stepLabels, validateStep } from '@/lib/diagnostic';
import { useOnlineStatus, useSavedAnswers } from '@/lib/useSavedAnswers';

/**
 * The diagnostic flow.
 *
 * PROTOTYPE: everything here is local component state plus `localStorage`.
 * There is no account, no server and no submission — "Ver meu diagnóstico"
 * navigates to a results screen computed in the browser from the same answers.
 *
 * The three behaviours this screen exists to prove:
 *  1. One question per screen, with a visible position on the path.
 *  2. You can always go back, edit, or leave and come back.
 *  3. A dropped connection costs nothing, and we say so instead of hiding it.
 */

const steps: Array<(props: StepProps) => React.ReactElement> = [
  StepCrop,
  StepProduction,
  StepPrice,
  StepDebt,
  StepHistory,
  StepDocuments,
];

export default function DiagnosticPage() {
  const router = useRouter();
  const { answers, setAnswers, step, setStep, savedAt, restored, hadSavedProgress, clear } =
    useSavedAnswers();
  const online = useOnlineStatus();

  const [error, setError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<UploadedFile[]>([]);
  const [confirmingRestart, setConfirmingRestart] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const headingRef = useRef<HTMLDivElement>(null);

  // Moving between steps sends focus to the new question, so keyboard and
  // screen-reader users are not left at the bottom of the previous screen.
  useEffect(() => {
    headingRef.current?.querySelector<HTMLElement>('h1')?.focus();
  }, [step]);

  const update = useCallback(
    (patch: Parameters<typeof setAnswers>[0]) => {
      setError(null);
      setAnswers(patch);
    },
    [setAnswers],
  );

  function goNext() {
    const message = validateStep(step, answers);
    if (message) {
      setError(message);
      return;
    }
    setError(null);
    setStep(Math.min(step + 1, TOTAL_STEPS));
  }

  function goBack() {
    setError(null);
    setStep(Math.max(step - 1, 1));
  }

  function saveForLater() {
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 4000);
  }

  function submit() {
    // PROTOTYPE: a short delay so the loading state is visible; the result is
    // computed from `answers` on the next screen, not fetched.
    setSubmitting(true);
    window.setTimeout(() => router.push('/diagnostico/resultado'), 600);
  }

  const isReview = step === TOTAL_STEPS;
  const CurrentStep = steps[step - 1];

  const savedTime = savedAt
    ? new Date(savedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <div className="flex min-h-dvh flex-col bg-sand-50">
      <header className="border-b border-sand-200 bg-sand-50">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" aria-label="Meu Crédito Rural, página inicial" className="rounded-md">
            <Logo />
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setConfirmingRestart(true)}
            className="shrink-0"
          >
            Recomeçar
          </Button>
        </div>
      </header>

      <main id="conteudo" className="flex-1">
        <div className="container-page max-w-2xl py-6 lg:py-10">
          <StepProgress current={step} total={TOTAL_STEPS} labels={[...stepLabels]} />

          {/* Connectivity is a first-class state, not an error. */}
          {!online ? (
            <Alert
              tone="attention"
              icon={<CloudOffIcon />}
              title="Sua conexão caiu."
              className="mt-6"
            >
              Suas respostas estão salvas neste dispositivo. Pode continuar respondendo
              normalmente — quando a conexão voltar, nada terá se perdido.
            </Alert>
          ) : null}

          {/* Shown on return, so picking up again is not a surprise. */}
          {restored && hadSavedProgress && step > 1 && online ? (
            <Alert tone="info" title="Você voltou de onde parou." className="mt-6">
              Encontramos respostas salvas neste dispositivo
              {savedTime ? ` às ${savedTime}` : ''}. Se preferir começar do zero, use
              “Recomeçar”.
            </Alert>
          ) : null}

          <div ref={headingRef} className="mt-8">
            {isReview ? (
              <StepReview answers={answers} onEdit={(target) => setStep(target)} />
            ) : (
              <CurrentStep
                answers={answers}
                update={update}
                error={error}
                documents={documents}
                setDocuments={setDocuments}
              />
            )}
          </div>
        </div>
      </main>

      {/*
       * The action bar is pinned to the bottom on mobile: the producer's thumb
       * is already there, and "Voltar" must be as reachable as "Continuar".
       */}
      <div className="sticky bottom-0 border-t border-sand-200 bg-sand-50/95 backdrop-blur-sm">
        <div className="container-page max-w-2xl py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {savedNotice ? (
            <p
              role="status"
              className="mb-3 flex items-center gap-2 text-body-sm font-medium text-healthy-fg"
            >
              <SaveIcon className="text-body-lg" />
              Suas respostas estão salvas neste dispositivo
              {savedTime ? ` (${savedTime})` : ''}. Pode fechar e voltar depois.
            </p>
          ) : null}

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              onClick={goBack}
              disabled={step === 1}
              iconLeft={<ChevronLeftIcon />}
              className="shrink-0"
            >
              Voltar
            </Button>

            {isReview ? (
              <Button onClick={submit} loading={submitting} loadingLabel="Preparando" fullWidth>
                Ver meu diagnóstico
              </Button>
            ) : (
              <Button onClick={goNext} iconRight={<ArrowRightIcon />} fullWidth>
                Continuar
              </Button>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={saveForLater}
              className="inline-flex min-h-touch items-center gap-2 rounded-md text-body-sm font-medium text-canopy-700 transition-colors hover:text-canopy-800"
            >
              <SaveIcon className="text-body-lg" />
              Salvar e continuar depois
            </button>
            <p className="text-caption text-ink-500">
              Etapa {step} de {TOTAL_STEPS}
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingRestart}
        onClose={() => setConfirmingRestart(false)}
        onConfirm={() => {
          clear();
          setDocuments([]);
          setError(null);
          setConfirmingRestart(false);
        }}
        title="Recomeçar o diagnóstico?"
        description="Suas respostas serão apagadas deste dispositivo e você voltará à primeira pergunta. Não dá para desfazer."
        confirmLabel="Sim, recomeçar"
        cancelLabel="Continuar de onde parei"
        destructive
      />
    </div>
  );
}
