import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Para cooperativas e sindicatos rurais',
  description:
    'Inteligência agregada e anonimizada sobre a saúde financeira dos seus associados, a partir do diagnóstico gratuito do Meu Crédito Rural.',
};

/**
 * Página de apresentação para cooperativas e sindicatos rurais.
 *
 * É um público diferente do produtor: gestores que avaliam a licença anual.
 * Esta página não substitui nem altera a página do produtor (`/`).
 */
export default function PaginaParaCooperativas() {
  return (
    <main id="conteudo" className="container-page section-y">
      <h1 className="text-display">Meu Crédito Rural para cooperativas</h1>
    </main>
  );
}
