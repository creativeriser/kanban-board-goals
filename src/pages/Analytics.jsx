import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts'
import { TrendingUp, Target, Flame, Award, LineChart as LineChartIcon } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { useGoalStore } from '../store/useGoalStore'
import { goalProgress, calculateStreaks, calculateWeeklyMomentum, calculateMonthlyAchievements } from '../lib/calculations'

const CATEGORY_HEX = {
  career: '#4C5FD5',
  health: '#1B6F5C',
  finance: '#E8A23D',
  learning: '#FF6B4A',
  relationships: '#2E8A6C',
  creative: '#7C8AE8',
}

const TONE_HEX = {
  moss: '#2E8A6C',
  ember: '#FF6B4A',
  indigo: '#4C5FD5',
  amber: '#E8A23D',
}

export default function Analytics() {
  const goals = useGoalStore((s) => s.goals)
  const milestonesById = useGoalStore((s) => s.milestones)
  const categories = useGoalStore((s) => s.categories)
  const goalList = Object.values(goals)
  
  const { currentStreak, longestStreak } = useMemo(() => calculateStreaks(milestonesById), [milestonesById])
  const weeklyMomentum = useMemo(() => calculateWeeklyMomentum(milestonesById), [milestonesById])
  const monthlyAchievements = useMemo(() => calculateMonthlyAchievements(goals, milestonesById), [goals, milestonesById])

  const completionByCategory = useMemo(() => {
    const byCategory = {}
    goalList.forEach((g) => {
      byCategory[g.category] = byCategory[g.category] || { total: 0, sum: 0 }
      byCategory[g.category].total += 1
      byCategory[g.category].sum += goalProgress(g, milestonesById)
    })
    return categories.map((c) => ({
      category: c.label,
      rate: byCategory[c.id] ? Math.round(byCategory[c.id].sum / byCategory[c.id].total) : 0,
      color: CATEGORY_HEX[c.id] || TONE_HEX[c.color] || '#9498A3',
    }))
  }, [goalList, milestonesById, categories])

  const categoryDistribution = useMemo(() => {
    const counts = {}
    goalList.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1
    })
    return categories.filter((c) => counts[c.id]).map((c) => ({
      name: c.label,
      value: counts[c.id],
      color: CATEGORY_HEX[c.id] || TONE_HEX[c.color] || '#9498A3',
    }))
  }, [goalList, categories])

  const achievedCount = goalList.filter((g) => g.status === 'achieved').length
  const avgProgress = Math.round(goalList.reduce((sum, g) => sum + goalProgress(g, milestonesById), 0) / goalList.length)

  // Simple linear forecast: extrapolate recent weekly momentum forward
  const forecast = useMemo(() => {
    const recent = weeklyMomentum.slice(-4).map((w) => w.completed)
    const avgWeekly = recent.reduce((a, b) => a + b, 0) / recent.length
    return weeklyMomentum.map((w, i) => ({
      week: w.week,
      actual: w.completed,
      trend: Math.round((avgWeekly + (i - weeklyMomentum.length / 2) * 0.15) * 10) / 10,
    }))
  }, [])

  return (
    <div>
      <TopBar title="Analytics" subtitle="Performance insights across every goal you're growing." />

      <div className="px-8 py-6">
        {goalList.length === 0 ? (
          <div className="flex h-[60vh] flex-col items-center justify-center text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-500 dark:bg-brand-500/10">
              <LineChartIcon size={32} />
            </div>
            <h2 className="mb-2 font-display text-xl font-semibold text-ink-900">No data to analyze yet</h2>
            <p className="max-w-sm text-sm text-ink-600">
              Analytics requires active goals. Start creating goals and completing milestones to unlock powerful performance insights here.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <KpiCard icon={Target} label="Avg. completion" value={`${avgProgress}%`} accent="moss" />
              <KpiCard icon={Award} label="Goals achieved" value={achievedCount} accent="indigo" />
              <KpiCard icon={Flame} label="Current streak" value={`${currentStreak}d`} accent="ember" />
              <KpiCard icon={TrendingUp} label="Longest streak" value={`${longestStreak}d`} accent="amber" />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
              <ChartCard title="Goal Completion Rate" subtitle="Average progress by category" delay={0}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={completionByCategory} margin={{ left: -16 }}>
                    <CartesianGrid vertical={false} stroke="#E6E8EC" />
                    <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#565B66' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9498A3' }} axisLine={false} tickLine={false} unit="%" />
                    <RTooltip contentStyle={{ fontSize: 12, borderRadius: 8, backgroundColor: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))', color: 'rgb(var(--color-ink-900))' }} />
                    <Bar dataKey="rate" radius={[6, 6, 0, 0]} maxBarSize={42}>
                      {completionByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Productivity Trend" subtitle="Milestones completed vs. trend line" delay={0.05}>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={forecast} margin={{ left: -16 }}>
                    <CartesianGrid vertical={false} stroke="#E6E8EC" />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#565B66' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9498A3' }} axisLine={false} tickLine={false} />
                    <RTooltip contentStyle={{ fontSize: 12, borderRadius: 8, backgroundColor: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))', color: 'rgb(var(--color-ink-900))' }} />
                    <Line type="monotone" dataKey="actual" stroke="rgb(var(--color-brand-500))" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="trend" stroke="rgb(var(--color-ink-400))" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Monthly Achievements" subtitle="Goals marked achieved per month" delay={0.1}>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthlyAchievements} margin={{ left: -16 }}>
                    <CartesianGrid vertical={false} stroke="#E6E8EC" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#565B66' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#9498A3' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <RTooltip contentStyle={{ fontSize: 12, borderRadius: 8, backgroundColor: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))', color: 'rgb(var(--color-ink-900))' }} />
                    <Bar dataKey="achieved" fill="rgb(var(--color-moss-500))" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Category Distribution" subtitle="Where your goals are concentrated" delay={0.15}>
                <div className="flex items-center gap-6">
                  <ResponsiveContainer width="55%" height={220}>
                    <PieChart>
                      <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                        {categoryDistribution.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <RTooltip contentStyle={{ fontSize: 12, borderRadius: 8, backgroundColor: 'rgb(var(--color-surface))', borderColor: 'rgb(var(--color-border))', color: 'rgb(var(--color-ink-900))' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-1 flex-col gap-2">
                    {categoryDistribution.map((c) => (
                      <div key={c.name} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-ink-700">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                          {c.name}
                        </span>
                        <span className="font-mono text-ink-600">{c.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ChartCard>
            </div>

            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-5">
              <Card className="p-6">
                <p className="mb-1 font-display text-base font-semibold text-ink-900">Performance Insights</p>
                <ul className="mt-3 flex flex-col gap-2 text-sm text-ink-600">
                  <li>• {completionByCategory.length > 0 ? `${completionByCategory.sort((a,b)=>b.rate-a.rate)[0]?.category} is your strongest category.` : 'Start adding goals to see insights.'}</li>
                  <li>• {weeklyMomentum[7]?.completed > weeklyMomentum[6]?.completed ? 'Your weekly momentum is trending upward — milestone completions are up.' : 'Weekly momentum is steady or dipping. Try to complete a small milestone today.'}</li>
                  <li>• {currentStreak > 3 ? `You are on a ${currentStreak}-day streak! Keep up the incredible consistency.` : 'Consistency builds momentum. Try to build a 3-day streak this week.'}</li>
                </ul>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, accent }) {
  const tones = {
    moss: 'bg-moss-100 text-moss-700',
    indigo: 'bg-indigo-100 text-indigo-600',
    ember: 'bg-ember-100 text-ember-600',
    amber: 'bg-amber-100 text-amber-600',
  }
  return (
    <Card className="p-5">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-full ${tones[accent]}`}>
        <Icon size={16} />
      </div>
      <p className="font-mono text-2xl font-semibold text-ink-900">{value}</p>
      <p className="mt-0.5 text-xs text-ink-600">{label}</p>
    </Card>
  )
}

function ChartCard({ title, subtitle, children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay }}>
      <Card className="p-6">
        <p className="font-display text-base font-semibold text-ink-900">{title}</p>
        <p className="mb-3 text-xs text-ink-600">{subtitle}</p>
        {children}
      </Card>
    </motion.div>
  )
}
