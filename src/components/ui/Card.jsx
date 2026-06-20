import { cn } from '../../lib/utils'

export function Card({ className, children, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={cn('rounded-lg border border-border bg-surface shadow-card', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
