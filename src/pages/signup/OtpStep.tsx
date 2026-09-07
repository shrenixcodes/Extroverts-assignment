import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { SignupLayout } from './SignupLayout'
import { OtpInput } from '../../components/ui/OtpInput'
import { Button } from '../../components/ui/Button'
import { useSignup } from '../../lib/SignupContext'
import { useToast } from '../../lib/ToastContext'
import { validateEmail, validateOtp } from '../../lib/validation'
import { OTP_LENGTH, RESEND_COOLDOWN_SECONDS, resendVerificationCode, verifyCode } from '../../lib/mockApi'

export function OtpStep() {
  const navigate = useNavigate()
  const { data, setEmailVerified } = useSignup()
  const { showToast } = useToast()

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

  if (validateEmail(data.email)) {
    return <Navigate to="/signup/email" replace />
  }

  function handleOtpChange(value: string) {
    setOtp(value)
    if (error) setError(null)
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (verifying) return

    const message = validateOtp(otp, OTP_LENGTH)
    if (message) {
      setError(message)
      return
    }

    setVerifying(true)
    try {
      await verifyCode(otp)
      setEmailVerified(true)
      navigate('/signup/profile-1')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed.')
      setOtp('')
    } finally {
      setVerifying(false)
    }
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
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Enter your code</h1>
        <p className="text-sm text-white/50">
          We sent a {OTP_LENGTH}-digit code to <span className="text-white/80">{data.email}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <OtpInput length={OTP_LENGTH} value={otp} onChange={handleOtpChange} error={error} disabled={verifying} />

        <Button type="submit" disabled={otp.length !== OTP_LENGTH} loading={verifying}>
          Verify
        </Button>

        <div className="text-center text-sm text-white/50">
          {cooldown > 0 ? (
            <span>Resend code in {cooldown}s</span>
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
