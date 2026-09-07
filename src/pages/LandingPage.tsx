import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/ui/Logo'
import { Button } from '../components/ui/Button'

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-fuchsia-600/50 blur-[110px]" />
        <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-violet-600/45 blur-[110px]" />
        <div className="absolute left-10 top-1/3 h-72 w-72 rounded-full bg-rose-500/40 blur-[100px]" />
        <div className="absolute -right-16 bottom-24 h-96 w-96 rounded-full bg-amber-400/30 blur-[120px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col px-6 pt-[calc(env(safe-area-inset-top)+28px)] pb-[calc(env(safe-area-inset-bottom)+28px)] sm:px-10">
        <header className="flex justify-center animate-fade-in">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm">
            <Logo size="lg" />
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
          <h1 className="animate-slide-up text-[2.6rem] leading-[1.05] font-black uppercase tracking-tight text-white sm:text-6xl [animation-delay:80ms]">
            An app only
            <br />
            for <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-amber-300">extroverts</span>
          </h1>

          <p className="animate-slide-up max-w-sm text-sm font-medium text-white/70 sm:text-base [animation-delay:160ms]">
            <span className="text-pink-300">Warning:</span> entering may lead to spontaneous
            dancing and unsolicited high-fives.
          </p>
        </main>

        <div className="mx-auto w-full max-w-sm animate-slide-up [animation-delay:240ms]">
          <Button onClick={() => navigate('/terms')}>Continue</Button>
        </div>
      </div>
    </div>
  )
}
