# Meu Crédito Rural

An orientation layer between rural producers — coffee growers first — and the
complexity of Brazilian rural credit. It helps a producer understand their debt
situation and identify paths that *may* be worth evaluating.

It is **not** a bank, it does not renegotiate debt, and it never promises an
approval. The diagnostic is indicative and built from what the producer tells
us.

Product journey: **Entender → Diagnosticar → Medir → Comparar → Agir.**

> **Language policy.** Every user-facing string is Brazilian Portuguese
> (pt-BR) — labels, buttons, errors, empty states, alt text, meta tags.
> Code, comments, commit messages and this README are English.

---

## Current phase: UX/UI foundation

This branch contains the design system and a high-fidelity, working front end.
There is **no backend, no authentication, no database and no real diagnostic
engine yet**. Where the flow needs dynamic behaviour it is built as a fully
interactive prototype over local state and sample data. Every such place is
marked with a `PROTOTYPE` or `MOCK` comment in the source — search for those
before wiring anything to a real service.

Specifically simulated today:

| Area | File | What is fake |
|---|---|---|
| Diagnostic analysis | `src/lib/diagnostic.ts` → `analyse()` | Placeholder rules; the **output shape** is the contract the real engine should honour. |
| Sample scenarios, FAQ, action plan | `src/lib/mock-data.ts` | Illustrative values, not offers or predictions. |
| Document upload | `src/components/ui/FileUpload.tsx` | Nothing leaves the device; the round trip is a timer. |
| Answer storage | `src/lib/useSavedAnswers.ts` | `localStorage` only — no account, no sync. |

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

The first `npm install` and the first build download the two web fonts through
`next/font`, which self-hosts them — after that, builds work offline and the
running app never requests a third-party font.

### Routes

| Route | What it is |
|---|---|
| `/` | The public landing page. |
| `/diagnostico` | The seven-step diagnostic prototype. |
| `/diagnostico/resultado` | The results screen, computed in the browser. |
| `/design-system` | Living reference: every token and every component state. |

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
icon shape *and* a written pt-BR label (`StatusBadge`, `Alert`, `DebtShareChart`).
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
| `DebtShareChart` | `DebtChart.tsx` | Debt as a share of projected revenue — a labelled proportion bar. |
| `ComparisonBar` | `DebtChart.tsx` | One measure, one axis, always directly labelled. |
| Icons | `Icon.tsx` | Hand-rolled inline SVG — no icon package. |

Brand marks live in `src/components/brand`: `Logo` / `LighthouseMark` and
`HeroScene` (the beam revealing a path through the plantation, inline SVG so
there is no image request).

### Supporting modules

- `src/lib/format.ts` — pt-BR formatting, masks and parsing (`formatCurrency`,
  `maskPercent`, `parseBrNumber`, `debtToRevenueRatio`…).
- `src/lib/glossary.ts` — plain-language definitions (CPR, CET, Pronaf,
  carência, portabilidade…). A technical term is never shown bare; wrap it in
  `<Term>`.
- `src/lib/diagnostic.ts` — question order, per-step validation and `analyse()`.
- `src/lib/useSavedAnswers.ts` — `localStorage` persistence and online status.

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
