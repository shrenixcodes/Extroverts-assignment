import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { Spinner } from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  loading?: boolean
  children: ReactNode
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className = '',
  onMouseMove,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  const base =
    'group relative flex h-14 w-full items-center justify-center overflow-hidden rounded-full text-base font-semibold transition-all duration-200 active:scale-[0.98] disabled:active:scale-100'

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-white text-black hover:bg-white/90 disabled:bg-white/30 disabled:text-black/40',
    ghost:
      'border border-white/25 bg-transparent text-white hover:bg-white/10 disabled:opacity-40',
  }

  const glow: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary: 'radial-gradient(140px circle at var(--mx,50%) var(--my,50%), rgba(0,0,0,0.14), transparent 70%)',
    ghost: 'radial-gradient(140px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.16), transparent 70%)',
  }

  function handleMouseMove(event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`)
    onMouseMove?.(event)
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${className}`}
      disabled={isDisabled}
      aria-busy={loading}
      onMouseMove={handleMouseMove}
      {...rest}
    >
      {!isDisabled && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glow[variant] }}
        />
      )}
      <span className={`relative ${loading ? 'invisible' : 'flex items-center gap-2'}`}>{children}</span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner className="h-5 w-5" />
        </span>
      )}
    </button>
  )
}
