import { create } from 'zustand'
import {
  goals as seedGoals,
  milestones as seedMilestones,
  initialGoalOrder,
  activityFeed,
  CATEGORIES,
  STATUSES,
} from '../lib/mockData'
import { uid } from '../lib/utils'

export const useGoalStore = create((set, get) => ({
  goals: seedGoals,
  milestones: seedMilestones,
  order: initialGoalOrder, // { [status]: [goalId, ...] }
  activity: activityFeed,

  user: {
    name: 'Jordan Avery',
    email: 'jordan@example.com',
    timezone: 'pst',
  },

  ui: {
    search: '',
    priorityFilter: null, // 'high' | 'medium' | 'low' | null
    categoryFilter: null, // category id | null
    sortBy: 'priority', // 'priority' | 'dueDate' | 'alphabetical'
  },

  setSearch: (search) => set((s) => ({ ui: { ...s.ui, search } })),
  setPriorityFilter: (priorityFilter) =>
    set((s) => ({ ui: { ...s.ui, priorityFilter: s.ui.priorityFilter === priorityFilter ? null : priorityFilter } })),
  setCategoryFilter: (categoryFilter) =>
    set((s) => ({ ui: { ...s.ui, categoryFilter: s.ui.categoryFilter === categoryFilter ? null : categoryFilter } })),
  setSortBy: (sortBy) => set((s) => ({ ui: { ...s.ui, sortBy } })),
  clearFilters: () => set((s) => ({ ui: { ...s.ui, search: '', priorityFilter: null, categoryFilter: null } })),

  // Move a goal to a new status/column, optionally at a specific index
  moveGoal: (goalId, toStatus, toIndex = null) =>
    set((s) => {
      const fromStatus = s.goals[goalId].status
      const order = { ...s.order }
      order[fromStatus] = order[fromStatus].filter((id) => id !== goalId)
      const targetList = [...(order[toStatus] || [])]
      if (toIndex === null || toIndex >= targetList.length) {
        targetList.push(goalId)
      } else {
        targetList.splice(toIndex, 0, goalId)
      }
      order[toStatus] = targetList

      return {
        order,
        goals: {
          ...s.goals,
          [goalId]: { ...s.goals[goalId], status: toStatus },
        },
      }
    }),

  // Reorder within the same column (drag preview)
  reorderWithinColumn: (status, fromIndex, toIndex) =>
    set((s) => {
      const list = [...s.order[status]]
      const [moved] = list.splice(fromIndex, 1)
      list.splice(toIndex, 0, moved)
      return { order: { ...s.order, [status]: list } }
    }),

  toggleMilestone: (milestoneId) =>
    set((s) => {
      const m = s.milestones[milestoneId]
      const nowDone = !m.done
      return {
        milestones: {
          ...s.milestones,
          [milestoneId]: {
            ...m,
            done: nowDone,
            completedAt: nowDone ? new Date().toISOString() : null,
          },
        },
      }
    }),

  addMilestone: (goalId, title) =>
    set((s) => {
      const id = uid('m')
      return {
        milestones: { ...s.milestones, [id]: { id, goalId, title, done: false, completedAt: null } },
        goals: {
          ...s.goals,
          [goalId]: { ...s.goals[goalId], milestoneIds: [...s.goals[goalId].milestoneIds, id] },
        },
      }
    }),

  updateGoal: (goalId, patch) =>
    set((s) => ({ goals: { ...s.goals, [goalId]: { ...s.goals[goalId], ...patch } } })),

  updateGoalNotes: (goalId, notes) =>
    set((s) => ({ goals: { ...s.goals, [goalId]: { ...s.goals[goalId], notes } } })),

  updateUser: (patch) =>
    set((s) => ({ user: { ...s.user, ...patch } })),

  addGoal: ({ title, description, category, priority, dueDate }) =>
    set((s) => {
      const id = uid('g')
      const goal = {
        id,
        title,
        description,
        status: 'planning',
        priority,
        category,
        dueDate,
        createdAt: new Date().toISOString(),
        milestoneIds: [],
        notes: '',
      }
      return {
        goals: { ...s.goals, [id]: goal },
        order: { ...s.order, planning: [...(s.order.planning || []), id] },
      }
    }),
}))

export { CATEGORIES, STATUSES }
