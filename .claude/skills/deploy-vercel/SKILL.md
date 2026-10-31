---
name: deploy-vercel
description: Publica o site Meu Crédito Rural na Vercel (projeto meu-credito-rural do time startupiot7). Use quando o usuário pedir para fazer deploy, publicar, subir ou atualizar o site na Vercel. Sem argumento publica em produção; com "preview" gera só uma URL de teste.
argument-hint: "[preview]"
---

# Deploy do Meu Crédito Rural na Vercel

Argumento recebido: `$ARGUMENTS`

- Vazio, `prod` ou `producao` → deploy de **produção** (`https://meu-credito-rural-one.vercel.app`).
- `preview` → deploy de **preview** (URL temporária, produção não muda).

Rode tudo a partir da raiz do repositório. Responda ao usuário em português.

## 1. Conferir o projeto vinculado

```bash
cat .vercel/project.json
```

Tem que mostrar `"orgId":"team_p0v1a2mnOZxWMT5KaE1XLRrD"` e `"projectName":"meu-credito-rural"`
(time **startupiot7**). Existe um projeto antigo com o mesmo nome em `pedromarcals-projects`
que serve conteúdo desatualizado — **nunca** faça deploy nele.

Se o arquivo não existir ou apontar para outro `orgId`, vincule explicitamente:

```bash
vercel link --yes --scope startupiot7 --project meu-credito-rural
```

Depois do `link`, desfaça os efeitos colaterais: apague o `.env.local` que ele cria (só contém
`VERCEL_OIDC_TOKEN`) e reverta a linha `.env*` que ele acrescenta ao `.gitignore`
(`git checkout -- .gitignore`), porque `.env*.local` já está ignorado.

## 2. Conferir o login

```bash
vercel whoami
```

Se der `Not authorized` / não logado, pare e peça ao usuário para rodar `! vercel login`
com a conta **startup.iot7@gmail.com** (a que tem acesso ao time startupiot7). Não tente
contornar o login.

## 3. Verificações antes de subir

Mostre o que vai junto: o CLI envia a pasta de trabalho **como está**, inclusive arquivos não
commitados e não rastreados (só respeita o `.gitignore`).

```bash
git status --short
git log -1 --oneline
```

Se houver alterações não commitadas, avise o usuário em uma linha quais são — mas não bloqueie
nem faça commit por conta própria.

Depois rode as checagens. Se alguma falhar, **pare**, mostre o erro e não faça o deploy:

```bash
npm run typecheck && npm test && npm run build
```

## 4. Fazer o deploy

Produção:

```bash
vercel --prod --yes --scope startupiot7
```

Preview:

```bash
vercel --yes --scope startupiot7
```

A última linha da saída é a URL do deploy. Se o build falhar na Vercel, mostre o trecho do erro
(`vercel inspect <url> --logs --scope startupiot7`).

## 5. Verificar que está no ar

```bash
curl -sS -o /dev/null -w "%{http_code}\n" https://meu-credito-rural-one.vercel.app
```

(para preview, use a URL que o deploy devolveu — ela pode responder 401 por causa da proteção
de deploy, o que é normal).

Espere `200` em produção. Confira também que o deploy novo é o atual:

```bash
vercel ls meu-credito-rural --scope startupiot7 | head -5
```

## 6. Relatar

Diga ao usuário, em poucas linhas:

- se foi produção ou preview, e a URL;
- o commit publicado (e se havia alterações não commitadas junto);
- o resultado das checagens e do `curl`.

Lembrete fixo: o endereço oficial é `meu-credito-rural-one.vercel.app`. O endereço curto
`meu-credito-rural.vercel.app` pertence ao projeto antigo e **não** é atualizado por este deploy.

Não faça `git commit` nem `git push` como parte desta skill, a menos que o usuário peça.
