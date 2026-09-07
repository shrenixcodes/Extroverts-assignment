# Extroverts — Onboarding

A high-fidelity, responsive recreation of the Extroverts signup and onboarding
experience: an immersive landing screen, a terms acceptance step, and a
progressive four-step signup wizard with email verification, OTP, and profile
capture.

This is a frontend-only build. There is no backend, database, or third-party
auth/OTP/email provider — all network behavior is simulated locally with
realistic delays and deterministic success/failure outcomes so every flow can
be exercised and demoed without external services.

## Key features

- **Immersive landing screen** — full-bleed abstract gradient background,
  bold uppercase headline, and a single primary call to action.
- **Terms onboarding screen** — black full-screen layout with the product's
  typographic voice, distinct from a conventional legal page.
- **Progressive four-step signup wizard**
  1. **Account** — email entry and OTP verification
  2. **About You** — full name and date of birth
  3. **Location** — pronouns, state, and city (with live state → city
     dependency)
  4. **Finish Up** — college/workplace and an optional bio
- **Centralized wizard state** shared across steps via React context and
  mirrored to `sessionStorage`, so back navigation, page refresh, and the
  browser back/forward buttons never lose already-entered data.
- **Real client-side validation** — trimmed input, whitespace-only rejection,
  format checks, character limits, and a hard 18+ age gate with a clear,
  respectful message.
- **Simulated network layer** (`src/lib/mockApi.ts`) with realistic delays,
  loading states, duplicate-submission prevention, and deterministic failure
  paths for demoing error handling without a backend.
- **Toast + inline error system** for global and field-level feedback.
- **Accessible by default** — semantic form controls, labels, `aria-describedby`
  error associations, visible focus states, and `prefers-reduced-motion`
  support.

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for tooling and dev server
- [React Router](https://reactrouter.com/) for route-driven wizard navigation
- [Tailwind CSS v4](https://tailwindcss.com/) for styling
- [Oxlint](https://oxc.rs/) for linting

No state management library, animation library, or UI kit was added — wizard
state uses plain React context, and transitions are handled with CSS
animations already defined in `src/index.css`.

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:5173`.

### Production build

```bash
npm run build
npm run preview
```

`npm run build` runs a full TypeScript project build (`tsc -b`) followed by
the Vite production build.

### Linting

```bash
npm run lint
```

## Demo behavior

Because there is no real backend, the following flows are simulated
deterministically so they can be verified during review:

| Scenario | How to trigger |
| --- | --- |
| OTP verification | Enter `123456` to verify successfully. Any other 6-digit code shows the "incorrect code" error. |
| Email send/resend failure | Enter `fail@nubpack.club` as the email address. |
| Final profile submission failure | Enter `Fail Case` as the full name on the "About You" step. |
| Age gate | Any date of birth resulting in an age under 18 is blocked with "You must be 18 or older to join." before the user can proceed. |

All other inputs follow the normal success path with a simulated network
delay.

## Project structure

```
src/
  components/ui/       Reusable, presentational UI primitives
                        (Button, TextField, SelectField, PillGroup,
                        OtpInput, ProgressIndicator, Toast, Logo, ...)
  lib/
    types.ts            Shared signup data shape
    validation.ts       All field-level validation rules
    locations.ts        State → city dataset and pronoun options
    mockApi.ts           Simulated async network layer
    SignupContext.tsx    Centralized wizard state (persisted per session)
    ToastContext.tsx     Global toast/banner feedback system
  pages/
    LandingPage.tsx
    TermsPage.tsx
    signup/
      SignupLayout.tsx   Shared wizard chrome (back button, progress, logo)
      EmailStep.tsx
      OtpStep.tsx
      ProfileStep1.tsx   Name + date of birth
      ProfileStep2.tsx   Pronouns + state + city
      ProfileStep3.tsx   College/workplace + bio, final submission
      SuccessPage.tsx
  App.tsx                Route definitions and provider composition
```

Each wizard step is guarded: attempting to load a step directly (e.g. by URL)
without valid data from the preceding step redirects back to the appropriate
point in the flow, so the wizard cannot be bypassed with invalid or missing
data.

## Notes

- Signup state lives in `sessionStorage` for the duration of the browser tab
  session and is cleared once the flow completes (or can be reset from the
  success screen).
- The four-step progress indicator groups email entry and OTP verification
  under a single "Account" step, reflecting that both are part of verifying
  a single email address before profile capture begins.
