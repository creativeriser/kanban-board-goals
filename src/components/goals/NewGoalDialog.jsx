import { useState } from 'react'
import { Dialog } from '../ui/Dialog'
import { Input, Textarea, Select } from '../ui/Input'
import { Button } from '../ui/Button'
import { useGoalStore, CATEGORIES } from '../../store/useGoalStore'

const today = new Date().toISOString().slice(0, 10)

export function NewGoalDialog({ open, onClose }) {
  const addGoal = useGoalStore((s) => s.addGoal)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: CATEGORIES[0].id,
    priority: 'medium',
    dueDate: today,
  })

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return
    addGoal({
      ...form,
      dueDate: new Date(form.dueDate).toISOString(),
    })
    setForm({ title: '', description: '', category: CATEGORIES[0].id, priority: 'medium', dueDate: today })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} title="New goal">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="goal-title"
          label="Title"
          placeholder="e.g. Run a sub-4-hour marathon"
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          autoFocus
          required
        />
        <Textarea
          id="goal-description"
          label="Description"
          rows={3}
          placeholder="What does success look like?"
          value={form.description}
          onChange={(e) => update('description', e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Select id="goal-category" label="Category" value={form.category} onChange={(e) => update('category', e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </Select>
          <Select id="goal-priority" label="Priority" value={form.priority} onChange={(e) => update('priority', e.target.value)}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
        </div>
        <Input
          id="goal-due"
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
            Create goal
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
