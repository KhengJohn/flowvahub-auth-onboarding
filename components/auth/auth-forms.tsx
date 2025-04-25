"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Eye, EyeOff, LogIn, Mail, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Form schemas
const signInSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

const signUpSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
      .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

type FormType = "signin" | "signup" | "forgot"

export function AuthForms() {
  const [formType, setFormType] = useState<FormType>("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Sign In Form
  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // Sign Up Form
  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  // Forgot Password Form
  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength(null)
      return
    }

    let strength = 0

    // Length check
    if (password.length >= 8) strength++

    // Contains both lower and uppercase
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++

    // Contains numbers
    if (/[0-9]/.test(password)) strength++

    // Contains special chars
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    if (password.length < 6) {
      setPasswordStrength("weak")
    } else if (strength <= 2) {
      setPasswordStrength("medium")
    } else {
      setPasswordStrength("strong")
    }
  }

  // Form submission handlers
  const onSignInSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      setIsLoading(true)
      setMessage({ type: "success", text: "Signing in..." })

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "signin",
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: "success", text: "Welcome back! Redirecting..." })
        setTimeout(() => {
          router.push("/onboarding")
          router.refresh()
        }, 1000)
      } else {
        setMessage({ type: "error", text: result.message || "Invalid email or password" })
      }
    } catch (error) {
      console.error("Sign in error:", error)
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const onSignUpSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      setIsLoading(true)
      setMessage({ type: "success", text: "Creating your account..." })

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "signup",
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: "success", text: "Account created successfully! Welcome to Flowva." })
        setTimeout(() => {
          router.push("/onboarding")
          router.refresh()
        }, 1000)
      } else {
        setMessage({ type: "error", text: result.message || "Failed to create account" })
      }
    } catch (error) {
      console.error("Sign up error:", error)
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const onForgotPasswordSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    try {
      setIsLoading(true)
      setMessage({ type: "success", text: "Sending reset link..." })

      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reset",
          email: data.email,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setMessage({ type: "success", text: "Reset link sent to your email" })
      } else {
        setMessage({ type: "error", text: result.message || "Failed to send reset link" })
      }
    } catch (error) {
      console.error("Forgot password error:", error)
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle between forms
  const toggleForm = (type: FormType) => {
    setFormType(type)
    setMessage(null)
  }

  return (
    <div className="relative w-full max-w-[420px] overflow-hidden rounded-[var(--radius-lg)] bg-white p-10 shadow-[var(--shadow-md)]">
      <div className="absolute left-0 top-0 h-[6px] w-full bg-gradient-to-r from-[#7C4DFF] to-[#FF80AB]"></div>

      {/* Logo */}
      <div className="mb-8 flex items-center justify-center text-2xl font-bold text-[#7C4DFF]">
        <svg className="mr-2 h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
        Flowva
      </div>

      {/* Sign In Form */}
      {formType === "signin" && (
        <div className="animate-form">
          <h2 className="mb-8 text-center text-2xl font-semibold text-gray-700">Welcome back</h2>

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

          <Form {...signInForm}>
            <form onSubmit={signInForm.handleSubmit(onSignInSubmit)} className="space-y-4">
              <FormField
                control={signInForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        className="border-gray-300 bg-gray-50 px-4 py-3.5 text-base focus:bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signInForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="border-gray-300 bg-gray-50 px-4 py-3.5 text-base focus:bg-white"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-right">
                <button
                  type="button"
                  className="text-sm text-gray-600 transition-colors hover:text-[#7C4DFF]"
                  onClick={() => toggleForm("forgot")}
                >
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full gap-2 py-3.5 text-base bg-[#7C4DFF]" disabled={isLoading}>
                <LogIn size={18} />
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>

              <div className="relative my-6 flex items-center text-sm text-gray-600 before:flex-1 before:border-b before:border-gray-200 before:content-[''] after:flex-1 after:border-b after:border-gray-200 after:content-['']">
                <span className="mx-4">or continue with</span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 border-gray-300 py-3.5 text-base text-gray-700"
                disabled={isLoading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>

              <div className="mt-6 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-[#7C4DFF] transition-colors hover:underline"
                  onClick={() => toggleForm("signup")}
                >
                  Sign up
                </button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* Sign Up Form */}
      {formType === "signup" && (
        <div className="animate-form">
          <h2 className="mb-8 text-center text-2xl font-semibold text-gray-700">Join Flowva today</h2>

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

          <Form {...signUpForm}>
            <form onSubmit={signUpForm.handleSubmit(onSignUpSubmit)} className="space-y-4">
              <FormField
                control={signUpForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        className="border-gray-300 bg-gray-50 px-4 py-3.5 text-base focus:bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signUpForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="border-gray-300 bg-gray-50 px-4 py-3.5 text-base focus:bg-white"
                          onChange={(e) => {
                            field.onChange(e)
                            checkPasswordStrength(e.target.value)
                          }}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                        >
                          {showSignupPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>

                    {/* Password strength meter */}
                    {field.value && (
                      <>
                        <div className="mt-2 h-1 overflow-hidden rounded-sm bg-gray-200">
                          <div
                            className={`h-full transition-all ${
                              passwordStrength === "weak"
                                ? "w-1/3 bg-error"
                                : passwordStrength === "medium"
                                  ? "w-2/3 bg-[#FFC107]"
                                  : "w-full bg-success"
                            }`}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-600">
                          Use at least 8 characters with a mix of letters, numbers & symbols
                        </p>
                      </>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={signUpForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          {...field}
                          className="border-gray-300 bg-gray-50 px-4 py-3.5 text-base focus:bg-white"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full gap-2 py-3.5 text-base bg-[#7C4DFF]" disabled={isLoading}>
                <Package size={18} />
                {isLoading ? "Creating account..." : "Create account"}
              </Button>

              <div className="relative my-6 flex items-center text-sm text-gray-600 before:flex-1 before:border-b before:border-gray-200 before:content-[''] after:flex-1 after:border-b after:border-gray-200 after:content-['']">
                <span className="mx-4">or continue with</span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2 border-gray-300 py-3.5 text-base text-gray-700"
                disabled={isLoading}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>

              <div className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{" "}
                <button
                  type="button"
                  className="font-medium text-[#7C4DFF] transition-colors hover:underline"
                  onClick={() => toggleForm("signin")}
                >
                  Sign in
                </button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* Forgot Password Form */}
      {formType === "forgot" && (
        <div className="animate-form">
          <h2 className="mb-8 text-center text-2xl font-semibold text-gray-700">Reset your password</h2>

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

          <Form {...forgotPasswordForm}>
            <form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} className="space-y-4">
              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="you@example.com"
                        {...field}
                        className="border-gray-300 bg-gray-50 px-4 py-3.5 text-base focus:bg-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full gap-2 py-3.5 text-base" disabled={isLoading}>
                <Mail size={18} />
                {isLoading ? "Sending..." : "Send reset link"}
              </Button>

              <div className="mt-6 text-center text-sm text-gray-600">
                Remember your password?{" "}
                <button
                  type="button"
                  className="font-medium text-[#7C4DFF] transition-colors hover:underline"
                  onClick={() => toggleForm("signin")}
                >
                  Sign in
                </button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  )
}
