import mongoose, { Schema, model } from 'mongoose';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  isVerified: boolean;
  contactNumber?: string;
  address?: string;
  emailVerificationToken?: string | null;
  emailVerificationExpires?: Date | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  isVerified: { type: Boolean, default: false },
  contactNumber: { type: String, default: '' },
  address: { type: String, default: '' },
  emailVerificationToken: { type: String, default: null },
  emailVerificationExpires: { type: Date, default: null },
  passwordResetToken: { type: String, default: null },
  passwordResetExpires: { type: Date, default: null }
});

// Ensure the schema is up to date in dev by resetting any
// previously compiled model before (re)creating it.
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export const User = model<IUser>('User', UserSchema);
