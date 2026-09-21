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
    default: 'Meu Crédito Rural — Entenda sua dívida rural e veja os caminhos possíveis',
    template: '%s · Meu Crédito Rural',
  },
  description:
    'Entenda sua situação, simule o impacto da dívida na produção e descubra quais alternativas podem fazer sentido para o seu caso. Diagnóstico inicial simples e orientativo.',
  applicationName: 'Meu Crédito Rural',
  authors: [{ name: 'Meu Crédito Rural' }],
  keywords: [
    'crédito rural',
    'dívida rural',
    'renegociação rural',
    'produtor de café',
    'diagnóstico de dívida',
  ],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Meu Crédito Rural',
    title: 'Sua dívida rural tem caminhos. Nós ajudamos você a enxergá-los.',
    description:
      'Entenda sua situação, simule o impacto da dívida na produção e descubra quais alternativas podem fazer sentido para o seu caso.',
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
