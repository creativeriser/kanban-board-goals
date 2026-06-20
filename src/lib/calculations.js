import { differenceInCalendarDays, format } from 'date-fns'

export function goalProgress(goal, milestonesById) {
  if (!goal.milestoneIds.length) return 0
  const done = goal.milestoneIds.filter((id) => milestonesById[id]?.done).length
  return Math.round((done / goal.milestoneIds.length) * 100)
}

export function milestoneCounts(goal, milestonesById) {
  const done = goal.milestoneIds.filter((id) => milestonesById[id]?.done).length
  return { done, total: goal.milestoneIds.length }
}

export function formatDueDate(isoDate) {
  return format(new Date(isoDate), 'MMM d')
}

export function dueMeta(isoDate) {
  const date = new Date(isoDate)
  const days = differenceInCalendarDays(date, new Date())
  if (days < 0) return { label: `${Math.abs(days)}d overdue`, tone: 'overdue' }
  if (days === 0) return { label: 'Due today', tone: 'soon' }
  if (days <= 7) return { label: `Due in ${days}d`, tone: 'soon' }
  return { label: format(date, 'MMM d'), tone: 'normal' }
}

export function isUpcoming(isoDate, withinDays = 14) {
  const days = differenceInCalendarDays(new Date(isoDate), new Date())
  return days >= 0 && days <= withinDays
}

const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 }
export function sortGoalIds(ids, goalsById, sortBy) {
  const arr = [...ids]
  if (sortBy === 'priority') {
    arr.sort((a, b) => PRIORITY_WEIGHT[goalsById[b].priority] - PRIORITY_WEIGHT[goalsById[a].priority])
  } else if (sortBy === 'dueDate') {
    arr.sort((a, b) => new Date(goalsById[a].dueDate) - new Date(goalsById[b].dueDate))
  } else if (sortBy === 'alphabetical') {
    arr.sort((a, b) => goalsById[a].title.localeCompare(goalsById[b].title))
  }
  return arr
}

export function categoryDistribution(goalsById) {
  const counts = {}
  Object.values(goalsById).forEach((g) => {
    counts[g.category] = (counts[g.category] || 0) + 1
  })
  return counts
}

export function completionRateByMonth(goalsById, milestonesById) {
  // simple deterministic mock-friendly aggregate used by Analytics charts
  const rates = Object.values(goalsById).map((g) => goalProgress(g, milestonesById))
  const avg = rates.length ? Math.round(rates.reduce((a, b) => a + b, 0) / rates.length) : 0
  return avg
}
