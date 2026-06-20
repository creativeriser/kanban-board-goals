import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { TopBar } from '../components/layout/TopBar'
import { KanbanColumn } from '../components/goals/KanbanColumn'
import { CommandBar } from '../components/goals/CommandBar'
import { GoalDragOverlay } from '../components/goals/GoalDragOverlay'
import { NewGoalDialog } from '../components/goals/NewGoalDialog'
import { useGoalStore } from '../store/useGoalStore'
import { STATUSES } from '../lib/mockData'
import { goalProgress, sortGoalIds } from '../lib/calculations'

export default function GoalsBoard() {
  const goals = useGoalStore((s) => s.goals)
  const milestonesById = useGoalStore((s) => s.milestones)
  const order = useGoalStore((s) => s.order)
  const ui = useGoalStore((s) => s.ui)
  const moveGoal = useGoalStore((s) => s.moveGoal)
  const reorderWithinColumn = useGoalStore((s) => s.reorderWithinColumn)

  const [activeId, setActiveId] = useState(null)
  const [newGoalOpen, setNewGoalOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // small distance threshold so a plain click (no movement) still
      // navigates to Goal Details instead of being swallowed by drag
      activationConstraint: { distance: 8 },
    })
  )

  // Apply search + filters + sort to each column's id list
  const visibleOrder = useMemo(() => {
    const result = {}
    for (const status of Object.keys(order)) {
      let ids = order[status].filter((id) => {
        const g = goals[id]
        if (!g) return false
        if (ui.search && !g.title.toLowerCase().includes(ui.search.toLowerCase())) return false
        if (ui.priorityFilter && g.priority !== ui.priorityFilter) return false
        if (ui.categoryFilter && g.category !== ui.categoryFilter) return false
        return true
      })
      ids = sortGoalIds(ids, goals, ui.sortBy)
      result[status] = ids
    }
    return result
  }, [order, goals, ui])

  function handleDragStart(event) {
    setActiveId(event.active.id)
  }

  function handleDragOver(event) {
    const { active, over } = event
    if (!over) return
    const activeStatus = goals[active.id]?.status
    const overData = over.data.current

    // dragging over a column directly (empty space) or another card
    const overStatus = overData?.type === 'column' ? overData.status : goals[over.id]?.status

    if (overStatus && overStatus !== activeStatus) {
      moveGoal(active.id, overStatus)
    }
  }

  function handleDragEnd(event) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const status = goals[active.id]?.status
    if (!status) return
    const ids = order[status]
    const oldIndex = ids.indexOf(active.id)
    const overData = over.data.current
    const newIndex = overData?.type === 'column' ? ids.length - 1 : ids.indexOf(over.id)

    if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
      reorderWithinColumn(status, oldIndex, newIndex)
    }
  }

  const activeGoal = activeId ? goals[activeId] : null

  return (
    <div>
      <TopBar title="Goals Board" subtitle="Drag goals across stages as they mature." />

      <div className="px-8 py-6">
        <CommandBar onNewGoal={() => setNewGoalOpen(true)} />

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="mt-6 flex gap-5 overflow-x-auto pb-6 scrollbar-thin">
            {STATUSES.map((s) => {
              const ids = visibleOrder[s.id] || []
              const avg = ids.length
                ? Math.round(ids.reduce((sum, id) => sum + goalProgress(goals[id], milestonesById), 0) / ids.length)
                : 0
              return <KanbanColumn key={s.id} status={s.id} label={s.label} goalIds={ids} avgProgress={avg} />
            })}
          </div>

          <DragOverlay>
            {activeGoal ? <GoalDragOverlay goal={activeGoal} milestonesById={milestonesById} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <NewGoalDialog open={newGoalOpen} onClose={() => setNewGoalOpen(false)} />
    </div>
  )
}
