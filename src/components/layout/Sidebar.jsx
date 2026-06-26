import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Kanban, BarChart3, Trophy, Settings, Sprout, ChevronsLeft, Search, Trash2, LifeBuoy } from 'lucide-react'
import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import { useGoalStore } from '../../store/useGoalStore'
import { calculateStreaks } from '../../lib/calculations'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/board', label: 'Goals Board', icon: Kanban },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/trash', label: 'Trash Bin', icon: Trash2 },
  { to: '/docs', label: 'Help Center', icon: LifeBuoy },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [isResizingState, setIsResizingState] = useState(false)
  
  const mobileSidebarOpen = useGoalStore((s) => s.ui.mobileSidebarOpen)
  const setMobileSidebarOpen = useGoalStore((s) => s.setMobileSidebarOpen)
  const sidebarWidth = useGoalStore((s) => s.ui.sidebarWidth)
  const setSidebarWidth = useGoalStore((s) => s.setSidebarWidth)
  
  const milestonesById = useGoalStore((s) => s.milestones)
  const { currentStreak } = calculateStreaks(milestonesById)

  // Drag to Resize Logic
  const isResizing = useRef(false)

  const startResizing = useCallback((e) => {
    isResizing.current = true
    setIsResizingState(true)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  const stopResizing = useCallback(() => {
    if (isResizing.current) {
      isResizing.current = false
      setIsResizingState(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [])

  const resize = useCallback(
    (e) => {
      if (isResizing.current) {
        const newWidth = e.clientX
        if (newWidth < 150) {
          setCollapsed(true)
        } else {
          setCollapsed(false)
          setSidebarWidth(Math.min(Math.max(newWidth, 200), 400))
        }
      }
    },
    [setSidebarWidth]
  )

  useEffect(() => {
    window.addEventListener('mousemove', resize)
    window.addEventListener('mouseup', stopResizing)
    return () => {
      window.removeEventListener('mousemove', resize)
      window.removeEventListener('mouseup', stopResizing)
    }
  }, [resize, stopResizing])

  return (
    <aside
      className={cn(
        'fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-surface/70 backdrop-blur-xl dark:bg-surface/95 border-r border-border/60 lg:sticky lg:top-0',
        !isResizingState && 'transition-all duration-300 ease-in-out',
        mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        mobileSidebarOpen && 'shadow-2xl dark:shadow-dark-floating'
      )}
      style={{
        width: mobileSidebarOpen ? 250 : (collapsed ? 72 : sidebarWidth)
      }}
    >
      {/* Resize Handle */}
      <div 
        className="absolute -right-[3px] top-0 bottom-0 w-[6px] cursor-col-resize z-50 hidden lg:block hover:bg-brand-500/50 active:bg-brand-500 transition-colors"
        onMouseDown={startResizing}
      />

      <div className="flex h-[72px] shrink-0 items-center gap-3 px-5 border-b border-border overflow-hidden">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ink-900 text-canvas">
          <Sprout size={17} />
        </div>
        {!collapsed && <span className="font-display text-[17px] font-semibold tracking-wide text-ink-900 whitespace-nowrap">GoalFlow</span>}
      </div>

      <div className="px-3 pt-5 overflow-hidden">
        <button
          onClick={() => {
            document.dispatchEvent(new CustomEvent('open-command-menu'))
            if (mobileSidebarOpen) setMobileSidebarOpen(false)
          }}
          className={cn(
            "flex w-full items-center gap-2 rounded-md border border-border bg-surface px-2.5 py-1.5 text-left text-[13px] text-ink-500 shadow-sm transition-colors hover:border-ink-300 hover:text-ink-900 dark:bg-ink-900/20 dark:hover:border-ink-700 outline-none focus-visible:ring-2 focus-visible:ring-brand-500 whitespace-nowrap",
            collapsed && "justify-center px-0"
          )}
        >
          <Search size={16} className={cn("shrink-0", collapsed && "mx-auto")} />
          {!collapsed && (
            <>
              <span className="flex-1 overflow-hidden text-ellipsis">Search...</span>
              <kbd className="hidden sm:inline-flex shrink-0 h-5 items-center justify-center rounded border border-border bg-ink-900/5 px-1.5 font-mono text-[10px] font-medium text-ink-500 dark:bg-white/10 dark:text-ink-400">⌘K</kbd>
            </>
          )}
        </button>
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-1.5 px-3 relative overflow-hidden">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setMobileSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors outline-none whitespace-nowrap',
                isActive ? 'text-ink-900' : 'text-ink-600 hover:text-ink-900 hover:bg-ink-900/5'
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Highlight Background */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 rounded-lg bg-ink-900/5 dark:bg-ink-900/10 border border-ink-900/10 dark:border-ink-900/5"
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                  />
                )}
                
                {/* Active Left Pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-brand-500"
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                  />
                )}
                
                <Icon
                  size={18}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={cn("shrink-0 relative z-10 transition-colors duration-200", isActive ? "text-moss-400" : "text-ink-500 group-hover:text-ink-300")}
                />
                {!collapsed && <span className="truncate relative z-10">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 pb-5 overflow-hidden">
        {!collapsed && (
          <div className="mb-4 relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-b from-ink-900/[0.02] to-transparent dark:from-white/[0.03] p-4 shadow-sm dark:shadow-dark-card backdrop-blur-sm whitespace-nowrap">
            {/* Ambient glow */}
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-ember-500/10 dark:bg-ember-500/20 blur-[24px]"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base drop-shadow-sm shrink-0">{currentStreak >= 3 ? '🔥' : '🌱'}</span>
                <p className="font-display text-[13px] font-semibold tracking-wide text-ink-900 truncate">{currentStreak}-Day Streak</p>
              </div>
              <p className="text-[12px] leading-relaxed text-ink-600 truncate">Consistency builds momentum. Keep showing up!</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="group hidden lg:flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-ink-600 transition-colors hover:bg-ink-900/5 hover:text-ink-900 whitespace-nowrap"
        >
          <ChevronsLeft size={18} className={cn('shrink-0 transition-transform duration-300', collapsed && 'rotate-180')} />
          {!collapsed && <span className="truncate">Collapse sidebar</span>}
        </button>
      </div>
    </aside>
  )
}
