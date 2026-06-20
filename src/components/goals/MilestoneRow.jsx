import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '../../lib/utils'

export function MilestoneRow({ milestone, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(milestone.title)

  function handleSave(e) {
    e.preventDefault()
    if (!draft.trim()) return
    onUpdate(milestone.id, draft.trim())
    setIsEditing(false)
  }

  return (
    <motion.div
      layout
      className="group flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 transition-colors hover:border-ink-200"
    >
      <button
        onClick={() => !isEditing && onToggle(milestone.id)}
        disabled={isEditing}
        aria-label={milestone.done ? 'Mark milestone incomplete' : 'Mark milestone complete'}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50',
          milestone.done ? 'border-moss-600 bg-moss-600 text-white' : 'border-ink-200 hover:border-moss-500'
        )}
      >
        {milestone.done && <Check size={12} strokeWidth={3} />}
      </button>

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <form onSubmit={handleSave} className="flex items-center gap-2">
            <input
              type="text"
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => {
                setDraft(milestone.title)
                setIsEditing(false)
              }}
              className="w-full rounded border border-moss-500 bg-white px-2 py-0.5 text-sm font-medium text-ink-900 outline-none"
            />
          </form>
        ) : (
          <>
            <p className={cn('text-sm font-medium transition-colors', milestone.done ? 'text-ink-400 line-through' : 'text-ink-900')}>
              {milestone.title}
            </p>
            {milestone.done && milestone.completedAt && (
              <p className="font-mono text-[11px] text-ink-400">Completed {format(new Date(milestone.completedAt), 'MMM d, yyyy')}</p>
            )}
          </>
        )}
      </div>

      {!isEditing && (
        <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => setIsEditing(true)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-canvas hover:text-ink-900"
            aria-label="Edit milestone"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(milestone.id)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-ink-400 transition-colors hover:bg-red-50 hover:text-red-600"
            aria-label="Delete milestone"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </motion.div>
  )
}
