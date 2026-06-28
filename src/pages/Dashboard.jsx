import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip as RTooltip } from 'recharts'
import { Flame, Target, CheckCircle2, TrendingUp, ArrowUpRight, ListChecks, CalendarClock, Plus, Rocket } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { GrowthRing } from '../components/ui/GrowthRing'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'

import { PriorityDot, CategoryTag } from '../components/goals/PriorityDot'
import { useGoalStore } from '../store/useGoalStore'
import { goalProgress, dueMeta, isUpcoming, calculateStreaks, calculateWeeklyMomentum, completionRateByMonth } from '../lib/calculations'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '../lib/utils'

export default function Dashboard() {
  const setNewGoalModalOpen = useGoalStore((s) => s.setNewGoalModalOpen)
  const goals = useGoalStore((s) => s.goals)
  const milestonesById = useGoalStore((s) => s.milestones)
  const activity = useGoalStore((s) => s.activity)
  const user = useGoalStore((s) => s.user)
  const navigate = useNavigate()

  const goalList = Object.values(goals)
  const active = goalList.filter((g) => g.status !== 'achieved')
  const completed = goalList.filter((g) => g.status === 'achieved')
  const overallProgress = useMemo(() => {
    if (!active.length) return 0
    return Math.round(active.reduce((sum, g) => sum + goalProgress(g, milestonesById), 0) / active.length)
  }, [active, milestonesById])

  const { currentStreak } = useMemo(() => calculateStreaks(milestonesById), [milestonesById])
  const weeklyMomentum = useMemo(() => calculateWeeklyMomentum(milestonesById), [milestonesById])

  const upcoming = goalList
    .filter((g) => g.status !== 'achieved' && isUpcoming(g.dueDate, 21))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 4)

  const highPriority = active
    .filter((g) => g.priority === 'high')
    .sort((a, b) => goalProgress(b, milestonesById) - goalProgress(a, milestonesById))

  const monthlyProgress = useMemo(() => completionRateByMonth(goals, milestonesById), [goals, milestonesById])

  const momentumChange = useMemo(() => {
    if (weeklyMomentum.length < 2) return 0
    const current = weeklyMomentum[weeklyMomentum.length - 1].completed
    const prev = weeklyMomentum[weeklyMomentum.length - 2].completed
    if (prev === 0) return current > 0 ? 100 : 0
    return Math.round(((current - prev) / prev) * 100)
  }, [weeklyMomentum])

  if (goalList.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <TopBar
          title="Welcome to GoalFlow"
          subtitle="Let's get started on your journey."
        />
        <div className="flex flex-1 items-center justify-center p-8 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-lg"
          >
            <Card className="flex flex-col items-center p-12 text-center shadow-floating dark:shadow-dark-floating">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                <Rocket size={40} strokeWidth={1.5} />
              </div>
              <h2 className="mb-3 font-display text-3xl font-semibold text-ink-900">Your board is empty</h2>
              <p className="mb-8 max-w-sm text-base leading-relaxed text-ink-600">
                GoalFlow is a space to define your ambitions and break them into actionable milestones. It's time to build momentum.
              </p>
              <Button variant="brand" size="lg" onClick={() => setNewGoalModalOpen(true)}>
                <Plus size={18} />
                Create your first goal
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <TopBar
        title={user?.name ? `Good to see you back, ${user.name.split(' ')[0]}` : "Good to see you back"}
        subtitle="Here's how your goals are growing this week."
        action={
          <button
            onClick={() => navigate('/board')}
            className="inline-flex items-center gap-1.5 rounded bg-ink-900 px-4 py-2 text-sm font-medium text-canvas transition-colors hover:bg-ink-700"
          >
            Go to Board <ArrowUpRight size={15} />
          </button>
        }
      />

      <div className="px-8 py-7">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 gap-4 lg:grid-cols-[1.4fr_1fr]"
        >
          <Card className="relative overflow-hidden p-7">
            <div className="relative z-10 flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">This month</p>
                <h2 className="mt-1.5 font-display text-3xl font-semibold leading-tight text-ink-900">
                  You're {monthlyProgress}% toward your monthly goals
                </h2>
                <p className="mt-2 max-w-md text-sm text-ink-600">
                  {active.length} active goals in motion, {completed.length} achieved all-time. Momentum is building —
                  keep the streak alive.
                </p>
                <div className="mt-5 flex items-center gap-6">
                  <Stat icon={Target} label="Active goals" value={active.length} />
                  <Stat icon={CheckCircle2} label="Completed" value={completed.length} />
                  <Stat icon={Flame} label="Current streak" value={`${currentStreak}d`} accent="ember" />
                </div>
              </div>
              <GrowthRing progress={overallProgress} size={108} strokeWidth={8} tone="moss" labelClassName="text-lg" />
            </div>
          </Card>

          <Card className="flex flex-col p-6">
            <div className="mb-1 flex items-center justify-between">
              <p className="font-display text-base font-semibold text-ink-900">Weekly Momentum</p>
              <span className={cn(
                "inline-flex items-center gap-1 text-xs font-medium",
                momentumChange > 0 ? "text-moss-600 dark:text-moss-500" :
                momentumChange < 0 ? "text-ember-600 dark:text-ember-500" :
                "text-ink-500"
              )}>
                <TrendingUp size={13} className={cn("transition-transform", momentumChange < 0 && "rotate-180")} /> 
                {momentumChange > 0 ? '+' : ''}{momentumChange}%
              </span>
            </div>
            <p className="mb-2 text-xs text-ink-600">Milestones completed, last {weeklyMomentum.length} weeks</p>
            <div className="-ml-2 h-[120px] flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyMomentum} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="momentumFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(var(--color-brand-600))" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="rgb(var(--color-brand-600))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="week" tick={{ fontSize: 10, fill: '#9498A3' }} axisLine={false} tickLine={false} />
                  <RTooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8, backgroundColor: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))', color: 'rgb(var(--color-ink-900))' }}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="completed" stroke="rgb(var(--color-brand-600))" strokeWidth={2} fill="url(#momentumFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        {/* Widget grid */}
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Widget title="Upcoming Deadlines" icon={CalendarClock} delay={0.05}>
            {upcoming.length === 0 && <EmptyRow text="Nothing due in the next 3 weeks." />}
            <div className="flex flex-col gap-1">
              {upcoming.map((g) => {
                const due = dueMeta(g.dueDate)
                return (
                  <Link
                    key={g.id}
                    to={`/goals/${g.id}`}
                    className="flex items-center justify-between gap-3 rounded px-2 py-2 transition-colors hover:bg-ink-900/5 dark:hover:bg-white/5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink-900">{g.title}</p>
                      <CategoryTag category={g.category} className="mt-1" />
                    </div>
                    <span
                      className={cn(
                        'shrink-0 text-xs font-medium',
                        due.tone === 'overdue' && 'text-ember-600',
                        due.tone === 'soon' && 'text-amber-600'
                      )}
                    >
                      {due.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </Widget>

          <Widget title="Priority Overview" icon={Target} delay={0.1}>
            {highPriority.length === 0 && <EmptyRow text="No high priority goals right now." />}
            <div className="flex flex-col gap-3">
              {highPriority.slice(0, 4).map((g) => {
                const progress = goalProgress(g, milestonesById)
                return (
                  <Link key={g.id} to={`/goals/${g.id}`} className="block rounded px-2 py-1.5 transition-colors hover:bg-ink-900/5 dark:hover:bg-white/5">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 truncate text-[13px] font-medium text-ink-900">
                        <PriorityDot priority={g.priority} />
                        {g.title}
                      </span>
                      <span className="font-mono text-[11px] text-ink-600">{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-900/5">
                      <div className="h-full rounded-full bg-ember-500" style={{ width: `${progress}%` }} />
                    </div>
                  </Link>
                )
              })}
            </div>
          </Widget>

          <Widget title="Recent Activity" icon={ListChecks} delay={0.15}>
            <div className="flex flex-col gap-3">
              {activity.slice(0, 5).map((a) => (
                <div key={a.id} className="flex gap-2.5">
                  <span
                    className={cn(
                      'mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full',
                      a.type === 'achieved' ? 'bg-moss-500' : a.type === 'status' ? 'bg-indigo-500' : 'bg-amber-500'
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm leading-snug text-ink-700">{a.text}</p>
                    <p className="font-mono text-[11px] text-ink-400 mt-0.5">{formatDistanceToNow(new Date(a.time), { addSuffix: true })}</p>
                  </div>
                </div>
              ))}
            </div>
          </Widget>
        </div>
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value, accent = 'ink' }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'flex h-8 w-8 items-center justify-center rounded-full',
          accent === 'ember' ? 'bg-ember-100 text-ember-600' : 'bg-ink-900/5 text-ink-700'
        )}
      >
        <Icon size={15} />
      </div>
      <div>
        <p className="font-mono text-base font-semibold leading-none text-ink-900">{value}</p>
        <p className="mt-0.5 text-[11px] text-ink-600">{label}</p>
      </div>
    </div>
  )
}

function Widget({ title, icon: Icon, children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}>
      <Card className="h-full p-5">
        <div className="mb-3 flex items-center gap-2">
          <Icon size={15} className="text-ink-400" />
          <p className="font-display text-sm font-semibold text-ink-900">{title}</p>
        </div>
        {children}
      </Card>
    </motion.div>
  )
}

function EmptyRow({ text }) {
  return <p className="px-2 py-2 text-sm text-ink-400">{text}</p>
}
