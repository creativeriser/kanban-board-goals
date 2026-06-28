import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Palette, Shield, Check, LogOut, LogIn } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
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
  { id: 'advanced', label: 'Advanced', icon: Shield },
]

export default function Settings() {
  const [active, setActive] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const navigate = useNavigate()
  const user = useGoalStore((s) => s.user)
  const logout = useGoalStore((s) => s.logout)
  const preferences = useGoalStore((s) => s.preferences) || {}
  const updateUser = useGoalStore((s) => s.updateUser)
  const updatePreferences = useGoalStore((s) => s.updatePreferences)
  const resetData = useGoalStore((s) => s.resetData)

  function handleSave(e) {
    e.preventDefault()
    
    if (active === 'profile') {
      const formData = new FormData(e.target)
      updateUser({
        name: formData.get('name'),
        email: formData.get('email'),
        timezone: formData.get('timezone')
      })
      if (active === 'profile') {
        toast.success('Profile saved successfully', {
          description: 'Your details have been updated.',
        })
      } else {
        toast.success('Settings saved')
      }
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
          <div className="flex flex-col gap-6">
            <nav className="flex flex-col gap-1.5 overflow-x-auto lg:overflow-visible">
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleNav(s.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                    active === s.id ? 'bg-ink-900/5 text-ink-900 font-semibold' : 'text-ink-600 font-medium hover:bg-ink-900/5 hover:text-ink-900 dark:hover:bg-white/5'
                  )}
                >
                  <s.icon size={16} className={active === s.id ? 'text-ink-900' : 'text-ink-500'} />
                  {s.label}
                </button>
              ))}
            </nav>
            <div className="hidden lg:block h-px w-full bg-border" />
            {user && (
              <button
                onClick={() => {
                  logout()
                  toast.success('Signed out')
                }}
                className="flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-ember-600 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ember-500 hover:bg-ember-50 hover:text-ember-700 dark:text-ember-500 dark:hover:bg-ember-500/10 dark:hover:text-ember-400"
              >
                <LogOut size={16} />
                Sign out
              </button>
            )}
          </div>

          <motion.div key={active} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            <Card className="overflow-hidden p-0 shadow-sm border border-border">
              <div className="flex items-start justify-between border-b border-border bg-canvas/40 px-8 py-6">
                <div>
                  <h2 className="font-display text-lg font-semibold tracking-tight text-ink-900">
                    {SECTIONS.find(s => s.id === active)?.label}
                  </h2>
                  <p className="mt-1 text-sm text-ink-600">
                    {active === 'profile' && 'Update your personal details and how we reach you.'}
                    {active === 'notifications' && 'Control exactly what alerts interrupt your focus.'}
                    {active === 'appearance' && 'Customize how GoalFlow looks on your screen.'}
                    {active === 'privacy' && 'Manage your data visibility and sharing preferences.'}
                    {active === 'advanced' && 'Danger zone. Reset or export your data.'}
                  </p>
                </div>
                {active === 'profile' && !isEditing && user && (
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
              
              {active === 'profile' && user && (
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
                    <div className="bg-brand-100/50 dark:bg-brand-500/10 border-t border-brand-100 dark:border-brand-500/20 px-8 py-3 flex items-center gap-2 text-brand-700 dark:text-brand-400 text-sm font-medium">
                      <Check size={16} /> Profile saved successfully.
                    </div>
                  )}
                </form>
              )}
              
              {active === 'profile' && !user && (
                <div className="flex flex-col items-center justify-center py-24 px-8 text-center h-full">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 mb-6 shadow-sm border border-brand-100 dark:border-brand-500/20">
                    <User size={28} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-ink-900 mb-2 tracking-tight">Set up your profile</h3>
                  <p className="text-ink-600 max-w-sm mb-8 leading-relaxed text-sm">
                    You're currently using GoalFlow in local mode. Sign in to set up your profile and securely sync your goals across all your devices.
                  </p>
                  <Button variant="brand" onClick={() => navigate('/auth')}>
                    <LogIn size={16} className="mr-2" /> Sign in or create account
                  </Button>
                </div>
              )}

              {active === 'notifications' && (
                <form onSubmit={handleSave} className="flex flex-col h-full">
                  <div className="flex flex-col px-8 py-2">
                    <Toggle 
                      label="Deadline reminders" 
                      description="Get notified 3 days before a goal is due" 
                      checked={preferences?.notifications?.deadlineReminders ?? true} 
                      onChange={(v) => updatePreferences('notifications', { deadlineReminders: v })}
                    />
                    <Toggle 
                      label="Weekly digest" 
                      description="A Monday-morning summary of last week's momentum" 
                      checked={preferences?.notifications?.weeklyDigest ?? true} 
                      onChange={(v) => updatePreferences('notifications', { weeklyDigest: v })}
                    />
                    <Toggle 
                      label="Streak alerts" 
                      description="Nudge me before my streak resets" 
                      checked={preferences?.notifications?.streakAlerts ?? true} 
                      onChange={(v) => updatePreferences('notifications', { streakAlerts: v })}
                    />
                    <Toggle 
                      label="Achievement celebrations" 
                      description="Confetti and a note when you hit a milestone" 
                      checked={preferences?.notifications?.celebrations ?? true} 
                      onChange={(v) => updatePreferences('notifications', { celebrations: v })}
                      border={false} 
                    />
                  </div>
                </form>
              )}

              {active === 'appearance' && (
                <form onSubmit={handleSave} className="flex flex-col h-full">
                  <div className="flex flex-col px-8 py-2">
                    <SettingsRow label="Theme preference" description="Choose how GoalFlow looks to you." isEditing={true}>
                      <Select id="theme" value={preferences?.appearance?.theme || 'light'} onChange={(e) => updatePreferences('appearance', { theme: e.target.value })}>
                        <option value="system">System Default</option>
                        <option value="light">Light Mode</option>
                        <option value="dark">True OLED Dark Mode</option>
                      </Select>
                    </SettingsRow>
                    <SettingsRow label="Accent color" description="The primary color used for highlights and active states." isEditing={true}>
                      <div className="flex gap-3">
                        {['#1B6F5C', '#4C5FD5', '#FF6B4A', '#E8A23D'].map((color, i) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => updatePreferences('appearance', { accent: color })}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-ink-200 transition-transform hover:scale-105 shadow-sm"
                            style={{ backgroundColor: color, borderColor: preferences?.appearance?.accent === color ? '#14161A' : undefined }}
                          >
                            {preferences?.appearance?.accent === color && <Check size={16} className="text-white drop-shadow-sm" />}
                          </button>
                        ))}
                      </div>
                    </SettingsRow>
                    <SettingsRow label="Board density" description="How tightly packed the kanban cards should appear." isEditing={true} border={false}>
                      <Select id="density" value={preferences?.appearance?.density || 'comfortable'} onChange={(e) => updatePreferences('appearance', { density: e.target.value })}>
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
                    <Toggle 
                      label="Public achievement profile" 
                      description="Let others see your achieved goals" 
                      checked={preferences?.privacy?.publicProfile ?? false}
                      onChange={(v) => updatePreferences('privacy', { publicProfile: v })}
                    />
                    <Toggle 
                      label="Share analytics with coach" 
                      description="Allow a connected accountability partner to view trends" 
                      checked={preferences?.privacy?.shareAnalytics ?? false}
                      onChange={(v) => updatePreferences('privacy', { shareAnalytics: v })}
                      border={false} 
                    />
                  </div>
                </form>
              )}

              {active === 'advanced' && (
                <div className="flex flex-col h-full">
                  <div className="flex flex-col px-8 py-6">
                    <div className="border border-ember-400/30 bg-ember-100/30 dark:border-ember-500/20 dark:bg-ember-500/10 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-ember-600 dark:text-ember-400">Developer Zone: Factory Reset</p>
                        <p className="mt-1 text-sm text-ember-600/80 dark:text-ember-400/80 max-w-md">Wipe your local storage and reset all goals, streaks, and settings back to the initial dummy data. This cannot be undone.</p>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          if (window.confirm('Are you 100% sure you want to factory reset your data? All progress will be lost.')) {
                            resetData()
                            toast.error('Data reset to factory defaults')
                          }
                        }}
                        className="shrink-0 border-ember-400/30 text-ember-600 hover:bg-ember-100 dark:border-ember-500/30 dark:text-ember-400 dark:hover:bg-ember-500/20"
                      >
                        Reset All Data
                      </Button>
                    </div>
                  </div>
                </div>
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
        <p className="text-sm font-semibold text-ink-900">{label}</p>
        {description && <p className="mt-1 text-sm text-ink-600 leading-relaxed">{description}</p>}
      </div>
      <div className="flex-1 max-w-md flex items-center min-h-[40px]">
        {!isEditing ? (
          <span className="text-sm text-ink-900">{value}</span>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

function Toggle({ label, description, checked, onChange, border = true, disabled = false, badge = null }) {
  return (
    <div className={cn("flex items-center justify-between py-6", border && "border-b border-border", disabled && "opacity-60 grayscale")}>
      <div className="pr-8 max-w-[400px]">
        <div className="flex items-center gap-3">
          <p className="text-sm font-semibold text-ink-900">{label}</p>
          {badge && <span className="rounded-full bg-ink-900/5 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-ink-600">{badge}</span>}
        </div>
        <p className="mt-1 text-sm text-ink-600 leading-relaxed">{description}</p>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        aria-pressed={checked}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
          checked ? 'bg-brand-600' : 'bg-ink-200',
          disabled && 'cursor-not-allowed'
        )}
      >
        <span
          className={cn(
            'pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0'
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
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600"
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
