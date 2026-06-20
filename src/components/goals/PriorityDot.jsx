import { cn } from '../../lib/utils'
import { CATEGORIES } from '../../lib/mockData'

const PRIORITY_CONFIG = {
  high: { color: 'bg-ember-500', label: 'High' },
  medium: { color: 'bg-amber-500', label: 'Medium' },
  low: { color: 'bg-moss-500', label: 'Low' },
}

export function PriorityDot({ priority, showLabel = false, className }) {
  const cfg = PRIORITY_CONFIG[priority]
  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className={cn('h-2 w-2 rounded-full', cfg.color)} />
      {showLabel && <span className="text-[12px] font-medium text-ink-600">{cfg.label}</span>}
    </span>
  )
}

const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))

const CAT_TONE = {
  moss: 'bg-moss-100 text-moss-700',
  ember: 'bg-ember-100 text-ember-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  amber: 'bg-amber-100 text-amber-600',
}

export function CategoryTag({ category, className }) {
  const cfg = CATEGORY_BY_ID[category]
  if (!cfg) return null
  return (
    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium', CAT_TONE[cfg.color], className)}>
      {cfg.label}
    </span>
  )
}
