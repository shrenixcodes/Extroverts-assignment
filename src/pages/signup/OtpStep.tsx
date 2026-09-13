import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { SignupLayout } from './SignupLayout'
import { OtpInput } from '../../components/ui/OtpInput'
import { Button } from '../../components/ui/Button'
import { useSignup } from '../../lib/SignupContext'
import { useToast } from '../../lib/ToastContext'
import { useFocusHeading } from '../../lib/useFocusHeading'
import { validateEmail, validateOtp } from '../../lib/validation'
import { OTP_LENGTH, RESEND_COOLDOWN_SECONDS, resendVerificationCode, verifyCode } from '../../lib/mockApi'

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain || local.length === 0) return email
  if (local.length <= 2) return `${local[0]}${'*'.repeat(local.length)}@${domain}`
  return `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}@${domain}`
}

export function OtpStep() {
  const navigate = useNavigate()
  const { data, setEmailVerified } = useSignup()
  const { showToast } = useToast()
  const headingRef = useFocusHeading<HTMLHeadingElement>('otp')

  const [otp, setOtp] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [verifying, setVerifying] = useState(false)
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setInterval(() => setCooldown((prev) => prev - 1), 1000)
    return () => window.clearInterval(timer)
  }, [cooldown])

  const emailValid = !validateEmail(data.email)

  async function runVerification(code: string) {
    if (verifying) return
    const message = validateOtp(code, OTP_LENGTH)
    if (message) {
      setError(message)
      return
    }

    setVerifying(true)
    try {
      await verifyCode(code)
      setEmailVerified(true)
      navigate('/signup/profile-1')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed.')
      setOtp('')
    } finally {
      setVerifying(false)
    }
  }

  if (!emailValid) {
    return <Navigate to="/signup/email" replace />
  }

  function handleOtpChange(value: string) {
    setOtp(value)
    if (error) setError(null)
    if (value.length === OTP_LENGTH) {
      runVerification(value)
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    runVerification(otp)
  }

  async function handleResend() {
    if (resending || cooldown > 0) return
    setResending(true)
    try {
      await resendVerificationCode(data.email)
      setOtp('')
      setError(null)
      setCooldown(RESEND_COOLDOWN_SECONDS)
      showToast('A new code is on its way.', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not resend code.')
    } finally {
      setResending(false)
    }
  }

  return (
    <SignupLayout step={1} onBack={() => navigate('/signup/email')}>
      <div className="flex flex-col gap-2 text-center">
        <h1 ref={headingRef} className="text-2xl font-bold text-white outline-none sm:text-3xl">
          Enter your code
        </h1>
        <p className="text-sm text-white/50">
          We sent a {OTP_LENGTH}-digit code to <span className="text-white/80">{maskEmail(data.email)}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <OtpInput length={OTP_LENGTH} value={otp} onChange={handleOtpChange} error={error} disabled={verifying} />

        <Button type="submit" disabled={otp.length !== OTP_LENGTH} loading={verifying}>
          Verify
        </Button>

        <div className="flex flex-col items-center gap-2 text-sm text-white/50">
          {cooldown > 0 ? (
            <>
              <span>Resend code in {cooldown}s</span>
              <div className="h-1 w-24 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-white/40 transition-all duration-1000 ease-linear"
                  style={{ width: `${(cooldown / RESEND_COOLDOWN_SECONDS) * 100}%` }}
                />
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="font-semibold text-white underline underline-offset-4 disabled:opacity-50"
            >
              {resending ? 'Sending…' : 'Resend code'}
            </button>
          )}
        </div>
      </form>
    </SignupLayout>
  )
}
