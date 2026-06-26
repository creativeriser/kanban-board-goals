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
import { TrashDropZone } from '../components/goals/TrashDropZone'
import { toast } from 'sonner'

import { useGoalStore } from '../store/useGoalStore'
import { STATUSES } from '../lib/mockData'
import { goalProgress, sortGoalIds } from '../lib/calculations'
import { triggerConfetti } from '../lib/utils'

export default function GoalsBoard() {
  const goals = useGoalStore((s) => s.goals)
  const milestonesById = useGoalStore((s) => s.milestones)
  const order = useGoalStore((s) => s.order)
  const ui = useGoalStore((s) => s.ui)
  const moveGoal = useGoalStore((s) => s.moveGoal)
  const reorderWithinColumn = useGoalStore((s) => s.reorderWithinColumn)
  const deleteGoal = useGoalStore((s) => s.deleteGoal)
  const restoreGoal = useGoalStore((s) => s.restoreGoal)

  const setNewGoalModalOpen = useGoalStore((s) => s.setNewGoalModalOpen)
  const preferences = useGoalStore((s) => s.preferences)

  const [activeId, setActiveId] = useState(null)
  const [originalStatus, setOriginalStatus] = useState(null)

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
    setOriginalStatus(goals[event.active.id]?.status)
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
    
    const finalStatus = goals[active.id]?.status
    if (finalStatus && finalStatus !== originalStatus) {
      if (finalStatus === 'achieved' && preferences?.notifications?.celebrations) {
        triggerConfetti()
      }
      
      const statusLabel = STATUSES.find(st => st.id === finalStatus)?.label || finalStatus
      useGoalStore.getState().addActivity(
        `Moved "${goals[active.id]?.title}" to ${statusLabel}`,
        finalStatus === 'achieved' ? 'achieved' : 'status',
        active.id
      )
    }
    setOriginalStatus(null)

    if (!over) return

    if (over.id === 'trash-zone') {
      const goal = goals[active.id]
      if (!goal) return
      
      deleteGoal(goal.id)
      toast.success('Goal moved to trash', {
        description: `"${goal.title}" can be restored from the Trash Bin.`,
        action: {
          label: 'Undo',
          onClick: () => restoreGoal(goal.id),
        },
      })
      return
    }

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
        <CommandBar onNewGoal={() => setNewGoalModalOpen(true)} />

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

          <TrashDropZone isDragging={!!activeId} />

          <DragOverlay>
            {activeGoal ? <GoalDragOverlay goal={activeGoal} milestonesById={milestonesById} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

    </div>
  )
}
