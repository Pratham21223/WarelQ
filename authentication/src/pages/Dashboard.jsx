import { useUser, UserButton } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoaded && !user) {
      navigate('/signin')
    }
  }, [isLoaded, user, navigate])

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <UserButton afterSignOutUrl="/signin" />
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-xl mb-4">Welcome, {user?.firstName}!</h2>
        <p className="text-gray-600">Email: {user?.primaryEmailAddress?.emailAddress}</p>
      </main>
    </div>
  )
}
