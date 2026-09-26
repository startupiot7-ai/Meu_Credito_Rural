import { EyeOffIcon, LockIcon, ScaleIcon, ShieldIcon } from '@/components/ui';
import { TAMANHO_MINIMO_DO_GRUPO } from '@/lib/institucional/privacidade';

/**
 * Os limites do painel, escritos dentro do próprio painel.
 *
 * A independência do diagnóstico é o que dá valor aos números. Ela fica
 * visível aqui, e não só num documento de política, para que qualquer pessoa
 * da instituição saiba o que o painel não faz.
 */
const limites = [
  {
    Icone: LockIcon,
    texto:
      'Nenhum produtor aparece por nome, a não ser que tenha pedido conversa com esta instituição — e mesmo assim só com o resumo que ele viu.',
  },
  {
    Icone: EyeOffIcon,
    texto: `Só entra quem autorizou o uso anônimo para estatísticas, e segmentos com menos de ${TAMANHO_MINIMO_DO_GRUPO} produtores são ocultados.`,
  },
  {
    Icone: ScaleIcon,
    texto: 'O painel não dá nota nem decide crédito, e a instituição não influencia o resultado que o produtor recebe.',
  },
  {
    Icone: ShieldIcon,
    texto: 'O diagnóstico continua gratuito para o produtor, com ou sem licença da instituição.',
  },
];

export function LimitesDoPainel() {
  return (
    <section
      aria-labelledby="limites-titulo"
      className="rounded-2xl border border-canopy-200 bg-canopy-50 p-5 md:p-6"
    >
      <h2 id="limites-titulo" className="text-title-sm">
        O que este painel não faz
      </h2>
      <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {limites.map(({ Icone, texto }) => (
          <li key={texto} className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-sand-50 text-body-lg text-canopy-600">
              <Icone aria-hidden />
            </span>
            <span className="text-body-sm leading-relaxed text-ink-700">{texto}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
