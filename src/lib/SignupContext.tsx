import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { emptySignupData, type SignupData } from './types'

const STORAGE_KEY = 'extroverts.signup.v1'

interface PersistedState {
  data: SignupData
  emailVerified: boolean
  completed: boolean
}

interface SignupContextValue extends PersistedState {
  updateData: (patch: Partial<SignupData>) => void
  setEmailVerified: (value: boolean) => void
  setCompleted: (value: boolean) => void
  resetSignup: () => void
}

const SignupContext = createContext<SignupContextValue | null>(null)

function loadPersisted(): PersistedState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { data: emptySignupData, emailVerified: false, completed: false }
    const parsed = JSON.parse(raw)
    return {
      data: { ...emptySignupData, ...parsed.data },
      emailVerified: Boolean(parsed.emailVerified),
      completed: Boolean(parsed.completed),
    }
  } catch {
    return { data: emptySignupData, emailVerified: false, completed: false }
  }
}

export function SignupProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SignupData>(() => loadPersisted().data)
  const [emailVerified, setEmailVerified] = useState<boolean>(() => loadPersisted().emailVerified)
  const [completed, setCompleted] = useState<boolean>(() => loadPersisted().completed)

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ data, emailVerified, completed }))
  }, [data, emailVerified, completed])

  const value = useMemo<SignupContextValue>(
    () => ({
      data,
      updateData: (patch) => setData((prev) => ({ ...prev, ...patch })),
      emailVerified,
      setEmailVerified,
      completed,
      setCompleted,
      resetSignup: () => {
        setData(emptySignupData)
        setEmailVerified(false)
        setCompleted(false)
        sessionStorage.removeItem(STORAGE_KEY)
      },
    }),
    [data, emailVerified, completed],
  )

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
}

export function useSignup(): SignupContextValue {
  const ctx = useContext(SignupContext)
  if (!ctx) throw new Error('useSignup must be used within a SignupProvider')
  return ctx
}
