/**
 * Etapa opcional depois do resultado do diagnóstico: o produtor decide se quer
 * ser apresentado a instituições de crédito participantes.
 *
 * O título da página vem do layout de `/diagnostico`, que já impede indexação.
 */
export default function PaginaDeConsentimento() {
  return (
    <main id="conteudo" className="container-page max-w-3xl py-8 lg:py-12">
      <h1 className="text-title-lg lg:text-display">Apresentar seu diagnóstico a instituições</h1>
    </main>
  );
}
