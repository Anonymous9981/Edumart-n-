"use client"

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

type NoticeTone = 'info' | 'success' | 'warning' | 'error'

interface Notice {
  id: number
  title: string
  message: string
  tone: NoticeTone
}

interface SiteFeedbackValue {
  notify: (notice: Omit<Notice, 'id'>) => void
  notifyInfo: (title: string, message: string) => void
  notifySuccess: (title: string, message: string) => void
  notifyWarning: (title: string, message: string) => void
}

const SiteFeedbackContext = createContext<SiteFeedbackValue | null>(null)

const TONE_STYLES: Record<NoticeTone, { panel: string; accent: string }> = {
  info: { panel: 'border-slate-200 bg-white text-slate-900', accent: 'bg-[#0B3558]' },
  success: { panel: 'border-emerald-200 bg-emerald-50 text-emerald-950', accent: 'bg-emerald-600' },
  warning: { panel: 'border-amber-200 bg-amber-50 text-amber-950', accent: 'bg-amber-500' },
  error: { panel: 'border-rose-200 bg-rose-50 text-rose-950', accent: 'bg-rose-600' },
}

export function SiteFeedbackProvider({ children }: { children: ReactNode }) {
  const [notices, setNotices] = useState<Notice[]>([])
  const sequenceRef = useRef(0)

  useEffect(() => {
    if (!notices.length) {
      return
    }

    const timers = notices.map((notice) =>
      window.setTimeout(() => {
        setNotices((current) => current.filter((entry) => entry.id !== notice.id))
      }, 3600),
    )

    return () => timers.forEach((timer) => window.clearTimeout(timer))
  }, [notices])

  const value = useMemo<SiteFeedbackValue>(() => {
    function notify(notice: Omit<Notice, 'id'>) {
      sequenceRef.current += 1
      const nextId = sequenceRef.current

      setNotices((current) => [...current, { ...notice, id: nextId }].slice(-3))
    }

    return {
      notify,
      notifyInfo: (title, message) => notify({ title, message, tone: 'info' }),
      notifySuccess: (title, message) => notify({ title, message, tone: 'success' }),
      notifyWarning: (title, message) => notify({ title, message, tone: 'warning' }),
    }
  }, [])

  return (
    <SiteFeedbackContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed bottom-4 right-4 z-[70] flex w-[min(92vw,24rem)] flex-col gap-3">
        {notices.map((notice) => {
          const styles = TONE_STYLES[notice.tone]

          return (
            <article key={notice.id} className={`pointer-events-auto rounded-2xl border p-4 shadow-2xl ${styles.panel}`} role="status" aria-live="polite">
              <div className="flex items-start gap-3">
                <span className={`mt-1 h-2.5 w-2.5 rounded-full ${styles.accent}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold">{notice.title}</p>
                  <p className="mt-1 text-sm leading-6 opacity-90">{notice.message}</p>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </SiteFeedbackContext.Provider>
  )
}

export function useSiteFeedback() {
  const context = useContext(SiteFeedbackContext)

  if (!context) {
    throw new Error('useSiteFeedback must be used within SiteFeedbackProvider')
  }

  return context
}