import { useNavigate } from 'react-router-dom'
import { Logo } from '../components/ui/Logo'
import { Button } from '../components/ui/Button'
import { MeshCanvas, type MeshBlob } from '../components/ui/MeshCanvas'

const HERO_BLOBS: MeshBlob[] = [
  { color: 'rgba(217,70,239,0.55)', x: 0.12, y: 0.1, radiusFrac: 0.55, ampX: 0.05, ampY: 0.06, freq: 0.16, phase: 0, parallax: 1.1 },
  { color: 'rgba(124,58,237,0.5)', x: 0.88, y: 0.16, radiusFrac: 0.48, ampX: 0.06, ampY: 0.05, freq: 0.13, phase: 2.1, parallax: 0.7 },
  { color: 'rgba(244,63,94,0.45)', x: 0.22, y: 0.52, radiusFrac: 0.44, ampX: 0.05, ampY: 0.06, freq: 0.19, phase: 4.2, parallax: 1.3 },
  { color: 'rgba(251,191,36,0.35)', x: 0.82, y: 0.8, radiusFrac: 0.52, ampX: 0.06, ampY: 0.05, freq: 0.11, phase: 1.4, parallax: 0.5 },
]

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-black">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <MeshCanvas blobs={HERO_BLOBS} interactive className="blur-[90px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col overflow-y-auto px-6 pt-[calc(env(safe-area-inset-top)+28px)] pb-[calc(env(safe-area-inset-bottom)+28px)] [@media(max-height:480px)]:pt-[calc(env(safe-area-inset-top)+6px)] [@media(max-height:480px)]:pb-[calc(env(safe-area-inset-bottom)+6px)] sm:px-10">
        <header className="flex shrink-0 justify-center animate-fade-in [@media(max-height:480px)]:hidden">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-xl">
            <Logo size="lg" />
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center gap-6 text-center [@media(max-height:480px)]:gap-1.5">
          <h1 className="animate-slide-up text-[2.6rem] leading-[1.05] font-black uppercase tracking-tight text-white sm:text-6xl [@media(max-height:480px)]:text-xl [animation-delay:80ms]">
            An app only
            <br />
            for <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-amber-300">extroverts</span>
          </h1>

          <p className="animate-slide-up max-w-sm rounded-2xl border border-white/15 bg-white/[0.06] px-5 py-3.5 text-sm font-medium text-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl [@media(max-height:480px)]:px-3 [@media(max-height:480px)]:py-1 [@media(max-height:480px)]:text-xs sm:text-base [animation-delay:160ms]">
            <span className="text-pink-300">Warning:</span> entering may lead to spontaneous
            dancing and unsolicited high-fives.
          </p>
        </main>

        <div className="mx-auto w-full max-w-sm shrink-0 animate-slide-up [animation-delay:240ms]">
          <Button onClick={() => navigate('/terms')} className="[@media(max-height:480px)]:h-10">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
