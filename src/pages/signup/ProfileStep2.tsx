import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { SignupLayout } from './SignupLayout'
import { SelectField } from '../../components/ui/SelectField'
import { PillGroup } from '../../components/ui/PillGroup'
import { Button } from '../../components/ui/Button'
import { useSignup } from '../../lib/SignupContext'
import { getCitiesForState, PRONOUN_OPTIONS, STATES } from '../../lib/locations'
import { validateCity, validateDob, validateFullName, validatePronouns, validateState } from '../../lib/validation'

export function ProfileStep2() {
  const navigate = useNavigate()
  const { data, updateData, emailVerified } = useSignup()

  const [pronouns, setPronouns] = useState(data.pronouns)
  const [state, setState] = useState(data.state)
  const [city, setCity] = useState(data.city)
  const [errors, setErrors] = useState<{ pronouns?: string | null; state?: string | null; city?: string | null }>({})
  const [touched, setTouched] = useState<{ pronouns?: boolean; state?: boolean; city?: boolean }>({})

  if (!emailVerified) {
    return <Navigate to="/signup/email" replace />
  }
  if (validateFullName(data.fullName) || validateDob(data.dob)) {
    return <Navigate to="/signup/profile-1" replace />
  }

  const cities = getCitiesForState(state)

  function handleStateChange(nextState: string) {
    setState(nextState)
    if (touched.state) setErrors((prev) => ({ ...prev, state: validateState(nextState) }))

    const availableCities = getCitiesForState(nextState)
    const cityStillValid = availableCities.includes(city)
    const nextCity = cityStillValid ? city : ''
    if (!cityStillValid) {
      setCity('')
      if (touched.city) setErrors((prev) => ({ ...prev, city: validateCity('') }))
    }
    updateData({ state: nextState, city: nextCity })
  }

  function handleCityChange(nextCity: string) {
    setCity(nextCity)
    updateData({ city: nextCity })
    if (touched.city) setErrors((prev) => ({ ...prev, city: validateCity(nextCity) }))
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setTouched({ pronouns: true, state: true, city: true })

    const pronounsError = validatePronouns(pronouns)
    const stateError = validateState(state)
    const cityError = validateCity(city)
    setErrors({ pronouns: pronounsError, state: stateError, city: cityError })
    if (pronounsError || stateError || cityError) return

    updateData({ pronouns, state, city })
    navigate('/signup/profile-3')
  }

  const isInvalid = Boolean(validatePronouns(pronouns) || validateState(state) || validateCity(city))

  return (
    <SignupLayout step={3} onBack={() => navigate('/signup/profile-1')}>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Where do we find you?</h1>
        <p className="text-sm text-white/50">Helps us match you with the right scene.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <PillGroup
          label="Pronouns"
          name="pronouns"
          options={PRONOUN_OPTIONS}
          value={pronouns}
          onChange={(next) => {
            setPronouns(next)
            updateData({ pronouns: next })
            setTouched((prev) => ({ ...prev, pronouns: true }))
            setErrors((prev) => ({ ...prev, pronouns: validatePronouns(next) }))
          }}
          error={touched.pronouns ? errors.pronouns : null}
        />

        <SelectField
          label="State"
          placeholder="Select your state"
          options={STATES}
          value={state}
          onChange={(event) => handleStateChange(event.target.value)}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, state: true }))
            setErrors((prev) => ({ ...prev, state: validateState(state) }))
          }}
          error={touched.state ? errors.state : null}
        />

        <SelectField
          label="City"
          placeholder={state ? 'Select your city' : 'Select a state first'}
          options={cities}
          value={city}
          disabled={!state}
          onChange={(event) => handleCityChange(event.target.value)}
          onBlur={() => {
            setTouched((prev) => ({ ...prev, city: true }))
            setErrors((prev) => ({ ...prev, city: validateCity(city) }))
          }}
          error={touched.city ? errors.city : null}
        />

        <Button type="submit" disabled={isInvalid} className="mt-2">
          Continue
        </Button>
      </form>
    </SignupLayout>
  )
}
