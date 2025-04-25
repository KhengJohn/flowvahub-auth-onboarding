import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import OnboardingData from "@/models/OnboardingData"
import { OnboardingForm } from "@/components/onboarding/onboarding-form"

export default async function OnboardingPage() {
  // Check if user is authenticated
  const token = cookies().get("token")?.value

  if (!token) {
    redirect("/")
  }

  try {
    // Verify token and get user
    const user = await verifyToken(token)

    if (!user) {
      redirect("/")
    }

    // Connect to database
    await connectToDatabase()

    // Check if user has already completed onboarding
    const onboardingData = await OnboardingData.findOne({ userId: user.id })

    if (onboardingData?.completed) {
      // User has already completed onboarding, redirect to dashboard
      redirect("/dashboard")
    }

    return (
      <main className="min-h-screen bg-[#F5F6FA] p-4">
        <OnboardingForm />
      </main>
    )
  } catch (error) {
    console.error("Onboarding page error:", error)
    redirect("/")
  }
}
