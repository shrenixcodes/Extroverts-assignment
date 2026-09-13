import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo } from '../../components/ui/Logo'
import { BackButton } from '../../components/ui/BackButton'
import { ProgressIndicator } from '../../components/ui/ProgressIndicator'
import { AmbientGlow } from '../../components/ui/AmbientGlow'

const STEP_LABELS = ['Account', 'About You', 'Location', 'Finish Up']

interface SignupLayoutProps {
  step: number
  onBack?: () => void
  children: ReactNode
}

export function SignupLayout({ step, onBack, children }: SignupLayoutProps) {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-dvh flex-col bg-black px-6 pt-[calc(env(safe-area-inset-top)+20px)] pb-[calc(env(safe-area-inset-bottom)+24px)] sm:px-10">
      <AmbientGlow />

      <div className="relative mx-auto flex w-full max-w-md flex-1 flex-col">
        <header className="flex items-center justify-between">
          <BackButton onClick={onBack ?? (() => navigate(-1))} />
          <Logo size="sm" />
          <div className="w-10" aria-hidden="true" />
        </header>

        <div className="mt-6">
          <ProgressIndicator steps={STEP_LABELS} currentStep={step} />
        </div>

        <main key={step} className="animate-slide-up flex w-full flex-1 flex-col justify-center gap-8 py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
