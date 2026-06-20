import { Search, SlidersHorizontal, Plus, X } from 'lucide-react'
import { useGoalStore, CATEGORIES } from '../../store/useGoalStore'
import { Button } from '../ui/Button'
import { Select } from '../ui/Input'
import { cn } from '../../lib/utils'

const PRIORITIES = [
  { id: 'high', label: 'High', dot: 'bg-ember-500' },
  { id: 'medium', label: 'Medium', dot: 'bg-amber-500' },
  { id: 'low', label: 'Low', dot: 'bg-moss-500' },
]

export function CommandBar({ onNewGoal }) {
  const { search, priorityFilter, categoryFilter, sortBy } = useGoalStore((s) => s.ui)
  const setSearch = useGoalStore((s) => s.setSearch)
  const setPriorityFilter = useGoalStore((s) => s.setPriorityFilter)
  const setCategoryFilter = useGoalStore((s) => s.setCategoryFilter)
  const setSortBy = useGoalStore((s) => s.setSortBy)
  const clearFilters = useGoalStore((s) => s.clearFilters)

  const hasActiveFilters = search || priorityFilter || categoryFilter

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search goals..."
            className="h-9 w-full rounded border border-border bg-white pl-9 pr-3 text-sm placeholder:text-ink-400 focus:border-moss-500 focus:outline-none"
          />
        </div>

        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-9 w-auto min-w-[150px]" aria-label="Sort goals">
          <option value="priority">Sort: Priority</option>
          <option value="dueDate">Sort: Due date</option>
          <option value="alphabetical">Sort: A–Z</option>
        </Select>

        <Button variant="brand" size="sm" onClick={onNewGoal}>
          <Plus size={15} /> New Goal
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="mr-1 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-ink-400">
          <SlidersHorizontal size={12} /> Filter
        </span>
        {PRIORITIES.map((p) => (
          <button
            key={p.id}
            onClick={() => setPriorityFilter(p.id)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors',
              priorityFilter === p.id
                ? 'border-ink-900 bg-ink-900 text-white'
                : 'border-border bg-white text-ink-600 hover:border-ink-200'
            )}
          >
            <span className={cn('h-1.5 w-1.5 rounded-full', priorityFilter === p.id ? 'bg-white' : p.dot)} />
            {p.label}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-border" />
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCategoryFilter(c.id)}
            className={cn(
              'rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors',
              categoryFilter === c.id
                ? 'border-ink-900 bg-ink-900 text-white'
                : 'border-border bg-white text-ink-600 hover:border-ink-200'
            )}
          >
            {c.label}
          </button>
        ))}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-1 inline-flex items-center gap-1 text-[12px] font-medium text-ink-400 hover:text-ink-900"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>
    </div>
  )
}
