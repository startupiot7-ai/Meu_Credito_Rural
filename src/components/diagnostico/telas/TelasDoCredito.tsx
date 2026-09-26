'use client';

import { useState } from 'react';
import { Checkbox, CurrencyInput, QuantityInput, RadioCard, RadioCardGroup } from '@/components/ui';
import { opcoesDeLinhaDeCredito } from '@/lib/diagnostico/opcoes';
import { faixasDeValorAnual, faixasDeValorDaSafra } from '@/lib/diagnostico/premissas';
import type { ListaDeFaixas } from '@/lib/diagnostico/premissas';
import type { OutrosPagamentos, ValorInformado } from '@/lib/diagnostico/tipos';
import { CampoDeValor } from '../CampoDeValor';
import { TelaDePergunta } from '../TelaDePergunta';
import type { PropsDaTela } from './tipos';

export function TelaDoCusteio({ respostas, atualizar, erro }: PropsDaTela) {
  const jaTemCusteio = respostas.perfil === 'ja-tenho-custeio';
  const parcela = respostas.parcelaDoCusteioNaColheita;
  const faltaValor = erro !== null && respostas.valorDoCusteio === null;

  return (
    <TelaDePergunta
      titulo={jaTemCusteio ? 'Quanto você pegou de custeio para esta safra?' : 'Quanto você pensa em pegar de custeio?'}
      ajuda="Custeio é o dinheiro para tocar a safra: adubo, defensivo, mão de obra e colheita."
    >
      <div className="flex flex-col gap-8">
        <CampoDeValor
          pergunta="Faixa do valor do custeio"
          rotuloDoCampo="Valor do custeio"
          faixas={faixasDeValorDaSafra}
          valor={respostas.valorDoCusteio}
          aoMudar={(valor) => atualizar({ valorDoCusteio: valor })}
          erro={faltaValor ? erro : undefined}
        />

        <RadioCardGroup legend="Por qual linha?" error={!faltaValor ? erro ?? undefined : undefined}>
          {opcoesDeLinhaDeCredito.map((opcao) => (
            <RadioCard
              key={opcao.valor}
              name="linha-do-custeio"
              value={opcao.valor}
              checked={respostas.linhaDoCusteio === opcao.valor}
              onChange={() => atualizar({ linhaDoCusteio: opcao.valor })}
              label={opcao.rotulo}
              description={opcao.descricao}
            />
          ))}
        </RadioCardGroup>

        {jaTemCusteio ? (
          <CurrencyInput
            label="Se souber, quanto vai pagar na colheita, já com juros"
            hint="Está no contrato ou no extrato. Se não souber, deixe em branco."
            optional
            value={parcela?.forma === 'exato' ? parcela.valor : null}
            onValueChange={(numero) =>
              atualizar({ parcelaDoCusteioNaColheita: numero === null ? null : { forma: 'exato', valor: numero } })
            }
          />
        ) : null}
      </div>
    </TelaDePergunta>
  );
}

type RespostaDoCafePrometido = 'nao' | 'sim' | 'nao-sei';

function respostaInicialDoCafePrometido(valor: ValorInformado | null): RespostaDoCafePrometido | null {
  if (valor === null) return null;
  if (valor.forma === 'nao-sei') return 'nao-sei';
  if (valor.forma === 'exato' && valor.valor === 0) return 'nao';
  return 'sim';
}

export function TelaDoCafePrometido({ respostas, atualizar, erro }: PropsDaTela) {
  // "Sim" ainda sem número não cabe nas respostas: fica só na tela até ele digitar.
  const [escolha, mudarEscolha] = useState(() => respostaInicialDoCafePrometido(respostas.sacasPrometidas));
  const sacas = respostas.sacasPrometidas;

  function escolher(nova: RespostaDoCafePrometido) {
    mudarEscolha(nova);
    if (nova === 'nao') atualizar({ sacasPrometidas: { forma: 'exato', valor: 0 } });
    if (nova === 'nao-sei') atualizar({ sacasPrometidas: { forma: 'nao-sei' } });
    if (nova === 'sim') atualizar({ sacasPrometidas: null });
  }

  const opcoes: { valor: RespostaDoCafePrometido; rotulo: string }[] = [
    { valor: 'nao', rotulo: 'Não, nenhuma saca' },
    { valor: 'sim', rotulo: 'Sim' },
    { valor: 'nao-sei', rotulo: 'Não sei' },
  ];

  return (
    <TelaDePergunta
      titulo="Parte desta safra já está prometida?"
      ajuda="Café prometido para pagar insumos (troca ou barter), CPR ou adiantamento de comprador. Ele precisa ser entregue mesmo se a colheita vier menor."
    >
      <div className="flex flex-col gap-6">
        <RadioCardGroup legend="Parte desta safra já está prometida?" hideLegend error={escolha !== 'sim' ? erro ?? undefined : undefined}>
          {opcoes.map((opcao) => (
            <RadioCard
              key={opcao.valor}
              name="cafe-prometido"
              value={opcao.valor}
              checked={escolha === opcao.valor}
              onChange={() => escolher(opcao.valor)}
              label={opcao.rotulo}
            />
          ))}
        </RadioCardGroup>

        {escolha === 'sim' ? (
          <QuantityInput
            label="Quantas sacas estão prometidas?"
            suffix="sacas"
            value={sacas?.forma === 'exato' ? sacas.valor : null}
            onValueChange={(numero) =>
              atualizar({ sacasPrometidas: numero === null ? null : { forma: 'exato', valor: numero } })
            }
            error={erro ?? undefined}
            autoFocus
          />
        ) : null}
      </div>
    </TelaDePergunta>
  );
}

const itensDePagamento: {
  campo: keyof OutrosPagamentos;
  rotulo: string;
  descricao: string;
  faixas: ListaDeFaixas;
}[] = [
  {
    campo: 'parcelaDeInvestimento',
    rotulo: 'Parcela de investimento',
    descricao: 'Máquina, lavoura nova, benfeitoria.',
    faixas: faixasDeValorDaSafra,
  },
  {
    campo: 'comprasAPrazoOuAdiantamento',
    rotulo: 'Compras a prazo ou adiantamento',
    descricao: 'Insumos comprados na revenda para pagar na colheita.',
    faixas: faixasDeValorDaSafra,
  },
  {
    campo: 'arrendamento',
    rotulo: 'Arrendamento da terra',
    descricao: 'O valor por ano pelo uso da terra.',
    faixas: faixasDeValorAnual,
  },
];

export function TelaDeOutrosPagamentos({ respostas, atualizar, erro }: PropsDaTela) {
  const pagamentos = respostas.outrosPagamentos;

  function mudarPagamento(campo: keyof OutrosPagamentos, valor: ValorInformado | null) {
    atualizar({ outrosPagamentos: { ...pagamentos, [campo]: valor } });
  }

  return (
    <TelaDePergunta
      titulo="O que mais você precisa pagar com esta safra?"
      ajuda="Marque o que você tiver. Se não tiver nenhum desses, é só continuar."
    >
      <div className="flex flex-col gap-6">
        {itensDePagamento.map((item) => {
          const valor = pagamentos[item.campo];
          const marcado = valor !== null;
          return (
            <div key={item.campo} className="rounded-xl border border-sand-200 bg-sand-50 p-4">
              <Checkbox
                checked={marcado}
                // Marcado e ainda sem valor fica como zero: a validação pede o valor.
                onChange={(marcou) => mudarPagamento(item.campo, marcou ? { forma: 'exato', valor: 0 } : null)}
                label={<span className="text-body font-medium text-ink-900">{item.rotulo}</span>}
                description={item.descricao}
              />
              {marcado ? (
                <div className="mt-4">
                  <CampoDeValor
                    pergunta={`Faixa de ${item.rotulo.toLowerCase()}`}
                    rotuloDoCampo={`Valor de ${item.rotulo.toLowerCase()}`}
                    faixas={item.faixas}
                    valor={valor}
                    aoMudar={(novo) => mudarPagamento(item.campo, novo ?? { forma: 'exato', valor: 0 })}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
        {erro ? (
          <p role="alert" className="text-body-sm text-risk-fg">
            {erro}
          </p>
        ) : null}
      </div>
    </TelaDePergunta>
  );
}
