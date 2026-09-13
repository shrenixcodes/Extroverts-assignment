import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/ui/Logo'
import { Button } from '../components/ui/Button'
import { AmbientGlow } from '../components/ui/AmbientGlow'
import { useFocusHeading } from '../lib/useFocusHeading'

export function TermsPage() {
  const navigate = useNavigate()
  const headingRef = useFocusHeading<HTMLHeadingElement>('terms')

  return (
    <div className="relative flex min-h-dvh flex-col bg-black px-6 pt-[calc(env(safe-area-inset-top)+24px)] pb-[calc(env(safe-area-inset-bottom)+28px)] sm:px-10">
      <AmbientGlow />

      <header className="relative animate-fade-in">
        <Logo size="md" />
      </header>

      <main className="relative flex flex-1 flex-col justify-center gap-6 py-10">
        <h1
          ref={headingRef}
          className="animate-slide-up max-w-lg text-[1.9rem] font-black uppercase leading-[1.15] tracking-tight text-white outline-none sm:text-4xl [animation-delay:60ms]"
        >
          By using this app, you&rsquo;re agreeing to keep things fun, safe, and respectful
          &mdash; and also agreeing to our terms and conditions.
        </h1>
        <p className="animate-slide-up max-w-md text-base font-medium leading-relaxed text-white/60 [animation-delay:140ms]">
          Politeness is a must&mdash;treat others how you&rsquo;d want to be treated. Harassment,
          hate speech, and general bad vibes will get you shown the door.
        </p>
      </main>

      <div className="relative animate-slide-up flex flex-col gap-4 [animation-delay:220ms]">
        <p className="text-center text-xs text-white/40">
          By continuing, you accept our{' '}
          <span className="font-semibold text-white/70 underline underline-offset-2">
            Terms and Conditions
          </span>
        </p>
        <div className="mx-auto w-full max-w-sm">
          <Button onClick={() => navigate('/signup/email')}>Accept</Button>
        </div>
      </div>
    </div>
  )
}
