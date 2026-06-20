import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils'

export const Input = forwardRef(function Input({ className, label, id, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-ink-600">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'h-10 rounded border border-border bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400',
          'transition-colors focus:border-moss-500 focus:outline-none',
          className
        )}
        {...props}
      />
    </div>
  )
})

export const Textarea = forwardRef(function Textarea({ className, label, id, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-ink-600">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={cn(
          'rounded border border-border bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400',
          'transition-colors focus:border-moss-500 focus:outline-none resize-none',
          className
        )}
        {...props}
      />
    </div>
  )
})

export const Select = forwardRef(function Select({ className, label, id, children, ...props }, ref) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-[13px] font-medium text-ink-600">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={id}
          className={cn(
            'h-10 w-full appearance-none rounded border border-border bg-white px-3 pr-9 text-sm text-ink-900',
            'transition-colors focus:border-moss-500 focus:outline-none',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
      </div>
    </div>
  )
})
