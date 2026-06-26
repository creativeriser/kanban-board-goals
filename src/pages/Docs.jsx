import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, LayoutDashboard, Target, Zap, Shield, 
  ChevronDown, Search, ArrowRight, ListChecks, Trophy, Trash2
} from 'lucide-react'
import { cn } from '../lib/utils'
import { GrowthRing } from '../components/ui/GrowthRing'
import { PriorityDot } from '../components/goals/PriorityDot'

const SECTIONS = [
  { id: 'getting-started', label: 'Getting Started', icon: BookOpen },
  { id: 'the-board', label: 'The Board', icon: LayoutDashboard },
  { id: 'goals-milestones', label: 'Goals', icon: Target },
  { id: 'shortcuts', label: 'Shortcuts', icon: Zap },
  { id: 'faq', label: 'FAQ', icon: Shield },
]

function FadeIn({ children, delay = 0, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Shortcut({ children }) {
  return (
    <kbd className="mx-1 inline-flex h-6 items-center justify-center rounded border border-border bg-ink-900/5 px-2 font-mono text-[11px] font-medium text-ink-600 dark:bg-white/10 dark:text-ink-400 shadow-[0_2px_0_rgba(0,0,0,0.05)] dark:shadow-[0_2px_0_rgba(255,255,255,0.05)]">
      {children}
    </kbd>
  )
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border-b border-border py-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 text-left outline-none"
      >
        <span className="font-display text-[16px] font-semibold text-ink-900">{question}</span>
        <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-900/5 transition-transform duration-300", isOpen && "rotate-180")}>
          <ChevronDown size={16} className="text-ink-600" />
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pt-4 text-[14px] leading-relaxed text-ink-600">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Docs() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id)

  const scrollTo = (id) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex w-full flex-col bg-canvas">
      
      {/* Sticky Horizontal Navigation Bar */}
      <div className="sticky top-0 z-40 flex h-[72px] shrink-0 items-center border-b border-border bg-canvas/95 px-4 backdrop-blur-md md:px-8 lg:px-16">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-1 overflow-x-auto no-scrollbar">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-all outline-none",
                activeSection === s.id 
                  ? "bg-brand-50 text-brand-600 shadow-sm dark:bg-brand-500/10 dark:text-brand-400" 
                  : "text-ink-500 hover:bg-ink-900/5 hover:text-ink-900"
              )}
            >
              <s.icon size={15} className={cn(activeSection === s.id ? "text-brand-500" : "text-ink-400")} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pt-10 pb-24 lg:px-16 lg:pt-16">
        <div className="mx-auto max-w-4xl">
          
          {/* Header */}
          <FadeIn>
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-[12px] font-semibold tracking-wide text-brand-600 dark:text-brand-400">
                <BookOpen size={14} /> Help Center
              </div>
              <h1 className="mb-4 font-display text-[36px] font-bold leading-tight text-ink-900 md:text-[46px]">
                Mastering GoalFlow
              </h1>
              <p className="text-[16px] leading-relaxed text-ink-600 md:text-[18px]">
                GoalFlow isn't just a to-do list; it's a visual maturation engine for your life's biggest ambitions. Learn how to harness its power.
              </p>
            </div>
          </FadeIn>

          {/* Section: Getting Started */}
          <section id="getting-started" className="mb-20 scroll-mt-24">
            <FadeIn>
              <h2 className="mb-6 font-display text-[24px] font-bold text-ink-900 border-b border-border pb-2">1. The Philosophy</h2>
              <p className="mb-6 text-[15px] leading-relaxed text-ink-600">
                Traditional task managers treat all tasks equally—buying milk is visually identical to starting a business. GoalFlow categorizes goals into a strict maturation pipeline:
              </p>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-border bg-surface p-5 shadow-sm transition-all hover:shadow-card">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink-100 text-ink-700">1</div>
                  <h3 className="mb-2 font-display text-[16px] font-semibold text-ink-900">Planning</h3>
                  <p className="text-[13px] text-ink-500">The incubation phase. Gather resources, define milestones, and prepare to execute.</p>
                </div>
                <div className="rounded-xl border border-indigo-500/20 bg-indigo-50/50 p-5 shadow-sm transition-all hover:shadow-card dark:bg-indigo-500/5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">2</div>
                  <h3 className="mb-2 font-display text-[16px] font-semibold text-ink-900">In Progress</h3>
                  <p className="text-[13px] text-ink-500">Active execution. This is where the work happens and momentum is built.</p>
                </div>
                <div className="rounded-xl border border-amber-500/20 bg-amber-50/50 p-5 shadow-sm transition-all hover:shadow-card dark:bg-amber-500/5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">3</div>
                  <h3 className="mb-2 font-display text-[16px] font-semibold text-ink-900">Review</h3>
                  <p className="text-[13px] text-ink-500">Reflection phase. Have all milestones been met? Is the quality up to standard?</p>
                </div>
                <div className="rounded-xl border border-moss-500/20 bg-moss-50/50 p-5 shadow-sm transition-all hover:shadow-card dark:bg-moss-500/5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-moss-100 text-moss-700">4</div>
                  <h3 className="mb-2 font-display text-[16px] font-semibold text-ink-900">Achieved</h3>
                  <p className="text-[13px] text-ink-500">Victory. The goal is completed and added to your permanent achievements.</p>
                </div>
              </div>
            </FadeIn>
          </section>

          {/* Section: The Board */}
          <section id="the-board" className="mb-20 scroll-mt-24">
            <FadeIn>
              <h2 className="mb-6 font-display text-[24px] font-bold text-ink-900 border-b border-border pb-2">2. The Kanban Board</h2>
              
              <div className="mb-8 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
                <div className="flex items-center gap-2 border-b border-border bg-ink-900/5 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400"></span>
                    <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                    <span className="h-3 w-3 rounded-full bg-green-400"></span>
                  </div>
                  <span className="ml-2 font-mono text-[11px] font-medium text-ink-500">goalflow.app/board</span>
                </div>
                <div className="p-6">
                  <div className="flex flex-col gap-6 md:flex-row md:items-center">
                    <div className="flex-1 space-y-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400">
                        <ArrowRight size={24} />
                      </div>
                      <h4 className="font-display text-[18px] font-semibold text-ink-900">Physics-Based Drag & Drop</h4>
                      <p className="text-[14px] leading-relaxed text-ink-600">Click and hold any goal card to pick it up. Drag it across columns to instantly update its status. The interface will smoothly part to make room, providing satisfying tactical feedback.</p>
                    </div>
                    <div className="hidden h-px w-full bg-border md:block md:h-24 md:w-px"></div>
                    <div className="flex-1 space-y-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
                        <Trash2 size={24} />
                      </div>
                      <h4 className="font-display text-[18px] font-semibold text-ink-900">Dynamic Island Trash</h4>
                      <p className="text-[14px] leading-relaxed text-ink-600">When you pick up a card, a red "Drop zone" appears at the bottom of the screen. Drop a card there to instantly delete it from your board.</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </section>

          {/* Section: Goals & Milestones */}
          <section id="goals-milestones" className="mb-20 scroll-mt-24">
            <FadeIn>
              <h2 className="mb-6 font-display text-[24px] font-bold text-ink-900 border-b border-border pb-2">3. Milestones & Progress</h2>
              <p className="mb-6 text-[15px] leading-relaxed text-ink-600">
                Clicking on a goal card opens the Goal Details page. This is where you break large ambitions into actionable daily steps.
              </p>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-surface p-8 shadow-sm text-center">
                  <div className="mb-6 flex justify-center">
                    <GrowthRing progress={75} size={80} strokeWidth={6} tone="brand" />
                  </div>
                  <h3 className="mb-2 font-display text-[18px] font-semibold text-ink-900">Concentric Growth Rings</h3>
                  <p className="text-[14px] leading-relaxed text-ink-500">
                    As you check off milestones, the outer ring fills. If you have many milestones, rings nest concentrically inward, creating a beautiful visual tracker of your momentum.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-surface p-8 shadow-sm text-center">
                  <div className="mb-6 flex flex-col gap-2">
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-ink-50/50 p-3 dark:bg-white/5">
                      <div className="h-4 w-4 rounded-full border-2 border-brand-500 bg-brand-500 shrink-0"></div>
                      <span className="text-[13px] font-medium text-ink-400 line-through truncate">Buy running shoes</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-brand-500 bg-surface p-3 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                      <div className="h-4 w-4 rounded-full border-2 border-ink-300 shrink-0"></div>
                      <span className="text-[13px] font-medium text-ink-900 truncate">Run 5k without stopping</span>
                    </div>
                  </div>
                  <h3 className="mb-2 font-display text-[18px] font-semibold text-ink-900">Inline Editing</h3>
                  <p className="text-[14px] leading-relaxed text-ink-500">
                    Hover over any milestone to edit it instantly. Drag the grip icon on the left to reorder milestones, creating a perfect chronological roadmap.
                  </p>
                </div>
              </div>
            </FadeIn>
          </section>

          {/* Section: Shortcuts */}
          <section id="shortcuts" className="mb-20 scroll-mt-24">
            <FadeIn>
              <h2 className="mb-6 font-display text-[24px] font-bold text-ink-900 border-b border-border pb-2">4. Power Shortcuts</h2>
              <p className="mb-6 text-[15px] leading-relaxed text-ink-600">
                GoalFlow is designed for speed. Keep your hands on the keyboard and move faster.
              </p>

              <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
                <div className="flex items-center justify-between border-b border-border p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-100 text-ink-700">
                      <Search size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-ink-900 text-[15px]">Command Palette</p>
                      <p className="text-[13px] text-ink-500">Search goals or jump to pages instantly</p>
                    </div>
                  </div>
                  <div>
                    <Shortcut>⌘ / Ctrl</Shortcut> + <Shortcut>K</Shortcut>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-border p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-100 text-ink-700">
                      <Target size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-ink-900 text-[15px]">Create New Goal</p>
                      <p className="text-[13px] text-ink-500">Opens the creation modal from anywhere</p>
                    </div>
                  </div>
                  <div>
                    <Shortcut>C</Shortcut>
                  </div>
                </div>

                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink-100 text-ink-700">
                      <LayoutDashboard size={18} />
                    </div>
                    <div>
                      <p className="font-semibold text-ink-900 text-[15px]">Escape</p>
                      <p className="text-[13px] text-ink-500">Closes any open modal or command palette</p>
                    </div>
                  </div>
                  <div>
                    <Shortcut>Esc</Shortcut>
                  </div>
                </div>
              </div>
            </FadeIn>
          </section>

          {/* Section: FAQ */}
          <section id="faq" className="scroll-mt-24">
            <FadeIn>
              <h2 className="mb-6 font-display text-[24px] font-bold text-ink-900 border-b border-border pb-2">5. Frequently Asked Questions</h2>
              
              <div className="flex flex-col gap-2">
                <FAQItem 
                  question="Where is my data stored? Is it private?" 
                  answer="GoalFlow uses local-first architecture. This means 100% of your goals, milestones, and notes are stored directly in your browser's LocalStorage. No data ever leaves your computer or is sent to a server. It is completely private."
                />
                <FAQItem 
                  question="How do streaks work?" 
                  answer="A streak increases every day you mark at least one milestone as 'done'. GoalFlow calculates this automatically in the background. Keep your momentum going to unlock badges in the Achievements tab!"
                />
                <FAQItem 
                  question="I accidentally deleted a goal. Can I get it back?" 
                  answer="Yes! Deleted goals are 'soft deleted' and moved to the Trash Bin. Click on 'Trash Bin' in the sidebar, find your goal, and click the Restore icon. It will return exactly to the column it was in previously."
                />
                <FAQItem 
                  question="What does the Factory Reset button do in Settings?" 
                  answer="The Factory Reset button wipes your LocalStorage completely and reloads the application with the default 'seed data' (the example goals you see when you first open the app). Warning: This cannot be undone."
                />
              </div>
            </FadeIn>
          </section>

        </div>
      </div>
    </div>
  )
}
