import { AuthForms } from "@/components/auth/auth-forms"

export default function AuthPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-light to-[#f5f5fa] p-4">
      <AuthForms />
    </main>
  )
}
