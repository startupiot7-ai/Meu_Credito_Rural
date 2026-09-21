'use client';

import { useCallback, useEffect, useState } from 'react';
import { STORAGE_KEY, emptyAnswers } from './diagnostic';
import type { Answers } from './diagnostic';

export type SavedState = {
  answers: Answers;
  step: number;
  /** ISO timestamp of the last write, shown as "salvo às 14:32". */
  savedAt: string | null;
};

/**
 * Keeps the diagnostic's answers on the device.
 *
 * Rural connectivity is the design constraint that produced this hook. If the
 * connection drops, the browser is closed, or the phone rings mid-question, the
 * answers are still there on return — losing twenty minutes of work is the
 * fastest way to lose the producer for good.
 *
 * Everything is wrapped in try/catch: private browsing and blocked site data
 * make `localStorage` throw rather than return null, and a diagnostic that
 * crashes is worse than one that forgets.
 */
export function useSavedAnswers() {
  const [answers, setAnswersState] = useState<Answers>(emptyAnswers);
  const [step, setStepState] = useState(1);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  /** False until the first read completes, so we never render stale defaults. */
  const [restored, setRestored] = useState(false);
  /** True when we found previous answers — used to greet the producer back. */
  const [hadSavedProgress, setHadSavedProgress] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SavedState>;
        if (parsed.answers) {
          // Merge onto the empty shape so a stored payload from an older
          // version of the form cannot leave a field undefined.
          setAnswersState({ ...emptyAnswers, ...parsed.answers });
          setHadSavedProgress(true);
        }
        if (typeof parsed.step === 'number') setStepState(parsed.step);
        if (parsed.savedAt) setSavedAt(parsed.savedAt);
      }
    } catch {
      // Storage unavailable. The diagnostic still works; it just will not
      // survive a refresh, and the UI says so.
    } finally {
      setRestored(true);
    }
  }, []);

  const persist = useCallback((nextAnswers: Answers, nextStep: number) => {
    const timestamp = new Date().toISOString();
    setSavedAt(timestamp);
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers: nextAnswers, step: nextStep, savedAt: timestamp }),
      );
      return true;
    } catch {
      return false;
    }
  }, []);

  /*
   * Both writers compute the next value up front rather than persisting from
   * inside a state updater: updaters must stay pure, and React double-invokes
   * them in development, which would write to storage twice.
   */
  const setAnswers = useCallback(
    (update: Partial<Answers>) => {
      const next = { ...answers, ...update };
      setAnswersState(next);
      persist(next, step);
    },
    [answers, persist, step],
  );

  const setStep = useCallback(
    (next: number) => {
      setStepState(next);
      persist(answers, next);
    },
    [answers, persist],
  );

  const clear = useCallback(() => {
    setAnswersState(emptyAnswers);
    setStepState(1);
    setSavedAt(null);
    setHadSavedProgress(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to clean up if storage was never available.
    }
  }, []);

  return { answers, setAnswers, step, setStep, savedAt, restored, hadSavedProgress, clear };
}

/**
 * Reports whether the browser currently believes it is online.
 *
 * Used to show "Sua conexão caiu. Suas respostas estão salvas neste
 * dispositivo." — the reassurance matters more than the warning.
 */
export function useOnlineStatus() {
  // Assume online during SSR and until proven otherwise, so the offline notice
  // never flashes on a perfectly good connection.
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const update = () => setOnline(window.navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return online;
}
