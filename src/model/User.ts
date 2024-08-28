// Importing mongoose for schema creation
import mongoose, { Schema, Document } from "mongoose";

// Interface for Message model
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

// Schema for Message model
const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

// Interface for User model
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}

// Schema for User model
const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  verifyCode: {
    type: String,
    required: true,
  },
  verifyCodeExpiry: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    required: true,
  },
  messages: [MessageSchema],
});

// Create User model if it doesn't exist or use existing model with return type User
const UserModel =
  // use existing model if it exists
  (mongoose.models.User as mongoose.Model<User>) ||
  // create new model if it doesn't exist
  mongoose.model<User>("User", UserSchema);

// Export User model
export default UserModel;
