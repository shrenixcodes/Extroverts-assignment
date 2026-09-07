interface PillGroupProps {
  label: string
  options: string[]
  value: string
  onChange: (value: string) => void
  error?: string | null
  name: string
}

export function PillGroup({ label, options, value, onChange, error, name }: PillGroupProps) {
  const errorId = `${name}-error`

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-white/90" id={`${name}-label`}>
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={`${name}-label`}
        aria-describedby={error ? errorId : undefined}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const selected = option === value
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(option)}
              className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-colors ${
                selected
                  ? 'border-white bg-white text-black'
                  : 'border-white/15 bg-white/5 text-white/80 hover:border-white/30'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-rose-400">
          {error}
        </p>
      )}
    </div>
  )
}
