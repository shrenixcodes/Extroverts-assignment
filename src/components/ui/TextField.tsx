import { useId, type InputHTMLAttributes } from 'react'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string | null
  hint?: string
}

export function TextField({ label, error, hint, id, className = '', ...rest }: TextFieldProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = `${inputId}-error`
  const hintId = `${inputId}-hint`

  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(' ') || undefined

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={inputId} className="text-sm font-medium text-white/90">
        {label}
      </label>
      <input
        id={inputId}
        className={`h-14 w-full rounded-2xl border bg-white/5 px-4 text-base text-white placeholder:text-white/35 outline-none transition-colors focus:bg-white/[0.08] ${
          error ? 'border-rose-500/60' : 'border-white/15 focus:border-white/40'
        } ${className}`}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-white/40">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-rose-400">
          {error}
        </p>
      )}
    </div>
  )
}
