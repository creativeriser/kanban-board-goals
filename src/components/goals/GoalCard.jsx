import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'
import { CalendarDays, ListChecks } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { GrowthRing } from '../ui/GrowthRing'
import { PriorityDot, CategoryTag } from './PriorityDot'
import { useGoalStore } from '../../store/useGoalStore'
import { goalProgress, milestoneCounts, dueMeta } from '../../lib/calculations'
import { cn } from '../../lib/utils'

const RING_TONE = { high: 'ember', medium: 'amber', low: 'moss' }

export function GoalCard({ goalId, dragHandleOnly = false }) {
  const navigate = useNavigate()
  const goal = useGoalStore((s) => s.goals[goalId])
  const milestonesById = useGoalStore((s) => s.milestones)
  const density = useGoalStore((s) => s.preferences?.appearance?.density || 'comfortable')

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: goalId,
    data: { type: 'goal', status: goal?.status },
  })

  if (!goal) return null

  const progress = goalProgress(goal, milestonesById)
  const { done, total } = milestoneCounts(goal, milestonesById)
  const due = dueMeta(goal.dueDate)
  const tone = RING_TONE[goal.priority]

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(dragHandleOnly ? {} : { ...attributes, ...listeners })}
      className={isDragging ? 'z-50' : ''}
    >
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: isDragging ? 0.4 : 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.18 }}
        onClick={() => navigate(`/goals/${goal.id}`)}
        className={cn(
          'group cursor-grab select-none rounded-lg border border-border bg-surface shadow-card active:cursor-grabbing',
          'hover:border-ink-200 hover:shadow-raised transition-all duration-200',
          isDragging && 'ring-2 ring-moss-500/40',
          density === 'compact' ? 'p-3' : 'p-4'
        )}
      >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <PriorityDot priority={goal.priority} />
            <CategoryTag category={goal.category} />
          </div>
          <h3 className={cn(
            "truncate font-display font-semibold leading-snug text-ink-900",
            density === 'compact' ? 'text-[14px]' : 'text-[15px]'
          )}>
            {goal.title}
          </h3>
        </div>
        <GrowthRing progress={progress} size={density === 'compact' ? 36 : 40} strokeWidth={4} tone={tone} labelClassName="text-[9px]" />
      </div>

      {density !== 'compact' && (
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-ink-600">{goal.description}</p>
      )}

      <div className={cn(
        "flex items-center justify-between border-t border-border text-[12px] text-ink-600",
        density === 'compact' ? 'mt-2.5 pt-2.5' : 'mt-3.5 pt-3'
      )}>
        <span className="inline-flex items-center gap-1.5">
          <ListChecks size={13} />
          {done}/{total} milestones
        </span>
        <span
          className={cn(
            'inline-flex items-center gap-1 font-medium',
            due.tone === 'overdue' && 'text-ember-600',
            due.tone === 'soon' && 'text-amber-600',
            due.tone === 'normal' && 'text-ink-600'
          )}
        >
          <CalendarDays size={13} />
          {due.label}
        </span>
      </div>
    </motion.div>
    </div>
  )
}
