import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '../../lib/utils'

export function MilestoneRow({ milestone, onToggle }) {
  return (
    <motion.div
      layout
      className="group flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-ink-200"
    >
      <button
        onClick={() => onToggle(milestone.id)}
        aria-label={milestone.done ? 'Mark milestone incomplete' : 'Mark milestone complete'}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          milestone.done ? 'border-moss-600 bg-moss-600 text-white' : 'border-ink-200 hover:border-moss-500'
        )}
      >
        {milestone.done && <Check size={12} strokeWidth={3} />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-medium', milestone.done ? 'text-ink-400 line-through' : 'text-ink-900')}>
          {milestone.title}
        </p>
        {milestone.done && milestone.completedAt && (
          <p className="font-mono text-[11px] text-ink-400">Completed {format(new Date(milestone.completedAt), 'MMM d, yyyy')}</p>
        )}
      </div>
    </motion.div>
  )
}
