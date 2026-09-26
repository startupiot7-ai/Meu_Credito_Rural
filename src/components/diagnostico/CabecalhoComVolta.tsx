import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink, ChevronLeftIcon } from '@/components/ui';

/** Cabeçalho das telas depois do questionário: marca à esquerda, um caminho de volta à direita. */
export function CabecalhoComVolta({
  destino,
  rotuloCurto,
  rotuloCompleto,
}: {
  destino: string;
  rotuloCurto: string;
  rotuloCompleto: string;
}) {
  return (
    <header className="border-b border-sand-200 bg-sand-50">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Meu Crédito Rural, página inicial" className="rounded-md">
          <Logo />
        </Link>
        <ButtonLink href={destino} variant="ghost" size="sm" iconLeft={<ChevronLeftIcon />} className="shrink-0">
          <span className="md:hidden">{rotuloCurto}</span>
          <span className="hidden md:inline">{rotuloCompleto}</span>
        </ButtonLink>
      </div>
    </header>
  );
}
