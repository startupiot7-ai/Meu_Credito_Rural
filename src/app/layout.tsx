import type { Metadata, Viewport } from 'next';
import { Inter, Source_Serif_4 } from 'next/font/google';
import './globals.css';

/**
 * Fonts are self-hosted by `next/font` — no runtime request to a third party,
 * which is what keeps first paint honest on a weak rural connection.
 * Only the weights we actually use are loaded.
 */
const sans = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Source_Serif_4({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Meu Crédito Rural — Veja se a sua safra aguenta o crédito antes de contratar',
    template: '%s · Meu Crédito Rural',
  },
  description:
    'Veja a sua safra em três cenários e descubra quanto ela pode piorar antes de faltar dinheiro, antes de assumir o custeio. Gratuito, independente e sem CPF.',
  applicationName: 'Meu Crédito Rural',
  authors: [{ name: 'Meu Crédito Rural' }],
  keywords: [
    'crédito rural',
    'crédito de custeio',
    'planejamento de safra',
    'risco da safra',
    'produtor de café',
    'capacidade de pagamento',
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Meu Crédito Rural',
    title: 'Antes de assumir o custeio, veja se a sua safra aguenta.',
    description:
      'Três cenários da safra e a sua margem de segurança, antes que o problema vire dívida. Gratuito e independente.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FDFBF6',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${display.variable}`}>
      <body>
        <a className="skip-link" href="#conteudo">
          Ir para o conteúdo principal
        </a>
        {children}
      </body>
    </html>
  );
}
