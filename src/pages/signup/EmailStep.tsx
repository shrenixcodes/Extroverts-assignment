import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignupLayout } from './SignupLayout'
import { TextField } from '../../components/ui/TextField'
import { Button } from '../../components/ui/Button'
import { useSignup } from '../../lib/SignupContext'
import { useToast } from '../../lib/ToastContext'
import { validateEmail } from '../../lib/validation'
import { sendVerificationCode } from '../../lib/mockApi'
import { useFocusHeading } from '../../lib/useFocusHeading'

export function EmailStep() {
  const navigate = useNavigate()
  const { data, updateData } = useSignup()
  const { showToast } = useToast()
  const headingRef = useFocusHeading<HTMLHeadingElement>('email')

  const [email, setEmail] = useState(data.email)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function runValidation(value: string) {
    const message = validateEmail(value)
    setError(message)
    return message
  }

  function handleChange(value: string) {
    setEmail(value)
    updateData({ email: value })
    if (touched) runValidation(value)
  }

  function handleBlur() {
    setTouched(true)
    runValidation(email)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (submitting) return

    setTouched(true)
    const message = runValidation(email)
    if (message) return

    setSubmitting(true)
    try {
      const trimmed = email.trim()
      await sendVerificationCode(trimmed)
      updateData({ email: trimmed })
      navigate('/signup/otp')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const isInvalid = email.trim().length === 0 || Boolean(validateEmail(email))

  return (
    <SignupLayout step={1} onBack={() => navigate('/terms')}>
      <div className="flex flex-col gap-2 text-center">
        <h1 ref={headingRef} className="text-2xl font-bold text-white outline-none sm:text-3xl">
          What&rsquo;s your email?
        </h1>
        <p className="text-sm text-white/50">
          We&rsquo;ll send a code to keep your account secure.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <TextField
          label="Email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          placeholder="you@email.com"
          value={email}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={handleBlur}
          error={touched ? error : null}
          disabled={submitting}
        />

        <Button type="submit" disabled={isInvalid} loading={submitting}>
          Send code
        </Button>
      </form>
    </SignupLayout>
  )
}
