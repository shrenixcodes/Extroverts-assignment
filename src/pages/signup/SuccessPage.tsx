import { Navigate, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/ui/Logo'
import { Button } from '../../components/ui/Button'
import { useSignup } from '../../lib/SignupContext'

export function SuccessPage() {
  const navigate = useNavigate()
  const { data, emailVerified, resetSignup } = useSignup()

  if (!emailVerified || !data.college) {
    return <Navigate to="/signup/email" replace />
  }

  function handleDone() {
    resetSignup()
    navigate('/')
  }

  const firstName = data.fullName.split(' ')[0]

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-black px-6 pt-[calc(env(safe-area-inset-top)+24px)] pb-[calc(env(safe-area-inset-bottom)+28px)] text-center">
      <div className="animate-pop flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/5">
        <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9 text-white" aria-hidden="true">
          <path d="m5 13 4.5 4.5L19 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="animate-slide-up mt-8 flex flex-col items-center gap-3 [animation-delay:120ms]">
        <Logo size="md" />
        <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
          You&rsquo;re in{firstName ? `, ${firstName}` : ''}
        </h1>
        <p className="max-w-xs text-sm font-medium text-white/60">
          Your account is ready. Go make some noise&mdash;the extroverts are waiting.
        </p>
      </div>

      <div className="animate-slide-up mt-12 w-full max-w-sm [animation-delay:220ms]">
        <Button onClick={handleDone}>Done</Button>
      </div>
    </div>
  )
}
