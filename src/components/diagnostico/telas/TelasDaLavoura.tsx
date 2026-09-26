'use client';

import { ButtonLink, Checkbox, RadioCard, RadioCardGroup } from '@/components/ui';
import {
  alternarEscolha,
  opcoesDeCultura,
  opcoesDePerfil,
  opcoesDePosseDaTerra,
  opcoesDeProtecao,
  protecoesExclusivas,
} from '@/lib/diagnostico/opcoes';
import { CampoDeQuantidade } from '../CampoDeValor';
import { TelaDePergunta } from '../TelaDePergunta';
import type { PropsDaTela } from './tipos';

/**
 * Primeira tela: é também a de início. Diz quanto tempo leva, que não precisa
 * de CPF, e oferece os exemplos para quem quer ver antes como funciona.
 */
export function TelaDoPerfil({ respostas, atualizar, erro }: PropsDaTela) {
  return (
    <TelaDePergunta
      titulo="Essa safra consegue pagar o crédito?"
      ajuda="Leva cerca de 5 minutos. Você não precisa informar CPF, nome ou endereço, e as respostas ficam só neste aparelho."
    >
      <RadioCardGroup legend="Qual é a sua situação agora?" error={erro ?? undefined}>
        {opcoesDePerfil.map((opcao) => (
          <RadioCard
            key={opcao.valor}
            name="perfil"
            value={opcao.valor}
            checked={respostas.perfil === opcao.valor}
            onChange={() => atualizar({ perfil: opcao.valor })}
            label={opcao.rotulo}
            description={opcao.descricao}
          />
        ))}
      </RadioCardGroup>

      <div className="mt-8 rounded-xl border border-sand-200 bg-sand-100/70 p-4">
        <p className="text-body-sm font-medium text-ink-800">Quer ver antes como funciona?</p>
        <p className="mt-1 text-body-sm text-ink-600">
          Os exemplos usam respostas fictícias e não mexem nas suas.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <ButtonLink href="/diagnostico/exemplo/ja-tenho-custeio" variant="secondary" size="sm">
            Ver com um exemplo: já tenho custeio
          </ButtonLink>
          <ButtonLink href="/diagnostico/exemplo/planejando-safra" variant="secondary" size="sm">
            Ver com um exemplo: planejando a safra
          </ButtonLink>
        </div>
      </div>
    </TelaDePergunta>
  );
}

export function TelaDaCultura({ respostas, atualizar, erro }: PropsDaTela) {
  return (
    <TelaDePergunta titulo="Qual é a sua cultura principal?">
      <RadioCardGroup legend="Qual é a sua cultura principal?" hideLegend error={erro ?? undefined}>
        {opcoesDeCultura.map((opcao) => (
          <RadioCard
            key={opcao.valor}
            name="cultura"
            value={opcao.valor}
            checked={respostas.cultura === opcao.valor}
            onChange={() => atualizar({ cultura: opcao.valor })}
            label={opcao.rotulo}
            description={opcao.descricao}
          />
        ))}
      </RadioCardGroup>
    </TelaDePergunta>
  );
}

export function TelaDaArea({ respostas, atualizar, erro }: PropsDaTela) {
  return (
    <TelaDePergunta
      titulo="Quantos hectares de café estão produzindo?"
      ajuda="Só a lavoura que vai colher nesta safra. Uma estimativa já serve."
    >
      <CampoDeQuantidade
        rotulo="Área em produção"
        unidade="hectares"
        dica="Arredonde para o número inteiro mais próximo."
        valor={respostas.areaEmProducaoHectares}
        aoMudar={(valor) => atualizar({ areaEmProducaoHectares: valor })}
        erro={erro ?? undefined}
        focarAoAbrir
      />
    </TelaDePergunta>
  );
}

export function TelaDaPosseDaTerra({ respostas, atualizar, erro }: PropsDaTela) {
  return (
    <TelaDePergunta
      titulo="A terra onde você planta é:"
      ajuda="Na parceria, a parte do dono da terra não entra como receita sua."
    >
      <RadioCardGroup legend="A terra onde você planta é:" hideLegend error={erro ?? undefined}>
        {opcoesDePosseDaTerra.map((opcao) => (
          <RadioCard
            key={opcao.valor}
            name="posse-da-terra"
            value={opcao.valor}
            checked={respostas.posseDaTerra === opcao.valor}
            onChange={() => atualizar({ posseDaTerra: opcao.valor })}
            label={opcao.rotulo}
            description={opcao.descricao}
          />
        ))}
      </RadioCardGroup>
    </TelaDePergunta>
  );
}

export function TelaDaProtecao({ respostas, atualizar, erro }: PropsDaTela) {
  // "Pretendo contratar" só faz sentido para quem ainda está planejando.
  const opcoes = opcoesDeProtecao.filter(
    (opcao) => opcao.valor !== 'pretendo-contratar-seguro' || respostas.perfil === 'planejando-safra',
  );

  return (
    <TelaDePergunta
      titulo="O que protege sua lavoura contra o clima?"
      ajuda="Marque tudo o que você tiver."
    >
      <fieldset className="flex flex-col gap-1 border-0 p-0">
        <legend className="sr-only">O que protege sua lavoura contra o clima?</legend>
        {opcoes.map((opcao) => (
          <Checkbox
            key={opcao.valor}
            checked={respostas.protecao.includes(opcao.valor)}
            onChange={() =>
              atualizar({ protecao: alternarEscolha(respostas.protecao, opcao.valor, protecoesExclusivas) })
            }
            label={opcao.rotulo}
            description={opcao.descricao}
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
