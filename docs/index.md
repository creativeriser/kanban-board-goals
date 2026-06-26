# GoalFlow — Software & Design Documentation

**Product:** GoalFlow — Personal Goal Management Kanban Platform
**Document type:** Combined Software Design Document (SDD) + Design System Reference
**Version:** 1.3.0
**Status:** Phase 1 UX Polish (Popover, Activity Feed, Notifications). Ready for Phase 2 Backend.
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

This is a **complete, working front-end** — every interaction (drag-and-drop, milestone toggling, goal creation, filtering, settings toggles) updates real application state and re-renders dependent UI (charts, rings, counts) live. 

As of **Phase 1**, there is **no backend**, but data is **persistent** using `localStorage` via Zustand's `persist` middleware.

## Colors

The application relies heavily on a dual-theme approach using CSS variables, defined in `index.css` and mapped into `tailwind.config.js`. This allows for a completely seamless, lag-free transition between Light Mode and True OLED Dark Mode.

### Theme System (Light vs. Dark)
We map abstract semantic names to concrete hex values using CSS variables. This ensures that when the user toggles dark mode, the entire UI switches instantly without requiring React to re-render thousands of components. We use smooth CSS transitions (`transition-colors duration-300`) to make the switch feel elegant and professional.

**Semantic Color Mapping:**
- `--color-canvas`: The absolute deepest background layer (e.g., `#F7F8FA` in light, `#000000` in dark for OLED perfection).
- `--color-surface`: Card and dialog backgrounds (e.g., `#FFFFFF` in light, `#0E1014` in dark).
- `--color-border`: Dividers and outlines (e.g., `#E6E8EC` in light, `#2A2F3A` in dark).
- `--color-ink-*`: The primary grayscale spectrum for text, icons, and muted elements.

By using this approach, we guarantee the application will never look "dirty" or inverted during a theme change. The theme defaults to `light` mode but can be instantly toggled on any page via the Sun/Moon icon in the TopBar, or via the `Appearance` section in Settings.

### Premium Dark Mode Methodology (Version 1.2.0+)
To ensure GoalFlow meets a "world-class, industry-standard" premium aesthetic (reminiscent of Vercel or Linear), Dark Mode is not just a direct color inversion. When building new features or modifying the design system, adhere to these rules:

1.  **Deep, Rich Canvas & Luminous Text**: The dark mode canvas relies on a rich, deep zinc/slate (`#09090B`) instead of a flat gray. Primary typography (`--color-ink-900`) should be a crisp off-white (`#FAFAFA`) to provide a high-contrast, satisfying reading experience without being pure white.
2.  **Vibrant Dark Mode Accents**: Semantic accent colors (Moss, Ember, Indigo, Amber) are specifically re-tuned in the `.dark` class to be *brighter and more luminous* (e.g., matching Tailwind's `400` or `300` weights) because dark backgrounds demand higher vibrance to pop. Do not let accent colors become muddy.
3.  **Ambient Depth & Rim Lighting**: Standard drop shadows disappear in dark mode. GoalFlow uses custom shadow utilities (`dark-card`, `dark-raised`, `dark-floating` defined in `tailwind.config.js`) that combine a deep ambient black shadow with a subtle, low-opacity white *top inner shadow*. This creates a "rim light" effect, giving the illusion that the card is physically lifting off the canvas and catching ambient light.
4.  **Glassmorphism for Floating Elements**: Floating UI elements (like the Sidebar, Command Palette, or active states) use `dark:bg-surface/95 dark:backdrop-blur-xl` or `dark:hover:bg-white/5`. This introduces texture and prevents the UI from feeling like flat blocks of color.

> **Note for Future Add-ons**: Any new element introduced must be tested in both modes. If an element requires a background or shadow in light mode, ensure you apply the equivalent `dark:*` premium design tokens (e.g., `dark:shadow-dark-card`, `dark:bg-white/5` for hover states) to maintain this standard.

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
| Routing | React Router | `^6.23.1` | Standard SPA routing; explicitly passing `location` to `<Routes>` within `AnimatePresence` to prevent context freezing during exit animations. |
| Drag & drop | DnD Kit (`@dnd-kit/core`, `/sortable`, `/utilities`) | `^6.1.0` / `^8.0.0` / `^3.2.2` | Accessible (keyboard + screen-reader support out of the box), unopinionated about rendering, and unlike `react-beautiful-dnd` is actively maintained. See §11 for the full architecture. |
| Animation | Framer Motion | `^11.2.10` | Declarative, handles layout animations (`layout` prop) needed for milestone-list reflows and drag lift effects without manual FLIP math. |
| Icons | Lucide React | `^0.383.0` | Consistent 1.5px-stroke icon set, tree-shakeable, matches the Linear/Notion aesthetic family. |
| Charts | Recharts | `^2.12.7` | Declarative React-native chart composition; used on Dashboard (momentum area chart) and Analytics (bar/line/pie). |
| Rich Text | Tiptap | `^3.27.1` | Headless editor framework for markdown-like rich text in goal notes. |
| Command Palette | cmdk | `^1.1.1` | Fast, accessible, unstyled command menu React primitive. |
| Notifications | Sonner | `^2.0.7` | Opinionated toast component for React. |
| Visual FX | canvas-confetti | `^1.9.4` | Used for visceral rewards upon goal completion. |
| State management | Zustand | `^4.5.2` | Chosen over Context API because the board needs frequent, granular updates (drag position, filters) without re-rendering the whole tree — Zustand's selector-based subscriptions (`useGoalStore(s => s.goals)`) avoid the "everything re-renders" problem Context has without `useMemo` gymnastics everywhere. Chosen over Redux for the much smaller boilerplate at this scale. |
| Styling | Tailwind CSS | `^3.4.3` | Utility-first, design tokens defined once in `tailwind.config.js` (see §6), no separate CSS-in-JS runtime cost. |
| Dates | date-fns | `^3.6.0` | Tree-shakeable, immutable, used for all date formatting/diffing (`formatDueDate`, `dueMeta`). |
| Class merging | clsx | `^2.1.1` | Wrapped as `cn()` in `src/lib/utils.js` for conditional className composition. |
| Testing | Playwright | `^1.61.0` | End-to-end browser testing for critical paths and store persistence. |

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
│                              │ Sidebar + {children}  │           │
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
│                     │  (Persisted via localStorage)│
│                     └─────────────┬─────────────┘
│                                   ▼
│                     ┌─────────────────────────┐
│                     │   mockData.js (seed)      │
│                     │   Loaded on factory reset  │
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

The brief's deliverable was the front-end application; the data layer was deliberately built **behind a clean Zustand interface** (`src/store/useGoalStore.js`) specifically so it can be swapped for real persistence without touching any component. Currently, the Zustand store uses `persist` middleware to save state to `localStorage`, giving the illusion of a full backend. Every component reads/writes through store actions, never through `mockData.js` directly — this is the seam where Phase 2 of the roadmap plugs in.

### 4.4 Phase 1 & 2: Synchronization & Polish
As of Version 1.2.0, the application has successfully transitioned from a "mock UI" to a fully functional client-side app with premium SaaS features:
- **True OLED Dark Mode Engine:** A custom CSS variable engine allows instant, zero-lag switching between Light Mode and OLED Dark Mode without React re-renders.
- **Global Command Palette:** Instantly accessible via `Cmd+K`, allowing rapid navigation and goal searching.
- **Rich Text Editing:** Goal notes utilize a powerful `tiptap` editor for Markdown-like rich text.
- **Visceral Rewards:** Hitting an "Achieved" status triggers an explosive, satisfying confetti burst via `canvas-confetti`.
- **Streaks Engine:** `calculateStreaks` accurately computes `currentStreak` and `longestStreak` from `completedAt` timestamps, updating the Dashboard and Sidebar live.
- **Analytics Charts:** The Weekly Momentum area chart and Monthly Achievements bar chart are wired to your actual activity history.
- **Achievement Badges:** Badges (e.g. "10-Day Streak", "First Goal Achieved") dynamically lock/unlock based on your real calculated metrics.
- **Developer Reset Zone:** A manual factory reset button was added to Settings > Advanced to reset the local storage back to the original `mockData.js` seed.
- **Draggable Milestones:** Added `@dnd-kit/sortable` inside Goal Details, allowing users to rapidly re-order their milestones on the fly.
- **Global Keyboard Shortcuts:** `c` to instantly launch New Goal, and `/` to instantly open the Command Palette.
- **Inline Title Editing:** Goal details H1 tags are transparent inputs, allowing seamless instant renaming without modals.
- **TopBar Popovers:** Interactive `Popover` components integrated into the TopBar for the Notification Bell and Activity Feed, replacing static dummy buttons.
- **Avatar Navigation:** Clicking the user avatar in the `TopBar` navigates directly to `/settings` rather than opening a redundant dropdown, unifying all profile configurations in one interface.
- **Sidebar Search Trigger:** A highly visible "Search... ⌘K" button in the Sidebar ensures the global Command Palette is easily discoverable, utilizing a clean custom DOM event (`open-command-menu`).
- **Fully Interactive Settings:** Previously disabled "Phase 2" toggles across the Notifications and Privacy tabs are now fully functional and completely wired into the Zustand `preferences` local state.
- **Command Palette Power Features:** In addition to search and navigation, the `Cmd+K` palette now contains global power-user toggles for instant theme switching (Dark/Light/System) and rapid goal creation.
- **Interactive Quick-Toggles:** Elements like the `PriorityDot` inside Goal Details are now directly interactive, allowing users to rapidly cycle goal priorities without opening the settings modal.
- **Social "Share" UX:** The Achievements page now features a "Share Profile" action that accurately respects the user's `preferences.privacy.publicProfile` toggle, seamlessly directing users to configure privacy if disabled, or generating a clipboard link if enabled.
- **Automatic Confetti & Feed Tracking:** Changing a goal's status via dropdowns or drag-and-drop perfectly triggers `canvas-confetti` celebrations and automatically registers the action in the persistent Activity Feed.

### 4.4 Phase 1.6 Advanced Trash UX
- **Soft-Delete Architecture:** Deleting a goal from the board no longer permanently erases it. It is moved to a `trash` status, preserving its `originalStatus` for perfect restoration via `useGoalStore`'s `restoreGoal` action.
- **Dedicated Trash Bin Page:** A new `/trash` route allows users to view deleted goals, restore them to their original location, or permanently purge them from local storage via `permanentlyDeleteGoal` and `emptyTrash`.
- **Dynamic Island Drop Zone:** The drag-to-delete drop zone is a beautifully styled, glassmorphic floating pill at the bottom of the screen that dynamically scales, glows, and morphs when a card is dragged over it, providing extremely satisfying tactile feedback.

### 4.5 Critical Architectural Fixes
- **Dnd-Kit & Framer-Motion Collision:** To prevent React's `Maximum update depth exceeded` infinite loop crashes, the `layout` prop must never be applied to a `motion.div` that also receives `@dnd-kit/sortable`'s `setNodeRef`. `dnd-kit` natively handles layout transforms during drag events via CSS `transform`, so `framer-motion`'s synchronous layout projections are redundant and cause resize observer loops.
- **Side-Effect Separation (Confetti):** Visual celebrations like `canvas-confetti` must never be triggered from within global state actions (e.g., `moveGoal` in `useGoalStore`). `dnd-kit` fires state updates aggressively during `onDragOver` to render visual previews. If side effects live in the store, they will fire prematurely during the drag. Instead, side effects are strictly bound to the UI interaction layer (e.g., `onDragEnd` in `GoalsBoard` and `onChange` in `GoalDetails`).

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
    │   │   ├── Popover.jsx      Accessible popover with click-outside and Framer Motion enter/exit
    │   │   ├── Tooltip.jsx      (exports Tooltip, EmptyState)
    │   │   ├── GrowthRing.jsx   ★ The signature visual element — see §6.7
    │   │   ├── CommandMenu.jsx  Global search & actions (Cmd+K)
    │   │   ├── DropdownMenu.jsx Reusable menu primitive
    │   │   └── RichTextEditor.jsx Tiptap-powered rich text input
    │   │
    │   ├── layout/               App chrome
    │   │   ├── Sidebar.jsx       Collapsible dark icon-rail nav
    │   │   ├── TopBar.jsx        Per-page title/subtitle/action header
    │   │   └── AppShell.jsx      Sidebar + useOutlet() + AnimatePresence transition wrapper
    │   │
    │   └── goals/                 Domain components (know about Goal/Milestone shape)
    │       ├── GoalCard.jsx       Draggable card (useSortable)
    │       ├── GoalDragOverlay.jsx  Static visual twin shown in <DragOverlay>
    │       ├── KanbanColumn.jsx     Droppable column (useDroppable + SortableContext)
    │       ├── CommandBar.jsx       Search + sort + filter chips + "New Goal" button
    │       ├── MilestoneRow.jsx     Single milestone checkbox row
    │       ├── NewGoalDialog.jsx    "Create goal" form inside <Dialog>
    │       ├── EditGoalDialog.jsx   Modal to edit goal properties
    │       ├── TrashDropZone.jsx    Animated drop zone for deletion
    │       └── PriorityDot.jsx      (exports PriorityDot, CategoryTag)
    │
    └── pages/                     One file per route, composed from the above
        ├── Dashboard.jsx
        ├── GoalsBoard.jsx: Dnd-Kit context provider and column layout.
        ├── GoalDetails.jsx: The detailed view of a single goal and its milestones.
        ├── Analytics.jsx: Recharts-powered graphs for momentum and category distribution.
        ├── Achievements.jsx: A gamified view of streaks and earned badges.
        ├── Settings.jsx: Interactive preferences panel.
        └── Trash.jsx: The dedicated bin for managing soft-deleted goals.
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
| Page transition | `0.18s` | `easeOut`, fade + 8px y-shift | `AppShell.jsx` — wraps `useOutlet()` in `AnimatePresence mode="wait"` |
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

### Settings UI Patterns
The `/settings` route implements strict modern SaaS design patterns (inspired by Vercel and Linear):
- **Split Layout (`SettingsRow`)**: Forms avoid stacking labels and inputs. Instead, they use a strict side-by-side grid (`sm:flex-row`), locking the label/description to a `240px` width column on the left and the interactive input on the right. 
- **Edit Mode Protection**: Destructive or sensitive forms (like the Profile tab) default to a read-only state. Users must explicitly click an `Edit Profile` button in the Card Header to unlock the inputs. 
- **Footer Persistence**: Forms maintain a `border-t bg-canvas/50` explicit footer at the bottom of the card to house the `Save changes` primary action and success banners, completely separated from the scrollable form body.
- **Global Account Actions**: Destructive/global actions like "Sign Out" are intentionally decoupled from editable form blocks. They reside at the bottom of the left-hand navigation sidebar, ensuring they are universally accessible without cluttering the split-layout form grids.

### Dynamic Custom Categories
To ensure the application maintains perfect visual harmony without introducing arbitrary colors, custom categories created by users bypass manual color-picking.
When a user selects `+ Custom category...` and types a label (e.g. "Fitness"):
1. The string is sanitized into an ID (`fitness`).
2. The ID is run through a deterministic hashing algorithm.
3. The hash inherently binds the category to one of the 4 strict semantic design tokens (`moss`, `ember`, `indigo`, `amber`).
This guarantees that user-generated tags look exactly as professional as the hardcoded defaults, without requiring a complex UI color picker or running the risk of unreadable contrast. Custom categories are persisted in the `useGoalStore` and automatically propagate to board filters and Analytics charts.

### Full CRUD Lifecycle
A core principle of the UX is that any user-created data must be mutable and destructible. 
- **Milestones**: Feature inline editing via hover actions. A `Pencil` icon transforms the row into an `<input>` for seamless typo correction. A `Trash` icon deletes the milestone immediately.
- **Goals**: The `GoalDetails` page features a Settings gear to launch `EditGoalDialog` (allowing core modifications to Title, Date, etc.) and a Trash icon to delete the goal entirely. 
- **Cascading Deletes**: `deleteGoal` in `useGoalStore` automatically loops through and deletes all child milestones to guarantee no memory leaks or orphaned objects.

### Global Toast Notifications & Soft Deletes
All successful user actions (Saving Settings, Creating a Goal) are acknowledged with a subtle toast notification.
**Soft Deletes & Undo**: Destructive actions like deleting a Goal now instantly remove the item from the UI while simultaneously firing a Toast notification containing an **Undo** action. Clicking Undo perfectly restores the entire goal, its milestones, and its exact index/column placement on the Kanban board. 

### Quick Board Actions
Goals can be deleted entirely from the Kanban board without navigating into the details page. Hovering over a GoalCard exposes a quick `Trash` action for power users.

### Premium Empty States
To avoid displaying "broken" or empty UI elements (like NaN% charts or blank lists), GoalFlow implements robust graphic zero-states on the `Dashboard`, `Analytics`, and `Achievements` pages when the underlying `useGoalStore` has zero data.

### Global Command Palette
To support power users, GoalFlow implements a global Command Palette (`CommandMenu.jsx` powered by `cmdk`).
- Triggered instantly from anywhere via `Cmd+K` or `Ctrl+K`.
- Features rapid navigation across core pages (Dashboard, Board, Analytics, Settings).
- Permits instant launching of the New Goal Modal.
- Dynamically indexes all active goals, allowing users to type a goal's name to immediately navigate to its details page.

### Visceral Rewards (Confetti)
To drive engagement and user delight, achieving a goal physically celebrates the user. 
- When a goal is moved to the "Achieved" status (either via drag-and-drop or status dropdowns), `canvas-confetti` fires a realistic confetti burst.
- This is deeply integrated into `useGoalStore` and automatically respects the user's `preferences.notifications.celebrations` setting.

### Rich Text Goal Notes
Goal details include a Notion-style Rich Text Editor powered by `tiptap` and `@tailwindcss/typography`.
- Replaces standard `<textarea>` for much higher fidelity context tracking.
- Supports bold, italic, bullet lists, ordered lists, and blockquotes.
- Saves raw HTML directly into the Zustand store for immediate rendering.

### Mobile Responsive Drawer
On screens smaller than `lg` (1024px), the left Sidebar seamlessly transforms from a static column into a slide-over mobile drawer.
- A Hamburger menu dynamically appears in the `TopBar`.
- Tapping it toggles a global `mobileSidebarOpen` state in `useGoalStore`.
- The Sidebar slides in from the left over a dark blurred backdrop, and automatically dismisses itself when a navigation link is clicked.

---

## 8. Routing & Error Handling Architecture

### The `ErrorBoundary` Pattern
Because the application relies heavily on dynamic `localStorage` persistence, it is susceptible to "data drift" (where the user's saved data structure doesn't perfectly match a newly deployed version of the app). 
To prevent "White Screens of Death", `App.jsx` wraps the entire routing layer in a strict `react-error-boundary`. If any component throws an uncaught error, the Error Boundary catches it and renders a safe, isolated fallback UI displaying the error message and stack trace.

### Routing Stability (Removed Page Transitions)
Initially, GoalFlow utilized Framer Motion's `<AnimatePresence mode="wait">` to orchestrate fade/slide transitions between pages. However, React Router v6 context updates immediately upon navigation, which caused exiting components to occasionally "freeze" or render blank screens during rapid user navigation.
To guarantee flawless performance and interaction speed, complex route transition animations were removed. Routes now instantly swap standard DOM subtrees:
```jsx
function AnimatedRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/board" element={<GoalsBoard />} />
      {/* ... */}
    </Routes>
  )
}
```
Micro-animations (staggered lists, card hovers, command palette scaling) were retained to provide the premium feel without comprising core navigation stability.

---

## 18. Testing Strategy (Recommended)

With the introduction of Playwright (`^1.61.0`), GoalFlow now supports end-to-end browser testing. Test files (e.g. `test-browser.js`, `test-store2.js`) simulate user flows and verify store persistence, ensuring the robustness of critical paths like goal creation, drag-and-drop interactions, and the accurate calculation of metrics.

---

## 19. Roadmap — Next Development Phases

### Phase 2: Cloud Sync & Backend
1. **Database Swapping:** Replace Zustand's `localStorage` persist middleware with real API calls (e.g., Supabase, PostgreSQL).
2. **Authentication:** Add login/signup flows and associate `userId` with all goals and milestones.
3. **Wire Notifications Engine:** Connect the functional local settings toggles for "Deadline reminders" and "Weekly digests" to a real backend CRON/Email service.

## 20. Coding Conventions
- **No Prop Drilling:** State is managed globally via `useGoalStore` and accessed locally via selector hooks.
- **Semantic Tailwind Only:** Avoid using hex codes directly in components. Map abstract tokens (`bg-surface`, `text-ink-900`) via `globals.css` and use those.
- **Pure Functions for Business Logic:** All calculations (progress, streaks, charts) live in `src/lib/calculations.js` and are highly unit-testable.

## 21. Glossary
- **Goal:** The macro objective (e.g., "Run a Marathon"). Contains multiple milestones.
- **Milestone:** The micro, actionable steps that make up a goal. Progress is strictly derived from the percentage of completed milestones.
- **Growth Ring:** The concentric SVG circular progress indicator used throughout the application.

## 22. Appendix: Full File Index
Refer to Section 5 for the comprehensive project structure map.
