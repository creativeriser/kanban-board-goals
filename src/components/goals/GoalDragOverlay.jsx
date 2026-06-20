import { CalendarDays, ListChecks } from 'lucide-react'
import { GrowthRing } from '../ui/GrowthRing'
import { PriorityDot, CategoryTag } from './PriorityDot'
import { goalProgress, milestoneCounts, dueMeta } from '../../lib/calculations'
import { cn } from '../../lib/utils'

const RING_TONE = { high: 'ember', medium: 'amber', low: 'moss' }

// Static visual twin of GoalCard, rendered inside <DragOverlay> for a smooth,
// list-independent drag preview (rotated slightly + elevated shadow).
export function GoalDragOverlay({ goal, milestonesById }) {
  if (!goal) return null
  const progress = goalProgress(goal, milestonesById)
  const { done, total } = milestoneCounts(goal, milestonesById)
  const due = dueMeta(goal.dueDate)
  const tone = RING_TONE[goal.priority]

  return (
    <div
      className="w-[296px] cursor-grabbing rounded-lg border border-ink-200 bg-surface p-4 shadow-floating"
      style={{ transform: 'rotate(2deg) scale(1.03)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <PriorityDot priority={goal.priority} />
            <CategoryTag category={goal.category} />
          </div>
          <h3 className="truncate font-display text-[15px] font-semibold leading-snug text-ink-900">{goal.title}</h3>
        </div>
        <GrowthRing progress={progress} size={40} strokeWidth={4} tone={tone} labelClassName="text-[9px]" />
      </div>
      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-600">{goal.description}</p>
      <div className="mt-3.5 flex items-center justify-between border-t border-border pt-3 text-[12px] text-ink-600">
        <span className="inline-flex items-center gap-1.5">
          <ListChecks size={13} />
          {done}/{total} milestones
        </span>
        <span className={cn('inline-flex items-center gap-1 font-medium', due.tone === 'overdue' && 'text-ember-600')}>
          <CalendarDays size={13} />
          {due.label}
        </span>
      </div>
    </div>
  )
}
