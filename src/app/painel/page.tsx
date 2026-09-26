import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Painel institucional',
  description: 'Visão agregada e anonimizada da carteira de associados.',
  // Área de trabalho da instituição licenciada, não é uma página para buscadores.
  robots: { index: false, follow: false },
};

/**
 * Painel da instituição licenciada.
 *
 * Mostra apenas números agregados da carteira. Nenhum produtor é identificado,
 * exceto quando ele mesmo autorizou isso para esta instituição específica.
 */
export default function PaginaDoPainel() {
  return (
    <main id="conteudo" className="container-page section-y">
      <h1 className="text-display">Painel institucional</h1>
    </main>
  );
}
