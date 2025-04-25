import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { verifyToken } from "@/lib/auth"
import { connectToDatabase } from "@/lib/db"
import OnboardingData from "@/models/OnboardingData"

export async function POST(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Verify token and get user
    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Get onboarding data from request
    const { useCase, categories, tools, name } = await request.json()

    // Connect to database
    await connectToDatabase()

    // Create or update onboarding data
    const onboardingData = await OnboardingData.findOneAndUpdate(
      { userId: user.id },
      {
        userId: user.id,
        useCase,
        categories,
        tools,
        name,
        completed: true,
      },
      { upsert: true, new: true },
    )

    return NextResponse.json({ success: true, data: onboardingData })
  } catch (error) {
    console.error("Onboarding API error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Verify token and get user
    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Connect to database
    await connectToDatabase()

    // Get onboarding data
    const onboardingData = await OnboardingData.findOne({ userId: user.id })

    return NextResponse.json({ success: true, data: onboardingData || null })
  } catch (error) {
    console.error("Onboarding API error:", error)
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
