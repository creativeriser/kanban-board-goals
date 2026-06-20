import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Palette, Shield, Check } from 'lucide-react'
import { TopBar } from '../components/layout/TopBar'
import { Card } from '../components/ui/Card'
import { Input, Select } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { useGoalStore } from '../store/useGoalStore'
import { cn } from '../lib/utils'

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'privacy', label: 'Privacy', icon: Shield },
]

export default function Settings() {
  const [active, setActive] = useState('profile')
  const [saved, setSaved] = useState(false)
  const user = useGoalStore((s) => s.user)
  const updateUser = useGoalStore((s) => s.updateUser)

  function handleSave(e) {
    e.preventDefault()
    
    // If we're on the profile tab, we save the form data to the global store
    if (active === 'profile') {
      const formData = new FormData(e.target)
      updateUser({
        name: formData.get('name'),
        email: formData.get('email'),
        timezone: formData.get('timezone')
      })
    }
    
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <TopBar title="Settings" subtitle="Tune GoalFlow to how you work and stay motivated." />

      <div className="mx-auto max-w-5xl px-8 py-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[240px_1fr]">
          <nav className="flex flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={cn(
                  'flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-[13.5px] font-medium transition-colors',
                  active === s.id ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-900/5 hover:text-ink-900'
                )}
              >
                <s.icon size={16} />
                {s.label}
              </button>
            ))}
          </nav>

          <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <Card className="overflow-hidden p-0 shadow-sm border border-border">
              <div className="border-b border-border bg-canvas/40 px-6 py-5">
                <h2 className="font-display text-[17px] font-semibold text-ink-900">
                  {SECTIONS.find(s => s.id === active)?.label}
                </h2>
                <p className="mt-1 text-[13px] text-ink-600">
                  {active === 'profile' && 'Update your personal details and how we reach you.'}
                  {active === 'notifications' && 'Control exactly what alerts interrupt your focus.'}
                  {active === 'appearance' && 'Customize how GoalFlow looks on your screen.'}
                  {active === 'privacy' && 'Manage your data visibility and sharing preferences.'}
                </p>
              </div>
              
              {active === 'profile' && (
                <form onSubmit={handleSave} className="flex flex-col h-full">
                  <div className="p-6 flex flex-col gap-5 max-w-lg">
                    <Input id="name" name="name" label="Full name" defaultValue={user?.name || ''} required />
                    <Input id="email" name="email" label="Email" type="email" defaultValue={user?.email || ''} required />
                    <Select id="timezone" name="timezone" label="Timezone" defaultValue={user?.timezone || 'pst'}>
                      <option value="pst">Pacific Time (PST)</option>
                      <option value="est">Eastern Time (EST)</option>
                      <option value="gmt">Greenwich Mean Time (GMT)</option>
                      <option value="ist">India Standard Time (IST)</option>
                    </Select>
                  </div>
                  <div className="bg-canvas/40 border-t border-border px-6 py-4 flex justify-end">
                    <SaveBar saved={saved} />
                  </div>
                </form>
              )}

              {active === 'notifications' && (
                <form onSubmit={handleSave} className="flex flex-col h-full">
                  <div className="p-6 flex flex-col max-w-lg">
                    <Toggle label="Deadline reminders" description="Get notified 3 days before a goal is due" defaultChecked />
                    <Toggle label="Weekly digest" description="A Monday-morning summary of last week's momentum" defaultChecked />
                    <Toggle label="Streak alerts" description="Nudge me before my streak resets" defaultChecked />
                    <Toggle label="Achievement celebrations" description="Confetti and a note when you hit a milestone" />
                  </div>
                  <div className="bg-canvas/40 border-t border-border px-6 py-4 flex justify-end">
                    <SaveBar saved={saved} />
                  </div>
                </form>
              )}

              {active === 'appearance' && (
                <form onSubmit={handleSave} className="flex flex-col h-full">
                  <div className="p-6 flex flex-col gap-6 max-w-lg">
                    <div>
                      <p className="mb-2 text-[13.5px] font-medium text-ink-900">Accent color</p>
                      <div className="flex gap-3">
                        {['#1B6F5C', '#4C5FD5', '#FF6B4A', '#E8A23D'].map((color, i) => (
                          <button
                            key={color}
                            type="button"
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 transition-transform hover:scale-105 shadow-sm"
                            style={{ backgroundColor: color, borderColor: i === 0 ? '#14161A' : undefined }}
                          >
                            {i === 0 && <Check size={16} className="text-white drop-shadow-sm" />}
                          </button>
                        ))}
                      </div>
                    </div>
                    <Select id="density" label="Board density" defaultValue="comfortable">
                      <option value="comfortable">Comfortable</option>
                      <option value="compact">Compact</option>
                    </Select>
                  </div>
                  <div className="bg-canvas/40 border-t border-border px-6 py-4 flex justify-end">
                    <SaveBar saved={saved} />
                  </div>
                </form>
              )}

              {active === 'privacy' && (
                <form onSubmit={handleSave} className="flex flex-col h-full">
                  <div className="p-6 flex flex-col max-w-lg">
                    <Toggle label="Public achievement profile" description="Let others see your achieved goals" />
                    <Toggle label="Share analytics with coach" description="Allow a connected accountability partner to view trends" />
                  </div>
                  <div className="bg-canvas/40 border-t border-border px-6 py-4 flex justify-end">
                    <SaveBar saved={saved} />
                  </div>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function Toggle({ label, description, defaultChecked = false }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <div className="flex items-center justify-between border-b border-border py-4 last:border-0">
      <div className="pr-6">
        <p className="text-[13.5px] font-medium text-ink-900">{label}</p>
        <p className="mt-0.5 text-[12.5px] text-ink-600">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
          on ? 'bg-moss-600' : 'bg-ink-200'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            on ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  )
}

function SaveBar({ saved, className }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      {saved && (
        <motion.span
          initial={{ opacity: 0, x: 4 }}
          animate={{ opacity: 1, x: 0 }}
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-moss-600"
        >
          <Check size={15} /> Saved successfully
        </motion.span>
      )}
      <Button type="submit" variant="brand" size="sm">
        Save changes
      </Button>
    </div>
  )
}
