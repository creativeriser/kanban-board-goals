import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import Dashboard from './pages/Dashboard'
import GoalsBoard from './pages/GoalsBoard'
import GoalDetails from './pages/GoalDetails'
import Analytics from './pages/Analytics'
import Achievements from './pages/Achievements'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/board" element={<GoalsBoard />} />
          <Route path="/goals/:goalId" element={<GoalDetails />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
