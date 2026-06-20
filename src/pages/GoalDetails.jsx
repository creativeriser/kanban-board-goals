import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, CalendarDays, ListChecks, Pencil, Clock3, Activity } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { GrowthRing } from '../components/ui/GrowthRing'
import { PriorityDot, CategoryTag } from '../components/goals/PriorityDot'
import { MilestoneRow } from '../components/goals/MilestoneRow'
import { useGoalStore, STATUSES } from '../store/useGoalStore'
import { goalProgress, milestoneCounts, formatDueDate } from '../lib/calculations'
import { format } from 'date-fns'
import { cn } from '../lib/utils'

const RING_TONE = { high: 'ember', medium: 'amber', low: 'moss' }

export default function GoalDetails() {
  const { goalId } = useParams()
  const navigate = useNavigate()
  const goal = useGoalStore((s) => s.goals[goalId])
  const milestonesById = useGoalStore((s) => s.milestones)
  const toggleMilestone = useGoalStore((s) => s.toggleMilestone)
  const addMilestone = useGoalStore((s) => s.addMilestone)
  const updateGoalNotes = useGoalStore((s) => s.updateGoalNotes)
  const updateGoal = useGoalStore((s) => s.updateGoal)
  const activity = useGoalStore((s) => s.activity.filter((a) => a.goalId === goalId))

  const [draftMilestone, setDraftMilestone] = useState('')
  const [notesDraft, setNotesDraft] = useState(goal?.notes ?? '')

  if (!goal) {
    return (
      <div className="px-8 py-10">
        <p className="text-sm text-ink-600">Goal not found.</p>
        <Link to="/board" className="mt-2 inline-block text-sm font-medium text-moss-600">
          Back to board
        </Link>
      </div>
    )
  }

  const progress = goalProgress(goal, milestonesById)
  const { done, total } = milestoneCounts(goal, milestonesById)
  const tone = RING_TONE[goal.priority]
  const milestoneList = goal.milestoneIds.map((id) => milestonesById[id])
  const completedMilestones = milestoneList.filter((m) => m.done).sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))

  function handleAddMilestone(e) {
    e.preventDefault()
    if (!draftMilestone.trim()) return
    addMilestone(goal.id, draftMilestone.trim())
    setDraftMilestone('')
  }

  return (
    <div className="px-8 py-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-600 transition-colors hover:text-ink-900"
      >
        <ArrowLeft size={15} /> Back
      </button>

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <PriorityDot priority={goal.priority} showLabel />
                <CategoryTag category={goal.category} />
                <select
                  value={goal.status}
                  onChange={(e) => updateGoal(goal.id, { status: e.target.value })}
                  className="ml-1 rounded-full border border-border bg-white px-2.5 py-0.5 text-[11px] font-medium text-ink-700 focus:border-moss-500 focus:outline-none"
                >
                  {STATUSES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <h1 className="font-display text-[28px] font-semibold leading-tight text-ink-900">{goal.title}</h1>
              <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-600">{goal.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-5 text-[13px] text-ink-600">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={14} /> Due {formatDueDate(goal.dueDate)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ListChecks size={14} /> {done}/{total} milestones
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 size={14} /> Created {format(new Date(goal.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <GrowthRing
                progress={progress}
                milestoneCount={total}
                doneCount={done}
                size={104}
                strokeWidth={7}
                tone={tone}
                labelClassName="text-base"
              />
              <span className="text-[11px] font-medium text-ink-400">Growth ring</span>
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        {/* Milestones */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}>
          <Card className="p-6">
            <p className="mb-4 font-display text-[16px] font-semibold text-ink-900">Milestones</p>
            <div className="flex flex-col gap-2.5">
              {milestoneList.map((m) => (
                <MilestoneRow key={m.id} milestone={m} onToggle={toggleMilestone} />
              ))}
              {milestoneList.length === 0 && (
                <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-[13px] text-ink-400">
                  No milestones yet — break this goal down into steps.
                </p>
              )}
            </div>
            <form onSubmit={handleAddMilestone} className="mt-4 flex gap-2">
              <Input
                value={draftMilestone}
                onChange={(e) => setDraftMilestone(e.target.value)}
                placeholder="Add a milestone..."
                className="flex-1"
              />
              <Button type="submit" variant="secondary">
                <Plus size={15} /> Add
              </Button>
            </form>
          </Card>

          {/* Progress timeline */}
          <Card className="mt-5 p-6">
            <p className="mb-4 font-display text-[16px] font-semibold text-ink-900">Progress Timeline</p>
            {completedMilestones.length === 0 ? (
              <p className="text-[13px] text-ink-400">Completed milestones will appear here as a timeline.</p>
            ) : (
              <ol className="relative ml-1.5 flex flex-col gap-5 border-l-2 border-moss-100 pl-5">
                {completedMilestones.map((m) => (
                  <li key={m.id} className="relative">
                    <span className="absolute -left-[26px] top-0.5 h-3 w-3 rounded-full border-2 border-moss-600 bg-white" />
                    <p className="text-[13px] font-medium text-ink-900">{m.title}</p>
                    <p className="font-mono text-[11px] text-ink-400">{format(new Date(m.completedAt), 'MMM d, yyyy')}</p>
                  </li>
                ))}
              </ol>
            )}
          </Card>
        </motion.div>

        {/* Sidebar: notes + stats */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col gap-5"
        >
          <Card className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <Pencil size={14} className="text-ink-400" />
              <p className="font-display text-[15px] font-semibold text-ink-900">Notes</p>
            </div>
            <textarea
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              onBlur={() => updateGoalNotes(goal.id, notesDraft)}
              placeholder="Jot down context, blockers, or reminders..."
              rows={6}
              className="w-full resize-none rounded border border-border bg-white px-3 py-2 text-[13px] text-ink-900 placeholder:text-ink-400 focus:border-moss-500 focus:outline-none"
            />
          </Card>

          <Card className="p-6">
            <p className="mb-3 font-display text-[15px] font-semibold text-ink-900">Statistics</p>
            <div className="flex flex-col gap-3 text-[13px]">
              <Row label="Completion" value={`${progress}%`} />
              <Row label="Milestones done" value={`${done} / ${total}`} />
              <Row label="Status" value={STATUSES.find((s) => s.id === goal.status)?.label} />
              <Row label="Priority" value={<PriorityDot priority={goal.priority} showLabel />} />
              <Row label="Category" value={<CategoryTag category={goal.category} />} />
            </div>
          </Card>

          <Card className="p-6">
            <div className="mb-3 flex items-center gap-2">
              <Activity size={14} className="text-ink-400" />
              <p className="font-display text-[15px] font-semibold text-ink-900">Activity Feed</p>
            </div>
            {activity.length === 0 ? (
              <p className="text-[13px] text-ink-400">No activity recorded yet for this goal.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {activity.map((a) => (
                  <div key={a.id} className="flex gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-moss-500" />
                    <div>
                      <p className="text-[12.5px] leading-snug text-ink-700">{a.text}</p>
                      <p className="font-mono text-[11px] text-ink-400">{format(new Date(a.time), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-2.5 last:border-0 last:pb-0">
      <span className="text-ink-600">{label}</span>
      <span className={cn('font-medium text-ink-900')}>{value}</span>
    </div>
  )
}
