import type { SignupData } from './types'

export const OTP_LENGTH = 6
export const TEST_OTP = '123456'
export const RESEND_COOLDOWN_SECONDS = 30

const NETWORK_DELAY_MS = 950

/**
 * Deterministic demo triggers so failure paths can be reproduced without a backend:
 * - email "fail@nubpack.club" -> code delivery fails
 * - name "Fail Case" -> final profile submission fails
 */
const FAIL_EMAIL = 'fail@nubpack.club'
const FAIL_NAME = 'fail case'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function sendVerificationCode(email: string): Promise<{ ok: true }> {
  await delay(NETWORK_DELAY_MS)
  if (email.trim().toLowerCase() === FAIL_EMAIL) {
    throw new Error("We couldn't send a code to that address. Please try again.")
  }
  return { ok: true }
}

export async function verifyCode(otp: string): Promise<{ ok: true }> {
  await delay(750)
  if (otp !== TEST_OTP) {
    throw new Error('That code isn’t right. Check the digits and try again.')
  }
  return { ok: true }
}

export async function resendVerificationCode(email: string): Promise<{ ok: true }> {
  await delay(700)
  if (email.trim().toLowerCase() === FAIL_EMAIL) {
    throw new Error("We couldn't resend the code. Please try again shortly.")
  }
  return { ok: true }
}

export async function submitProfile(data: SignupData): Promise<{ ok: true }> {
  await delay(NETWORK_DELAY_MS)
  if (data.fullName.trim().toLowerCase() === FAIL_NAME) {
    throw new Error("Something went wrong on our end. Let's try that again.")
  }
  return { ok: true }
}
