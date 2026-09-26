# Diagnóstico preventivo da safra

Este documento explica como o Meu Crédito Rural responde à pergunta do
produtor: *"se as coisas não acontecerem exatamente como espero, esse custeio
ainda cabe na minha safra?"*.

O diagnóstico **não é score de crédito**. Não existe nota. O resultado segue
sempre a ordem: **o que encontramos → o que isso significa → o que fazer
agora**.

## Onde está cada coisa

```text
src/lib/diagnostico/
  tipos.ts                  vocabulário: respostas, dados da safra, cenários, resultado
  premissas.ts              TODAS as premissas numéricas e limites de faixa
  interpretar-respostas.ts  faixas e "não sei" viram números com origem
  cenarios.ts               os três cenários de simulação
  margem-de-seguranca.ts    quanto a safra pode piorar antes de faltar dinheiro
  situacao.ts               os três níveis e a frase-síntese
  fatores.ts                até três fatores, em ordem de importância
  proximo-passo.ts          um único próximo passo
  mp.ts                     critérios da MP 1.376/2026 (ainda não avaliada)
  diagnosticar.ts           junta tudo: respostas → resultado
  fluxo.ts                  telas do questionário, validação, teto de 15 telas
  persistencia.ts           chave mcr:diagnostico:v2 e migração da v1
  exemplos.ts               respostas fictícias do botão "ver com um exemplo"
  simulacao-rapida.ts       a simulação da página inicial (mesma conta)
```

Tudo nessa pasta é puro: não depende de React, e os testes rodam direto no
Node com `npm test`. Os arquivos importam uns aos outros com a extensão `.ts`
(opção `allowImportingTsExtensions` no `tsconfig.json`) justamente para isso.

## A conta, em português

Para cada cenário:

```text
produção própria      = produção esperada × (1 − parte do dono da terra, na parceria)
sacas livres          = produção própria − sacas prometidas (barter, CPR, troca)
receita               = sacas com preço fechado × preço esperado
                      + demais sacas livres × preço do cenário
custos do bolso       = custo da safra − (custeio + compras a prazo + valor do café prometido)
                        (nunca menos que zero)
compromissos          = parcela do custeio + parcela de investimento
                      + compras a prazo + arrendamento + retirada da família
o que sobra           = receita − custos do bolso − compromissos
```

**Por que "custos do bolso", e não o custo inteiro?** Parte do adubo já foi
paga com o custeio ou com café prometido. Descontar o custo inteiro *e* a
parcela contaria a mesma despesa duas vezes. Há teste que prova que, quando o
crédito não passa do custo, a sobra é igual à conta econômica simples
(receita − custo − juros − outros pagamentos).

**Cenários** (valores em `premissas.ts`):

| Cenário | Produção | Preço (sacas sem preço fechado) | Custo |
|---|---|---|---|
| Esperado | como informado | como informado | como informado |
| Desfavorável | −20% | −20% | +10% |
| Favorável | +10% | +10% | igual |

**Margem de segurança** — não usa nenhuma premissa. É o ponto em que a sobra
do cenário esperado chega a zero, uma piora de cada vez:

```text
quebra de produção suportada = sobra ÷ (produção própria × preço)
queda de preço suportada     = sobra ÷ (sacas ao preço do dia × preço)
aumento de custo suportado   = (sobra + folga do crédito acima do custo) ÷ custo
```

Os testes aplicam cada margem calculada como variação de um cenário e
conferem que a sobra zera.

**Situação** (três níveis, mais "faltam dados" com o tom informativo):

| Situação | Regra |
|---|---|
| A safra cobre com folga | sobra no cenário desfavorável |
| A safra cobre, mas fica apertada | sobra no esperado, falta no desfavorável |
| A safra não cobre os compromissos | falta já no esperado |
| Faltam dados para calcular | sem produção, sem preço, ou sem custo e sem custeio |

## Dados faltantes e faixas

- Faixa fechada: usamos o ponto médio.
- Faixa aberta ("acima de X"): usamos X e avisamos que pode ser maior.
- Produção "não sei": usamos a média histórica, se houver.
- Custo "não sei": consideramos que o custeio e o café prometido pagam todo o
  custo, e avisamos que a sobra real pode ser menor.
- Juros: as taxas por linha ainda não têm valor, então a parcela estimada é o
  próprio custeio, e o resultado avisa. Quem já tem custeio pode informar a
  parcela real.

Toda aproximação vira uma frase em "Como esta conta foi feita", no resultado.

## Premissas a validar

Todas estão em `src/lib/diagnostico/premissas.ts`, com nome, valor, unidade,
finalidade, fonte e justificativa. Nenhuma está validada; procure por
`PREMISSA_A_VALIDAR`.

| Premissa | Valor provisório | Fonte a buscar |
|---|---:|---|
| Queda de produção no desfavorável | 20% | Conab, IBGE/PAM, Embrapa Café |
| Queda de preço no desfavorável | 20% | Cepea/Esalq |
| Aumento de custo no desfavorável | 10% | Conab (custos), FGV (IPA) |
| Alta de produção e de preço no favorável | 10% e 10% | Conab, Cepea/Esalq |
| Prazo do custeio | 12 meses | Manual de Crédito Rural (BCB) |
| Taxa de juros por linha | sem valor | Plano Safra, MCR, resoluções do CMN, MAPA (Funcafé) |
| Tolerância entre expectativa e média | 15% | Conab, Embrapa (bienalidade) |
| Parte da safra prometida que merece destaque | 30% | critério de comunicação |
| Divisões da parceria | 1/4, 1/3, 1/2 | Estatuto da Terra, Decreto 59.566/1966 |
| Limites das faixas (preço, custo, valores) | ver arquivo | Cepea, Conab, CNA/Campo Futuro, cooperativas |
| Limites das opções de "preço fechado" | ver arquivo | definição da equipe |

A tela de resultado mostra as premissas usadas sempre como hipótese, com o
selo "A validar".

## MP 1.376/2026

Está em `src/lib/diagnostico/mp.ts` e aparece **só** para quem já tem custeio
e já está com dificuldade (parcela atrasada, prorrogação, renegociação ou
safra que não cobre). A leitura é sempre "não avaliada". Para preencher depois
da validação jurídica:

1. Em cada critério, escreva `regra` e `fonte` e confira o `dadoNecessario`.
2. Se o dado ainda não é perguntado no questionário, crie a pergunta antes.
3. Marque `validado: true`.
4. Programe a verificação de cada critério. Até lá, a leitura continua "não
   avaliada", mesmo com todos validados.

## Persistência

- Chave atual: `mcr:diagnostico:v2`, com a tela atual guardada pelo nome.
- A v1 (`mcr:diagnostico:v1`) nunca é sobrescrita. Quando só ela existe,
  aproveitamos cultura, sacas e preço. A dívida antiga **não** é aproveitada:
  era o saldo total, e a conta nova precisa da parcela desta safra.
- "Recomeçar" apaga as duas, por pedido explícito do produtor.

## Consentimentos

São dois, separados, desligados por padrão e revogáveis. Nenhum muda o
diagnóstico.

1. **Estatísticas anônimas** (`mcr:consentimento-estatistico:v1`): só quem
   ligou entra nos números agregados do painel.
2. **Conversa com instituições** (`mcr:consentimento-originacao:v2`),
   instituição por instituição. A instituição autorizada recebe só a situação
   da safra, a margem de segurança e o fator que mais pesou — nunca respostas
   ou valores, nem a retirada da família. As autorizações da v1 não são
   herdadas, porque valiam para outro conteúdo.
