import { AnimatePresence, motion } from 'framer-motion'
import { useLocation, useOutlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AppShell() {
  const location = useLocation()
  const element = useOutlet()

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {element}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  )
}
