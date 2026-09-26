import { Card, ComparisonBar } from '@/components/ui';
import { percentual, sacas } from '@/lib/diagnostico/texto';
import type { MargemDeSeguranca, ResultadoDoCenario } from '@/lib/diagnostico/tipos';

/**
 * "Quanto minha safra pode piorar antes de faltar dinheiro?"
 *
 * Cada linha é uma piora sozinha, com o resto como o produtor espera. A barra
 * fica destacada quando a margem é menor que a hipótese do cenário
 * desfavorável: é ali que a safra é mais sensível.
 */
export function BlocoDaMargem({
  margem,
  desfavoravel,
}: {
  margem: MargemDeSeguranca;
  desfavoravel: ResultadoDoCenario;
}) {
  if (!margem.calculavel) return null;

  const quebra = margem.quebraDeProducaoSuportada;
  if (quebra.fracao === 0) {
    return (
      <Card>
        <p className="text-body leading-relaxed text-ink-800">
          Já falta dinheiro no cenário esperado, então não há margem para a safra piorar. O mais importante é
          entender de onde vem a diferença.
        </p>
      </Card>
    );
  }

  const { variacaoDaProducao, variacaoDoPreco, variacaoDoCusto } = desfavoravel.hipoteses;
  const preco = margem.quedaDePrecoSuportada;

  return (
    <Card>
      <p className="text-body-sm text-ink-600">Cada linha considera só aquela piora, com o resto como você espera.</p>
      <div className="mt-5 flex flex-col gap-5">
        <div>
          <ComparisonBar
            label="A colheita pode ser menor em até"
            value={quebra.fracao * 100}
            max={100}
            valueLabel={percentual(quebra.fracao)}
            highlighted={quebra.fracao < -variacaoDaProducao}
          />
          <p className="mt-1.5 text-body-sm text-ink-600">Isso é {sacas(quebra.sacas)} a menos.</p>
        </div>

        {preco.tipo === 'percentual' ? (
          <ComparisonBar
            label="O preço do dia pode cair até"
            value={preco.valor * 100}
            max={100}
            valueLabel={percentual(preco.valor)}
            highlighted={preco.valor < -variacaoDoPreco}
          />
        ) : (
          <p className="text-body-sm leading-relaxed text-ink-700">
            <strong className="font-medium text-ink-900">Preço:</strong> uma queda do preço do dia não chega a
            deixar faltar dinheiro. O risco desta safra está no volume colhido.
          </p>
        )}

        {margem.aumentoDeCustoSuportado !== null ? (
          <ComparisonBar
            label="O custo pode subir até"
            value={Math.min(margem.aumentoDeCustoSuportado, 1) * 100}
            max={100}
            valueLabel={
              margem.aumentoDeCustoSuportado >= 1 ? 'mais de 100%' : percentual(margem.aumentoDeCustoSuportado)
            }
            highlighted={margem.aumentoDeCustoSuportado < variacaoDoCusto}
          />
        ) : null}
      </div>

      {margem.mediaHistoricaAbaixoDaEsperada !== null ? (
        <p className="mt-5 border-t border-sand-200 pt-4 text-body-sm leading-relaxed text-ink-700">
          Para comparar: a sua média das últimas safras fica{' '}
          <strong className="font-semibold">{percentual(margem.mediaHistoricaAbaixoDaEsperada)}</strong> abaixo do
          que você espera colher agora.
        </p>
      ) : null}
    </Card>
  );
}
