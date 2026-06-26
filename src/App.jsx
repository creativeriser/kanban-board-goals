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

function AnimatedRoutes() {
  return (
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
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <ErrorBoundary fallbackRender={({ error }) => (
          <div className="p-10 text-red-600">
            <h1 className="text-xl font-bold">App Crashed!</h1>
            <pre className="mt-4 bg-red-50 p-4 rounded text-xs">{error.message}</pre>
            <pre className="mt-2 bg-red-50 p-4 rounded text-xs">{error.stack}</pre>
          </div>
        )}>
          <AnimatedRoutes />
        </ErrorBoundary>
      </AppShell>
      <Toaster position="bottom-right" richColors />
    </BrowserRouter>
  )
}
