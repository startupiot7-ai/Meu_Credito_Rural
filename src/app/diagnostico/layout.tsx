import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diagnóstico indicativo',
  description:
    'Responda uma pergunta por vez e veja, em três cenários, se a sua safra aguenta o custeio. Sem CPF; as respostas ficam salvas neste aparelho.',
  // The diagnostic is a private working surface, not a page to be indexed.
  robots: { index: false, follow: true },
};

export default function DiagnosticLayout({ children }: { children: React.ReactNode }) {
  return children;
}
