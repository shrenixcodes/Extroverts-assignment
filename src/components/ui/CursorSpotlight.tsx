import { useEffect, useRef } from 'react'

export function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let target = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    let current = { ...target }
    let rafId = 0

    function handleMove(event: PointerEvent) {
      target = { x: event.clientX, y: event.clientY }
    }
    window.addEventListener('pointermove', handleMove)

    function tick() {
      current.x += (target.x - current.x) * 0.1
      current.y += (target.y - current.y) * 0.1
      el!.style.setProperty('--spot-x', `${current.x}px`)
      el!.style.setProperty('--spot-y', `${current.y}px`)
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('pointermove', handleMove)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
      style={{
        background:
          'radial-gradient(480px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(255,255,255,0.05), transparent 65%)',
      }}
    />
  )
}
