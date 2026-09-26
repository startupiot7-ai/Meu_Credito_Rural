'use client';

import { Button, Card, Checkbox, RadioCard, RadioCardGroup } from '@/components/ui';
import {
  acontecimentosExclusivos,
  alternarEscolha,
  opcoesDeAcontecimentos,
  opcoesDeParteComPrecoFechado,
} from '@/lib/diagnostico/opcoes';
import { faixasDeValorAnual } from '@/lib/diagnostico/premissas';
import { resumirRespostas } from '@/lib/diagnostico/resumo-das-respostas';
import type { IdDaTela } from '@/lib/diagnostico/fluxo';
import { CampoDeValor } from '../CampoDeValor';
import { TelaDePergunta } from '../TelaDePergunta';
import type { PropsDaTela } from './tipos';

export function TelaDoPrecoFechado({ respostas, atualizar, erro }: PropsDaTela) {
  return (
    <TelaDePergunta
      titulo="Quanto desta safra já tem preço fechado?"
      ajuda="Venda antecipada ou contrato com cooperativa ou trading. Não conte o café prometido para insumos."
    >
      <RadioCardGroup legend="Quanto desta safra já tem preço fechado?" hideLegend error={erro ?? undefined}>
        {opcoesDeParteComPrecoFechado.map((opcao) => (
          <RadioCard
            key={opcao.valor}
            name="preco-fechado"
            value={opcao.valor}
            checked={respostas.parteComPrecoFechado === opcao.valor}
            onChange={() => atualizar({ parteComPrecoFechado: opcao.valor })}
            label={opcao.rotulo}
            description={opcao.descricao}
          />
        ))}
      </RadioCardGroup>
    </TelaDePergunta>
  );
}

export function TelaDosAcontecimentos({ respostas, atualizar, erro }: PropsDaTela) {
  return (
    <TelaDePergunta titulo="O que já aconteceu nesta safra?" ajuda="Marque tudo o que aconteceu.">
      <fieldset className="flex flex-col gap-1 border-0 p-0">
        <legend className="sr-only">O que já aconteceu nesta safra?</legend>
        {opcoesDeAcontecimentos.map((opcao) => (
          <Checkbox
            key={opcao.valor}
            checked={respostas.acontecimentosDaSafra.includes(opcao.valor)}
            onChange={() =>
              atualizar({
                acontecimentosDaSafra: alternarEscolha(
                  respostas.acontecimentosDaSafra,
                  opcao.valor,
                  acontecimentosExclusivos,
                ),
              })
            }
            label={opcao.rotulo}
          />
        ))}
        {erro ? (
          <p role="alert" className="mt-1 text-body-sm text-risk-fg">
            {erro}
          </p>
        ) : null}
      </fieldset>
    </TelaDePergunta>
  );
}

export function TelaDaRetiradaDaFamilia({ respostas, atualizar, erro }: PropsDaTela) {
  const retirada = respostas.retiradaDaFamilia;
  const prefereNaoInformar = retirada?.forma === 'prefiro-nao-informar';

  return (
    <TelaDePergunta
      titulo="Quanto a família precisa tirar da lavoura por ano para viver?"
      ajuda="Ajuda a ver o que realmente sobra. Esta resposta nunca é compartilhada, e você pode preferir não informar."
    >
      <div className="flex flex-col gap-6">
        <Checkbox
          checked={prefereNaoInformar}
          onChange={(marcou) => atualizar({ retiradaDaFamilia: marcou ? { forma: 'prefiro-nao-informar' } : null })}
          label={<span className="text-body font-medium text-ink-900">Prefiro não informar</span>}
        />
        <CampoDeValor
          pergunta="Faixa da retirada da família por ano"
          rotuloDoCampo="Retirada da família por ano"
          faixas={faixasDeValorAnual}
          valor={prefereNaoInformar ? null : retirada}
          aoMudar={(valor) => atualizar({ retiradaDaFamilia: valor })}
          erro={erro ?? undefined}
          desativado={prefereNaoInformar}
        />
      </div>
    </TelaDePergunta>
  );
}

export function TelaDeRevisao({
  respostas,
  aoEditar,
}: {
  respostas: PropsDaTela['respostas'];
  aoEditar: (tela: IdDaTela) => void;
}) {
  const linhas = resumirRespostas(respostas);

  return (
    <TelaDePergunta
      titulo="Confira o que você informou"
      ajuda="Se algo estiver diferente, é só editar. Nada sai deste aparelho quando você pede o resultado."
    >
      <Card>
        <dl className="divide-y divide-sand-200">
          {linhas.map((linha) => (
            <div
              key={`${linha.tela}-${linha.rotulo}`}
              className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <dt className="text-body-sm text-ink-600">{linha.rotulo}</dt>
                <dd className="mt-0.5 break-words text-body font-medium text-ink-900">{linha.valor}</dd>
              </div>
              <Button variant="ghost" size="sm" onClick={() => aoEditar(linha.tela)} className="-mr-2 shrink-0 px-3">
                Editar
                <span className="sr-only"> {linha.rotulo.toLowerCase()}</span>
              </Button>
            </div>
          ))}
        </dl>
      </Card>
    </TelaDePergunta>
  );
}
