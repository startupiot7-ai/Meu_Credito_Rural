import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diagnóstico indicativo',
  description:
    'Responda poucas perguntas, uma de cada vez, e entenda a sua situação de crédito rural. Suas respostas ficam salvas neste dispositivo.',
  // The diagnostic is a private working surface, not a page to be indexed.
  robots: { index: false, follow: true },
};

export default function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  return children;
}
