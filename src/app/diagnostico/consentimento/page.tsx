'use client';

import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { InterruptorDeConsentimento } from '@/components/consentimento/InterruptorDeConsentimento';
import { ResumoQueSeriaCompartilhado } from '@/components/consentimento/ResumoQueSeriaCompartilhado';
import {
  Alert,
  Button,
  ButtonLink,
  Card,
  CheckCircleIcon,
  ChevronLeftIcon,
  ShieldIcon,
  Skeleton,
  SkeletonCard,
  SkeletonRegion,
  StateView,
} from '@/components/ui';
import {
  instituicaoEstaAutorizada,
  quantidadeDeInstituicoesAutorizadas,
} from '@/lib/consentimento/consentimento';
import { useConsentimentoDeOriginacao } from '@/lib/consentimento/useConsentimentoDeOriginacao';
import { instituicoesParticipantes } from '@/lib/institucional/dados-simulados';
import { formatarData } from '@/lib/institucional/formatacao';
import { useSavedAnswers } from '@/lib/useSavedAnswers';

/**
 * Etapa opcional depois do resultado do diagnóstico: o produtor decide se quer
 * ser apresentado a instituições de crédito participantes.
 *
 * REGRA OBRIGATÓRIA: todas as instituições começam NÃO autorizadas. Nada nesta
 * tela vem marcado, e dizer não (ou simplesmente sair) não muda nada no
 * diagnóstico do produtor. O texto do consentimento fica sozinho nesta
 * página, sem estar misturado com outros termos.
 *
 * O título da página vem do layout de `/diagnostico`, que já impede indexação.
 */
export default function PaginaDeConsentimento() {
  const { answers: respostas, restored: respostasCarregadas } = useSavedAnswers();
  const { consentimento, carregado, autorizar, revogar, revogarTodas } = useConsentimentoDeOriginacao();

  const temDiagnostico = respostasCarregadas && Boolean(respostas.crop);
  const quantidadeAutorizada = quantidadeDeInstituicoesAutorizadas(consentimento);

  return (
    <div className="flex min-h-dvh flex-col bg-sand-50">
      <header className="border-b border-sand-200 bg-sand-50">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link href="/" aria-label="Meu Crédito Rural, página inicial" className="rounded-md">
            <Logo />
          </Link>
          <ButtonLink
            href="/diagnostico/resultado"
            variant="ghost"
            size="sm"
            iconLeft={<ChevronLeftIcon />}
            className="shrink-0"
          >
            <span className="md:hidden">Voltar</span>
            <span className="hidden md:inline">Voltar ao meu diagnóstico</span>
          </ButtonLink>
        </div>
      </header>

      <main id="conteudo" className="flex-1">
        <div className="container-page max-w-3xl py-8 lg:py-12">
          {!respostasCarregadas || !carregado ? (
            <SkeletonRegion label="Carregando suas escolhas">
              <Skeleton className="h-9 w-3/4" />
              <SkeletonCard className="mt-8" />
              <SkeletonCard className="mt-4" />
            </SkeletonRegion>
          ) : !temDiagnostico ? (
            <StateView
              variant="empty"
              title="Primeiro, o seu diagnóstico"
              description="Esta etapa é opcional e só faz sentido depois do diagnóstico: é o resumo dele que poderia ser apresentado a instituições, se você quiser."
              action={<ButtonLink href="/diagnostico">Começar meu diagnóstico</ButtonLink>}
            />
          ) : (
            <article className="animate-fade-up">
              <p className="text-caption font-semibold uppercase tracking-[0.12em] text-canopy-600">
                Opcional
              </p>
              <h1 className="mt-3 text-title-lg lg:text-display">
                Quer que instituições de crédito conheçam o seu caso?
              </h1>
              <p className="mt-4 max-w-prose text-body-lg leading-relaxed text-ink-600">
                Você pode autorizar que o resumo do seu diagnóstico seja apresentado a instituições
                participantes, para buscar condições melhores. A escolha é sua, instituição por
                instituição, e pode ser desfeita quando você quiser.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <h2 className="text-title-sm">Se você autorizar</h2>
                  <ul className="mt-3 flex flex-col gap-2 text-body-sm leading-relaxed text-ink-700">
                    <li>Só as instituições que você ligar abaixo recebem o resumo.</li>
                    <li>Elas podem procurar você para conversar sobre condições.</li>
                    <li>Você pode retirar a autorização a qualquer momento, nesta mesma página.</li>
                  </ul>
                </Card>
                <Card>
                  <h2 className="text-title-sm">Se você não autorizar</h2>
                  <ul className="mt-3 flex flex-col gap-2 text-body-sm leading-relaxed text-ink-700">
                    <li>Nada muda. Seu diagnóstico continua gratuito e igual.</li>
                    <li>Nenhuma instituição vê o seu caso individualmente.</li>
                    <li>Você pode voltar aqui depois, se mudar de ideia.</li>
                  </ul>
                </Card>
              </div>

              <section aria-labelledby="o-que-seria-compartilhado" className="mt-10">
                <h2 id="o-que-seria-compartilhado" className="text-title">
                  O que seria compartilhado
                </h2>
                <p className="mt-2 max-w-prose text-body-sm leading-relaxed text-ink-600">
                  Exatamente estas informações, com os números que você informou. Documentos que você
                  enviou não são compartilhados.
                </p>
                <div className="mt-4">
                  <ResumoQueSeriaCompartilhado respostas={respostas} />
                </div>
              </section>

              <section aria-labelledby="escolha-as-instituicoes" className="mt-10">
                <h2 id="escolha-as-instituicoes" className="text-title">
                  Escolha as instituições
                </h2>
                <p className="mt-2 max-w-prose text-body-sm leading-relaxed text-ink-600">
                  Todas começam desligadas. Ligue apenas as que você quer que conheçam o seu caso.
                </p>
                <div className="mt-4 flex flex-col gap-3">
                  {instituicoesParticipantes.map((instituicao) => {
                    const autorizada = instituicaoEstaAutorizada(consentimento, instituicao.identificador);
                    const autorizadaEm = consentimento.autorizacoesAtivas[instituicao.identificador];
                    return (
                      <InterruptorDeConsentimento
                        key={instituicao.identificador}
                        nomeDaInstituicao={instituicao.nome}
                        tipoDeInstituicao={instituicao.tipo}
                        autorizado={autorizada}
                        autorizadoDesde={autorizadaEm ? formatarData(autorizadaEm) : undefined}
                        aoAlterar={(querAutorizar) =>
                          querAutorizar
                            ? autorizar(instituicao.identificador)
                            : revogar(instituicao.identificador)
                        }
                      />
                    );
                  })}
                </div>
                <p className="mt-3 text-caption text-ink-500">
                  Nomes fictícios nesta versão de demonstração.
                </p>

                <div aria-live="polite" className="mt-6">
                  {quantidadeAutorizada > 0 ? (
                    <Alert
                      tone="healthy"
                      icon={<CheckCircleIcon />}
                      title={
                        quantidadeAutorizada === 1
                          ? 'Você autorizou 1 instituição'
                          : `Você autorizou ${quantidadeAutorizada} instituições`
                      }
                      action={
                        <Button variant="secondary" size="sm" onClick={revogarTodas}>
                          Retirar todas as autorizações
                        </Button>
                      }
                    >
                      A retirada vale na hora. Para mudar depois, volte a esta página pelo link no
                      resultado do seu diagnóstico.
                    </Alert>
                  ) : (
                    <p className="text-body-sm text-ink-600">
                      Nenhuma instituição autorizada. Seu diagnóstico continua só com você.
                    </p>
                  )}
                </div>
              </section>

              <Alert
                tone="info"
                icon={<ShieldIcon />}
                title="Se a sua cooperativa usa o Meu Crédito Rural"
                className="mt-10"
              >
                Ela vê apenas números somados de muitos produtores, nunca o seu caso, a não ser que
                você a autorize acima. Ela também não influencia o resultado do seu diagnóstico.
              </Alert>

              <div className="mt-8">
                <ButtonLink href="/diagnostico/resultado" variant="secondary">
                  Voltar ao meu diagnóstico
                </ButtonLink>
              </div>
            </article>
          )}
        </div>
      </main>
    </div>
  );
}
