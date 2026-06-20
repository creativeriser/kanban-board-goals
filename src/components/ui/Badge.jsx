import { cn } from '../../lib/utils'

const TONES = {
  moss: 'bg-moss-100 text-moss-700',
  ember: 'bg-ember-100 text-ember-600',
  indigo: 'bg-indigo-100 text-indigo-600',
  amber: 'bg-amber-100 text-amber-600',
  ink: 'bg-ink-900/5 text-ink-600',
}

export function Badge({ tone = 'ink', className, children, icon: Icon, dot = false }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        TONES[tone],
        className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', TONES[tone].split(' ')[1].replace('text', 'bg'))} />}
      {Icon && <Icon size={11} strokeWidth={2.5} />}
      {children}
    </span>
  )
}
