import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react'

interface OtpInputProps {
  length: number
  value: string
  onChange: (value: string) => void
  error?: string | null
  disabled?: boolean
}

export function OtpInput({ length, value, onChange, error, disabled }: OtpInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const digits = Array.from({ length }, (_, index) => value[index] ?? '')
  const errorId = 'otp-error'

  function setDigit(index: number, digit: string) {
    const nextDigits = [...digits]
    nextDigits[index] = digit
    onChange(nextDigits.join(''))
  }

  function handleChange(index: number, rawInput: string) {
    const digit = rawInput.replace(/\D/g, '').slice(-1)
    setDigit(index, digit)
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace') {
      if (digits[index]) {
        setDigit(index, '')
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
        setDigit(index - 1, '')
      }
      event.preventDefault()
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (event.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    event.preventDefault()
    onChange(pasted)
    const nextIndex = Math.min(pasted.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <div>
      <div className="flex justify-between gap-2" role="group" aria-label="One-time verification code" aria-describedby={error ? errorId : undefined}>
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? 'one-time-code' : 'off'}
            pattern="\d*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={Boolean(error)}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            onFocus={(event) => event.target.select()}
            className={`h-14 w-12 flex-1 rounded-2xl border bg-white/5 text-center text-xl font-semibold text-white outline-none transition-colors focus:bg-white/[0.08] sm:w-14 ${
              error ? 'border-rose-500/60' : 'border-white/15 focus:border-white/50'
            } disabled:opacity-50`}
          />
        ))}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-xs font-medium text-rose-400">
          {error}
        </p>
      )}
    </div>
  )
}
