import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { verifyToken } from "@/lib/auth"
import { AuthForms } from "@/components/auth/auth-forms"

export default async function HomePage() { 
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-light to-[#f5f5fa] p-4">
      <AuthForms />
    </main>
  )
}
