import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';

/**
 * Rodapé da página institucional. A primeira coisa que ele diz é o limite do
 * produto: a independência do diagnóstico vale também para quem paga a licença.
 */
export function RodapeInstitucional() {
  return (
    <footer className="border-t border-sand-200 bg-sand-100">
      <div className="container-page py-10 lg:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          <div className="max-w-prose">
            <Logo />
            <p className="mt-4 text-body-sm leading-relaxed text-ink-600">
              O Meu Crédito Rural não é banco nem instituição financeira, não concede crédito e não
              renegocia dívidas. O diagnóstico é gratuito para o produtor e independente das
              instituições licenciadas, que acessam apenas informações agregadas e anonimizadas, ou
              dados de produtores que as autorizaram de forma específica.
            </p>
          </div>

          <nav aria-label="Links do rodapé" className="shrink-0">
            <h2 className="text-body-sm font-semibold text-ink-900">Navegação</h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              <li>
                <a href="#demonstracao" className="rounded-md text-body-sm text-ink-600 hover:text-ink-900">
                  Solicitar demonstração
                </a>
              </li>
              <li>
                <Link href="/painel" className="rounded-md text-body-sm text-ink-600 hover:text-ink-900">
                  Painel de demonstração
                </Link>
              </li>
              <li>
                <Link href="/" className="rounded-md text-body-sm text-ink-600 hover:text-ink-900">
                  Página para produtores
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <p className="mt-10 border-t border-sand-200 pt-6 text-caption text-ink-500">
          © {new Date().getFullYear()} Meu Crédito Rural. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
