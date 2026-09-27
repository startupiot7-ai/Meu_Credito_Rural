import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ButtonLink } from '@/components/ui';

const secoesDaPagina = [
  { endereco: '#como-funciona', rotulo: 'Como funciona' },
  { endereco: '#o-painel', rotulo: 'O painel' },
  { endereco: '#privacidade', rotulo: 'Privacidade' },
];

/**
 * Cabeçalho da página para instituições. Mesmo desenho do cabeçalho do
 * produtor, com um caminho de volta para quem chegou aqui por engano.
 */
export function CabecalhoInstitucional() {
  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/95 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/cooperativas" aria-label="Meu Crédito Rural para instituições" className="shrink-0 rounded-md">
            <Logo compactOnMobile />
          </Link>
          <span className="hidden whitespace-nowrap rounded-full bg-canopy-50 px-2.5 py-1 text-caption font-semibold text-canopy-700 md:inline">
            Para instituições
          </span>
        </div>

        <nav aria-label="Seções da página" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {secoesDaPagina.map((secao) => (
              <li key={secao.endereco}>
                <a
                  href={secao.endereco}
                  className="whitespace-nowrap rounded-md px-3 py-2 text-body-sm text-ink-700 transition-colors hover:bg-sand-100 hover:text-ink-900"
                >
                  {secao.rotulo}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/"
            className="hidden whitespace-nowrap rounded-md px-3 py-2 text-body-sm text-ink-600 hover:text-ink-900 xl:block"
          >
            Sou produtor
          </Link>
          {/* No celular, a frase inteira empurrava a página para o lado. */}
          <ButtonLink href="#demonstracao" size="sm">
            <span className="sm:hidden">Demonstração</span>
            <span className="hidden sm:inline">Solicitar demonstração</span>
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
