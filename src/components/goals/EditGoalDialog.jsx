import { useState, useEffect } from 'react'
import { Dialog } from '../ui/Dialog'
import { Input, Textarea, Select } from '../ui/Input'
import { Button } from '../ui/Button'
import { useGoalStore } from '../../store/useGoalStore'

export function EditGoalDialog({ open, onClose, goal }) {
  const updateGoal = useGoalStore((s) => s.updateGoal)
  const categories = useGoalStore((s) => s.categories)
  const addCategory = useGoalStore((s) => s.addCategory)
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    dueDate: '',
  })
  const [customCategory, setCustomCategory] = useState('')

  // Sync internal form state with goal prop when opened
  useEffect(() => {
    if (goal && open) {
      setForm({
        title: goal.title,
        description: goal.description,
        category: goal.category,
        priority: goal.priority,
        dueDate: goal.dueDate ? goal.dueDate.slice(0, 10) : '',
      })
      setCustomCategory('')
    }
  }, [goal, open])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return

    let finalCategoryId = form.category
    if (form.category === '__custom__') {
      if (!customCategory.trim()) return
      const newId = addCategory(customCategory.trim())
      if (newId) finalCategoryId = newId
    }

    updateGoal(goal.id, {
      ...form,
      category: finalCategoryId,
      dueDate: new Date(form.dueDate).toISOString(),
    })
    
    onClose()
  }

  if (!goal) return null

  return (
    <Dialog open={open} onClose={onClose} title="Edit goal">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="edit-goal-title"
          label="Title"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          autoFocus
          required
        />
        <Textarea
          id="edit-goal-description"
          label="Description"
          rows={3}
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Select id="edit-goal-category" label="Category" value={form.category} onChange={(e) => update('category', e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
              <option value="__custom__">+ Custom category...</option>
            </Select>
            {form.category === '__custom__' && (
              <Input
                id="edit-custom-category"
                placeholder="e.g. Fitness"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                required
              />
            )}
          </div>
          <Select id="edit-goal-priority" label="Priority" value={form.priority} onChange={(e) => update('priority', e.target.value)}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </div>
        <Input
          id="edit-goal-due"
          type="date"
          label="Due date"
          value={form.dueDate}
          onChange={(e) => update('dueDate', e.target.value)}
        />
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="brand">
            Save changes
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
