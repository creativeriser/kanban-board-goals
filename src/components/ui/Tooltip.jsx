import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export function Tooltip({ label, children, side = 'top' }) {
  const [open, setOpen] = useState(false)
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
  }
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className={cn(
              'pointer-events-none absolute z-50 whitespace-nowrap rounded bg-ink-950 px-2 py-1 text-[11px] font-medium text-white shadow-raised',
              positions[side]
            )}
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-14 text-center">
      {Icon && (
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-900/5 text-ink-400">
          <Icon size={20} />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-ink-900">{title}</p>
        {description && <p className="max-w-xs text-[13px] text-ink-600">{description}</p>}
      </div>
      {action}
    </div>
  )
}
