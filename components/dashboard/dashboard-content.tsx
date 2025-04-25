"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardContentProps {
  user: {
    id: string
    email: string
    name?: string
  }
  onboardingData: {
    useCase?: string
    categories?: string[]
    tools?: string[]
    name?: string
  }
}

export function DashboardContent({ user, onboardingData }: DashboardContentProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setIsLoading(true)

      await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "signout",
        }),
      })

      router.push("/auth")
      router.refresh()
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderDashboardContent = () => {
    switch (onboardingData?.useCase) {
      case "track-tools":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Your Subscription Tracker</CardTitle>
              <CardDescription>Track and manage your tool subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="rounded-md bg-white p-3 shadow-sm">🔹 Notion - $8/month (next bill: May 15)</div>
                <div className="rounded-md bg-white p-3 shadow-sm">🔹 Slack - $6.67/month (next bill: May 20)</div>
                <div className="rounded-md bg-white p-3 shadow-sm">🔹 Canva - $12.99/month (next bill: June 1)</div>
              </div>
            </CardContent>
          </Card>
        )

      case "organize-work":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Your Work Dashboard</CardTitle>
              <CardDescription>All your tools organized in one place</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="rounded-md bg-white p-3 shadow-sm">📌 Pinned: Notion workspace</div>
                <div className="rounded-md bg-white p-3 shadow-sm">📌 Pinned: Slack channels</div>
                <div className="rounded-md bg-white p-3 shadow-sm">📌 Pinned: Design assets</div>
              </div>
            </CardContent>
          </Card>
        )

      case "discover-tools":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Tool Recommendations</CardTitle>
              <CardDescription>Discover new tools based on your needs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="rounded-md bg-white p-3 shadow-sm">⭐️ Recommended: Loom for async video</div>
                <div className="rounded-md bg-white p-3 shadow-sm">⭐️ Recommended: Miro for collaboration</div>
                <div className="rounded-md bg-white p-3 shadow-sm">⭐️ Recommended: Zapier for automation</div>
              </div>
            </CardContent>
          </Card>
        )

      case "earn-rewards":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Rewards Dashboard</CardTitle>
              <CardDescription>Earn rewards for being productive</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="rounded-md bg-white p-3 shadow-sm">🎁 Earn 100 points for trying Figma</div>
                <div className="rounded-md bg-white p-3 shadow-sm">🎁 Earn 50 points for completing daily tasks</div>
                <div className="rounded-md bg-white p-3 shadow-sm">🎁 Redeem points for gift cards</div>
              </div>
            </CardContent>
          </Card>
        )

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Flowva</CardTitle>
              <CardDescription>Your personalized dashboard is being set up</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Complete the onboarding process to personalize your dashboard.</p>
              <Button onClick={() => router.push("/onboarding")} className="mt-4">
                Complete Onboarding
              </Button>
            </CardContent>
          </Card>
        )
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#9013FE]">Flowva Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {onboardingData?.name || user?.name || user?.email?.split("@")[0] || "User"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleSignOut} disabled={isLoading}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {renderDashboardContent()}

        <Card>
          <CardHeader>
            <CardTitle>Your Tools</CardTitle>
            <CardDescription>Tools you currently use</CardDescription>
          </CardHeader>
          <CardContent>
            {onboardingData?.tools && onboardingData.tools.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {onboardingData.tools.map((tool) => (
                  <span key={tool} className="rounded-full bg-[#9013FE]/10 px-3 py-1 text-sm text-[#9013FE]">
                    {tool}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tools selected yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
