import { useId, type SelectHTMLAttributes } from 'react'

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string | null
  placeholder: string
  options: string[]
}

export function SelectField({
  label,
  error,
  placeholder,
  options,
  id,
  className = '',
  value,
  ...rest
}: SelectFieldProps) {
  const generatedId = useId()
  const selectId = id ?? generatedId
  const errorId = `${selectId}-error`

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={selectId} className="text-sm font-medium text-white/90">
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          value={value}
          className={`h-14 w-full appearance-none rounded-2xl border bg-white/5 px-4 pr-11 text-base outline-none transition-colors focus:bg-white/[0.08] ${
            value ? 'text-white' : 'text-white/35'
          } ${error ? 'border-rose-500/60' : 'border-white/15 focus:border-white/40'} ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...rest}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-neutral-900 text-white">
              {option}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <path d="M5 7.5 10 12.5 15 7.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-rose-400">
          {error}
        </p>
      )}
    </div>
  )
}
