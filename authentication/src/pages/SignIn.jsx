import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <SignIn 
        routing="virtual"
        signUpUrl="/signup"
        afterSignInUrl="/dashboard"
      />
    </div>
  )
}
