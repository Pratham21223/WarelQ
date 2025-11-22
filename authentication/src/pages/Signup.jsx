import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <SignUp 
        routing="virtual"
        signInUrl="/signin"
        afterSignUpUrl="/dashboard"
      />
    </div>
  )
}
