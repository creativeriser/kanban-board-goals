import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  goals as seedGoals,
  milestones as seedMilestones,
  initialGoalOrder,
  activityFeed,
  CATEGORIES,
  STATUSES,
} from '../lib/mockData'
import { uid, triggerConfetti } from '../lib/utils'

export const useGoalStore = create(
  persist(
    (set, get) => ({
      goals: seedGoals,
      milestones: seedMilestones,
      order: initialGoalOrder, // { [status]: [goalId, ...] }
      activity: activityFeed,

  addActivity: (text, type = 'status', goalId = null) =>
    set((s) => ({
      activity: [
        { id: uid('a'), goalId, text, type, time: new Date().toISOString() },
        ...s.activity,
      ].slice(0, 20),
    })),

  user: {
    name: 'Jordan Avery',
    email: 'jordan@example.com',
    timezone: 'pst',
  },

  preferences: {
    notifications: {
      deadline: true,
      weekly: true,
      streak: true,
      celebrations: true,
    },
    appearance: {
      theme: 'light',
      accent: '#1B6F5C',
      density: 'comfortable',
    },
    privacy: {
      publicProfile: false,
      shareAnalytics: false,
    }
  },

  ui: {
    search: '',
    priorityFilter: null, // 'high' | 'medium' | 'low' | null
    categoryFilter: null, // category id | null
    sortBy: 'priority', // 'priority' | 'dueDate' | 'alphabetical'
    mobileSidebarOpen: false,
    newGoalModalOpen: false,
    sidebarWidth: 220, // Compact, perfectly aligned default width
  },

  setSearch: (search) => set((s) => ({ ui: { ...s.ui, search } })),
  setPriorityFilter: (priorityFilter) =>
    set((s) => ({ ui: { ...s.ui, priorityFilter: s.ui.priorityFilter === priorityFilter ? null : priorityFilter } })),
  setCategoryFilter: (categoryFilter) =>
    set((s) => ({ ui: { ...s.ui, categoryFilter: s.ui.categoryFilter === categoryFilter ? null : categoryFilter } })),
  setSortBy: (sortBy) => set((s) => ({ ui: { ...s.ui, sortBy } })),
  setMobileSidebarOpen: (open) => set((s) => ({ ui: { ...s.ui, mobileSidebarOpen: open } })),
  setNewGoalModalOpen: (open) => set((s) => ({ ui: { ...s.ui, newGoalModalOpen: open } })),
  setSidebarWidth: (width) => set((s) => ({ ui: { ...s.ui, sidebarWidth: width } })),
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
      const updates = {
        milestones: {
          ...s.milestones,
          [milestoneId]: {
            ...m,
            done: nowDone,
            completedAt: nowDone ? new Date().toISOString() : null,
          },
        },
      }

      if (nowDone) {
        updates.activity = [
          {
            id: uid('a'),
            goalId: m.goalId,
            text: `Completed milestone: "${m.title}"`,
            type: 'achieved',
            time: new Date().toISOString()
          },
          ...s.activity
        ].slice(0, 20)
      }

      return updates
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

  updateMilestone: (milestoneId, title) =>
    set((s) => ({
      milestones: {
        ...s.milestones,
        [milestoneId]: { ...s.milestones[milestoneId], title },
      },
    })),

  reorderMilestones: (goalId, oldIndex, newIndex) =>
    set((s) => {
      const goal = s.goals[goalId]
      if (!goal) return s
      const list = [...goal.milestoneIds]
      const [moved] = list.splice(oldIndex, 1)
      list.splice(newIndex, 0, moved)
      return {
        goals: {
          ...s.goals,
          [goalId]: { ...goal, milestoneIds: list },
        },
      }
    }),

  deleteMilestone: (goalId, milestoneId) =>
    set((s) => {
      const newMilestones = { ...s.milestones }
      delete newMilestones[milestoneId]
      return {
        milestones: newMilestones,
        goals: {
          ...s.goals,
          [goalId]: {
            ...s.goals[goalId],
            milestoneIds: s.goals[goalId].milestoneIds.filter((id) => id !== milestoneId),
          },
        },
      }
    }),

  deleteGoal: (goalId) =>
    set((s) => {
      const goal = s.goals[goalId]
      if (!goal) return s

      // Remove from current column
      const newOrder = { ...s.order }
      newOrder[goal.status] = (s.order[goal.status] || []).filter((id) => id !== goalId)
      
      // Move to trash
      newOrder.trash = [goalId, ...(newOrder.trash || [])]

      const newActivity = {
        id: uid('a'),
        goalId: goalId,
        text: `Moved goal to trash: "${goal.title}"`,
        type: 'amber',
        time: new Date().toISOString()
      }

      return { 
        goals: {
          ...s.goals,
          [goalId]: { ...goal, status: 'trash', originalStatus: goal.status }
        },
        order: newOrder,
        activity: [newActivity, ...s.activity].slice(0, 20)
      }
    }),

  restoreGoal: (goalId) =>
    set((s) => {
      const goal = s.goals[goalId]
      if (!goal || goal.status !== 'trash') return s

      const restoreStatus = goal.originalStatus || 'planning'

      const newOrder = { ...s.order }
      newOrder.trash = (s.order.trash || []).filter((id) => id !== goalId)
      newOrder[restoreStatus] = [goalId, ...(newOrder[restoreStatus] || [])]

      const newActivity = {
        id: uid('a'),
        goalId: goalId,
        text: `Restored goal: "${goal.title}"`,
        type: 'status',
        time: new Date().toISOString()
      }

      return {
        goals: {
          ...s.goals,
          [goalId]: { ...goal, status: restoreStatus }
        },
        order: newOrder,
        activity: [newActivity, ...s.activity].slice(0, 20)
      }
    }),

  permanentlyDeleteGoal: (goalId) =>
    set((s) => {
      const goal = s.goals[goalId]
      if (!goal) return s

      // Clean up orphaned milestones
      const newMilestones = { ...s.milestones }
      goal.milestoneIds.forEach((id) => delete newMilestones[id])

      // Remove from goals
      const newGoals = { ...s.goals }
      delete newGoals[goalId]

      // Remove from order tracking
      const newOrder = {
        ...s.order,
        [goal.status]: (s.order[goal.status] || []).filter((id) => id !== goalId),
      }

      return { 
        goals: newGoals, 
        milestones: newMilestones, 
        order: newOrder
      }
    }),

  emptyTrash: () =>
    set((s) => {
      const trashIds = s.order.trash || []
      const newGoals = { ...s.goals }
      const newMilestones = { ...s.milestones }
      
      trashIds.forEach(goalId => {
         const goal = newGoals[goalId]
         if (goal) {
            goal.milestoneIds.forEach((id) => delete newMilestones[id])
            delete newGoals[goalId]
         }
      })

      return {
         goals: newGoals,
         milestones: newMilestones,
         order: { ...s.order, trash: [] }
      }
    }),

  restoreGoalSnapshot: (snapshot) =>
    set((s) => {
      const { goal, milestones, status, index } = snapshot
      const newGoals = { ...s.goals, [goal.id]: goal }
      const newMilestones = { ...s.milestones, ...milestones }
      
      const newOrder = { ...s.order }
      const targetList = [...(newOrder[status] || [])]
      targetList.splice(index >= 0 ? index : targetList.length, 0, goal.id)
      newOrder[status] = targetList

      const newActivity = {
        id: uid('a'),
        goalId: goal.id,
        text: `Restored goal: "${goal.title}"`,
        type: 'status',
        time: new Date().toISOString()
      }

      return {
        goals: newGoals,
        milestones: newMilestones,
        order: newOrder,
        activity: [newActivity, ...s.activity].slice(0, 20)
      }
    }),

  updateGoal: (goalId, patch) =>
    set((s) => ({ goals: { ...s.goals, [goalId]: { ...s.goals[goalId], ...patch } } })),

  updateGoalNotes: (goalId, notes) =>
    set((s) => ({ goals: { ...s.goals, [goalId]: { ...s.goals[goalId], notes } } })),

  updateUser: (patch) =>
    set((s) => ({ user: { ...s.user, ...patch } })),

  updatePreferences: (category, patch) =>
    set((s) => ({
      preferences: {
        ...(s.preferences || {}),
        [category]: { ...((s.preferences || {})[category] || {}), ...patch },
      },
    })),

  categories: CATEGORIES,

  addCategory: (label) => {
    const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    if (!id) return null
    const s = get()
    if (s.categories.find((c) => c.id === id)) return id
    
    // Deterministic hash to assign a theme color automatically
    const TONES = ['moss', 'ember', 'indigo', 'amber']
    let hash = 0
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash)
    }
    const color = TONES[Math.abs(hash) % TONES.length]
    
    set({ categories: [...s.categories, { id, label, color }] })
    return id
  },

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
      const newActivity = {
        id: uid('a'),
        goalId: id,
        text: `Created new goal: "${title}"`,
        type: 'status',
        time: new Date().toISOString()
      }

      return {
        goals: { ...s.goals, [id]: goal },
        order: { ...s.order, planning: [...(s.order.planning || []), id] },
        activity: [newActivity, ...s.activity].slice(0, 20)
      }
    }),
    
  resetData: () => {
    set({
      goals: seedGoals,
      milestones: seedMilestones,
      order: initialGoalOrder,
      activity: activityFeed,
    })
  }
  }),
  {
    name: 'goalflow-storage',
  }
))

export { STATUSES }
