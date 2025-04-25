import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import OnboardingData from "@/models/OnboardingData";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";

export default async function OnboardingPage() {
  return (
    <main className="min-h-screen bg-[#F5F6FA] p-4">
      <OnboardingForm />
    </main>
  );
}
