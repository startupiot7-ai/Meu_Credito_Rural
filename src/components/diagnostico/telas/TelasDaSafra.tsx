'use client';

import { RadioCard, RadioCardGroup } from '@/components/ui';
import { validarTela } from '@/lib/diagnostico/fluxo';
import {
  faixasDeCustoPorHectare,
  faixasDeCustoPorSaca,
  faixasDePrecoPorSaca,
  faixasDeValorDaSafra,
} from '@/lib/diagnostico/premissas';
import type { CustoInformado, ValorInformado } from '@/lib/diagnostico/tipos';
import { CampoDeQuantidade, CampoDeValor } from '../CampoDeValor';
import { TelaDePergunta } from '../TelaDePergunta';
import type { PropsDaTela } from './tipos';

export function TelaDaProducao({ respostas, atualizar, erro }: PropsDaTela) {
  const planejando = respostas.perfil === 'planejando-safra';
  // A tela tem dois campos: o erro aparece no que ainda falta.
  const faltaEsperada = erro && validarTela('producao', { ...respostas, producaoMediaSacas: { forma: 'nao-sei' } });

  return (
    <TelaDePergunta
      titulo={planejando ? 'Quantas sacas você espera colher na próxima safra?' : 'Quantas sacas você espera colher nesta safra?'}
      ajuda="Uma estimativa já serve. A média das últimas safras ajuda a ver se a expectativa está otimista."
    >
      <div className="flex flex-col gap-7">
        <CampoDeQuantidade
          rotulo="Produção esperada"
          unidade="sacas"
          valor={respostas.producaoEsperadaSacas}
          aoMudar={(valor) => atualizar({ producaoEsperadaSacas: valor })}
          erro={faltaEsperada ? erro : undefined}
          focarAoAbrir
        />
        <CampoDeQuantidade
          rotulo="Média das últimas safras"
          unidade="sacas"
          dica="Se o café alterna safra alta e baixa, pense na média de dois anos."
          valor={respostas.producaoMediaSacas}
          aoMudar={(valor) => atualizar({ producaoMediaSacas: valor })}
          erro={erro && !faltaEsperada ? erro : undefined}
        />
      </div>
    </TelaDePergunta>
  );
}

export function TelaDoPreco({ respostas, atualizar, erro }: PropsDaTela) {
  return (
    <TelaDePergunta
      titulo="Qual preço você espera receber por saca?"
      ajuda="Pense no preço de quando você vai vender, não só no de hoje."
    >
      <CampoDeValor
        pergunta="Faixa de preço por saca"
        rotuloDoCampo="Preço por saca"
        faixas={faixasDePrecoPorSaca}
        valor={respostas.precoPorSaca}
        aoMudar={(valor) => atualizar({ precoPorSaca: valor })}
        erro={erro ?? undefined}
      />
    </TelaDePergunta>
  );
}

type BaseDoCusto = CustoInformado['base'];

const opcoesDeBaseDoCusto: { valor: BaseDoCusto; rotulo: string }[] = [
  { valor: 'por-hectare', rotulo: 'Sei quanto custa por hectare' },
  { valor: 'por-saca', rotulo: 'Sei quanto custa por saca' },
  { valor: 'total-da-safra', rotulo: 'Sei o custo total da safra' },
  { valor: 'nao-sei', rotulo: 'Não sei' },
];

const faixasDaBase = {
  'por-hectare': { faixas: faixasDeCustoPorHectare, rotulo: 'Custo por hectare' },
  'por-saca': { faixas: faixasDeCustoPorSaca, rotulo: 'Custo por saca' },
  'total-da-safra': { faixas: faixasDeValorDaSafra, rotulo: 'Custo total da safra' },
} as const;

function custoComBase(base: BaseDoCusto, valor: ValorInformado | null): CustoInformado {
  if (base === 'nao-sei') return { base: 'nao-sei' };
  return { base, valor };
}

export function TelaDoCusto({ respostas, atualizar, erro }: PropsDaTela) {
  const custo = respostas.custoDaSafra;
  const base = custo?.base ?? null;

  return (
    <TelaDePergunta
      titulo="Quanto custa tocar a lavoura nesta safra?"
      ajuda="Adubo, defensivo, mão de obra e colheita. Sem contar parcelas de financiamento nem arrendamento."
    >
      <div className="flex flex-col gap-8">
        <RadioCardGroup legend="Como você prefere informar?" error={!custo ? erro ?? undefined : undefined}>
          {opcoesDeBaseDoCusto.map((opcao) => (
            <RadioCard
              key={opcao.valor}
              name="base-do-custo"
              value={opcao.valor}
              checked={base === opcao.valor}
              onChange={() => atualizar({ custoDaSafra: custoComBase(opcao.valor, null) })}
              label={opcao.rotulo}
            />
          ))}
        </RadioCardGroup>

        {custo && custo.base !== 'nao-sei' ? (
          <CampoDeValor
            pergunta={`Faixa de ${faixasDaBase[custo.base].rotulo.toLowerCase()}`}
            rotuloDoCampo={faixasDaBase[custo.base].rotulo}
            faixas={faixasDaBase[custo.base].faixas}
            valor={custo.valor}
            aoMudar={(valor) => atualizar({ custoDaSafra: custoComBase(custo.base, valor) })}
            erro={erro ?? undefined}
          />
        ) : null}
      </div>
    </TelaDePergunta>
  );
}
