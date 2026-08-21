import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  age?: number;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [150, "Age is not realistic"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// Supports GET /users?age= without a collection scan once data grows.
userSchema.index({ age: 1 });

export const User = model<IUser>("User", userSchema);
