import { useEffect, useRef } from 'react'

export interface MeshBlob {
  color: string
  x: number
  y: number
  radiusFrac: number
  ampX: number
  ampY: number
  freq: number
  phase: number
  parallax: number
}

interface MeshCanvasProps {
  blobs: MeshBlob[]
  interactive?: boolean
  className?: string
}

export function MeshCanvas({ blobs, interactive = false, className = '' }: MeshCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !parent || !ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let rafId = 0
    const pointer = { x: 0.5, y: 0.5 }
    const pointerTarget = { x: 0.5, y: 0.5 }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = parent!.clientWidth
      height = parent!.clientHeight
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      canvas!.style.width = `${width}px`
      canvas!.style.height = `${height}px`
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(parent)

    function handlePointerMove(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect()
      pointerTarget.x = (event.clientX - rect.left) / rect.width
      pointerTarget.y = (event.clientY - rect.top) / rect.height
    }
    if (interactive) {
      window.addEventListener('pointermove', handlePointerMove)
    }

    function paint(time: number) {
      ctx!.clearRect(0, 0, width, height)
      ctx!.globalCompositeOperation = 'screen'

      pointer.x += (pointerTarget.x - pointer.x) * 0.035
      pointer.y += (pointerTarget.y - pointer.y) * 0.035
      const px = (pointer.x - 0.5) * 2
      const py = (pointer.y - 0.5) * 2
      const t = time / 1000

      for (const blob of blobs) {
        const floatX = Math.sin(t * blob.freq + blob.phase) * blob.ampX
        const floatY = Math.cos(t * blob.freq * 0.8 + blob.phase) * blob.ampY
        const parX = interactive ? px * blob.parallax * 0.05 : 0
        const parY = interactive ? py * blob.parallax * 0.05 : 0

        const cx = (blob.x + floatX + parX) * width
        const cy = (blob.y + floatY + parY) * height
        const r = blob.radiusFrac * width

        const gradient = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r)
        gradient.addColorStop(0, blob.color)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        ctx!.fillStyle = gradient
        ctx!.fillRect(cx - r, cy - r, r * 2, r * 2)
      }

      if (!reduceMotion) {
        rafId = requestAnimationFrame(paint)
      }
    }

    rafId = requestAnimationFrame(paint)

    return () => {
      cancelAnimationFrame(rafId)
      resizeObserver.disconnect()
      if (interactive) window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [blobs, interactive])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      aria-hidden="true"
    />
  )
}
