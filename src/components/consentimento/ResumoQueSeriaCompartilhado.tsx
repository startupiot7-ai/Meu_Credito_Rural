import { montarResumoCompartilhado } from '@/lib/consentimento/resumo-compartilhado';
import type { ResultadoDoDiagnostico } from '@/lib/diagnostico/tipos';

/**
 * Mostra ao produtor, com o resultado dele, exatamente o que uma instituição
 * autorizada receberia. Consentimento só é informado quando a pessoa vê o que
 * está autorizando — e o que NÃO está.
 */
export function ResumoQueSeriaCompartilhado({ resultado }: { resultado: ResultadoDoDiagnostico }) {
  const linhas = montarResumoCompartilhado(resultado);

  return (
    <div>
      <dl className="divide-y divide-sand-200 rounded-xl border border-sand-200 bg-sand-50">
        {linhas.map((linha) => (
          <div key={linha.rotulo} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-3">
            <dt className="text-body-sm text-ink-600">{linha.rotulo}</dt>
            <dd className="text-body font-medium text-ink-900">{linha.valor}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-body-sm leading-relaxed text-ink-600">
        <strong className="font-semibold text-ink-800">Não são compartilhados:</strong> suas respostas, os valores
        que você informou (produção, preço, custo, custeio e outros pagamentos), a retirada da família e documentos.
      </p>
    </div>
  );
}
