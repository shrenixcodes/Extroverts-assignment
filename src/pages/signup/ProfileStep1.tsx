import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { SignupLayout } from './SignupLayout'
import { TextField } from '../../components/ui/TextField'
import { Button } from '../../components/ui/Button'
import { useSignup } from '../../lib/SignupContext'
import { validateDob, validateFullName } from '../../lib/validation'

const TODAY = new Date().toISOString().split('T')[0]

export function ProfileStep1() {
  const navigate = useNavigate()
  const { data, updateData, emailVerified } = useSignup()

  const [fullName, setFullName] = useState(data.fullName)
  const [dob, setDob] = useState(data.dob)
  const [errors, setErrors] = useState<{ fullName?: string | null; dob?: string | null }>({})
  const [touched, setTouched] = useState<{ fullName?: boolean; dob?: boolean }>({})

  if (!emailVerified) {
    return <Navigate to="/signup/email" replace />
  }

  function validateField(field: 'fullName' | 'dob', value: string) {
    const message = field === 'fullName' ? validateFullName(value) : validateDob(value)
    setErrors((prev) => ({ ...prev, [field]: message }))
    return message
  }

  function handleBlur(field: 'fullName' | 'dob') {
    setTouched((prev) => ({ ...prev, [field]: true }))
    validateField(field, field === 'fullName' ? fullName : dob)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setTouched({ fullName: true, dob: true })

    const nameError = validateField('fullName', fullName)
    const dobError = validateField('dob', dob)
    if (nameError || dobError) return

    updateData({ fullName: fullName.trim(), dob })
    navigate('/signup/profile-2')
  }

  const isInvalid = Boolean(validateFullName(fullName) || validateDob(dob))

  return (
    <SignupLayout step={2} onBack={() => navigate('/signup/otp')}>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Let&rsquo;s make it official</h1>
        <p className="text-sm text-white/50">Tell us your name and birthday.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <TextField
          label="Full name"
          type="text"
          autoComplete="name"
          maxLength={60}
          placeholder="Jordan Rivera"
          value={fullName}
          onChange={(event) => {
            setFullName(event.target.value)
            updateData({ fullName: event.target.value })
            if (touched.fullName) validateField('fullName', event.target.value)
          }}
          onBlur={() => handleBlur('fullName')}
          error={touched.fullName ? errors.fullName : null}
        />

        <TextField
          label="Date of birth"
          type="date"
          autoComplete="bday"
          max={TODAY}
          value={dob}
          onChange={(event) => {
            setDob(event.target.value)
            updateData({ dob: event.target.value })
            if (touched.dob) validateField('dob', event.target.value)
          }}
          onBlur={() => handleBlur('dob')}
          error={touched.dob ? errors.dob : null}
          hint="You must be 18 or older to join."
        />

        <Button type="submit" disabled={isInvalid} className="mt-2">
          Continue
        </Button>
      </form>
    </SignupLayout>
  )
}
