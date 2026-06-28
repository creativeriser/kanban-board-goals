import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { GoalCard } from './GoalCard'
import { useGoalStore } from '../../store/useGoalStore'
import { cn } from '../../lib/utils'

const STATUS_TONE = {
  planning: 'bg-ink-400',
  in_progress: 'bg-indigo-500',
  review: 'bg-amber-500',
  achieved: 'bg-moss-500',
}

export function KanbanColumn({ status, label, goalIds, avgProgress }) {
  const { setNodeRef, isOver } = useDroppable({ id: status, data: { type: 'column', status } })
  const density = useGoalStore((s) => s.preferences?.appearance?.density || 'comfortable')

  return (
    <div className={cn("flex shrink-0 flex-col transition-all", density === 'compact' ? "w-[280px]" : "w-[320px]")}>
      <div className="mb-3 px-0.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn('h-2 w-2 rounded-full', STATUS_TONE[status])} />
            <h2 className="font-display text-base font-semibold text-ink-900">{label}</h2>
            <span className="rounded-full bg-ink-900/5 px-1.5 py-0.5 font-mono text-[11px] text-ink-600">
              {goalIds.length}
            </span>
          </div>
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink-900/5">
          <div
            className={cn('h-full rounded-full transition-all duration-500', STATUS_TONE[status])}
            style={{ width: `${avgProgress}%` }}
          />
        </div>
      </div>

      <SortableContext items={goalIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={cn(
            'flex min-h-[140px] flex-1 flex-col rounded-lg border border-dashed p-2 transition-colors',
            density === 'compact' ? 'gap-2' : 'gap-3',
            isOver ? 'border-moss-500/50 bg-moss-100/40' : 'border-transparent'
          )}
        >
          {goalIds.map((id) => (
            <GoalCard key={id} goalId={id} />
          ))}
          {goalIds.length === 0 && (
            <div className="flex flex-1 items-center justify-center rounded border border-dashed border-border py-10 text-center text-[12px] text-ink-400">
              Drop a goal here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}
