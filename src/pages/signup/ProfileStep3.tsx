import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { SignupLayout } from './SignupLayout'
import { TextField } from '../../components/ui/TextField'
import { Button } from '../../components/ui/Button'
import { useSignup } from '../../lib/SignupContext'
import { useToast } from '../../lib/ToastContext'
import { validateBio, validateCity, validateCollege, validateState } from '../../lib/validation'
import { submitProfile } from '../../lib/mockApi'

export function ProfileStep3() {
  const navigate = useNavigate()
  const { data, updateData, emailVerified, setCompleted } = useSignup()
  const { showToast } = useToast()

  const [college, setCollege] = useState(data.college)
  const [bio, setBio] = useState(data.bio)
  const [errors, setErrors] = useState<{ college?: string | null; bio?: string | null }>({})
  const [touched, setTouched] = useState<{ college?: boolean; bio?: boolean }>({})
  const [submitting, setSubmitting] = useState(false)

  if (!emailVerified) {
    return <Navigate to="/signup/email" replace />
  }
  if (validateState(data.state) || validateCity(data.city)) {
    return <Navigate to="/signup/profile-2" replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (submitting) return

    setTouched({ college: true, bio: true })
    const collegeError = validateCollege(college)
    const bioError = validateBio(bio)
    setErrors({ college: collegeError, bio: bioError })
    if (collegeError || bioError) return

    setSubmitting(true)
    try {
      const finalData = { ...data, college: college.trim(), bio: bio.trim() }
      await submitProfile(finalData)
      updateData({ college: finalData.college, bio: finalData.bio })
      setCompleted(true)
      navigate('/signup/success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const isInvalid = Boolean(validateCollege(college) || validateBio(bio))

  return (
    <SignupLayout step={4} onBack={() => navigate('/signup/profile-2')}>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Almost there</h1>
        <p className="text-sm text-white/50">A little more about you.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <TextField
          label="College or workplace"
          type="text"
          autoComplete="organization"
          maxLength={80}
          placeholder="NYU, Stripe, freelance…"
          value={college}
          onChange={(event) => {
            setCollege(event.target.value)
            updateData({ college: event.target.value })
            if (touched.college) setErrors((prev) => ({ ...prev, college: validateCollege(event.target.value) }))
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, college: true }))
            setErrors((prev) => ({ ...prev, college: validateCollege(college) }))
          }}
          error={touched.college ? errors.college : null}
        />

        <TextField
          label="Bio (optional)"
          type="text"
          maxLength={160}
          placeholder="Loud laugh, louder playlists."
          value={bio}
          onChange={(event) => {
            setBio(event.target.value)
            updateData({ bio: event.target.value })
            if (touched.bio) setErrors((prev) => ({ ...prev, bio: validateBio(event.target.value) }))
          }}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, bio: true }))
            setErrors((prev) => ({ ...prev, bio: validateBio(bio) }))
          }}
          error={touched.bio ? errors.bio : null}
          hint={`${bio.trim().length}/160`}
        />

        <Button type="submit" disabled={isInvalid} loading={submitting} className="mt-2">
          Finish
        </Button>
      </form>
    </SignupLayout>
  )
}
