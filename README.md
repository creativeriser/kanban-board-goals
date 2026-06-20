# GoalFlow — Personal Goal Management Kanban Platform

A premium, opinionated goal-tracking SaaS — Dashboard, drag-and-drop Goals Board, Goal Details, Analytics, Achievements, and Settings — built with React, Vite, Tailwind, DnD Kit, Framer Motion, Recharts, and Zustand.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`).

```bash
npm run build      # production build to dist/
npm run preview    # preview the production build
```

> This project was hand-written (not built/tested in a live dev server), since it was generated in a sandboxed environment without package-registry access. On first `npm install`, double check versions resolve cleanly — pinned ranges are in `package.json`. If you hit a peer-dependency hiccup, `npm install --legacy-peer-deps` is a safe fallback.

## Design system

All tokens live in `tailwind.config.js` (colors, radii, shadows) and `src/styles/globals.css` (base styles, focus rings, reduced-motion support). Three type roles: **Fraunces** (display/headlines), **Inter** (UI/body), **JetBrains Mono** (stats & data), loaded via Google Fonts in `index.html`.

The signature visual motif is the **Growth Ring** (`src/components/ui/GrowthRing.jsx`) — a tree-ring–style concentric progress indicator used across the Dashboard hero, goal cards, and Goal Details.

## Architecture

- `src/store/useGoalStore.js` — single Zustand store: normalized `goals`/`milestones`, per-column `order`, and `ui` (search/filter/sort) state. All progress/streak numbers are derived, never duplicated.
- `src/lib/mockData.js` — seed data (10 goals across all 4 stages, realistic milestones, activity feed).
- `src/lib/calculations.js` — progress %, due-date formatting, sorting, distribution helpers.
- `src/components/ui/` — design-system primitives (Button, Badge, Card, Input/Select/Textarea, Dialog, Tooltip, EmptyState, GrowthRing).
- `src/components/goals/` — board-specific pieces (GoalCard, KanbanColumn, CommandBar, GoalDragOverlay, MilestoneRow, NewGoalDialog, PriorityDot/CategoryTag).
- `src/components/layout/` — Sidebar, TopBar, AppShell (route-transition wrapper).
- `src/pages/` — Dashboard, GoalsBoard, GoalDetails, Analytics, Achievements, Settings.

### DnD Kit

One `DndContext` on the board (`closestCorners` collision). Columns are `useDroppable`; cards are `useSortable`, which gives both in-column reordering and cross-column moves. A `DragOverlay` renders a free-floating card clone for a smooth, list-independent drag. `PointerSensor` uses an 8px activation distance so a plain click still navigates to Goal Details instead of being swallowed by drag.

## What's mocked vs. real

Everything in this build runs entirely client-side against the Zustand store seeded from `mockData.js` — there's no backend. Creating a goal, adding/toggling milestones, dragging cards, editing notes, and the Settings toggles all update real in-memory state and re-render the relevant charts/rings live; refreshing the page resets to the seed data, since nothing persists yet. Wiring up real persistence (e.g. swapping the store's mutators for API calls, or adding `localStorage`) is the natural next step.
