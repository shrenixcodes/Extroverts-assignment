import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { emptySignupData, type SignupData } from './types'

const STORAGE_KEY = 'extroverts.signup.v1'

interface SignupContextValue {
  data: SignupData
  updateData: (patch: Partial<SignupData>) => void
  emailVerified: boolean
  setEmailVerified: (value: boolean) => void
  resetSignup: () => void
}

const SignupContext = createContext<SignupContextValue | null>(null)

function loadPersisted(): { data: SignupData; emailVerified: boolean } {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return { data: emptySignupData, emailVerified: false }
    const parsed = JSON.parse(raw)
    return {
      data: { ...emptySignupData, ...parsed.data },
      emailVerified: Boolean(parsed.emailVerified),
    }
  } catch {
    return { data: emptySignupData, emailVerified: false }
  }
}

export function SignupProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SignupData>(() => loadPersisted().data)
  const [emailVerified, setEmailVerified] = useState<boolean>(() => loadPersisted().emailVerified)

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ data, emailVerified }))
  }, [data, emailVerified])

  const value = useMemo<SignupContextValue>(
    () => ({
      data,
      updateData: (patch) => setData((prev) => ({ ...prev, ...patch })),
      emailVerified,
      setEmailVerified,
      resetSignup: () => {
        setData(emptySignupData)
        setEmailVerified(false)
        sessionStorage.removeItem(STORAGE_KEY)
      },
    }),
    [data, emailVerified],
  )

  return <SignupContext.Provider value={value}>{children}</SignupContext.Provider>
}

export function useSignup(): SignupContextValue {
  const ctx = useContext(SignupContext)
  if (!ctx) throw new Error('useSignup must be used within a SignupProvider')
  return ctx
}
