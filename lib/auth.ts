import jwt from "jsonwebtoken"
import "server-only"
import { connectToDatabase } from "./db"
import User from "@/models/User"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = "7d"

export interface UserData {
  id: string
  email: string
  name?: string
}

export async function signIn(email: string, password: string): Promise<{ user: UserData; token: string } | null> {
  try {
    await connectToDatabase()

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) return null

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) return null

    // Generate JWT token
    const token = generateToken(user)

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      token,
    }
  } catch (error) {
    console.error("Sign in error:", error)
    return null
  }
}

export async function signUp(email: string, password: string): Promise<{ user: UserData; token: string } | null> {
  try {
    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) return null

    // Create new user
    const user = await User.create({
      email,
      password,
      name: email.split("@")[0], // Default name from email
    })

    // Generate JWT token
    const token = generateToken(user)

    return {
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      token,
    }
  } catch (error) {
    console.error("Sign up error:", error)
    return null
  }
}

export async function resetPassword(email: string): Promise<boolean> {
  try {
    await connectToDatabase()

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) return false

    // In a real app, you would generate a reset token and send an email
    // For this demo, we'll just return true
    return true
  } catch (error) {
    console.error("Reset password error:", error)
    return false
  }
}

export async function verifyToken(token: string): Promise<UserData | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }

    await connectToDatabase()
    const user = await User.findById(decoded.id)

    if (!user) return null

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
    }
  } catch (error) {
    console.error("Verify token error:", error)
    return null
  }
}

// This function can be used in middleware without database access
export function verifyJWT(token: string): { id: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string }
  } catch (error) {
    return null
  }
}

function generateToken(user: any): string {
  return jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}
