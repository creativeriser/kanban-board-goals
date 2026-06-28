import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import confetti from 'canvas-confetti'

export function cn(...args) {
  return twMerge(clsx(...args))
}

export function uid(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

export function triggerConfetti(brandColor = '#1B6F5C') {
  const duration = 3500
  const end = Date.now() + duration
  const colors = [brandColor, '#FFFFFF', brandColor, '#E8A23D']

  ;(function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: colors
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: colors
    })

    if (Date.now() < end) {
      requestAnimationFrame(frame)
    }
  }())
}
