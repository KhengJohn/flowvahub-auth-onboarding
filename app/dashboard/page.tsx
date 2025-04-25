import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import OnboardingData from "@/models/OnboardingData"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  // Get token from cookies
  const cookieStore = await cookies()
  const token = cookieStore.get("token")?.value

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

    // Get onboarding data
    const onboardingData = await OnboardingData.findOne({ userId: user.id })

    // Convert Mongoose document to plain object
    const serializedData = onboardingData ? JSON.parse(JSON.stringify(onboardingData)) : null

    return (
      <main className="min-h-screen bg-[#F5F6FA] p-4">
        <DashboardContent user={user} onboardingData={serializedData || {}} />
      </main>
    )
  } catch (error) {
    console.error("Dashboard error:", error)
    redirect("/")
  }
}
