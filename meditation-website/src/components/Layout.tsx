import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Subtle background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary-light/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-secondary-light/10 to-transparent blur-3xl" />
        <div className="absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-bl from-accent-light/8 to-transparent blur-3xl" />
      </div>

      <Navbar />

      <main className="flex-1 relative z-10">
        <Outlet />
      </main>

      <footer className="relative z-10 py-10 text-center border-t border-border-light bg-background-alt/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col items-center gap-4">
            {/* Footer Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-light/50 to-primary/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="8" className="opacity-60" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>

            <p className="text-text-muted text-sm">
              &copy; 2026 静心 Mindful. All rights reserved.
            </p>

            <p className="text-text-muted/60 text-xs">
              Crafted with care for your peace of mind
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
