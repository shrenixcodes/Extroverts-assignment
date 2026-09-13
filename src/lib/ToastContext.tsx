import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

interface Toast {
  id: number
  message: string
  tone: 'error' | 'success'
  leaving: boolean
}

interface ToastContextValue {
  showToast: (message: string, tone?: Toast['tone']) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const AUTO_DISMISS_MS = 4500
const EXIT_DURATION_MS = 220

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const dismiss = useCallback(
    (id: number) => {
      setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)))
      window.setTimeout(() => remove(id), EXIT_DURATION_MS)
    },
    [remove],
  )

  const showToast = useCallback(
    (message: string, tone: Toast['tone'] = 'error') => {
      const id = idRef.current++
      setToasts((prev) => [...prev, { id, message, tone, leaving: false }])
      window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex flex-col items-center gap-2 px-4 pt-[calc(env(safe-area-inset-top)+16px)]"
        aria-live="assertive"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="alert"
            className={`pointer-events-auto w-full max-w-sm rounded-2xl border px-4 py-3 text-sm font-medium shadow-lg backdrop-blur-md transition-all duration-200 ease-in ${
              toast.leaving ? 'translate-y-[-8px] opacity-0' : 'animate-slide-up opacity-100'
            } ${
              toast.tone === 'error'
                ? 'border-rose-500/30 bg-rose-950/90 text-rose-100'
                : 'border-emerald-500/30 bg-emerald-950/90 text-emerald-100'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
