'use client'

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Loading state
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black" />
      </div>
    )
  }

  // Not logged in
  if (!session) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold mb-8">
          Welcome to SkillTest Platform
        </h1>

        <p className="text-gray-600 mb-10">
          Take or manage skill assessments in seconds
        </p>

        <div className="space-x-4">
          <button
            onClick={() =>
              signIn("credentials", { callbackUrl: "/dashboard" })
            }
            className="px-6 py-3 bg-black text-white rounded hover:opacity-90"
          >
            Start Free Test
          </button>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="px-6 py-3 border rounded hover:bg-gray-50"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    )
  }

  // Logged in
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 text-center">
      <h1 className="text-3xl font-bold mb-8">
        Welcome back 👋
      </h1>

      <p className="text-gray-600 mb-10">
        You are already signed in
      </p>

      <button
        onClick={() => router.push("/dashboard")}
        className="px-6 py-3 bg-black text-white rounded hover:opacity-90"
      >
        Go to Dashboard
      </button>
    </div>
  )
}