'use client';

import { useState } from 'react';
import {
  Alert,
  ArrowRightIcon,
  BottomSheet,
  Button,
  Card,
  CheckSteps,
  Checkbox,
  ComparisonBar,
  ConfirmDialog,
  CurrencyInput,
  FileUpload,
  PercentInput,
  ProgressBar,
  QuantityInput,
  RadioCard,
  RadioCardGroup,
  Select,
  Skeleton,
  SkeletonCard,
  SkeletonText,
  StateView,
  StatusBadge,
  StatusLegend,
  StepProgress,
  Term,
  TextInput,
  Tooltip,
} from '@/components/ui';
import type { UploadedFile } from '@/components/ui';
import { rotuloDaTela, telasDoFluxo } from '@/lib/diagnostico/fluxo';

/** O caminho de quem planeja a safra, usado só para ilustrar a barra de progresso. */
const telasDeExemplo = telasDoFluxo('planejando-safra');

/**
 * Component gallery.
 *
 * A living reference of the design system: every component, every interactive
 * state, in the real palette and the real typography. It exists so a state can
 * be reviewed without hunting for the screen that happens to produce it, and so
 * regressions are visible in one place.
 *
 * All copy is pt-BR because the components ship pt-BR strings — this page shows
 * them exactly as a producer would see them.
 */

function Block({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return (
    <section aria-labelledby={id} className="scroll-mt-20 border-t border-sand-200 pt-10">
      <h2 id={id} className="text-title">
        {title}
      </h2>
      {description ? (
        <p className="mt-2 max-w-prose text-body-sm text-ink-600">{description}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-caption font-semibold uppercase tracking-[0.1em] text-ink-500">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

export function Gallery() {
  const [currency, setCurrency] = useState<number | null>(750_000);
  const [percent, setPercent] = useState<number | null>(40);
  const [bags, setBags] = useState<number | null>(500);
  const [crop, setCrop] = useState('arabica');
  const [agreed, setAgreed] = useState(false);
  const [documents, setDocuments] = useState<UploadedFile[]>([]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-12">
      <Block
        title="Botões"
        description="Cinco variantes e três tamanhos. Todos os estados: padrão, hover, foco, pressionado, desabilitado e carregando."
      >
        <div className="flex flex-col gap-6">
          <Row label="Variantes">
            <Button>Analisar minha situação</Button>
            <Button variant="secondary">Entender como funciona</Button>
            <Button variant="ghost">Editar</Button>
            <Button variant="beam">Começar meu diagnóstico</Button>
            <Button variant="danger">Apagar respostas</Button>
          </Row>
          <Row label="Tamanhos">
            <Button size="sm">Pequeno</Button>
            <Button size="md">Médio</Button>
            <Button size="lg" iconRight={<ArrowRightIcon />}>
              Grande
            </Button>
          </Row>
          <Row label="Estados">
            <Button disabled>Desabilitado</Button>
            <Button loading loadingLabel="Preparando">
              Carregando
            </Button>
            <Button variant="secondary" disabled>
              Desabilitado
            </Button>
          </Row>
        </div>
      </Block>

      <Block
        title="Campos de entrada"
        description="Máscaras em pt-BR: moeda como “R$ 750.000”, porcentagem como “40%”, quantidades com separador de milhar."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <CurrencyInput
            label="Dívida informada"
            hint="Quanto você deve hoje, somando as operações que conhece."
            value={currency}
            onValueChange={setCurrency}
          />
          <PercentInput
            label="Comprometimento da receita"
            hint="Quanto da receita já está reservado para a dívida."
            value={percent}
            onValueChange={setPercent}
          />
          <QuantityInput
            label="Produção esperada"
            suffix="sacas"
            value={bags}
            onValueChange={setBags}
          />
          <TextInput
            label="Nome da propriedade"
            placeholder="Sítio Bom Retiro"
            optional
          />
          <TextInput
            label="Município"
            error="Informe o município onde fica a propriedade."
            defaultValue=""
          />
          <TextInput
            label="Telefone para contato"
            success="Telefone confirmado."
            defaultValue="(35) 99999-0000"
          />
          <TextInput label="Campo desabilitado" disabled defaultValue="Não editável" />
          <Select
            label="Instituição da operação"
            hint="Se houver mais de uma, escolha a principal."
            options={[
              { value: 'banco-1', label: 'Banco público' },
              { value: 'cooperativa', label: 'Cooperativa de crédito' },
              { value: 'banco-privado', label: 'Banco privado' },
              { value: 'outra', label: 'Outra' },
            ]}
          />
        </div>
      </Block>

      <Block
        title="Escolhas"
        description="Radio cards para uma decisão por vez; checkbox para consentimentos."
      >
        <div className="grid gap-8 md:grid-cols-2">
          <RadioCardGroup
            legend="O que você produz hoje?"
            hint="Escolha a sua principal cultura."
          >
            <RadioCard
              name="gallery-crop"
              value="arabica"
              checked={crop === 'arabica'}
              onChange={setCrop}
              label="Café arábica"
              description="A maior parte da sua produção é arábica."
            />
            <RadioCard
              name="gallery-crop"
              value="conilon"
              checked={crop === 'conilon'}
              onChange={setCrop}
              label="Café conilon (robusta)"
              description="A maior parte da sua produção é conilon."
            />
            <RadioCard
              name="gallery-crop"
              value="indisponivel"
              checked={false}
              onChange={setCrop}
              label="Opção indisponível"
              description="Exemplo do estado desabilitado."
              disabled
            />
          </RadioCardGroup>

          <div className="flex flex-col gap-5">
            <Checkbox
              checked={agreed}
              onChange={setAgreed}
              label="Entendi que o diagnóstico é indicativo e não garante renegociação."
              description="Você pode rever isso a qualquer momento."
            />
            <Checkbox
              checked={false}
              onChange={() => undefined}
              label="Exemplo de erro"
              error="É preciso marcar esta opção para seguir."
            />
            <Checkbox
              checked
              onChange={() => undefined}
              label="Exemplo desabilitado"
              disabled
            />
          </div>
        </div>
      </Block>

      <Block
        title="Termos e explicações"
        description="Todo termo técnico aparece com a definição junto — na tela e para leitores de tela."
      >
        <p className="max-w-prose text-body leading-relaxed text-ink-800">
          Se a sua operação é uma <Term term="cpr" />, o valor que ainda falta pagar é o{' '}
          <Term term="saldoDevedor" />. Para comparar duas propostas de verdade, olhe o{' '}
          <Term term="cet" /> de cada uma — e não só a parcela.
        </p>
        <div className="mt-5 flex items-center gap-2 text-body-sm text-ink-600">
          Tooltip isolado:
          <Tooltip
            label="O que é portabilidade?"
            content="Levar uma dívida que você já tem para outra instituição, que assume o saldo devedor e passa a cobrar nas condições dela."
          />
        </div>
      </Block>

      <Block title="Status" description="Verde, amarelo e vermelho sempre com ícone e texto.">
        <div className="flex flex-col gap-6">
          <Row label="Badges">
            <StatusBadge tone="healthy">Situação saudável</StatusBadge>
            <StatusBadge tone="attention">Atenção</StatusBadge>
            <StatusBadge tone="risk">Risco elevado</StatusBadge>
            <StatusBadge tone="info">Informação</StatusBadge>
          </Row>
          <Row label="Legenda">
            <StatusLegend />
          </Row>
        </div>
      </Block>

      <Block title="Avisos" description="Explicam o que aconteceu e o que dá para fazer. Nunca assustam.">
        <div className="flex flex-col gap-3">
          <Alert tone="info" title="Você voltou de onde parou.">
            Encontramos respostas salvas neste dispositivo às 14:32.
          </Alert>
          <Alert tone="attention" title="Sua conexão caiu.">
            Suas respostas estão salvas neste dispositivo. Pode continuar respondendo
            normalmente.
          </Alert>
          <Alert tone="healthy" title="Documento recebido." onDismiss={() => undefined}>
            O extrato foi anexado ao seu diagnóstico.
          </Alert>
          <Alert
            tone="risk"
            title="Não conseguimos ler o arquivo."
            action={
              <Button size="sm" variant="secondary">
                Tentar de novo
              </Button>
            }
          >
            O arquivo pode estar corrompido. Tente enviar uma foto do documento.
          </Alert>
        </div>
      </Block>

      <Block title="Progresso" description="Pontos no caminho, barras e listas de conferência.">
        <div className="flex flex-col gap-8">
          <StepProgress current={3} total={telasDeExemplo.length} labels={telasDeExemplo.map((tela) => rotuloDaTela[tela])} />
          <div className="grid gap-5 md:grid-cols-2">
            <ProgressBar value={18} label="Comprometimento" valueLabel="18%" tone="healthy" />
            <ProgressBar value={40} label="Comprometimento" valueLabel="40%" tone="attention" />
            <ProgressBar value={72} label="Comprometimento" valueLabel="72%" tone="risk" />
            <ProgressBar value={55} label="Documentos reunidos" valueLabel="5 de 9" />
          </div>
          <CheckSteps
            steps={[
              { label: 'Contrato anexado', description: 'Recebido em 12/03.', done: true },
              { label: 'Extrato atualizado', description: 'Ainda pendente.' },
              { label: 'Confirmação do saldo devedor' },
            ]}
          />
        </div>
      </Block>

      <Block
        title="Gráficos"
        description="Uma medida por gráfico, sempre com rótulo direto. Nunca dois eixos."
      >
        <Card>
          <div className="flex flex-col gap-5">
            <ComparisonBar
              label="A colheita pode ser menor em até"
              value={28}
              max={100}
              valueLabel="28%"
            />
            <ComparisonBar
              label="O preço do dia pode cair até"
              value={14}
              max={100}
              valueLabel="14%"
              highlighted
            />
          </div>
        </Card>
      </Block>

      <Block title="Envio de documentos" description="Foto ou arquivo, com validação antes do envio.">
        <FileUpload
          label="Contrato ou extrato da operação"
          hint="Se estiver no papel, uma foto legível já serve."
          files={documents}
          onFilesChange={setDocuments}
        />
      </Block>

      <Block title="Camadas" description="Bottom sheet no celular e diálogo de confirmação.">
        <Row label="Abrir">
          <Button variant="secondary" onClick={() => setSheetOpen(true)}>
            Abrir bottom sheet
          </Button>
          <Button variant="secondary" onClick={() => setDialogOpen(true)}>
            Abrir confirmação
          </Button>
        </Row>

        <BottomSheet
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Como calculamos a receita projetada"
          description="Em duas linhas, sem fórmula escondida."
          footer={
            <Button fullWidth onClick={() => setSheetOpen(false)}>
              Entendi
            </Button>
          }
        >
          <p className="text-body leading-relaxed text-ink-700">
            Multiplicamos a produção esperada pelo preço estimado por saca. O resultado é a{' '}
            <Term term="receitaBruta">receita bruta projetada</Term> — o valor que a safra deve
            gerar antes de descontar os custos.
          </p>
        </BottomSheet>

        <ConfirmDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={() => setDialogOpen(false)}
          title="Recomeçar o diagnóstico?"
          description="Suas respostas serão apagadas deste dispositivo e você voltará à primeira pergunta. Não dá para desfazer."
          confirmLabel="Sim, recomeçar"
          cancelLabel="Continuar de onde parei"
          destructive
        />
      </Block>

      <Block title="Carregamento" description="Esqueletos em vez de giradores, para conexões instáveis.">
        <div className="grid gap-5 md:grid-cols-2">
          <SkeletonCard />
          <div className="rounded-2xl border border-sand-200 bg-sand-50 p-6">
            <Skeleton className="h-8 w-2/3" />
            <SkeletonText className="mt-5" lines={4} />
          </div>
        </div>
      </Block>

      <Block title="Estados de tela" description="Vazio, erro, offline e sucesso — sempre com um próximo passo.">
        <div className="grid gap-4 md:grid-cols-2">
          <StateView
            variant="empty"
            title="Ainda não temos suas respostas"
            description="O diagnóstico é montado a partir do que você informa. São poucas perguntas, uma de cada vez."
            action={<Button>Começar meu diagnóstico</Button>}
          />
          <StateView
            variant="offline"
            title="Sua conexão caiu"
            description="Suas respostas estão salvas neste dispositivo. Você pode continuar de onde parou quando a conexão voltar."
            action={<Button variant="secondary">Tentar de novo</Button>}
          />
          <StateView
            variant="error"
            title="Não conseguimos montar o diagnóstico"
            description="Algo saiu errado do nosso lado, não com as suas respostas. Elas continuam salvas."
            action={<Button>Tentar de novo</Button>}
          />
          <StateView
            variant="success"
            title="Documento recebido"
            description="O extrato foi anexado. Agora dá para confirmar o saldo devedor com a instituição."
            action={<Button>Ver próximo passo</Button>}
          />
        </div>
      </Block>
    </div>
  );
}
