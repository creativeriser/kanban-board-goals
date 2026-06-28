import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sprout, ArrowRight, Github, Sun, Moon, Loader2 } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { GoogleIcon } from '../components/ui/GoogleIcon'
import { useGoalStore } from '../store/useGoalStore'
// Removed GrowthAnimation
import { TypewriterText } from '../components/ui/TypewriterText'

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const login = useGoalStore(s => s.login)
  const theme = useGoalStore(s => s.preferences?.appearance?.theme || 'light')
  const updatePreferences = useGoalStore(s => s.updatePreferences)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Mock login since Supabase isn't hooked up yet
    login({
      name: isSignUp ? (name || 'New Achiever') : 'Jordan Avery',
      email: email || 'jordan@example.com',
      timezone: 'pst'
    })
    navigate('/')
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-surface">
      {/* Auth Navbar (Global Full-Width) */}
      <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-border bg-surface/70 backdrop-blur-xl px-4 md:px-8 sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-canvas">
            <Sprout size={18} />
          </div>
          <span className="font-display text-lg font-bold tracking-wide text-ink-900">GoalFlow</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => updatePreferences('appearance', { theme: theme === 'dark' ? 'light' : 'dark' })}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-900/5 hover:text-ink-600"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content Split */}
      <div className="flex h-[calc(100vh-72px)] w-full">
        {/* Left Column - Form */}
        <div className="flex h-full w-full flex-col px-6 md:px-16 lg:w-1/2 xl:px-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto my-auto w-full max-w-[360px]"
          >
          <motion.div layout="position" className="mb-5">
            <h1 className="font-display text-2xl font-semibold text-ink-900">
              {isSignUp ? 'Create an account' : 'Welcome back'}
            </h1>
          </motion.div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: -12 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: -12 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <Input
                    label="Full name"
                    id="name"
                    type="text"
                    placeholder="Jordan Avery"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    disabled={isLoading}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <Input
              label="Email"
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={isLoading}
              required
            />
            
            <Input
              label="Password"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignUp ? "new-password" : "current-password"}
              disabled={isLoading}
              required
            />

            <Button type="submit" className="mt-1 w-full justify-center" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  {isSignUp ? 'Creating account...' : 'Signing in...'}
                </>
              ) : (
                <>
                  {isSignUp ? 'Create account' : 'Sign in'} <ArrowRight size={16} className="ml-1" />
                </>
              )}
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface px-4 text-ink-400 text-[11px] font-medium uppercase tracking-wider">Or continue with</span>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" className="w-full justify-center border-border/50 hover:bg-ink-900/5 dark:hover:bg-white/5 transition-all duration-300 ease-out shadow-sm" type="button" onClick={handleSubmit} disabled={isLoading}>
              <GoogleIcon className="h-4 w-4 mr-2" />
              Google
            </Button>
            <Button variant="secondary" className="w-full justify-center border-border/50 hover:bg-ink-900/5 dark:hover:bg-white/5 transition-all duration-300 ease-out shadow-sm" type="button" onClick={handleSubmit} disabled={isLoading}>
              <Github className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </div>

          <p className="mt-5 text-center text-sm text-ink-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              onClick={() => setIsSignUp(!isSignUp)}
              disabled={isLoading}
              className="font-medium text-brand-600 hover:text-brand-700 hover:underline outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSignUp ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </motion.div>
      </div>
        {/* Right Column - Brand/Decorative */}
        <div className="relative hidden w-1/2 overflow-hidden bg-[#0A1017] dark:bg-surface lg:block transition-colors">
          
          {/* Subtle glowing spotlight to ground the text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-96 w-96 rounded-full bg-[#10b981] opacity-5 dark:opacity-10 blur-[100px]" />
          </div>
          
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA0KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />

          {/* Simple Typing Animation */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="font-display text-4xl font-medium tracking-wide text-white drop-shadow-sm">
              <TypewriterText text="Achieve your goals :)" />
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}
