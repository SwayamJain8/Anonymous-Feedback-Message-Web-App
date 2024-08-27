// Import the full module of next-auth
import "next-auth";

// Import the DefaultSession from next-auth
import { DefaultSession } from "next-auth";

// Extend the User and Session with the new fields
declare module "next-auth" {
  // Little bit of modifying the User of next-auth according to our User model / needs
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
  // Little bit of modifying the user of the Session of next-auth according to our User model / needs
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
      username?: string;
    } & DefaultSession["user"]; // DefaultSession has user as a default key, to avoid errors
  }
}

// Modify the JWT of next-auth according to our User model / needs
declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    username?: string;
  }
}
