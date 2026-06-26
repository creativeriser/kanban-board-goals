import { Bell, Menu, Sun, Moon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { useGoalStore } from '../../store/useGoalStore'
import { Popover } from '../ui/Popover'
import { cn } from '../../lib/utils'

export function TopBar({ title, subtitle, action }) {
  const user = useGoalStore((s) => s.user)
  const setMobileSidebarOpen = useGoalStore((s) => s.setMobileSidebarOpen)
  const theme = useGoalStore((s) => s.preferences?.appearance?.theme || 'light')
  const updatePreferences = useGoalStore((s) => s.updatePreferences)
  const activity = useGoalStore((s) => s.activity)
  
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : 'U'

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-border bg-canvas/95 px-4 md:px-8 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden flex h-9 w-9 items-center justify-center rounded-lg text-ink-600 transition-colors hover:bg-ink-900/5"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="font-display text-[20px] md:text-[26px] font-semibold leading-tight text-ink-900">{title}</h1>
          {subtitle && <p className="mt-0.5 hidden md:block text-[13.5px] text-ink-600">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-5">
        {action}
        
        <div className="flex items-center gap-3 pl-2">
          {action && <div className="h-5 w-px bg-ink-200"></div>}
          <button 
            onClick={() => updatePreferences('appearance', { theme: theme === 'dark' ? 'light' : 'dark' })}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-900/5 hover:text-ink-600"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Popover 
            trigger={
              <button className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-900/5 hover:text-ink-600 relative" aria-label="Notifications">
                <Bell size={18} />
                {activity.length > 0 && (
                  <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-ember-500 border-[1.5px] border-canvas"></span>
                )}
              </button>
            }
          >
            <div className="flex flex-col max-h-[360px]">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between sticky top-0 bg-surface/95 backdrop-blur z-10">
                <p className="font-display text-[14px] font-semibold text-ink-900">Notifications</p>
                {activity.length > 0 && <span className="text-[11px] font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">{activity.length} new</span>}
              </div>
              <div className="overflow-y-auto overflow-x-hidden p-2 scrollbar-thin flex flex-col gap-1">
                {activity.length === 0 ? (
                  <div className="py-8 text-center px-4">
                    <p className="text-[13px] text-ink-500">You're all caught up!</p>
                  </div>
                ) : (
                  activity.slice(0, 10).map((a) => (
                    <div key={a.id} className="flex gap-3 p-2.5 rounded-lg hover:bg-ink-900/5 transition-colors cursor-default">
                      <span
                        className={cn(
                          'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                          a.type === 'achieved' ? 'bg-moss-500' : a.type === 'status' ? 'bg-indigo-500' : 'bg-amber-500'
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[12.5px] leading-snug text-ink-800">{a.text}</p>
                        <p className="font-mono text-[11px] text-ink-400 mt-0.5">{formatDistanceToNow(new Date(a.time), { addSuffix: true })}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Popover>
          <Link 
            to="/settings"
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-surface border border-ink-900 shadow-sm transition-all hover:bg-ink-900/5 hover:border-ink-700 active:scale-95"
            aria-label="Profile settings"
          >
            <span className="font-display text-[13px] font-bold text-ink-900 tracking-tight">{initials}</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
