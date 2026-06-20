// Realistic seed data so every page feels alive on first load.

const today = new Date()
const d = (offsetDays) => {
  const dt = new Date(today)
  dt.setDate(dt.getDate() + offsetDays)
  return dt.toISOString()
}

export const CATEGORIES = [
  { id: 'career', label: 'Career', color: 'indigo' },
  { id: 'health', label: 'Health', color: 'moss' },
  { id: 'finance', label: 'Finance', color: 'amber' },
  { id: 'learning', label: 'Learning', color: 'ember' },
  { id: 'relationships', label: 'Relationships', color: 'moss' },
  { id: 'creative', label: 'Creative', color: 'indigo' },
]

export const STATUSES = [
  { id: 'planning', label: 'Planning' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'achieved', label: 'Achieved' },
]

export const PRIORITIES = ['high', 'medium', 'low']

let goalSeq = 1
let milestoneSeq = 1
const nextGoalId = () => `g${goalSeq++}`
const nextMilestoneId = () => `m${milestoneSeq++}`

function makeGoal({ title, description, status, priority, category, dueOffset, milestones }) {
  const goalId = nextGoalId()
  const milestoneIds = milestones.map((ms) => {
    const id = nextMilestoneId()
    return {
      id,
      goalId,
      title: ms.title,
      done: ms.done,
      completedAt: ms.done ? d(ms.completedOffset ?? -3) : null,
    }
  })
  return {
    id: goalId,
    title,
    description,
    status,
    priority,
    category,
    dueDate: d(dueOffset),
    createdAt: d(dueOffset - 60),
    milestoneIds: milestoneIds.map((m) => m.id),
    _milestones: milestoneIds, // flattened below
    notes: '',
  }
}

const rawGoals = [
  makeGoal({
    title: 'Run a sub-4-hour marathon',
    description:
      'Build endurance through a structured 16-week plan, peak mileage by week 12, and taper into race day with confidence.',
    status: 'in_progress',
    priority: 'high',
    category: 'health',
    dueOffset: 42,
    milestones: [
      { title: 'Complete base-building phase (8 weeks)', done: true, completedOffset: -20 },
      { title: 'Hit 18-mile long run', done: true, completedOffset: -6 },
      { title: 'Run a tune-up half marathon under 1:50', done: false },
      { title: 'Taper week — reduce volume 40%', done: false },
      { title: 'Race day', done: false },
    ],
  }),
  makeGoal({
    title: 'Ship GoalFlow v2.0',
    description: 'Redesign the kanban core, add analytics, and launch to the first 500 waitlist users.',
    status: 'in_progress',
    priority: 'high',
    category: 'career',
    dueOffset: 18,
    milestones: [
      { title: 'Finalize design system', done: true, completedOffset: -14 },
      { title: 'Build kanban board with drag & drop', done: true, completedOffset: -5 },
      { title: 'Ship analytics dashboard', done: false },
      { title: 'Closed beta with 50 users', done: false },
    ],
  }),
  makeGoal({
    title: 'Build a 6-month emergency fund',
    description: 'Automate transfers into a high-yield savings account until reaching 6 months of expenses.',
    status: 'in_progress',
    priority: 'medium',
    category: 'finance',
    dueOffset: 95,
    milestones: [
      { title: 'Reach 1 month of expenses saved', done: true, completedOffset: -40 },
      { title: 'Reach 3 months of expenses saved', done: true, completedOffset: -8 },
      { title: 'Reach 6 months of expenses saved', done: false },
    ],
  }),
  makeGoal({
    title: 'Learn conversational Japanese',
    description: 'Reach JLPT N4 level — daily Anki reviews, weekly tutor sessions, and immersion through podcasts.',
    status: 'planning',
    priority: 'medium',
    category: 'learning',
    dueOffset: 180,
    milestones: [
      { title: 'Finish hiragana & katakana', done: false },
      { title: 'Complete Genki I textbook', done: false },
      { title: 'Hold a 5-minute unscripted conversation', done: false },
    ],
  }),
  makeGoal({
    title: 'Write a short story collection',
    description: 'Draft 8 short stories exploring memory and place; submit to two literary magazines.',
    status: 'planning',
    priority: 'low',
    category: 'creative',
    dueOffset: 150,
    milestones: [
      { title: 'Outline all 8 stories', done: false },
      { title: 'Draft first 4 stories', done: false },
      { title: 'Submit to first magazine', done: false },
    ],
  }),
  makeGoal({
    title: 'Host monthly dinner with old friends',
    description: 'Rebuild a consistent social rhythm — one dinner a month, rotating hosts, no cancellations.',
    status: 'review',
    priority: 'low',
    category: 'relationships',
    dueOffset: 10,
    milestones: [
      { title: 'January dinner hosted', done: true, completedOffset: -50 },
      { title: 'February dinner hosted', done: true, completedOffset: -20 },
      { title: 'March dinner — confirm guest list', done: true, completedOffset: -2 },
    ],
  }),
  makeGoal({
    title: 'Negotiate a senior promotion',
    description: 'Document quarterly impact, gather peer feedback, and present the case in the Q3 review cycle.',
    status: 'review',
    priority: 'high',
    category: 'career',
    dueOffset: 5,
    milestones: [
      { title: 'Compile impact doc', done: true, completedOffset: -15 },
      { title: 'Collect 4 peer reviews', done: true, completedOffset: -4 },
      { title: 'Present case to manager', done: true, completedOffset: -1 },
    ],
  }),
  makeGoal({
    title: 'Read 24 books this year',
    description: 'Two books a month across fiction and nonfiction, tracked in a simple reading log.',
    status: 'achieved',
    priority: 'medium',
    category: 'learning',
    dueOffset: -2,
    milestones: [
      { title: 'Finish Q1 — 6 books', done: true, completedOffset: -90 },
      { title: 'Finish Q2 — 12 books', done: true, completedOffset: -60 },
      { title: 'Finish Q3 — 18 books', done: true, completedOffset: -30 },
      { title: 'Finish Q4 — 24 books', done: true, completedOffset: -2 },
    ],
  }),
  makeGoal({
    title: 'Redesign personal portfolio site',
    description: 'New case studies, faster load times, and a custom illustration style.',
    status: 'achieved',
    priority: 'medium',
    category: 'creative',
    dueOffset: -20,
    milestones: [
      { title: 'Content audit & copy pass', done: true, completedOffset: -55 },
      { title: 'Design 3 case study layouts', done: true, completedOffset: -35 },
      { title: 'Launch on custom domain', done: true, completedOffset: -20 },
    ],
  }),
  makeGoal({
    title: 'Pay off remaining student loan',
    description: 'Aggressive payoff plan — extra $400/month toward principal until balance hits zero.',
    status: 'achieved',
    priority: 'high',
    category: 'finance',
    dueOffset: -45,
    milestones: [
      { title: 'Balance under $5,000', done: true, completedOffset: -120 },
      { title: 'Balance under $1,000', done: true, completedOffset: -70 },
      { title: 'Final payment made', done: true, completedOffset: -45 },
    ],
  }),
]

export const goals = {}
export const milestones = {}

rawGoals.forEach((g) => {
  const { _milestones, ...goal } = g
  goals[goal.id] = goal
  _milestones.forEach((m) => {
    milestones[m.id] = m
  })
})

export const initialGoalOrder = Object.values(goals).reduce((acc, g) => {
  acc[g.status] = acc[g.status] || []
  acc[g.status].push(g.id)
  return acc
}, {})

// Activity feed — recent events across goals, newest first
export const activityFeed = [
  { id: 'a1', goalId: 'g7', type: 'milestone', text: 'Presented promotion case to manager', time: d(-1) },
  { id: 'a2', goalId: 'g1', type: 'milestone', text: 'Hit 18-mile long run', time: d(-6) },
  { id: 'a3', goalId: 'g2', type: 'milestone', text: 'Built kanban board with drag & drop', time: d(-5) },
  { id: 'a4', goalId: 'g3', type: 'milestone', text: 'Reached 3 months of expenses saved', time: d(-8) },
  { id: 'a5', goalId: 'g6', type: 'status', text: 'Moved "Host monthly dinner" to Review', time: d(-2) },
  { id: 'a6', goalId: 'g9', type: 'achieved', text: 'Achieved "Redesign personal portfolio site"', time: d(-20) },
  { id: 'a7', goalId: 'g10', type: 'achieved', text: 'Achieved "Pay off remaining student loan"', time: d(-45) },
]

// Weekly momentum — milestones completed per week, last 8 weeks
export const weeklyMomentum = [
  { week: 'W1', completed: 2 },
  { week: 'W2', completed: 3 },
  { week: 'W3', completed: 1 },
  { week: 'W4', completed: 4 },
  { week: 'W5', completed: 3 },
  { week: 'W6', completed: 5 },
  { week: 'W7', completed: 2 },
  { week: 'W8', completed: 4 },
]

// Monthly achievements over the last 6 months
export const monthlyAchievements = [
  { month: 'Jan', achieved: 1 },
  { month: 'Feb', achieved: 0 },
  { month: 'Mar', achieved: 2 },
  { month: 'Apr', achieved: 1 },
  { month: 'May', achieved: 3 },
  { month: 'Jun', achieved: 2 },
]

export const currentStreak = 12
export const longestStreak = 27
