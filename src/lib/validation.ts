const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const MIN_AGE = 18
export const NAME_MAX_LENGTH = 60
export const COLLEGE_MAX_LENGTH = 80
export const BIO_MAX_LENGTH = 160

export function isBlank(value: string): boolean {
  return value.trim().length === 0
}

export function validateEmail(rawValue: string): string | null {
  const value = rawValue.trim()
  if (value.length === 0) return 'Enter your email to continue.'
  if (/\s/.test(rawValue.trim())) return 'Email cannot contain spaces.'
  if (!EMAIL_PATTERN.test(value)) return 'That email doesn’t look right.'
  return null
}

export function validateFullName(rawValue: string): string | null {
  const value = rawValue.trim()
  if (value.length === 0) return 'Tell us your name.'
  if (value.length < 2) return 'Name is too short.'
  if (value.length > NAME_MAX_LENGTH) return `Keep it under ${NAME_MAX_LENGTH} characters.`
  if (!/^[a-zA-Z\s'.-]+$/.test(value)) return 'Use letters, spaces, and basic punctuation only.'
  return null
}

export function calculateAge(dob: string): number | null {
  if (!dob) return null
  const birthDate = new Date(dob)
  if (Number.isNaN(birthDate.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1
  }
  return age
}

export function validateDob(rawValue: string): string | null {
  if (!rawValue) return 'Enter your date of birth.'
  const birthDate = new Date(rawValue)
  if (Number.isNaN(birthDate.getTime())) return 'Enter a valid date.'

  const today = new Date()
  if (birthDate > today) return 'That date is in the future.'

  const age = calculateAge(rawValue)
  if (age === null) return 'Enter a valid date.'
  if (age > 120) return 'Enter a valid date of birth.'
  if (age < MIN_AGE) return 'You must be 18 or older to join.'
  return null
}

export function validatePronouns(value: string): string | null {
  if (isBlank(value)) return 'Select your pronouns.'
  return null
}

export function validateState(value: string): string | null {
  if (isBlank(value)) return 'Select your state.'
  return null
}

export function validateCity(value: string): string | null {
  if (isBlank(value)) return 'Select your city.'
  return null
}

export function validateCollege(rawValue: string): string | null {
  const value = rawValue.trim()
  if (value.length === 0) return 'Tell us where you study or work.'
  if (value.length > COLLEGE_MAX_LENGTH) return `Keep it under ${COLLEGE_MAX_LENGTH} characters.`
  return null
}

export function validateBio(rawValue: string): string | null {
  if (rawValue.trim().length > BIO_MAX_LENGTH) return `Keep it under ${BIO_MAX_LENGTH} characters.`
  return null
}

export function validateOtp(digits: string, length: number): string | null {
  if (digits.length < length) return `Enter all ${length} digits.`
  if (!/^\d+$/.test(digits)) return 'Digits only, please.'
  return null
}
