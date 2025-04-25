import mongoose, { Schema, type Document } from "mongoose"
import bcrypt from "bcryptjs"
import "server-only"

export interface IUser extends Document {
  email: string
  password: string
  name?: string
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    name: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Method to compare password
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

// Use mongoose.models.User to prevent model recompilation error
const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
