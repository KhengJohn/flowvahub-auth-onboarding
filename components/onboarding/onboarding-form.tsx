"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  BarChart,
  Briefcase,
  Code,
  Compass,
  Headphones,
  Layers,
  MessageSquare,
  Palette,
  PenTool,
  Search,
  Users,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Tool data
const toolsByCategory = {
  design: ["Figma", "Adobe XD", "Sketch", "Canva", "Photoshop", "Illustrator"],
  development: ["VS Code", "GitHub", "GitLab", "Docker", "Postman", "AWS"],
  "ai-tools": ["ChatGPT", "Midjourney", "Bard", "Claude", "Stable Diffusion", "DALL-E"],
  crm: ["Salesforce", "HubSpot", "Zoho", "Pipedrive", "Freshsales", "Nimble"],
  "sales-marketing": ["Mailchimp", "ActiveCampaign", "ConvertKit", "Klaviyo", "Brevo", "Lemlist"],
  collaboration: ["Slack", "Microsoft Teams", "Discord", "Zoom", "Google Meet", "Webex"],
  "customer-support": ["Zendesk", "Intercom", "Freshdesk", "Help Scout", "LiveAgent", "Kayako"],
  "seo-analytics": ["Google Analytics", "SEMrush", "Ahrefs", "Moz", "Hotjar", "SimilarWeb"],
  "product-management": ["Jira", "Productboard", "Aha!", "Pendo", "Amplitude", "Roadmunk"],
  "project-management": ["Asana", "Trello", "ClickUp", "Monday.com", "Basecamp", "Wrike"],
}

// Demo content for each use case
const demoContents = {
  "track-tools": `
    <h3>Your Subscription Tracker</h3>
    <div class="demo-item">🔹 Notion - $8/month (next bill: May 15)</div>
    <div class="demo-item">🔹 Slack - $6.67/month (next bill: May 20)</div>
    <div class="demo-item">🔹 Canva - $12.99/month (next bill: June 1)</div>
    <p>We'll help you track renewal dates and identify savings opportunities.</p>
  `,
  "organize-work": `
    <h3>Your Work Dashboard</h3>
    <div class="demo-item">📌 Pinned: Notion workspace</div>
    <div class="demo-item">📌 Pinned: Slack channels</div>
    <div class="demo-item">📌 Pinned: Design assets</div>
    <p>All your tools organized by project and priority.</p>
  `,
  "discover-tools": `
    <h3>Tool Recommendations</h3>
    <div class="demo-item">⭐️ Recommended: Loom for async video</div>
    <div class="demo-item">⭐️ Recommended: Miro for collaboration</div>
    <div class="demo-item">⭐️ Recommended: Zapier for automation</div>
    <p>We'll suggest tools based on your workflow and needs.</p>
  `,
  "earn-rewards": `
    <h3>Rewards Dashboard</h3>
    <div class="demo-item">🎁 Earn 100 points for trying Figma</div>
    <div class="demo-item">🎁 Earn 50 points for completing daily tasks</div>
    <div class="demo-item">🎁 Redeem points for gift cards</div>
    <p>Get rewarded for being productive and exploring new tools.</p>
  `,
}

// Tool icon mapping
const getToolIcon = (tool: string) => {
  const iconMap: Record<string, string> = {
    Figma: "✏️",
    "Adobe XD": "🎨",
    Sketch: "🖌️",
    Canva: "🖼️",
    "VS Code": "💻",
    GitHub: "🐙",
    GitLab: "🦊",
    Docker: "🐳",
    ChatGPT: "🤖",
    Midjourney: "🖼️",
    Bard: "🔮",
    Claude: "🌀",
    Salesforce: "📊",
    HubSpot: "📈",
    Zoho: "📇",
    Pipedrive: "📞",
    Mailchimp: "✉️",
    ActiveCampaign: "📧",
    ConvertKit: "📨",
    Slack: "💬",
    "Microsoft Teams": "👥",
    Discord: "🎮",
    Zoom: "📹",
    Zendesk: "🛎️",
    Intercom: "💬",
    Freshdesk: "📞",
    "Google Analytics": "📊",
    SEMrush: "🔍",
    Ahrefs: "📈",
    Jira: "📝",
    Productboard: "📋",
    "Aha!": "💡",
    Asana: "✔️",
    Trello: "📋",
    ClickUp: "📌",
    "Monday.com": "📅",
  }

  return iconMap[tool] || "🔧"
}

// Category icon mapping
const getCategoryIcon = (category: string) => {
  switch (category) {
    case "design":
      return <Palette className="h-8 w-8" />
    case "development":
      return <Code className="h-8 w-8" />
    case "ai-tools":
      return <Layers className="h-8 w-8" />
    case "crm":
      return <Users className="h-8 w-8" />
    case "sales-marketing":
      return <BarChart className="h-8 w-8" />
    case "collaboration":
      return <MessageSquare className="h-8 w-8" />
    case "customer-support":
      return <Headphones className="h-8 w-8" />
    case "seo-analytics":
      return <Search className="h-8 w-8" />
    case "product-management":
      return <Briefcase className="h-8 w-8" />
    case "project-management":
      return <PenTool className="h-8 w-8" />
    default:
      return <Compass className="h-8 w-8" />
  }
}

type UseCase = "track-tools" | "organize-work" | "discover-tools" | "earn-rewards"

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [existingData, setExistingData] = useState<any>(null)
  const router = useRouter()

  // Check if user has already completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const response = await fetch("/api/onboarding")
        const result = await response.json()

        if (result.success && result.data) {
          setExistingData(result.data)

          // Pre-fill form with existing data
          if (result.data.useCase) setSelectedUseCase(result.data.useCase as UseCase)
          if (result.data.categories) setSelectedCategories(result.data.categories)
          if (result.data.tools) setSelectedTools(result.data.tools)
          if (result.data.name) setUserName(result.data.name)

          // If onboarding is already completed, redirect to dashboard
          if (result.data.completed) {
            router.push("/dashboard")
          }
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error)
      }
    }

    checkOnboardingStatus()
  }, [router])

  // Step navigation
  const nextStep = () => {
    if (currentStep === 2) {
      populateTools()
    }
    setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  // Use case selection
  const selectUseCase = (useCase: UseCase) => {
    setSelectedUseCase(useCase)
    nextStep()
  }

  // Category selection
  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category)
      } else {
        return [...prev, category]
      }
    })
  }

  // Tool selection
  const toggleTool = (tool: string) => {
    setSelectedTools((prev) => {
      if (prev.includes(tool)) {
        return prev.filter((t) => t !== tool)
      } else {
        return [...prev, tool]
      }
    })
  }

  // Get tools based on selected categories
  const populateTools = () => {
    if (selectedCategories.length === 0) return []

    // Get all tools from selected categories
    const toolsToShow: string[] = []
    selectedCategories.forEach((category) => {
      toolsByCategory[category as keyof typeof toolsByCategory].forEach((tool) => {
        if (!toolsToShow.includes(tool)) {
          toolsToShow.push(tool)
        }
      })
    })

    // Sort alphabetically
    return toolsToShow.sort()
  }

  // Complete onboarding
  const completeOnboarding = async () => {
    if (!selectedUseCase) {
      setMessage({ type: "error", text: "Please select a use case" })
      return
    }

    try {
      setIsLoading(true)
      setMessage({ type: "success", text: "Saving your preferences..." })

      const onboardingData = {
        useCase: selectedUseCase,
        categories: selectedCategories,
        tools: selectedTools,
        name: userName,
      }

      const response = await fetch("/api/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(onboardingData),
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: "success", text: "Onboarding completed successfully! Redirecting..." })
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 1500)
      } else {
        setMessage({ type: "error", text: result.message || "Failed to save preferences" })
      }
    } catch (error) {
      console.error("Onboarding error:", error)
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  // Skip to dashboard
  const skipToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <div className="mx-auto max-w-[600px] rounded-xl bg-white p-8 shadow-md">
      {message && (
        <Alert
          className={`mb-4 border-l-4 ${
            message.type === "error"
              ? "border-l-error bg-error/10 text-error"
              : "border-l-success bg-success/10 text-success"
          }`}
        >
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {/* Step 0: Welcome */}
      {currentStep === 0 && (
        <div className="flex min-h-[450px] animate-form flex-col">
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold text-[#9013FE]">Welcome to Flowva</h1>
            <p className="mt-4 text-gray-600">
              Let&apos;s get you set up in 30 seconds. First, tell us your main goal so we can personalize your
              experience.
            </p>
          </div>
          <div className="mt-8">
            <Button onClick={nextStep} className="w-full bg-[#9013FE] hover:bg-[#A29BFE]" disabled={isLoading}>
              Get Started
            </Button>
          </div>
        </div>
      )}

      {/* Step 1: Main Use Case */}
      {currentStep === 1 && (
        <div className="min-h-[450px] animate-form">
          <h2 className="text-2xl font-bold text-[#9013FE]">What&apos;s your main goal?</h2>
          <p className="mb-6 text-gray-600">Select one to see a personalized demo workspace</p>

          <div className="space-y-4">
            <div
              className={`cursor-pointer rounded-xl border p-6 transition-all hover:border-[#9013FE] hover:-translate-y-1 ${
                selectedUseCase === "track-tools" ? "border-[#9013FE] bg-[#A29BFE]/20" : ""
              }`}
              onClick={() => selectUseCase("track-tools")}
            >
              <h3 className="text-lg font-semibold">Track my tool subscriptions</h3>
              <p className="text-gray-600">See all my subscriptions in one place and reduce costs</p>
            </div>

            <div
              className={`cursor-pointer rounded-xl border p-6 transition-all hover:border-[#9013FE] hover:-translate-y-1 ${
                selectedUseCase === "organize-work" ? "border-[#9013FE] bg-[#A29BFE]/20" : ""
              }`}
              onClick={() => selectUseCase("organize-work")}
            >
              <h3 className="text-lg font-semibold">Organize my work tools</h3>
              <p className="text-gray-600">Manage all my work apps from a single dashboard</p>
            </div>

            <div
              className={`cursor-pointer rounded-xl border p-6 transition-all hover:border-[#9013FE] hover:-translate-y-1 ${
                selectedUseCase === "discover-tools" ? "border-[#9013FE] bg-[#A29BFE]/20" : ""
              }`}
              onClick={() => selectUseCase("discover-tools")}
            >
              <h3 className="text-lg font-semibold">Discover new tools</h3>
              <p className="text-gray-600">Get recommendations based on my needs</p>
            </div>

            <div
              className={`cursor-pointer rounded-xl border p-6 transition-all hover:border-[#9013FE] hover:-translate-y-1 ${
                selectedUseCase === "earn-rewards" ? "border-[#9013FE] bg-[#A29BFE]/20" : ""
              }`}
              onClick={() => selectUseCase("earn-rewards")}
            >
              <h3 className="text-lg font-semibold">Earn Rewards</h3>
              <p className="text-gray-600">Earn rewards for trying new tools and staying productive</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button onClick={skipToDashboard} className="text-sm text-gray-500 hover:text-[#9013FE]">
              Skip setup and go straight to my dashboard
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Categories of Interest */}
      {currentStep === 2 && (
        <div className="min-h-[450px] animate-form">
          <h2 className="text-2xl font-bold text-[#9013FE]">What categories of tools are you interested in?</h2>
          <p className="mb-6 text-gray-600">Select all that apply (you can change these later)</p>

          <div className="grid grid-cols-2 gap-4">
            {Object.keys(toolsByCategory).map((category) => (
              <div
                key={category}
                className={`flex cursor-pointer flex-col items-center rounded-xl border p-4 text-center transition-all hover:border-[#9013FE] hover:-translate-y-1 ${
                  selectedCategories.includes(category) ? "border-[#9013FE] bg-[#A29BFE]/20" : ""
                }`}
                onClick={() => toggleCategory(category)}
              >
                <div className="mb-2 text-[#9013FE]">{getCategoryIcon(category)}</div>
                <h3 className="text-lg font-semibold">
                  {category
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </h3>
                <p className="text-sm text-gray-600">
                  {category === "design" && "UI/UX, graphics, prototyping"}
                  {category === "development" && "Code, hosting, APIs"}
                  {category === "ai-tools" && "AI assistants, automation"}
                  {category === "crm" && "Customer relationship"}
                  {category === "sales-marketing" && "Outreach, campaigns"}
                  {category === "collaboration" && "Team communication"}
                  {category === "customer-support" && "Help desks, live chat"}
                  {category === "seo-analytics" && "Tracking, optimization"}
                  {category === "product-management" && "Roadmaps, feedback"}
                  {category === "project-management" && "Tasks, workflows"}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              onClick={nextStep}
              className="flex-1 bg-[#9013FE] hover:bg-[#A29BFE]"
              disabled={selectedCategories.length === 0 || isLoading}
            >
              Continue
            </Button>
            <Button
              onClick={prevStep}
              variant="outline"
              className="flex-1 border-[#9013FE] text-[#9013FE]"
              disabled={isLoading}
            >
              Back
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Specific Tools Selection */}
      {currentStep === 3 && (
        <div className="min-h-[450px] animate-form">
          <h2 className="text-2xl font-bold text-[#9013FE]">Which tools do you currently use?</h2>
          <p className="mb-6 text-gray-600">
            Select the tools you use regularly (we&apos;ll help track or find alternatives)
          </p>

          {selectedCategories.length === 0 ? (
            <p>Please select at least one category first</p>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {populateTools().map((tool) => (
                <div
                  key={tool}
                  className={`flex cursor-pointer flex-col items-center rounded-lg border p-3 text-center text-sm transition-all hover:border-[#9013FE] ${
                    selectedTools.includes(tool) ? "border-[#9013FE] bg-[#A29BFE]/20" : ""
                  }`}
                  onClick={() => toggleTool(tool)}
                >
                  <div className="mb-2 text-xl">{getToolIcon(tool)}</div>
                  {tool}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <Button onClick={nextStep} className="flex-1 bg-[#9013FE] hover:bg-[#A29BFE]" disabled={isLoading}>
              Continue
            </Button>
            <Button
              onClick={prevStep}
              variant="outline"
              className="flex-1 border-[#9013FE] text-[#9013FE]"
              disabled={isLoading}
            >
              Back
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Demo Preview */}
      {currentStep === 4 && selectedUseCase && (
        <div className="min-h-[450px] animate-form">
          <h2 className="text-2xl font-bold text-[#9013FE]">Your Personalized Workspace</h2>
          <p className="mb-6 text-gray-600">Here&apos;s what we&apos;ve prepared based on your selections:</p>

          <div className="rounded-xl border border-dashed bg-gray-50 p-4">
            <div dangerouslySetInnerHTML={{ __html: demoContents[selectedUseCase] }} />

            {selectedTools.length > 0 && (
              <>
                <h4 className="mt-6 font-medium">Based on your tools:</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedTools.map((tool) => (
                    <span key={tool} className="rounded bg-white px-2 py-1 text-sm shadow-sm">
                      {tool}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <Button onClick={nextStep} className="flex-1 bg-[#9013FE] hover:bg-[#A29BFE]" disabled={isLoading}>
              Looks great! Continue
            </Button>
            <Button
              onClick={prevStep}
              variant="outline"
              className="flex-1 border-[#9013FE] text-[#9013FE]"
              disabled={isLoading}
            >
              Make changes
            </Button>
          </div>
        </div>
      )}

      {/* Step 5: Quick Personalization */}
      {currentStep === 5 && (
        <div className="min-h-[450px] animate-form">
          <h2 className="text-2xl font-bold text-[#9013FE]">One Last Thing</h2>
          <p className="mb-6 text-gray-600">What should we call you? (Optional)</p>

          <Input
            type="text"
            placeholder="Your first name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="mb-6 border-gray-300 p-3 text-base"
          />

          <div className="mt-8 flex gap-4">
            <Button
              onClick={completeOnboarding}
              className="flex-1 bg-[#9013FE] hover:bg-[#A29BFE]"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Finish and Go to Dashboard"}
            </Button>
            <Button
              onClick={skipToDashboard}
              variant="outline"
              className="flex-1 border-[#9013FE] text-[#9013FE]"
              disabled={isLoading}
            >
              Skip
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
