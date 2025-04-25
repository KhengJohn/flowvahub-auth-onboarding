import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import { AuthForms } from "@/components/auth/auth-forms"

export default async function HomePage() {
  // Check if user is already logged in
  const token = cookies().get("token")?.value

  if (token) {
    try {
      const user = await verifyToken(token)
      if (user) {
        // User is authenticated, redirect to onboarding or dashboard
        redirect("/onboarding")
      }
    } catch (error) {
      // Invalid token, continue to auth page
      console.error("Token verification error:", error)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-light to-[#f5f5fa] p-4">
      <AuthForms />
    </main>
  )
}
