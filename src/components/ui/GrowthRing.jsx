import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const TONES = {
  moss: { track: '#E3F0EC', fill: '#1B6F5C' },
  ember: { track: '#FFE7E0', fill: '#FF6B4A' },
  indigo: { track: '#E8EAFB', fill: '#4C5FD5' },
  amber: { track: '#FBEDD7', fill: '#E8A23D' },
  ink: { track: '#E6E8EC', fill: '#14161A' },
}

/**
 * GrowthRing — the product's signature visual motif.
 * Renders progress as a single ring, or (when milestoneCount is passed)
 * as concentric tree-ring style arcs, one per milestone, filling outward.
 */
export function GrowthRing({
  progress = 0,
  size = 56,
  strokeWidth = 5,
  tone = 'moss',
  milestoneCount,
  doneCount,
  showLabel = true,
  className,
  labelClassName,
}) {
  const colors = TONES[tone] || TONES.moss
  const center = size / 2

  // Concentric mode: one ring per milestone (max 5 rings shown for clarity)
  if (milestoneCount && milestoneCount > 1) {
    const ringCount = Math.min(milestoneCount, 5)
    const gap = strokeWidth + 2
    return (
      <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          {Array.from({ length: ringCount }).map((_, i) => {
            const r = center - strokeWidth / 2 - i * gap
            if (r <= 4) return null
            const circumference = 2 * Math.PI * r
            const filled = i < doneCount
            return (
              <g key={i}>
                <circle cx={center} cy={center} r={r} fill="none" stroke={colors.track} strokeWidth={strokeWidth} />
                {filled && (
                  <motion.circle
                    cx={center}
                    cy={center}
                    r={r}
                    fill="none"
                    stroke={colors.fill}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                  />
                )}
              </g>
            )
          })}
        </svg>
        {showLabel && (
          <span className={cn('absolute font-mono font-medium text-ink-900', labelClassName)} style={{ fontSize: size * 0.22 }}>
            {progress}%
          </span>
        )}
      </div>
    )
  }

  // Single ring mode
  const r = center - strokeWidth / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference - (progress / 100) * circumference

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={center} cy={center} r={r} fill="none" stroke={colors.track} strokeWidth={strokeWidth} />
        <motion.circle
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke={colors.fill}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      {showLabel && (
        <span className={cn('absolute font-mono font-medium text-ink-900', labelClassName)} style={{ fontSize: size * 0.24 }}>
          {progress}%
        </span>
      )}
    </div>
  )
}
