import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { StatusBadge } from '@/components/ui';

/** Barra superior do painel: produto, área e instituição que está vendo. */
export function CabecalhoDoPainel({ nomeDaInstituicao }: { nomeDaInstituicao: string }) {
  return (
    <header className="border-b border-sand-200 bg-sand-50">
      <div className="container-page flex h-16 max-w-screen-xl items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Link href="/cooperativas" aria-label="Meu Crédito Rural para instituições" className="shrink-0 rounded-md">
            <Logo />
          </Link>
          <span aria-hidden className="hidden h-6 w-px bg-sand-300 md:block" />
          <p className="hidden min-w-0 truncate text-body-sm text-ink-700 md:block">
            Painel institucional · <span className="font-semibold text-ink-900">{nomeDaInstituicao}</span>
          </p>
        </div>
        {/* PROTÓTIPO: retirar este selo quando o painel usar dados reais. */}
        <StatusBadge tone="info" size="sm" className="shrink-0">
          Dados fictícios de demonstração
        </StatusBadge>
      </div>
    </header>
  );
}
