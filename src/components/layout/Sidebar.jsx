import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Kanban, BarChart3, Trophy, Settings, Sprout, ChevronsLeft } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/board', label: 'Goals Board', icon: Kanban },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/achievements', label: 'Achievements', icon: Trophy },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'sticky top-0 flex h-screen shrink-0 flex-col bg-ink-950 border-r border-white/5 transition-all duration-300 ease-in-out',
        collapsed ? 'w-[72px]' : 'w-[250px]'
      )}
    >
      <div className="flex h-[72px] items-center gap-3 px-5 border-b border-white/5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-moss-500 text-white">
          <Sprout size={17} />
        </div>
        {!collapsed && <span className="font-display text-[17px] font-semibold tracking-wide text-white">GoalFlow</span>}
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1.5 px-3 relative">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors outline-none',
                isActive ? 'text-white' : 'text-ink-400 hover:text-white'
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active Highlight Background */}
                {isActive ? (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 rounded-lg bg-white/5 border border-white/5"
                    transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
                  />
                ) : (
                  <div className="absolute inset-0 rounded-lg bg-white/[0.04] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                )}
                
                {/* Active Left Pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-moss-500"
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

      <div className="px-4 pb-5">
        {!collapsed && (
          <div className="mb-4 relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-4 shadow-sm">
            {/* Ambient glow */}
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-ember-500/20 blur-[24px]"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base drop-shadow-sm">🔥</span>
                <p className="font-display text-[13px] font-semibold tracking-wide text-white">12-Day Streak</p>
              </div>
              <p className="text-[12px] leading-relaxed text-ink-400/90">Consistency builds momentum. Keep showing up!</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-ink-400 transition-colors hover:bg-white/[0.04] hover:text-white"
        >
          <ChevronsLeft size={18} className={cn('shrink-0 transition-transform duration-300', collapsed && 'rotate-180')} />
          {!collapsed && 'Collapse sidebar'}
        </button>
      </div>
    </aside>
  )
}
