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
import { TrendingUp, Target, Flame, Award } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { useGoalStore } from '../store/useGoalStore'
import { goalProgress } from '../lib/calculations'
import { weeklyMomentum, monthlyAchievements, CATEGORIES, currentStreak, longestStreak } from '../lib/mockData'

const CATEGORY_HEX = {
  career: '#4C5FD5',
  health: '#1B6F5C',
  finance: '#E8A23D',
  learning: '#FF6B4A',
  relationships: '#2E8A6C',
  creative: '#7C8AE8',
}

export default function Analytics() {
  const goals = useGoalStore((s) => s.goals)
  const milestonesById = useGoalStore((s) => s.milestones)
  const goalList = Object.values(goals)

  const completionByCategory = useMemo(() => {
    const byCategory = {}
    goalList.forEach((g) => {
      byCategory[g.category] = byCategory[g.category] || { total: 0, sum: 0 }
      byCategory[g.category].total += 1
      byCategory[g.category].sum += goalProgress(g, milestonesById)
    })
    return CATEGORIES.map((c) => ({
      category: c.label,
      rate: byCategory[c.category] ? Math.round(byCategory[c.category].sum / byCategory[c.category].total) : 0,
    }))
  }, [goalList, milestonesById])

  const categoryDistribution = useMemo(() => {
    const counts = {}
    goalList.forEach((g) => {
      counts[g.category] = (counts[g.category] || 0) + 1
    })
    return CATEGORIES.filter((c) => counts[c.id]).map((c) => ({
      name: c.label,
      value: counts[c.id],
      color: CATEGORY_HEX[c.id],
    }))
  }, [goalList])

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
                <RTooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E6E8EC' }} />
                <Bar dataKey="rate" fill="#1B6F5C" radius={[6, 6, 0, 0]} maxBarSize={42} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Productivity Trend" subtitle="Milestones completed vs. trend line" delay={0.05}>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={forecast} margin={{ left: -16 }}>
                <CartesianGrid vertical={false} stroke="#E6E8EC" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#565B66' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9498A3' }} axisLine={false} tickLine={false} />
                <RTooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E6E8EC' }} />
                <Line type="monotone" dataKey="actual" stroke="#4C5FD5" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="trend" stroke="#9498A3" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Monthly Achievements" subtitle="Goals marked achieved per month" delay={0.1}>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyAchievements} margin={{ left: -16 }}>
                <CartesianGrid vertical={false} stroke="#E6E8EC" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#565B66' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9498A3' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <RTooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E6E8EC' }} />
                <Bar dataKey="achieved" fill="#FF6B4A" radius={[6, 6, 0, 0]} maxBarSize={32} />
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
                  <RTooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E6E8EC' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-1 flex-col gap-2">
                {categoryDistribution.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-[12.5px]">
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
            <p className="mb-1 font-display text-[15px] font-semibold text-ink-900">Performance Insights</p>
            <ul className="mt-3 flex flex-col gap-2 text-[13px] text-ink-600">
              <li>• Health and Career categories show the strongest average completion this quarter.</li>
              <li>• Your weekly momentum is trending upward — milestone completions are up over the trend line.</li>
              <li>• At the current pace, your 3 remaining high-priority goals are forecast to reach 80%+ within 6 weeks.</li>
            </ul>
          </Card>
        </motion.div>
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
      <p className="mt-0.5 text-[12px] text-ink-600">{label}</p>
    </Card>
  )
}

function ChartCard({ title, subtitle, children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay }}>
      <Card className="p-6">
        <p className="font-display text-[15px] font-semibold text-ink-900">{title}</p>
        <p className="mb-3 text-[12px] text-ink-600">{subtitle}</p>
        {children}
      </Card>
    </motion.div>
  )
}
