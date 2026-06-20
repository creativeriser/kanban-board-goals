import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Trophy, Flame, Star, Target, Crown, Sparkles } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { CategoryTag } from '../components/goals/PriorityDot'
import { useGoalStore } from '../store/useGoalStore'
import { currentStreak, longestStreak } from '../lib/mockData'
import { cn } from '../lib/utils'

const BADGES = [
  { id: 'b1', icon: Flame, label: '10-Day Streak', tone: 'ember', earned: true },
  { id: 'b2', icon: Star, label: 'First Goal Achieved', tone: 'amber', earned: true },
  { id: 'b3', icon: Target, label: '5 Goals Active', tone: 'indigo', earned: true },
  { id: 'b4', icon: Crown, label: '3 Goals Achieved', tone: 'moss', earned: true },
  { id: 'b5', icon: Sparkles, label: '25 Milestones Hit', tone: 'indigo', earned: true },
  { id: 'b6', icon: Trophy, label: '30-Day Streak', tone: 'ember', earned: false },
]

export default function Achievements() {
  const goals = useGoalStore((s) => s.goals)
  const achieved = Object.values(goals)
    .filter((g) => g.status === 'achieved')
    .sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))

  return (
    <div>
      <TopBar title="Achievements" subtitle="Every goal you've carried across the finish line." />

      <div className="px-8 py-6">
        {/* Streak hero */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card className="overflow-hidden bg-ink-950 p-7">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wide text-moss-300">Growth streak</p>
                <p className="mt-1.5 font-display text-[34px] font-semibold leading-none text-white">{currentStreak} days</p>
                <p className="mt-2 text-[13px] text-ink-400">Longest streak: {longestStreak} days. Keep showing up daily.</p>
              </div>
              <div className="flex gap-1.5">
                {Array.from({ length: 14 }).map((_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scaleY: 0.3, opacity: 0 }}
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{ delay: i * 0.025 }}
                    className={cn('h-8 w-2.5 rounded-full', i < currentStreak % 14 || i < 14 ? 'bg-moss-500' : 'bg-white/10')}
                  />
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Badges */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="mt-5">
          <p className="mb-3 font-display text-[16px] font-semibold text-ink-900">Badges</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {BADGES.map((b, i) => (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.04 }}
              >
                <Card className={cn('flex flex-col items-center gap-2 p-4 text-center', !b.earned && 'opacity-40')}>
                  <div className={cn('flex h-11 w-11 items-center justify-center rounded-full', TONE_BG[b.tone])}>
                    <b.icon size={20} className={TONE_TEXT[b.tone]} />
                  </div>
                  <p className="text-[12px] font-medium leading-tight text-ink-900">{b.label}</p>
                  {!b.earned && <p className="text-[10px] text-ink-400">Locked</p>}
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trophy case */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="mt-7">
          <p className="mb-3 font-display text-[16px] font-semibold text-ink-900">Completed Goals</p>
          {achieved.length === 0 ? (
            <Card className="p-10 text-center text-[13px] text-ink-400">No goals achieved yet — your first trophy is waiting.</Card>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {achieved.map((g, i) => (
                <motion.div key={g.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                  <Card className="p-5">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-moss-100 text-moss-700">
                        <Trophy size={15} />
                      </div>
                      <CategoryTag category={g.category} />
                    </div>
                    <p className="font-display text-[14.5px] font-semibold leading-snug text-ink-900">{g.title}</p>
                    <p className="mt-1 font-mono text-[11px] text-ink-400">Achieved {format(new Date(g.dueDate), 'MMM d, yyyy')}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

const TONE_BG = {
  ember: 'bg-ember-100',
  amber: 'bg-amber-100',
  indigo: 'bg-indigo-100',
  moss: 'bg-moss-100',
}
const TONE_TEXT = {
  ember: 'text-ember-600',
  amber: 'text-amber-600',
  indigo: 'text-indigo-600',
  moss: 'text-moss-700',
}
