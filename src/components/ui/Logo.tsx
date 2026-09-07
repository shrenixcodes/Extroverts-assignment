interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASSES: Record<NonNullable<LogoProps['size']>, string> = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <span
      className={`select-none font-extrabold tracking-tight text-white ${SIZE_CLASSES[size]} ${className}`}
      aria-label="Extroverts"
    >
      E<span className="text-fuchsia-400">•</span>
    </span>
  )
}
