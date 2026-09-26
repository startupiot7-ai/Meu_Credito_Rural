import type { Metadata } from 'next';
import { PainelInstitucional } from '@/components/institucional/painel/PainelInstitucional';
import type { EstadoDoPainel } from '@/components/institucional/painel/PainelInstitucional';

export const metadata: Metadata = {
  title: 'Painel institucional',
  description: 'Visão agregada e anonimizada da carteira de associados.',
  // Área de trabalho da instituição licenciada, não é uma página para buscadores.
  robots: { index: false, follow: false },
};

function lerEstadoDoEndereco(valor: string | string[] | undefined): EstadoDoPainel {
  if (valor === 'vazio' || valor === 'carregando') return valor;
  return 'com-dados';
}

/**
 * Painel da instituição licenciada.
 *
 * Mostra apenas números agregados da carteira. Nenhum produtor é identificado,
 * exceto quando ele mesmo autorizou isso para esta instituição específica.
 */
export default async function PaginaDoPainel({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const parametros = await searchParams;
  return <PainelInstitucional estado={lerEstadoDoEndereco(parametros.estado)} />;
}
