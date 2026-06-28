import { motion } from 'framer-motion'
import { Trash2, RotateCcw } from 'lucide-react'
import { toast } from 'sonner'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { CategoryTag } from '../components/goals/PriorityDot'
import { useGoalStore } from '../store/useGoalStore'

export default function Trash() {
  const goals = useGoalStore((s) => s.goals)
  const order = useGoalStore((s) => s.order)
  const restoreGoal = useGoalStore((s) => s.restoreGoal)
  const permanentlyDeleteGoal = useGoalStore((s) => s.permanentlyDeleteGoal)
  const emptyTrash = useGoalStore((s) => s.emptyTrash)

  const trashIds = order.trash || []

  return (
    <div className="flex h-full flex-col">
      <TopBar 
        title="Trash Bin" 
        subtitle="Deleted goals stay here until you empty the bin."
        action={
          trashIds.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => {
                if (window.confirm('Permanently delete all goals in the trash? This cannot be undone.')) {
                  emptyTrash()
                  toast.success('Trash emptied')
                }
              }}
              className="text-ember-600 border-ember-200 hover:bg-ember-50 dark:border-ember-900/30 dark:hover:bg-ember-500/10 dark:text-ember-500"
            >
              <Trash2 size={16} />
              Empty Bin
            </Button>
          )
        }
      />

      <div className="flex-1 overflow-y-auto px-8 py-8">
        {trashIds.length === 0 ? (
          <div className="flex h-[50vh] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-ink-900/5 text-ink-400 dark:bg-white/5">
              <Trash2 size={24} />
            </div>
            <h2 className="font-display text-lg font-semibold text-ink-900">Trash is empty</h2>
            <p className="mt-1 text-sm text-ink-500 max-w-[240px]">Goals you delete from the board will appear here for safekeeping.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-w-4xl mx-auto">
            {trashIds.map((id, i) => {
              const goal = goals[id]
              if (!goal) return null
              return (
                <motion.div 
                  key={id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 shadow-sm border border-border/60 transition-colors hover:border-border">
                    <div>
                      <p className="font-medium text-sm text-ink-900 line-through opacity-70">{goal.title}</p>
                      <div className="mt-1.5 flex items-center gap-2 opacity-70">
                        <CategoryTag category={goal.category} />
                        <span className="text-xs font-mono text-ink-400">
                          {new Date(goal.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          restoreGoal(goal.id)
                          toast.success('Goal restored', { description: `"${goal.title}" has been returned to your board.` })
                        }}
                      >
                        <RotateCcw size={14} />
                        Restore
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-ember-600 hover:bg-ember-50 hover:border-ember-200 dark:text-ember-500 dark:hover:bg-ember-500/10 dark:hover:border-ember-500/30"
                        onClick={() => {
                          permanentlyDeleteGoal(goal.id)
                          toast.success('Permanently deleted')
                        }}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
