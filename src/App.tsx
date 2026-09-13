import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { SignupProvider } from './lib/SignupContext'
import { ToastProvider } from './lib/ToastContext'
import { CursorSpotlight } from './components/ui/CursorSpotlight'
import { LandingPage } from './pages/LandingPage'
import { TermsPage } from './pages/TermsPage'
import { EmailStep } from './pages/signup/EmailStep'
import { OtpStep } from './pages/signup/OtpStep'
import { ProfileStep1 } from './pages/signup/ProfileStep1'
import { ProfileStep2 } from './pages/signup/ProfileStep2'
import { ProfileStep3 } from './pages/signup/ProfileStep3'
import { SuccessPage } from './pages/signup/SuccessPage'

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <SignupProvider>
          <CursorSpotlight />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/signup/email" element={<EmailStep />} />
            <Route path="/signup/otp" element={<OtpStep />} />
            <Route path="/signup/profile-1" element={<ProfileStep1 />} />
            <Route path="/signup/profile-2" element={<ProfileStep2 />} />
            <Route path="/signup/profile-3" element={<ProfileStep3 />} />
            <Route path="/signup/success" element={<SuccessPage />} />
          </Routes>
        </SignupProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
