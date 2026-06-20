import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const VARIANTS = {
  primary: 'bg-ink-900 text-white hover:bg-ink-700 shadow-xs',
  brand: 'bg-moss-600 text-white hover:bg-moss-700 shadow-xs',
  secondary: 'bg-white text-ink-900 border border-border hover:bg-canvas shadow-xs',
  ghost: 'bg-transparent text-ink-600 hover:bg-ink-900/5 hover:text-ink-900',
  danger: 'bg-white text-ember-600 border border-ember-100 hover:bg-ember-100',
}

const SIZES = {
  sm: 'h-8 px-3 text-[13px] gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-[15px] gap-2',
  icon: 'h-9 w-9 justify-center',
}

export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', className, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center rounded font-medium transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
})
