import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from 'sonner'
import { AppShell } from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import GoalsBoard from './pages/GoalsBoard'
import GoalDetails from './pages/GoalDetails'
import Analytics from './pages/Analytics'
import Achievements from './pages/Achievements'
import Trash from './pages/Trash'
import Settings from './pages/Settings'
import Docs from './pages/Docs'
import Auth from './pages/Auth'

function DashboardLayout() {
  return (
    <AppShell>
      <ErrorBoundary fallbackRender={({ error }) => (
        <div className="p-10 text-red-600">
          <h1 className="text-xl font-bold">App Crashed!</h1>
          <pre className="mt-4 bg-red-50 p-4 rounded text-xs">{error.message}</pre>
          <pre className="mt-2 bg-red-50 p-4 rounded text-xs">{error.stack}</pre>
        </div>
      )}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/board" element={<GoalsBoard />} />
          <Route path="/goals/:goalId" element={<GoalDetails />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/docs" element={<Docs />} />
        </Routes>
      </ErrorBoundary>
    </AppShell>
  )
}

import { useEffect } from 'react'
import { useGoalStore } from './store/useGoalStore'

function GlobalThemeProvider() {
  const theme = useGoalStore((s) => s.preferences?.appearance?.theme || 'light')
  const accentHex = useGoalStore((s) => s.preferences?.appearance?.accent || '#1B6F5C')

  useEffect(() => {
    const root = document.documentElement
    const HEX_TO_ACCENT = {
      '#1B6F5C': 'moss',
      '#4C5FD5': 'indigo',
      '#FF6B4A': 'ember',
      '#E8A23D': 'amber',
    }
    const accentName = HEX_TO_ACCENT[accentHex] || 'moss'
    root.setAttribute('data-accent', accentName)
    
    function applyTheme() {
      if (theme === 'dark') {
        root.classList.add('dark')
      } else if (theme === 'light') {
        root.classList.remove('dark')
      } else {
        const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (systemIsDark) root.classList.add('dark')
        else root.classList.remove('dark')
      }
    }

    applyTheme()
    
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = () => applyTheme()
      mediaQuery.addEventListener('change', listener)
      return () => mediaQuery.removeEventListener('change', listener)
    }
  }, [theme, accentHex])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <GlobalThemeProvider />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/*" element={<DashboardLayout />} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  )
}
