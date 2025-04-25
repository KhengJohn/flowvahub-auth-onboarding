import mongoose, { Schema, type Document } from "mongoose"
import "server-only"

export interface IOnboardingData extends Document {
  userId: mongoose.Types.ObjectId
  useCase: string
  categories: string[]
  tools: string[]
  name?: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

const OnboardingDataSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    useCase: {
      type: String,
      enum: ["track-tools", "organize-work", "discover-tools", "earn-rewards"],
      required: true,
    },
    categories: {
      type: [String],
      default: [],
    },
    tools: {
      type: [String],
      default: [],
    },
    name: {
      type: String,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// Use mongoose.models.OnboardingData to prevent model recompilation error
const OnboardingData =
  mongoose.models.OnboardingData || mongoose.model<IOnboardingData>("OnboardingData", OnboardingDataSchema)

export default OnboardingData
