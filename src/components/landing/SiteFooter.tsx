import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';

/**
 * SiteFooter — where the legal boundary of the product is stated plainly.
 *
 * The disclaimer is not fine print hidden at the bottom of a wall of links: it
 * is the first thing in the footer, in readable type. We would rather a
 * producer understand what we are not than be surprised later.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-sand-200 bg-sand-100">
      <div className="container-page py-10 lg:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:justify-between">
          <div className="max-w-prose">
            <Logo />
            <p className="mt-4 text-body-sm leading-relaxed text-ink-600">
              O Meu Crédito Rural ajuda o produtor a entender se a safra sustenta o crédito.
              Não somos banco, cooperativa ou instituição financeira, não concedemos crédito,
              não recomendamos contratação e não renegociamos dívidas. O diagnóstico é
              indicativo, elaborado com base nas informações fornecidas por você, e não
              representa aprovação, recomendação ou garantia de crédito, nem substitui
              orientação jurídica ou contábil.
            </p>
          </div>

          <nav aria-label="Links do rodapé" className="shrink-0">
            <h2 className="text-body-sm font-semibold text-ink-900">Navegação</h2>
            <ul className="mt-3 flex flex-col gap-2.5">
              <li>
                <a href="#como-funciona" className="rounded-md text-body-sm text-ink-600 hover:text-ink-900">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="#simulador" className="rounded-md text-body-sm text-ink-600 hover:text-ink-900">
                  Simulador
                </a>
              </li>
              <li>
                <a
                  href="#perguntas-frequentes"
                  className="rounded-md text-body-sm text-ink-600 hover:text-ink-900"
                >
                  Perguntas frequentes
                </a>
              </li>
              <li>
                <Link href="/diagnostico" className="rounded-md text-body-sm text-ink-600 hover:text-ink-900">
                  Simular minha safra
                </Link>
              </li>
              <li>
                <Link href="/cooperativas" className="rounded-md text-body-sm text-ink-600 hover:text-ink-900">
                  Para cooperativas
                </Link>
              </li>
              <li>
                <Link
                  href="/design-system"
                  className="rounded-md text-body-sm text-ink-600 hover:text-ink-900"
                >
                  Design system
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
