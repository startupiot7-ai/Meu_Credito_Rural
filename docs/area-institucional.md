# Área institucional (B2B2C)

Este documento explica as telas para o segundo público do Meu Crédito Rural:
cooperativas e instituições de crédito. Nada aqui altera a experiência do
produtor, que continua gratuita e independente.

Com a pivotagem para prevenção, o valor para a cooperativa deixou de ser
"encontrar quem renegociar" e passou a ser **entender o risco da safra na
carteira antes da inadimplência**. O painel não dá nota nem decide crédito.

## Modelo em três camadas

1. **Gratuito para o produtor, sempre.** Página inicial, diagnóstico e resultado
   são os mesmos com ou sem licença.
2. **Licença institucional.** A cooperativa paga uma licença anual para ver a
   carteira **somada e anonimizada**: situação da safra, margem de segurança,
   exposições e necessidade potencial de renegociação.
3. **Pedidos de conversa.** Depois do diagnóstico, o produtor pode autorizar,
   instituição por instituição, que ela converse com ele. A instituição recebe
   só o resumo que ele viu. Não há etapas de venda no painel, e a cobrança não
   pode depender de o produtor contratar crédito.

A independência do diagnóstico é o valor central: a instituição paga para ver
padrões, nunca para influenciar o resultado que o produtor recebe. Essa regra
aparece escrita dentro das próprias telas ("O que este painel não faz", rodapé
institucional, tela de consentimento).

## Rotas

| Rota | Público | O que é |
|---|---|---|
| `/cooperativas` | Gestores de cooperativas | Página de apresentação da licença, com pedido de demonstração. |
| `/painel` | Instituição licenciada | Painel agregado da carteira (protótipo com dados fictícios). |
| `/painel?estado=vazio` | — | Painel de uma instituição sem diagnósticos suficientes. |
| `/painel?estado=carregando` | — | Esqueleto de carregamento do painel. |
| `/diagnostico/consentimento` | Produtor | Os dois consentimentos opcionais, separados. |

## O que o painel mostra

| Bloco | O que é |
|---|---|
| Indicadores | Acompanhados, diagnósticos nas estatísticas, quem não cobre no esperado, quem cobre apertado. |
| Situação da safra | As mesmas três situações que o produtor vê: cobre com folga, cobre mas apertado, não cobre. |
| Margem de segurança da carteira | Quantos aguentam quanto de quebra de produção antes de faltar dinheiro. |
| O que mais expõe a carteira | Sem proteção climática, com compromissos fora do banco, sem preço fechado; perfis A e B. |
| Onde está o risco | Recortes por núcleo, porte e cultura, com grupos pequenos ocultos. |
| Necessidade potencial de renegociação | Quem já tem custeio e relatou atraso, prorrogação ou renegociação. A MP 1.376/2026 aparece como bloco "não avaliada", sem contagem de enquadrados. |
| Pedidos de conversa | Quem autorizou esta instituição, com o resumo de três linhas. |

## Onde está cada coisa

```text
src/
  app/
    cooperativas/page.tsx              página de apresentação
    painel/page.tsx                    painel da instituição
    diagnostico/consentimento/page.tsx etapa de consentimento do produtor
  components/
    institucional/pagina/              seções da página /cooperativas
    institucional/painel/              blocos do painel
    consentimento/                     interruptor, resumo compartilhado e convite
  lib/
    institucional/
      tipos.ts                         vocabulário da carteira agregada
      privacidade.ts                   regra de ocultação de grupos pequenos
      carteira.ts                      cálculos simples (percentuais, somas)
      dados-simulados.ts               DADOS FICTÍCIOS do protótipo
      conteudo-comercial.ts            textos da página /cooperativas
      formatacao.ts                    datas
      validar-solicitacao-de-demonstracao.ts
    consentimento/
      consentimento-estatistico.ts     consentimento 1: estatísticas anônimas
      consentimento.ts                 consentimento 2: conversa com instituições
      resumo-compartilhado.ts          as três linhas que a instituição recebe
      useConsentimentoEstatistico.ts   guarda o consentimento 1 no aparelho
      useConsentimentoDeOriginacao.ts  guarda o consentimento 2 no aparelho
```

## Regras de privacidade

- **Tudo é agregado por padrão.** O painel não tem nenhum tipo de dado que
  represente um produtor identificado, exceto quem autorizou aquela instituição.
- **Grupos pequenos são ocultados.** Qualquer segmento com menos de
  `TAMANHO_MINIMO_DO_GRUPO` (10) produtores com diagnóstico aparece como
  "Grupo pequeno demais para exibir sem identificar produtores individualmente".
- **Proteção contra subtração.** Se os segmentos ocultos somados ainda forem
  menos de 10, o menor segmento visível também é ocultado. Sem isso, bastaria
  subtrair os segmentos visíveis do total da carteira para descobrir o grupo
  pequeno.
- **Nenhum número oculto chega ao navegador em forma de texto.** O segmento
  protegido não é escondido com CSS: seus números simplesmente não são
  renderizados.
- **Painel inteiro protegido.** Com menos de 10 diagnósticos, até o total da
  carteira poderia identificar alguém; o painel mostra o estado vazio.

## Regras dos consentimentos

São dois, separados. Nenhum muda o diagnóstico, e dizer não a qualquer um não
tem consequência.

1. **Estatísticas anônimas.** Só quem ligou entra nos números do painel.
2. **Conversa com instituições**, instituição por instituição.

Valem para os dois:

- **Começa desligado.** Nada vem autorizado. O interruptor não tem valor padrão
  ligado, e isso está escrito nos comentários do código.
- **Específico.** No consentimento 2, o produtor escolhe instituição por
  instituição. Não existe "autorizar todas".
- **Informado.** A tela mostra exatamente as três linhas que seriam
  compartilhadas (situação, margem e fator principal) e diz o que não é:
  respostas, valores, retirada da família e documentos.
- **Revogável.** Desligar vale na hora; há também "Retirar todas as
  autorizações". O caminho para revogar fica sempre visível no resultado.
- **Versionado.** Quando o conteúdo compartilhado muda, a chave muda de versão
  e as autorizações antigas não são herdadas (hoje: `mcr:consentimento-originacao:v2`).

## O que ainda é protótipo

| Item | Situação atual | O que falta |
|---|---|---|
| Dados do painel | `dados-simulados.ts`, fictícios | Integração com a base real de diagnósticos. |
| Estado do painel | Escolhido pelo endereço (`?estado=`) | Vir do servidor; retirar os atalhos do rodapé do painel. |
| Consentimento | Guardado só no navegador | Registrar no servidor, com data e versão do texto apresentado, para valer como prova. |
| Instituições participantes | Nomes fictícios | Lista real de parceiros. |
| Pedido de demonstração | Valida, mas não envia; a tela diz isso | Ligar ao canal comercial real antes de publicar. |
| Contato do produtor no pedido de conversa | Não é coletado | Definir como o contato é pedido ao produtor depois da autorização. |
| Acesso ao painel | Sem login | Autenticação por instituição, e cada instituição vendo só a própria carteira. |

## Marcadores para a equipe preencher

Procure por estes marcadores no código:

- `{{PRICING_PLACEHOLDER}}` — `src/lib/institucional/conteudo-comercial.ts`
  (preço e forma de cobrança dos dois planos, e a resposta "Quanto custa a
  licença?"). A forma de cobrança dos pedidos de conversa não pode depender de
  o produtor contratar crédito e `src/components/institucional/pagina/PlanosECasos.tsx`.
  Enquanto não houver preço, a tela mostra "Valor sob consulta".
- `{{CASES_PLACEHOLDER}}` — `casosDeInstituicoes` em
  `src/lib/institucional/conteudo-comercial.ts`. A lista está vazia, e a parte
  de casos só aparece quando houver pelo menos um caso real e autorizado.

## Testes

```bash
npm test
```

Usa o executor de testes do próprio Node (sem dependência nova). Os testes
cobrem a ocultação de grupos pequenos (inclusive com os grupos pequenos
colocados de propósito nos dados fictícios), a coerência dos totais dos dados
simulados, que cada pedido de conversa traz só as três linhas do resumo, as
regras dos dois consentimentos e a validação do pedido de demonstração.
