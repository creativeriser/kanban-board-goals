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
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const user = useGoalStore((s) => s.user)
  const updateUser = useGoalStore((s) => s.updateUser)

  function handleSave(e) {
    e.preventDefault()
    
    if (active === 'profile') {
      const formData = new FormData(e.target)
      updateUser({
        name: formData.get('name'),
        email: formData.get('email'),
        timezone: formData.get('timezone')
      })
      setIsEditing(false)
    }
    
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleNav(id) {
    setActive(id)
    setIsEditing(false)
    setSaved(false)
  }

  return (
    <div>
      <TopBar title="Settings" subtitle="Tune GoalFlow to how you work and stay motivated." />

      <div className="mx-auto max-w-5xl px-8 py-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[220px_1fr]">
          <nav className="flex flex-col gap-1.5 overflow-x-auto lg:overflow-visible">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleNav(s.id)}
                className={cn(
                  'flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-left text-[13.5px] transition-colors',
                  active === s.id ? 'bg-ink-900/5 text-ink-900 font-semibold' : 'text-ink-600 font-medium hover:bg-ink-900/5 hover:text-ink-900'
                )}
              >
                <s.icon size={16} className={active === s.id ? 'text-ink-900' : 'text-ink-500'} />
                {s.label}
              </button>
            ))}
          </nav>

          <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <Card className="overflow-hidden p-0 shadow-sm border border-border">
              <div className="flex items-start justify-between border-b border-border bg-canvas/40 px-8 py-6">
                <div>
                  <h2 className="font-display text-[18px] font-semibold tracking-tight text-ink-900">
                    {SECTIONS.find(s => s.id === active)?.label}
                  </h2>
                  <p className="mt-1 text-[13.5px] text-ink-600">
                    {active === 'profile' && 'Update your personal details and how we reach you.'}
                    {active === 'notifications' && 'Control exactly what alerts interrupt your focus.'}
                    {active === 'appearance' && 'Customize how GoalFlow looks on your screen.'}
                    {active === 'privacy' && 'Manage your data visibility and sharing preferences.'}
                  </p>
                </div>
                {active === 'profile' && !isEditing && (
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
              
              {active === 'profile' && (
                <form onSubmit={handleSave} className="flex flex-col h-full">
                  <div className="flex flex-col px-8 py-2">
                    <SettingsRow label="Full name" description="Your name as it appears across the platform." value={user?.name} isEditing={isEditing}>
                      <Input id="name" name="name" defaultValue={user?.name || ''} required />
                    </SettingsRow>
                    <SettingsRow label="Email address" description="Where we send important account updates and notifications." value={user?.email} isEditing={isEditing}>
                      <Input id="email" name="email" type="email" defaultValue={user?.email || ''} required />
                    </SettingsRow>
                    <SettingsRow 
                      label="Timezone" 
                      description="Used to perfectly align your streaks and daily resets." 
                      value={{'pst': 'Pacific Time (PST)', 'est': 'Eastern Time (EST)', 'gmt': 'Greenwich Mean Time (GMT)', 'ist': 'India Standard Time (IST)'}[user?.timezone] || user?.timezone} 
                      isEditing={isEditing} 
                      border={false}
                    >
                      <Select id="timezone" name="timezone" defaultValue={user?.timezone || 'pst'}>
                        <option value="pst">Pacific Time (PST)</option>
                        <option value="est">Eastern Time (EST)</option>
                        <option value="gmt">Greenwich Mean Time (GMT)</option>
                        <option value="ist">India Standard Time (IST)</option>
                      </Select>
                    </SettingsRow>
                  </div>
                  {isEditing && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-canvas/50 border-t border-border px-8 py-4 flex justify-end gap-3">
                      <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
                      <SaveBar saved={saved} />
                    </motion.div>
                  )}
                  {saved && !isEditing && (
                    <div className="bg-moss-50 border-t border-moss-100 px-8 py-3 flex items-center gap-2 text-moss-700 text-[13px] font-medium">
                      <Check size={16} /> Profile saved successfully.
                    </div>
                  )}
                </form>
              )}

              {active === 'notifications' && (
                <form onSubmit={handleSave} className="flex flex-col h-full">
                  <div className="flex flex-col px-8 py-2">
                    <Toggle label="Deadline reminders" description="Get notified 3 days before a goal is due" defaultChecked />
                    <Toggle label="Weekly digest" description="A Monday-morning summary of last week's momentum" defaultChecked />
                    <Toggle label="Streak alerts" description="Nudge me before my streak resets" defaultChecked />
                    <Toggle label="Achievement celebrations" description="Confetti and a note when you hit a milestone" border={false} />
                  </div>
                </form>
              )}

              {active === 'appearance' && (
                <form onSubmit={handleSave} className="flex flex-col h-full">
                  <div className="flex flex-col px-8 py-2">
                    <SettingsRow label="Accent color" description="The primary color used for highlights and active states." isEditing={true}>
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
                    </SettingsRow>
                    <SettingsRow label="Board density" description="How tightly packed the kanban cards should appear." isEditing={true} border={false}>
                      <Select id="density" defaultValue="comfortable">
                        <option value="comfortable">Comfortable</option>
                        <option value="compact">Compact</option>
                      </Select>
                    </SettingsRow>
                  </div>
                </form>
              )}

              {active === 'privacy' && (
                <form onSubmit={handleSave} className="flex flex-col h-full">
                  <div className="flex flex-col px-8 py-2">
                    <Toggle label="Public achievement profile" description="Let others see your achieved goals" />
                    <Toggle label="Share analytics with coach" description="Allow a connected accountability partner to view trends" border={false} />
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

function SettingsRow({ label, description, value, isEditing = true, children, border = true }) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:gap-10 py-6", border && "border-b border-border")}>
      <div className="w-full sm:w-[240px] shrink-0">
        <p className="text-[13.5px] font-semibold text-ink-900">{label}</p>
        {description && <p className="mt-1 text-[13px] text-ink-600 leading-relaxed">{description}</p>}
      </div>
      <div className="flex-1 max-w-md flex items-center min-h-[40px]">
        {!isEditing ? (
          <span className="text-[14.5px] text-ink-900">{value}</span>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

function Toggle({ label, description, defaultChecked = false, border = true }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <div className={cn("flex items-center justify-between py-6", border && "border-b border-border")}>
      <div className="pr-8 max-w-[400px]">
        <p className="text-[13.5px] font-semibold text-ink-900">{label}</p>
        <p className="mt-1 text-[13px] text-ink-600 leading-relaxed">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2',
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
