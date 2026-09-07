export interface SignupData {
  email: string
  fullName: string
  dob: string
  pronouns: string
  state: string
  city: string
  college: string
  bio: string
}

export const emptySignupData: SignupData = {
  email: '',
  fullName: '',
  dob: '',
  pronouns: '',
  state: '',
  city: '',
  college: '',
  bio: '',
}

export type AsyncStatus = 'idle' | 'loading' | 'error'
