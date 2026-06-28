import { useEffect } from 'react'
import { Sidebar } from './Sidebar'
import { NewGoalDialog } from '../goals/NewGoalDialog'
import { CommandMenu } from '../ui/CommandMenu'
import { useGoalStore } from '../../store/useGoalStore'
import { motion, AnimatePresence } from 'framer-motion'

export function AppShell({ children }) {
  const mobileSidebarOpen = useGoalStore((s) => s.ui.mobileSidebarOpen)
  const setMobileSidebarOpen = useGoalStore((s) => s.setMobileSidebarOpen)
  const newGoalModalOpen = useGoalStore((s) => s.ui.newGoalModalOpen)
  const setNewGoalModalOpen = useGoalStore((s) => s.setNewGoalModalOpen)

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return
      
      if (e.key.toLowerCase() === 'c' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setNewGoalModalOpen(true)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [setNewGoalModalOpen])

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <Sidebar />
      <div className="min-w-0 flex-1">
        {children}
      </div>

      <NewGoalDialog open={newGoalModalOpen} onClose={() => setNewGoalModalOpen(false)} />
      <CommandMenu />
    </div>
  )
}
