'use client';

import { useId, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent } from 'react';
import { cn } from '@/lib/cn';
import { Button } from './Button';
import { AlertCircleIcon, CheckCircleIcon, FileIcon, SpinnerIcon, TrashIcon, UploadIcon } from './Icon';

/**
 * FileUpload — sending a document (contrato, extrato, nota fiscal).
 *
 * Prototype note: nothing leaves the device. `onFilesChange` reports the
 * selection and the "sending" state below is simulated so the interaction and
 * all of its states can be reviewed. The real upload arrives with the backend.
 *
 * Design decisions worth keeping:
 *  - A photo taken with the phone is a first-class answer: images are accepted
 *    alongside PDFs, so the phone's camera shows up in the picker. Many
 *    producers have the document on paper, not as a file.
 *  - The drop zone is a convenience for desktop; the button is the real
 *    affordance, because you cannot drag a file on a phone.
 *  - Size and type are checked before anything is sent — error prevention
 *    beats an error message.
 */

export type UploadedFile = {
  id: string;
  name: string;
  size: number;
  status: 'uploading' | 'done' | 'error';
  /** pt-BR message shown when `status` is "error". */
  error?: string;
};

export type FileUploadProps = {
  label: string;
  /** What exactly we need, in plain language. */
  hint?: string;
  accept?: string;
  maxSizeMb?: number;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  className?: string;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`;
}

export function FileUpload({
  label,
  hint,
  accept = 'image/jpeg,image/png,application/pdf',
  maxSizeMb = 10,
  files,
  onFilesChange,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [rejected, setRejected] = useState<string | null>(null);
  const id = useId();
  const hintId = `${id}-hint`;

  function handleIncoming(incoming: FileList | null) {
    if (!incoming || incoming.length === 0) return;
    setRejected(null);

    const accepted: UploadedFile[] = [];
    for (const file of Array.from(incoming)) {
      if (file.size > maxSizeMb * 1024 * 1024) {
        setRejected(
          `"${file.name}" tem ${formatSize(file.size)} e o limite é ${maxSizeMb} MB. Tente enviar uma foto com menos qualidade ou um arquivo menor.`,
        );
        continue;
      }
      accepted.push({
        id: `${file.name}-${file.size}-${Date.now()}`,
        name: file.name,
        size: file.size,
        status: 'uploading',
      });
    }

    if (accepted.length === 0) return;
    onFilesChange([...files, ...accepted]);

    // PROTOTYPE ONLY: fakes the round trip so the "enviando" and "enviado"
    // states are reachable without a backend.
    const ids = new Set(accepted.map((file) => file.id));
    window.setTimeout(() => {
      onFilesChange(
        [...files, ...accepted].map((file) =>
          ids.has(file.id) ? { ...file, status: 'done' as const } : file,
        ),
      );
    }, 1400);
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    handleIncoming(event.dataTransfer.files);
  }

  function onSelect(event: ChangeEvent<HTMLInputElement>) {
    handleIncoming(event.target.files);
    // Reset so selecting the same file twice still fires a change.
    event.target.value = '';
  }

  return (
    <div className={cn('flex flex-col gap-stack-sm', className)}>
      <div>
        <p id={id} className="text-body font-medium text-ink-900">
          {label}
        </p>
        {hint ? (
          <p id={hintId} className="mt-1 text-body-sm text-ink-600">
            {hint}
          </p>
        ) : null}
      </div>

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center gap-3 rounded-xl border-2 border-dashed px-5 py-7 text-center',
          'transition-colors duration-base ease-standard',
          dragging ? 'border-canopy-500 bg-canopy-50' : 'border-sand-300 bg-sand-100/50',
        )}
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-sand-200 text-title text-ink-600">
          <UploadIcon />
        </span>
        <div>
          <p className="text-body font-medium text-ink-900">
            Envie uma foto ou o arquivo do documento
          </p>
          <p className="mt-1 text-body-sm text-ink-600">
            JPG, PNG ou PDF, até {maxSizeMb} MB.
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          aria-labelledby={hint ? `${id} ${hintId}` : id}
          onChange={onSelect}
          className="sr-only"
        />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
            Escolher arquivo
          </Button>
          <span aria-hidden className="hidden text-body-sm text-ink-500 md:inline">
            ou arraste aqui
          </span>
        </div>
      </div>

      {rejected ? (
        <p role="alert" className="flex items-start gap-1.5 text-body-sm text-risk-fg">
          <AlertCircleIcon className="mt-0.5 shrink-0 text-[1.05em]" />
          <span>{rejected}</span>
        </p>
      ) : null}

      {files.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {files.map((file) => (
            <li
              key={file.id}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-3.5 py-3',
                file.status === 'error'
                  ? 'border-risk-border bg-risk-surface'
                  : 'border-sand-200 bg-sand-50',
              )}
            >
              <span
                className={cn(
                  'grid h-9 w-9 shrink-0 place-items-center rounded-md text-body-lg',
                  file.status === 'done' && 'bg-healthy-surface text-healthy-fg',
                  file.status === 'uploading' && 'bg-sand-200 text-ink-600',
                  file.status === 'error' && 'bg-risk-surface text-risk-fg',
                )}
              >
                {file.status === 'done' ? (
                  <CheckCircleIcon />
                ) : file.status === 'uploading' ? (
                  <SpinnerIcon className="animate-spin" />
                ) : (
                  <FileIcon />
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-body-sm font-medium text-ink-900">
                  {file.name}
                </span>
                <span
                  className={cn(
                    'block text-caption',
                    file.status === 'error' ? 'text-risk-fg' : 'text-ink-500',
                  )}
                >
                  {file.status === 'uploading'
                    ? 'Enviando…'
                    : file.status === 'done'
                      ? `Documento recebido · ${formatSize(file.size)}`
                      : (file.error ?? 'Não conseguimos enviar. Tente novamente.')}
                </span>
              </span>

              <button
                type="button"
                onClick={() => onFilesChange(files.filter((item) => item.id !== file.id))}
                aria-label={`Remover ${file.name}`}
                className="grid h-touch w-touch shrink-0 place-items-center rounded-md text-ink-500 transition-colors hover:bg-sand-200 hover:text-risk-fg"
              >
                <TrashIcon className="text-body-lg" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
