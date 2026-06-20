# GoalFlow — Software & Design Documentation

**Product:** GoalFlow — Personal Goal Management Kanban Platform
**Document type:** Combined Software Design Document (SDD) + Design System Reference
**Version:** 1.0.0
**Status:** Front-end complete (client-only, mock data) — no backend yet
**Last updated:** June 2026

---

## How to use this document

This is the single reference for everything about how GoalFlow is built and why. It's written so that a developer who has never seen the codebase — including a future version of whoever builds on it next — can get from zero to productive without re-reverse-engineering decisions that already got made. Where a decision was a judgment call (a color, a animation duration, a data shape), this doc says so explicitly, so it can be revisited deliberately instead of by accident.

Keep this file in the repo root (or `/docs`) and update it in the same PR as any structural change — new entity field, new store action, new route, new design token. A docs file that drifts from the code is worse than no docs file.

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Product & Design Vision](#2-product--design-vision)
3. [Tech Stack](#3-tech-stack)
4. [System Architecture Overview](#4-system-architecture-overview)
5. [Project Structure](#5-project-structure)
6. [Design System](#6-design-system)
7. [Data Model](#7-data-model)
8. [State Management](#8-state-management)
9. [Routing & Page Architecture](#9-routing--page-architecture)
10. [Component Reference](#10-component-reference)
11. [DnD Kit Architecture (Deep Dive)](#11-dnd-kit-architecture-deep-dive)
12. [Calculations & Utilities Reference](#12-calculations--utilities-reference)
13. [Page-by-Page Functional Specification](#13-page-by-page-functional-specification)
14. [Accessibility](#14-accessibility)
15. [Responsive Behavior](#15-responsive-behavior)
16. [Performance Considerations](#16-performance-considerations)
17. [What's Mocked vs. Real](#17-whats-mocked-vs-real)
18. [Testing Strategy](#18-testing-strategy-recommended)
19. [Roadmap — Next Development Phases](#19-roadmap--next-development-phases)
20. [Coding Conventions](#20-coding-conventions)
21. [Glossary](#21-glossary)
22. [Appendix: Full File Index](#22-appendix-full-file-index)

---

## 1. Introduction

### 1.1 Purpose

GoalFlow is a personal goal-management platform — a Kanban board for life goals rather than tasks. This document captures the product reasoning, the visual design system, the data model, the state architecture, and the component API so that future work (backend integration, new features, redesigns) can build on intent rather than guesswork.

### 1.2 Product summary

Users define goals (e.g. "Run a sub-4-hour marathon"), break them into milestones, and move them through four maturation stages — **Planning → In Progress → Review → Achieved** — on a drag-and-drop board. Progress is derived entirely from milestone completion, visualized through the product's signature element, the **Growth Ring** (a tree-ring-style concentric progress indicator). A Dashboard, Analytics page, and Achievements/gamification page round out the experience.

### 1.3 Audience

- Engineers picking up this codebase to add features or wire up a backend
- Designers extending the visual system to new surfaces
- Whoever scopes "Phase 2" and needs to know exactly what's real vs. simulated today

### 1.4 Scope & current status

This is a **complete, working front-end** — every interaction (drag-and-drop, milestone toggling, goal creation, filtering, settings toggles) updates real application state and re-renders dependent UI (charts, rings, counts) live. There is **no backend**: all data lives in a single in-memory Zustand store, seeded from a mock dataset on load, and is lost on refresh. Section 17 enumerates exactly what's mocked and section 19 lays out how to make it real.

---

## 2. Product & Design Vision

### 2.1 Core product philosophy

The product's emotional job is "show me I'm becoming who I want to be," not "show me my todos." Three concrete decisions follow from that framing:

| Generic task-tracker default | GoalFlow's choice | Why |
|---|---|---|
| Progress = a percentage / linear bar | Progress = a **Growth Ring** (concentric arcs, one per milestone) | A linear bar reads as "task completion." A tree-ring reads as cumulative growth over time — it's the metaphor the whole product is built around. |
| Kanban stages = generic "To Do / Doing / Done" | Stages = a **maturation arc**: Planning → In Progress → Review → Achieved | "Review" exists because real goals have a verification/reflection moment before they're truly done (a race run, a promotion case presented) — collapsing that into "Doing → Done" loses something real about how goals actually resolve. |
| Gamification = points/levels | Gamification = streaks + badges + a trophy case of **actually completed goals** | Keeps the reward tied to real outcomes rather than abstract points, so it reinforces the "growth" framing instead of competing with it. |

### 2.2 Experience pillars

1. **Derived, not duplicated.** No progress percentage, streak count, or chart value is ever stored directly — everything is computed from `goals` + `milestones` at render time (see §12). This is a deliberate architectural commitment, not just a style preference: it means the UI can never show stale or contradictory numbers.
2. **One signature visual motif, used everywhere.** The Growth Ring appears at three scales (card-level, hero-level, detail-level) so the product has a consistent visual fingerprint instead of three different progress-indicator styles competing for attention.
3. **The board is the product.** Every other page (Dashboard, Analytics, Achievements) is a different lens on the same underlying goal/milestone data — there's deliberately no separate "task" entity or parallel data model.

### 2.3 Visual identity rationale

The brief asked for something between Linear, Notion, Trello, Framer, and Arc — explicitly **not** a generic SaaS template. Two specific anti-patterns were avoided on purpose:

- **Not** the cliché "warm cream background + serif headline + terracotta accent" AI-design default.
- **Not** the near-black + single neon-accent SaaS default.

Instead: a cool warm-neutral light canvas (`#F7F8FA`), a dark ink sidebar (`#0E1014`, Linear-style icon rail), and a **moss/ember/indigo/amber** palette tied directly to product meaning (moss = growth/achieved, ember = high priority/streak energy, indigo = in-progress/focus, amber = review/caution) rather than decoration. Full rationale and exact tokens are in §6.

---

## 3. Tech Stack

| Layer | Choice | Version (range) | Why this, not an alternative |
|---|---|---|---|
| Build tool | Vite | `^5.2.11` | Fast HMR, zero-config React JSX, minimal config surface vs. Webpack/CRA. |
| UI library | React | `^18.3.1` | Required by brief; hooks-based, matches DnD Kit / Recharts ecosystem expectations. |
| Routing | React Router | `^6.23.1` | Standard SPA routing; `<Outlet>`-based layout nesting used for the persistent sidebar shell. |
| Drag & drop | DnD Kit (`@dnd-kit/core`, `/sortable`, `/utilities`) | `^6.1.0` / `^8.0.0` / `^3.2.2` | Accessible (keyboard + screen-reader support out of the box), unopinionated about rendering, and unlike `react-beautiful-dnd` is actively maintained. See §11 for the full architecture. |
| Animation | Framer Motion | `^11.2.10` | Declarative, handles layout animations (`layout` prop) needed for milestone-list reflows and drag lift effects without manual FLIP math. |
| Icons | Lucide React | `^0.383.0` | Consistent 1.5px-stroke icon set, tree-shakeable, matches the Linear/Notion aesthetic family. |
| Charts | Recharts | `^2.12.7` | Declarative React-native chart composition; used on Dashboard (momentum area chart) and Analytics (bar/line/pie). |
| State management | Zustand | `^4.5.2` | Chosen over Context API because the board needs frequent, granular updates (drag position, filters) without re-rendering the whole tree — Zustand's selector-based subscriptions (`useGoalStore(s => s.goals)`) avoid the "everything re-renders" problem Context has without `useMemo` gymnastics everywhere. Chosen over Redux for the much smaller boilerplate at this scale. |
| Styling | Tailwind CSS | `^3.4.3` | Utility-first, design tokens defined once in `tailwind.config.js` (see §6), no separate CSS-in-JS runtime cost. |
| Dates | date-fns | `^3.6.0` | Tree-shakeable, immutable, used for all date formatting/diffing (`formatDueDate`, `dueMeta`). |
| Class merging | clsx | `^2.1.1` | Wrapped as `cn()` in `src/lib/utils.js` for conditional className composition. |

**Fonts** (loaded via Google Fonts `<link>` in `index.html`, not npm packages): Fraunces (display), Inter (UI/body), JetBrains Mono (data/stats).

---

## 4. System Architecture Overview

GoalFlow is currently a **fully client-side single-page application**. There is no server component; "persistence" is in-memory only (resets on refresh — see §17 and §19 for the path to real persistence).

### 4.1 High-level architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser (SPA)                          │
│                                                                   │
│  ┌───────────┐      ┌────────────────────────────────────────┐ │
│  │  index.html │ ──▶ │              main.jsx                  │ │
│  │ (fonts,root)│      │  mounts <App /> into #root             │ │
│  └───────────┘      └────────────────────┬───────────────────┘ │
│                                            │                     │
│                                            ▼                     │
│                                  ┌──────────────────┐            │
│                                  │     App.jsx       │           │
│                                  │  <BrowserRouter>  │           │
│                                  │  route table       │          │
│                                  └─────────┬─────────┘           │
│                                            │                     │
│                                            ▼                     │
│                              ┌──────────────────────┐            │
│                              │   AppShell.jsx        │           │
│                              │ Sidebar + <Outlet/>   │           │
│                              │ (route transitions)   │           │
│                              └───────────┬───────────┘           │
│                                          │                       │
│      ┌───────────────┬───────────────────┼───────────────┬──────┴──────┐
│      ▼               ▼                   ▼               ▼             ▼
│ Dashboard       GoalsBoard         GoalDetails       Analytics    Achievements / Settings
│      │               │                   │               │             │
│      └───────────────┴─────────┬─────────┴───────────────┴─────────────┘
│                                  ▼
│                     ┌─────────────────────────┐
│                     │   useGoalStore (Zustand)  │
│                     │  goals / milestones /     │
│                     │  order / activity / ui    │
│                     └─────────────┬─────────────┘
│                                   ▼
│                     ┌─────────────────────────┐
│                     │   mockData.js (seed)      │
│                     │   in-memory only,          │
│                     │   no network, no persistence│
│                     └─────────────────────────┘
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Data flow pattern

Unidirectional, single-store, no prop-drilling:

```
User action (click / drag / type)
        │
        ▼
Component calls a store action  ──────▶  useGoalStore.<action>(...)
        │                                        │
        │                                        ▼
        │                          Zustand `set()` produces a new
        │                          immutable slice of state
        │                                        │
        ▼                                        ▼
Component re-renders only if its          Every other component
selected slice changed                    subscribed to that slice
(e.g. `s => s.goals[id]`)                 also re-renders
        │
        ▼
Derived values (progress %, streak, chart data) are recomputed
in the component from raw state via src/lib/calculations.js —
never stored redundantly.
```

### 4.3 Why no backend yet

The brief's deliverable was the front-end application; the data layer was deliberately built **behind a clean Zustand interface** (`src/store/useGoalStore.js`) specifically so it can be swapped for real persistence without touching any component. Every component reads/writes through store actions, never through `mockData.js` directly (except the store's own initialization) — this is the seam where Phase 1/2 of the roadmap (§19) plugs in.

---

## 5. Project Structure

```
goalflow/
├── index.html                  Vite entry HTML; Google Fonts <link> tags live here
├── package.json                 Dependencies + npm scripts (dev/build/preview)
├── vite.config.js               Vite + @vitejs/plugin-react config
├── tailwind.config.js           ★ Design tokens: colors, type, radius, shadows, keyframes
├── postcss.config.js            Tailwind + autoprefixer wiring
├── README.md                    Quick-start + architecture summary (shorter version of this doc)
│
└── src/
    ├── main.jsx                 ReactDOM root; imports global CSS
    ├── App.jsx                  ★ Route table (BrowserRouter + Routes)
    │
    ├── styles/
    │   └── globals.css          Tailwind layers, focus-ring styles, reduced-motion query, scrollbar utilities
    │
    ├── store/
    │   └── useGoalStore.js      ★ THE single source of truth — see §8
    │
    ├── lib/
    │   ├── mockData.js          Seed data: 10 goals, milestones, activity feed, chart mock series
    │   ├── calculations.js      ★ All derived-value logic (progress %, due-date labels, sorting)
    │   └── utils.js             cn() classname helper, uid() id generator
    │
    ├── components/
    │   ├── ui/                  Design-system primitives (no domain knowledge of "goals")
    │   │   ├── Button.jsx
    │   │   ├── Badge.jsx
    │   │   ├── Card.jsx
    │   │   ├── Input.jsx        (exports Input, Textarea, Select)
    │   │   ├── Dialog.jsx       Modal, Framer Motion enter/exit
    │   │   ├── Tooltip.jsx      (exports Tooltip, EmptyState)
    │   │   └── GrowthRing.jsx   ★ The signature visual element — see §6.7
    │   │
    │   ├── layout/               App chrome
    │   │   ├── Sidebar.jsx       Collapsible dark icon-rail nav
    │   │   ├── TopBar.jsx        Per-page title/subtitle/action header
    │   │   └── AppShell.jsx      Sidebar + <Outlet> + route-transition wrapper
    │   │
    │   └── goals/                 Domain components (know about Goal/Milestone shape)
    │       ├── GoalCard.jsx       Draggable card (useSortable)
    │       ├── GoalDragOverlay.jsx  Static visual twin shown in <DragOverlay>
    │       ├── KanbanColumn.jsx     Droppable column (useDroppable + SortableContext)
    │       ├── CommandBar.jsx       Search + sort + filter chips + "New Goal" button
    │       ├── MilestoneRow.jsx     Single milestone checkbox row
    │       ├── NewGoalDialog.jsx    "Create goal" form inside <Dialog>
    │       └── PriorityDot.jsx      (exports PriorityDot, CategoryTag)
    │
    └── pages/                     One file per route, composed from the above
        ├── Dashboard.jsx
        ├── GoalsBoard.jsx
        ├── GoalDetails.jsx
        ├── Analytics.jsx
        ├── Achievements.jsx
        └── Settings.jsx
```

**Naming convention:** `ui/` components are domain-agnostic (a `Button` doesn't know what a "goal" is); `goals/` components are domain-specific. If a future feature adds a second domain (e.g. "Habits"), it should get its own `components/habits/` folder following the same split — don't add habit-specific logic into `ui/`.

---

## 6. Design System

All tokens are defined in exactly two places: `tailwind.config.js` (colors, type, radius, shadow, keyframes) and `src/styles/globals.css` (base/reset layer, focus rings, reduced-motion, scrollbar utilities). Nothing is hardcoded as a raw hex/px value inside component files — every component references a Tailwind token class.

### 6.1 Color tokens

| Token | Hex | Tailwind class root | Semantic use |
|---|---|---|---|
| `canvas` | `#F7F8FA` | `bg-canvas` | Page background |
| `surface` | `#FFFFFF` | `bg-surface` | Card/panel background |
| `ink-950` | `#0E1014` | `bg-ink-950` | Sidebar background, dark surfaces |
| `ink-900` | `#14161A` | `text-ink-900` | Primary text |
| `ink-700` | `#363A44` | `text-ink-700` | Secondary emphasis text |
| `ink-600` | `#565B66` | `text-ink-600` | Secondary/body text |
| `ink-400` | `#9498A3` | `text-ink-400` | Tertiary/placeholder text, disabled icons |
| `ink-200` | `#D6D9DF` | `border-ink-200` | Hover-state borders |
| `border` | `#E6E8EC` | `border-border` | Default hairline borders |
| `moss-100` | `#E3F0EC` | `bg-moss-100` | Tint background (badges, hover states) |
| `moss-500` | `#2E8A6C` | `bg-moss-500` | Mid-tone accent (status dots) |
| `moss-600` | `#1B6F5C` | `bg-moss-600` | **Primary brand color.** CTAs, Achieved status, growth/positive meaning |
| `moss-700` | `#155747` | `text-moss-700` | Text-on-tint (badges) |
| `ember-100` | `#FFE7E0` | `bg-ember-100` | Tint background |
| `ember-500` | `#FF6B4A` | `bg-ember-500` | High priority, streak/energy accent |
| `ember-600` | `#E2502F` | `text-ember-600` | Text-on-tint, danger/overdue text |
| `indigo-100` | `#E8EAFB` | `bg-indigo-100` | Tint background |
| `indigo-500` | `#4C5FD5` | `bg-indigo-500` | Medium priority, "In Progress" status, links |
| `indigo-600` | `#3B4BB8` | — | Hover state for indigo elements |
| `amber-100` | `#FBEDD7` | `bg-amber-100` | Tint background |
| `amber-500` | `#E8A23D` | `bg-amber-500` | "Review" status, due-soon warning |
| `amber-600` | `#C9852A` | `text-amber-600` | Text-on-tint |

**Color-to-meaning mapping is fixed** — don't reassign moss/ember/indigo/amber to different meanings on new screens, since the palette's whole job is to let users pattern-match status/priority by color across the entire app without reading labels.

### 6.2 Typography

Three type roles, each with a distinct job — **never substitute one for another**:

| Role | Font | Tailwind class | Used for |
|---|---|---|---|
| Display | Fraunces (serif, warm, characterful) | `font-display` | Goal titles, page H1s (`TopBar`), card titles, hero headlines. Carries the product's emotional warmth — this is the one place the design takes a "risk." |
| UI/Body | Inter | `font-sans` (default) | All chrome: labels, body copy, buttons, nav, form fields. Never decorative — purely functional. |
| Data/Mono | JetBrains Mono | `font-mono` | Anything numeric that benefits from tabular alignment: percentages, streak counts, dates in stat rows, KPI numbers. |

Type sizes used in practice (no formal numbered scale was codified — these are the sizes actually in use; **if formalizing a scale, start here**):

| Size (px) | Typical use |
|---|---|
| 11–12 | Captions, badge labels, mono stat labels |
| 13–14 | Body text, form labels, card descriptions |
| 15–16 | Card titles, widget headings (`font-display`) |
| 22–28 | Page titles (`TopBar` H1), goal detail hero title |
| 34 | Achievements streak hero number |

### 6.3 Spacing, radius, shadow

| Token | Value | Notes |
|---|---|---|
| Border radius (cards) | `16px` (`rounded-lg`) | The signature radius — generous enough to feel premium, not so large it reads as "playful app." Buttons/inputs use `10px` (`rounded` default), pills use `9999px` (`rounded-full`). |
| `shadow-xs` | `0 1px 2px rgba(20,22,26,.04)` | Resting buttons |
| `shadow-card` | `0 1px 2px + 0 1px 1px rgba(20,22,26,.03–.04)` | Default card elevation |
| `shadow-raised` | `0 8px 24px + 0 2px 6px rgba(20,22,26,.04–.08)` | Card hover state |
| `shadow-floating` | `0 16px 40px + 0 4px 12px rgba(20,22,26,.08–.16)` | Modals, drag overlay |

Spacing otherwise uses Tailwind's default scale (4px base unit) directly — no custom spacing tokens beyond `18` (4.5rem) and `22` (5.5rem), which exist for the sidebar's collapsed/expanded widths.

### 6.4 Motion principles

All animation goes through Framer Motion. Conventions actually used in the codebase:

| Pattern | Duration | Easing | Where |
|---|---|---|---|
| Page transition | `0.18s` | `easeOut`, fade + 8px y-shift | `AppShell.jsx` — wraps `<Outlet>` in `AnimatePresence mode="wait"` |
| Widget/card stagger-in | `0.35–0.4s`, delayed `0.05s` per item | default spring | Dashboard widgets, Analytics chart cards, Achievements badges |
| Card hover lift | implicit (`whileHover`) | — | `GoalCard` — `whileHover={ { y: -2 } }` |
| Drag lift | instant, static transform | — | `GoalDragOverlay` — `rotate(2deg) scale(1.03)`, no animation needed since DnD Kit handles the live transform |
| Ring fill | `0.7–0.8s` | `easeOut`, staggered `0.08s` per ring | `GrowthRing` — `strokeDashoffset` animated from full circumference to target |
| Modal enter/exit | `0.2s` | `easeOut`, scale 0.98→1 + y 16→0 | `Dialog.jsx` |

**Reduced motion:** `globals.css` includes a `prefers-reduced-motion: reduce` media query that collapses all CSS animation/transition durations to near-zero. This covers Tailwind-driven CSS transitions; Framer Motion animations respect the same OS-level setting automatically via its own reduced-motion handling in most cases, but this hasn't been explicitly verified with `useReducedMotion()` — see §19 for a recommended follow-up.

### 6.5 Iconography

Lucide React exclusively, default stroke width (1.5–2px depending on context). Icon sizing convention: `13–15px` inline with text, `16–20px` standalone in nav/buttons, `28–32px` decorative (empty states, hero icons). No icon font, no custom SVG icon set — keep this consistent for any new component.

### 6.6 The Growth Ring — signature element, technical detail

`src/components/ui/GrowthRing.jsx` is the one component every future designer/engineer should read before changing anything progress-related. It has **two render modes**, switched automatically by props:

**Single-ring mode** (default — used whenever `milestoneCount` is omitted or ≤ 1):
- One SVG `<circle>` track + one animated `<circle>` progress arc.
- `strokeDasharray` = full circumference; `strokeDashoffset` animates from full circumference (0% shown) to `circumference - (progress/100) * circumference`.
- Used on: `GoalCard` (40px), `GoalDragOverlay` (40px), Dashboard hero (108px).

**Concentric mode** ("tree rings" — triggered when `milestoneCount > 1`, used with `doneCount`):
- Renders up to **5 rings max** (`Math.min(milestoneCount, 5)`) — if a goal has more than 5 milestones, rings beyond the 5th are folded into the outermost ring rather than rendered separately. *(This is a known simplification — see §19 for the recommended fix if a goal with >5 milestones needs visually distinct rings.)*
- Each ring's radius = `center - strokeWidth/2 - i * gap`, where `gap = strokeWidth + 2`, so rings nest inward without overlapping.
- A ring is fully filled (animated in) if its index `i < doneCount` — i.e., rings fill from the **outside in**, representing milestones completed in order.
- Used on: `GoalDetails` hero (104px) — the only place concentric mode is currently used, since it needs more visual space than a 40px card ring.

```jsx
// Single ring (card-sized)
<GrowthRing progress={67} size={40} strokeWidth={4} tone="ember" />

// Concentric (detail-page hero)
<GrowthRing
  progress={67}
  milestoneCount={5}
  doneCount={3}
  size={104}
  strokeWidth={7}
  tone="moss"
/>
```

`tone` maps priority → ring color via `RING_TONE = { high: 'ember', medium: 'amber', low: 'moss' }`, defined locally in each consumer (`GoalCard`, `GoalDragOverlay`, `GoalDetails`) rather than in `GrowthRing` itself — `GrowthRing` only knows about its 5 named tones (`moss`/`ember`/`indigo`/`amber`/`ink`), not about "priority" as a concept. This keeps the primitive domain-agnostic; the priority→tone mapping is a `goals/`-layer decision, intentionally duplicated three times rather than centralized — **if you touch this mapping, update it in all three files** (or better, extract it to `src/lib/constants.js` as a follow-up — see §19).

---

## 7. UX & Empty States

GoalFlow implements a SaaS-grade approach to Zero States (empty data states) to ensure users aren't met with a broken or confusing interface when starting out.

### Dashboard Zero State
If `useGoalStore().goals` has a length of 0, `Dashboard.jsx` intercepts the standard metrics rendering and outputs a tailored onboarding card. This state includes:
- A `moss-600` highlighted Rocket icon.
- Copy explaining the value proposition ("GoalFlow is a space to define your ambitions...").
- A primary CTA button that directly opens the `NewGoalDialog` without requiring navigation away from the dashboard.
- Elegant 0.5s stagger-in animations via Framer Motion to preserve the premium feel.

### Global Profile Avatar
The `TopBar.jsx` houses the user's avatar. It dynamically computes initials from the `useGoalStore().user.name` state. If the user updates their name via the `/settings` profile form, the `updateUser` Zustand action dispatches the change, instantly reflecting the new initials globally in the sticky TopBar.
