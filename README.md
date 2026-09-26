# Meu Crédito Rural

Ajuda o produtor rural — cafeicultor primeiro — a responder, **antes** de
assumir um crédito de custeio: *"essa safra consegue sustentar o crédito que
estou pensando em assumir?"*. E ajuda a cooperativa a entender os riscos da
carteira antes que eles virem inadimplência.

Não é banco, não concede nem recomenda crédito, não renegocia dívidas e nunca
promete aprovação. O diagnóstico é indicativo, gratuito para o produtor e
independente das instituições. A renegociação (e a MP 1.376/2026) aparece
apenas como um caminho para quem já está com dificuldade.

> **Política de idioma.** Tudo o que é criado ou alterado usa português do
> Brasil: textos da interface, nomes de arquivos, funções, variáveis, tipos,
> comentários, testes e commits. Partes antigas deste README e do design
> system ainda estão em inglês.

---

## Fase atual: protótipo sem backend

Não há servidor, login nem banco de dados. As respostas ficam no navegador
(`localStorage`) e o resultado é calculado no próprio aparelho.

| Parte | Onde está | O que ainda é provisório |
|---|---|---|
| Motor do diagnóstico preventivo | `src/lib/diagnostico/` | As premissas marcadas `{{PREMISSA_A_VALIDAR}}` em `premissas.ts`. |
| Critérios da MP 1.376/2026 | `src/lib/diagnostico/mp.ts` | Todos: a MP aparece sempre como "não avaliada". |
| Painel das cooperativas | `src/lib/institucional/dados-simulados.ts` | Todos os números são fictícios. |
| Consentimentos | `src/lib/consentimento/` | Guardados só no navegador; precisam ir para o servidor. |

O motor, as fórmulas, as premissas e como preencher a MP estão explicados em
[`docs/diagnostico-preventivo.md`](docs/diagnostico-preventivo.md).

---

## Running locally

Requires Node.js 18.18+ (developed on Node 22) and npm.

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Development server with hot reload. |
| `npm run build` | Production build. |
| `npm run start` | Serves the production build. |
| `npm run lint` | ESLint via `next lint`. |
| `npm run typecheck` | `tsc --noEmit`. |
| `npm test` | Testes do motor do diagnóstico, do questionário, da privacidade e dos consentimentos (executor do Node, sem dependência nova). |

The first `npm install` and the first build download the two web fonts through
`next/font`, which self-hosts them — after that, builds work offline and the
running app never requests a third-party font.

### Routes

| Route | What it is |
|---|---|
| `/` | Página inicial, com a simulação rápida da safra. |
| `/diagnostico` | Questionário adaptativo: 15 telas para quem já tem custeio, 14 para quem planeja a safra. |
| `/diagnostico/resultado` | Resultado: três cenários, margem de segurança, fatores e um próximo passo. |
| `/diagnostico/exemplo/ja-tenho-custeio` | Exemplo fictício: safra apertada. Não mexe nas respostas salvas. |
| `/diagnostico/exemplo/planejando-safra` | Exemplo fictício: safra com folga. |
| `/diagnostico/consentimento` | Os dois consentimentos opcionais: estatísticas anônimas e conversa com instituições. |
| `/cooperativas` | Página de apresentação para cooperativas. |
| `/painel` | Painel agregado da cooperativa, com dados fictícios. |
| `/design-system` | Living reference: every token and every component state. |

A área institucional está documentada em português em
[`docs/area-institucional.md`](docs/area-institucional.md).

`/design-system` is the fastest way to review the system — open it first.

---

## Design tokens

`src/design-system/tokens.ts` is the **single source of truth**.
`tailwind.config.ts` is a projection of it: never write a raw value in the
Tailwind config or in a component. Add or change the token, and the utility
class follows.

### Colour

The lighthouse in a coffee landscape: deep agricultural green as the voice,
warm beige as the page, coffee brown for support, amber as the light.

| Ramp | Class prefix | Role |
|---|---|---|
| `canopy` | `bg-canopy-600`, `text-canopy-700`… | Primary. Deep agricultural green. |
| `sand` | `bg-sand-50`, `border-sand-200`… | Surfaces. Warm beige — the page is `sand-50`, never white. |
| `coffee` | `text-coffee-600`… | Secondary. Roasted-coffee brown, earth accents. |
| `beam` | `bg-beam-400`, `ring-beam-500`… | Accent. The lighthouse light, and the focus ring. |
| `ink` | `text-ink-900`, `text-ink-600`… | Text. Warm dark neutrals; pure black is never used. |

Status colours ship as a **surface / border / foreground trio**, each verified
at ≥ 4.5:1 foreground-on-surface:

| Token | Class prefix | Meaning |
|---|---|---|
| `healthy` | `bg-healthy-surface text-healthy-fg` | Luz verde — situação saudável. |
| `attention` | `bg-attention-surface text-attention-fg` | Luz amarela — atenção. |
| `risk` | `bg-risk-surface text-risk-fg` | Luz vermelha — risco elevado. |
| `info` | `bg-info-surface text-info-fg` | Neutral information. |

**Colour never carries meaning alone.** Every status is rendered with its own
icon shape *and* a written pt-BR label (`StatusBadge`, `Alert`, os cartões de cenário do resultado).
The palette is validated for colour-vision deficiency separation; the amber sits
below 3:1 against the page, which is why anything using it also carries a direct
label.

### Typography

Two families, both self-hosted by `next/font`:

- **`font-display`** — Source Serif 4 (600, 700). Headings and figures.
- **`font-sans`** — Inter (400, 500, 600). Everything that must be read and acted on.

Scale (`text-*`), sized generously because much of the audience is older and
reading on a phone in daylight. **Body text never goes below `1rem`.**

`caption` 0.8125 · `body-sm` 0.9375 · `body` 1 · `body-lg` 1.125 ·
`title-sm` 1.25 · `title` 1.5 · `title-lg` 1.875 · `display` 2.25 ·
`display-lg` 2.75 · `display-xl` 3.5 (rem)

### Spacing, radius, elevation, motion

- **Spacing** — 4px grid, plus named steps used by layouts: `gutter-mobile`,
  `gutter-desktop`, `section-y`, `section-y-lg`, `stack-xs` … `stack-xl`, and
  `touch` (2.75rem / 44px, the minimum tap target).
- **Radius** — `sm` 6 · `md` 10 · `lg` 14 · `xl` 20 · `2xl` 28 · `3xl` 36 (px).
- **Shadow** — warm-tinted and low contrast: `xs`, `sm`, `md`, `lg`, `card`,
  `focus`. No glassmorphism, no decorative glow.
- **Motion** — `duration-fast|base|slow|beam` with `ease-standard|enter`.
  Animation is only used to communicate progress, transition, confirmation or
  relationship. All of it is disabled under `prefers-reduced-motion`.

### Breakpoints

Mobile-first, named for the devices actually designed against:
`xs` 360 · `sm` 430 · `md` 768 · `lg` 1024 · `xl` 1280 · `2xl` 1440.

> `sm` is a **large phone**, not a tablet. Layout-direction changes
> (stacked → side by side) belong at `md` and above.

---

## Component library

Everything is exported from `@/components/ui`. Each control covers **default,
hover, focus-visible, active, disabled, loading, error and success** where the
state applies.

| Component | File | Notes |
|---|---|---|
| `Button`, `ButtonLink` | `Button.tsx` | 4 variants × 3 sizes; loading state keeps focus and announces politely. |
| `Field` | `Field.tsx` | Shared label / hint / error / success chrome and ARIA wiring for all controls. |
| `TextInput` | `Input.tsx` | Plain text over `Field`. |
| `CurrencyInput` | `Input.tsx` | Live pt-BR mask — types `750000`, shows `R$ 750.000`, reports `750000`. |
| `PercentInput` | `Input.tsx` | Shows `40%`, clamped to 0–100, one decimal. |
| `QuantityInput` | `Input.tsx` | Thousands separators, optional suffix (`sacas`). |
| `Select` | `Select.tsx` | Native `<select>` with our chevron — the OS picker is what the audience knows. |
| `RadioCard`, `RadioCardGroup` | `Choice.tsx` | Large tappable cards with a line of explanation; real `<input>` underneath. |
| `Checkbox` | `Choice.tsx` | Consent and confirmation. |
| `Tooltip` | `Tooltip.tsx` | Opens on hover, focus **and tap**; Escape closes. |
| `Term` | `Tooltip.tsx` | Wraps jargon with its plain-language definition from the glossary. |
| `Card`, `CardHeader` | `Card.tsx` | `raised`, `flat`, `beam`. Use `beam` once per screen — it marks the recommended path. |
| `StepProgress` | `Progress.tsx` | "Pontos no caminho" for the diagnostic. |
| `ProgressBar`, `CheckSteps` | `Progress.tsx` | Single measures and checklists. |
| `StatusBadge`, `StatusLegend` | `StatusBadge.tsx` | Verde / amarelo / vermelho with icon + label. |
| `Alert` | `Alert.tsx` | Explains and offers one next step; never alarms. |
| `FileUpload` | `FileUpload.tsx` | Photo or file, validated before sending, per-file states. |
| `BottomSheet` | `Overlay.tsx` | Mobile pattern; focus trapped, Escape closes, focus restored. |
| `ConfirmDialog` | `Overlay.tsx` | For irreversible actions; cancel is never hidden. |
| `Skeleton*` | `Skeleton.tsx` | Loading shapes used instead of spinners. |
| `StateView` | `StateView.tsx` | `empty` / `error` / `offline` / `success`, each with one action. |
| `ComparisonBar` | `ComparisonBar.tsx` | One measure, one axis, always directly labelled. |
| Icons | `Icon.tsx` | Hand-rolled inline SVG — no icon package. |

Brand marks live in `src/components/brand`: `Logo` / `LighthouseMark` and
`HeroScene` (the beam revealing a path through the plantation, inline SVG so
there is no image request).

### Supporting modules

- `src/lib/format.ts` — pt-BR formatting, masks and parsing (`formatCurrency`,
  `maskPercent`, `parseBrNumber`…).
- `src/lib/glossary.ts` — plain-language definitions (CPR, CET, Pronaf,
  carência, portabilidade…). A technical term is never shown bare; wrap it in
  `<Term>`.
- `src/lib/diagnostico/` — o motor do diagnóstico preventivo e o fluxo do
  questionário (veja [`docs/diagnostico-preventivo.md`](docs/diagnostico-preventivo.md)).
- `src/lib/useDiagnosticoSalvo.ts` — salvamento no aparelho a cada resposta e
  aviso de conexão.

---

## Principles the code is expected to keep

1. **Never a mysterious score.** The results screen shows reasoning the producer
   can check: ✅ what we found, ⚠ what is still missing, what it means, and one
   next step.
2. **One decision per screen.** A step that asks two unrelated questions is a
   bug.
3. **Translate on sight.** Any of CPR / CET / Pronaf / Pronamp / portabilidade
   appears through `<Term>`, with the definition attached.
4. **Never a bare number.** A percentage always travels with the sentence that
   says what it means.
5. **Careful wording.** Use "diagnóstico indicativo", "com base nas informações
   fornecidas", "possíveis caminhos". Never "vamos reduzir sua dívida", "você
   tem direito", "garantimos sua renegociação", "você vai economizar X".
6. **Assume a bad connection.** Skeletons over spinners, answers persisted
   locally, minimal JavaScript, no third-party runtime requests.
7. **Accessibility is not a pass at the end.** Semantic HTML, visible focus,
   44px touch targets, colour never alone, `prefers-reduced-motion` honoured.

---

## Stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 3.4.
No component library, no icon package, no animation library — the payload is a
product requirement.
