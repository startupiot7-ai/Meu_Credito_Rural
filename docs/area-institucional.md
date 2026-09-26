# Área institucional (B2B2C)

Este documento explica as telas criadas para o segundo público do Meu Crédito
Rural: cooperativas, sindicatos rurais e instituições de crédito. Nada aqui
altera a experiência do produtor, que continua gratuita e independente.

## Modelo em três camadas

1. **Gratuito para o produtor, sempre.** Página inicial, diagnóstico e resultado
   continuam como estavam.
2. **Licença institucional.** A cooperativa ou o sindicato paga uma licença anual
   para ver a saúde financeira da carteira de associados, **somada e
   anonimizada**.
3. **Originação qualificada.** Depois do diagnóstico, o produtor pode autorizar,
   instituição por instituição, a apresentação do seu caso. Só então aquela
   instituição vê o caso dele.

A independência do diagnóstico é o valor central: a instituição paga para ver
padrões, nunca para influenciar o resultado que o produtor recebe. Essa regra
aparece escrita dentro das próprias telas ("O que este painel não faz", rodapé
institucional, tela de consentimento).

## Rotas novas

| Rota | Público | O que é |
|---|---|---|
| `/cooperativas` | Gestores de cooperativas e sindicatos | Página de apresentação da licença, com pedido de demonstração. |
| `/painel` | Instituição licenciada | Painel agregado da carteira (protótipo com dados fictícios). |
| `/painel?estado=vazio` | — | Painel de uma instituição sem diagnósticos suficientes. |
| `/painel?estado=carregando` | — | Esqueleto de carregamento do painel. |
| `/diagnostico/consentimento` | Produtor | Etapa opcional de autorização para apresentação a instituições. |

A tela de resultado (`/diagnostico/resultado`) ganhou apenas um convite
discreto, no fim, para a etapa de consentimento.

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
      formatacao.ts                    valores em milhões e datas
      validar-solicitacao-de-demonstracao.ts
    consentimento/
      consentimento.ts                 regras do consentimento (começa desligado)
      useConsentimentoDeOriginacao.ts  guarda as escolhas no dispositivo
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

## Regras do consentimento (originação qualificada)

- **Começa desligado.** Nenhuma instituição vem autorizada. O interruptor não
  tem valor padrão ligado, e isso está escrito nos comentários do código.
- **Específico.** O produtor escolhe instituição por instituição. Não existe
  "autorizar todas".
- **Informado.** A tela mostra, com os números do próprio produtor, exatamente o
  que seria compartilhado. Documentos enviados não são compartilhados.
- **Revogável.** Desligar vale na hora; há também "Retirar todas as
  autorizações". O caminho para revogar fica sempre visível no resultado.
- **Separado.** O texto do consentimento fica sozinho na página, sem outros
  termos.

## O que ainda é protótipo

| Item | Situação atual | O que falta |
|---|---|---|
| Dados do painel | `dados-simulados.ts`, fictícios | Integração com a base real de diagnósticos. |
| Estado do painel | Escolhido pelo endereço (`?estado=`) | Vir do servidor; retirar os atalhos do rodapé do painel. |
| Consentimento | Guardado só no navegador | Registrar no servidor, com data e versão do texto apresentado, para valer como prova. |
| Instituições participantes | Nomes fictícios | Lista real de parceiros. |
| Pedido de demonstração | Valida, mas não envia; a tela diz isso | Ligar ao canal comercial real antes de publicar. |
| Contato do produtor na originação | Não é coletado | Definir como o contato é pedido ao produtor depois da autorização. |
| Acesso ao painel | Sem login | Autenticação por instituição, e cada instituição vendo só a própria carteira. |

## Marcadores para a equipe preencher

Procure por estes marcadores no código:

- `{{PRICING_PLACEHOLDER}}` — `src/lib/institucional/conteudo-comercial.ts`
  (preço e forma de cobrança dos dois planos, e a resposta "Quanto custa a
  licença?") e `src/components/institucional/pagina/PlanosECasos.tsx`.
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
simulados, as regras de consentimento e a validação do pedido de demonstração.
