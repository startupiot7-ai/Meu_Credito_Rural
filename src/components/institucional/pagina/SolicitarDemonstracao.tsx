'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { BeamDivider } from '@/components/brand/HeroScene';
import { Button, Select, StateView, TextInput } from '@/components/ui';
import {
  solicitacaoEmBranco,
  solicitacaoEstaValida,
  validarSolicitacaoDeDemonstracao,
} from '@/lib/institucional/validar-solicitacao-de-demonstracao';
import type {
  ErrosDaSolicitacao,
  SolicitacaoDeDemonstracao,
} from '@/lib/institucional/validar-solicitacao-de-demonstracao';

const opcoesDeTipoDeInstituicao = [
  { value: 'cooperativa', label: 'Cooperativa de produtores' },
  { value: 'sindicato', label: 'Sindicato rural' },
  { value: 'instituicao-de-credito', label: 'Instituição de crédito' },
  { value: 'outro', label: 'Outro tipo de organização' },
];

/**
 * Chamada final e formulário de pedido de demonstração.
 *
 * PROTÓTIPO: o envio ainda não está conectado a nenhum serviço. Ao confirmar,
 * a tela diz isso claramente, em vez de fingir que a equipe recebeu o pedido.
 * Antes de publicar, ligar `enviarSolicitacao` ao canal comercial real.
 */
export function SolicitarDemonstracao() {
  const [solicitacao, atualizarSolicitacao] = useState<SolicitacaoDeDemonstracao>(solicitacaoEmBranco);
  const [erros, atualizarErros] = useState<ErrosDaSolicitacao>({});
  const [foiEnviada, marcarComoEnviada] = useState(false);

  function alterarCampo(campo: keyof SolicitacaoDeDemonstracao, valor: string) {
    atualizarSolicitacao({ ...solicitacao, [campo]: valor });
    // O erro some assim que a pessoa começa a corrigir o campo.
    if (erros[campo]) atualizarErros({ ...erros, [campo]: undefined });
  }

  function enviarSolicitacao(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const novosErros = validarSolicitacaoDeDemonstracao(solicitacao);
    atualizarErros(novosErros);
    if (solicitacaoEstaValida(novosErros)) marcarComoEnviada(true);
  }

  return (
    <section
      id="demonstracao"
      aria-labelledby="demonstracao-titulo"
      className="section-y relative scroll-mt-16 overflow-hidden bg-canopy-800"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(70%_100%_at_30%_0%,rgba(233,174,46,0.2),transparent_70%)]"
      />
      <div className="container-page relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div className="max-w-prose">
          <BeamDivider className="mb-8 max-w-xs" />
          <h2 id="demonstracao-titulo" className="text-title-lg text-sand-50 lg:text-display">
            Veja o que o painel mostraria sobre a sua carteira
          </h2>
          <p className="mt-5 text-body-lg leading-relaxed text-sand-200">
            Numa conversa de meia hora, mostramos o painel, explicamos como os associados chegam ao
            diagnóstico e como funciona a proteção dos dados.
          </p>
          <p className="mt-4 text-body-sm text-sand-300">
            Usamos seus dados apenas para responder a este pedido.
          </p>
        </div>

        <div className="rounded-3xl bg-sand-50 p-6 shadow-lg md:p-8">
          {foiEnviada ? (
            <StateView
              variant="success"
              title="Pedido pronto para envio"
              description={`Protótipo: o envio para a equipe comercial ainda não está conectado. Na versão final, a resposta chega em ${solicitacao.email.trim()}.`}
              className="border-0 px-0 py-6"
            />
          ) : (
            <form noValidate onSubmit={enviarSolicitacao} className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <TextInput
                label="Nome"
                autoComplete="name"
                value={solicitacao.nome}
                onChange={(evento) => alterarCampo('nome', evento.target.value)}
                error={erros.nome}
              />
              <TextInput
                label="Cargo"
                autoComplete="organization-title"
                value={solicitacao.cargo}
                onChange={(evento) => alterarCampo('cargo', evento.target.value)}
                error={erros.cargo}
              />
              <TextInput
                label="Instituição"
                autoComplete="organization"
                value={solicitacao.instituicao}
                onChange={(evento) => alterarCampo('instituicao', evento.target.value)}
                error={erros.instituicao}
              />
              <Select
                label="Tipo de instituição"
                options={opcoesDeTipoDeInstituicao}
                value={solicitacao.tipoDeInstituicao}
                onChange={(evento) => alterarCampo('tipoDeInstituicao', evento.target.value)}
                error={erros.tipoDeInstituicao}
              />
              <TextInput
                label="E-mail"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={solicitacao.email}
                onChange={(evento) => alterarCampo('email', evento.target.value)}
                error={erros.email}
              />
              <TextInput
                label="Telefone"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={solicitacao.telefone}
                onChange={(evento) => alterarCampo('telefone', evento.target.value)}
                error={erros.telefone}
              />
              <TextInput
                label="Número aproximado de associados"
                optional
                inputMode="numeric"
                value={solicitacao.quantidadeDeAssociados}
                onChange={(evento) => alterarCampo('quantidadeDeAssociados', evento.target.value)}
                className="md:col-span-2"
              />
              <div className="md:col-span-2">
                <Button type="submit" size="lg" fullWidth>
                  Solicitar demonstração
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
