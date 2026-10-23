---
name: Kinetic Meme & Culture Engine
colors:
  surface: '#111319'
  surface-dim: '#111319'
  surface-bright: '#373940'
  surface-container-lowest: '#0c0e14'
  surface-container-low: '#191b22'
  surface-container: '#1e1f26'
  surface-container-high: '#282a30'
  surface-container-highest: '#33343b'
  on-surface: '#e2e2eb'
  on-surface-variant: '#bccbb9'
  inverse-surface: '#e2e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#869585'
  outline-variant: '#3d4a3d'
  surface-tint: '#4ae176'
  primary: '#4be277'
  on-primary: '#003915'
  primary-container: '#22c55e'
  on-primary-container: '#004b1e'
  inverse-primary: '#006e2f'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#ffb0ce'
  on-tertiary: '#640039'
  tertiary-container: '#ff83b8'
  on-tertiary-container: '#80004b'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6bff8f'
  primary-fixed-dim: '#4ae176'
  on-primary-fixed: '#002109'
  on-primary-fixed-variant: '#005321'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#ffd9e4'
  tertiary-fixed-dim: '#ffb0cd'
  on-tertiary-fixed: '#3e0022'
  on-tertiary-fixed-variant: '#8c0053'
  background: '#111319'
  on-background: '#e2e2eb'
  surface-variant: '#33343b'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: 0em
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: DM Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: DM Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Space Mono
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Space Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-md: 1.5rem
  gutter-lg: 2rem
  margin: 1rem
  margin-md: 2rem
  margin-lg: 3rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system drives a fast-paced, irreverent, and hyper-social meme platform. It targets digital natives, internet archeologists, creators, and community moderators who navigate at lightning speeds. The aesthetic fuses **Neo-Brutalism** with **Cyber-Vibrant Internet Culture**: unashamedly high-contrast, kinetic, and razor-sharp, balanced by disciplined tabular density for backend curation and analytics.

Key brand traits:
- **Electric & Unapologetic:** Intense neon strikes piercing through a deep graphite canvas create instant visual dopamine.
- **Micro-Precision Humor:** Meme cards, karma tags, and viral metrics are rendered with punchy, poster-like clarity.
- **Admin Rigor:** While the consumer side is playful and reactive, the moderation and super-admin layers are dense, analytical, and structured for zero-latency triage.

## Colors

The color architecture is built around an ink-black graphite canvas that elevates hyper-saturated neon emitters:

- **Surface Tiers (Graphite System):**
  - Base Canvas (`#0F1117`): Deep charcoal ink providing absolute contrast without the deadness of `#000000`.
  - Surface Mid (`#161922`): Elevated cards, sidebars, and sticky viewports.
  - Surface High (`#222734`): Modals, tooltips, and interactive card hovers.
  - Border Subdued (`#2E3648`): Clean division between meme streams and moderation feeds.

- **Kinetic Accents:**
  - **Electric Lime (`#22C55E` / `#10B981`):** Primary upvote actions, karma positive deltas, successful publish states, and verified badge indicators.
  - **Cyber Violet (`#8B5CF6`):** Secondary interactive nodes, category pills (Shitpost, OC, Lore), and elevated user badges.
  - **Neon Magenta (`#EC4899`):** Tertiary triggers, virality surges, hot streaks, NSFW blur reveals, and pinned mod actions.
  - **Caution Amber (`#F59E0B`):** Strike counters, report flags, rate-limit warnings, and spicy/controversial sorting indicators.

## Typography

The type system blends structural geometric display with razor-sharp monospaced data metadata:

- **Space Grotesk (Headlines):** High-tension, eccentric geometric forms. Headlines command immediate focus, projecting authentic internet counter-culture.
- **DM Sans (Body & Comments):** Highly legible, human, neutral grotesque for rapid reading across endless comment sections and meme captions.
- **Space Mono (Labels, Stats, Pill Data):** Technical, terminal-grade monospace used for upvote metrics, karma tallies, timestamps, tags, and super-admin data tables.

## Layout & Spacing

The platform applies a responsive 12-column layout that shifts dynamically between consumer stream viewing and dense administrative dashboard matrices:

- **Desktop Feed Grid:** 12-column fluid structure with a pinned max container width of 1440px. The central feed spans 7 columns, left contextual navigation takes 2 columns, and right virality/leaderboard rails take 3 columns.
- **Admin/Moderation Matrix:** Full-width 100% fluid edge-to-edge layout with a collapsable 240px utility rail and an active multi-pane data table.
- **Mobile Reflow:** Single-column layout with fixed top/bottom utility bars. Inner feed elements use `margin: 1rem` with a compact `space-sm` internal item separation to maintain maximum vertical media density.

## Elevation & Depth

Visual hierarchy uses a **High-Contrast Border Layering** model rather than soft diffused blurs, staying true to neo-brutalist digital design:

- **Edge Definition:** Layers are separated primarily through 1px solid structural outlines (`#2E3648` on idle surfaces, shifting to `#22C55E` or `#8B5CF6` on focus/hover).
- **Hard Offset Drops:** Interactive elements (cards, active filter pills, buttons) use zero-blur hard offset shadows (`2px 2px 0px #000000`, scaling to `4px 4px 0px #22C55E` on active state), evoking vintage screen mechanics and sticker decals.
- **Glass Overlays:** Reserved strictly for ephemeral media layers—such as floating upvote toasts, video overlay controls, and image zoom shields—using `rgba(15, 17, 23, 0.75)` with an 8px backdrop blur.

## Shapes

The shape hierarchy establishes a crisp contrast between architectural structures and interactive pills:

- **Micro-Radius Containers (`roundedness: 1`):** Panels, meme media containers, modals, table headers, and input boxes adopt a sharp `4px` (`0.25rem`) corner radius. This delivers an authoritative, engineered feel.
- **Full Pill Encapsulation:** Upvote counters, karma chips, status badges, and user-flair capsules break the grid with full-pill radii (`9999px`), visually distinguishing atomic interactive units from parent container boxes.

## Components

### Buttons
- **Primary Kinetic:** Sharp corners (`0.25rem`), neon green background (`#22C55E`), jet-black Space Grotesk text (`#0F1117`), 1px black outline with a hard `2px 2px 0px #000` drop-shadow. Hover translates `-1px, -1px` with a matching hard shadow increase.
- **Ghost/Destructive:** Graphite background (`#161922`), border `1px solid #EC4899`, text `#EC4899`.

### Upvote & Karma Pill Indicators
- **Voter Cluster:** Pill shape (`9999px`) housing a dual arrow and monospace counter.
- **State Changes:** Idle state displays `#2E3648` border with `#8B5CF6` counter text. Upvoted state ignites the entire pill border in `#22C55E` with an electric glow (`box-shadow: 0 0 12px rgba(34, 197, 94, 0.35)`). Spicy/controversial votes toggle the amber indicator (`#F59E0B`).

### Meme Content Cards
- Constructed on `#161922` with a `1px solid #2E3648` perimeter.
- Top metadata strip hosts avatar, sub-community capsule, user karma score (`Space Mono`), and an options trigger.
- Media viewport features an edge-to-edge fit with an automatic aspect-ratio lock and an optional spoiler/NSFW blur layer.

### Inputs & Search
- Surface `#0F1117` with `1px solid #2E3648`.
- Focus snaps to `1px solid #8B5CF6` with a crisp `2px 2px 0px #8B5CF6` border offset. Placeholder text rendered in muted slate (`#64748B`).

### Super-Admin & Moderation Tables
- Dense tabular rows (`36px` row height) built for rapid inspection. Monospace numerical columns for report count, spam likelihood, user trust rating, and latency.
- Row highlighting: Amber tint for flagged posts, magenta highlight for immediate DMCA/escalation queues, green marker for batch-approved nodes.