import { clsx } from 'clsx'

export function cn(...args) {
  return clsx(...args)
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}
