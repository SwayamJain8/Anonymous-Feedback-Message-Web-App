// Import NextAuthOptions for type checking and intellisense
import { NextAuthOptions } from "next-auth";

// Import CredentialsProvider for the CredentialsProvider type definition
// (Other providers like GoogleProvider, FacebookProvider, etc. can also be used, but Credentialsprovider is little complex to setup)
import CredentialsProvider from "next-auth/providers/credentials";

// Import bcrypt to compare the password
import bcrypt from "bcryptjs";

// Import dbConnect function to connect to the database
import dbConnect from "@/lib/dbConnect";

// Import UserModel to interact with the user collection in the database
import UserModel from "@/model/User";

// Create and export the authOptions object with returned value of NextAuthOptions
export const authOptions: NextAuthOptions = {
  // Providers array with CredentialsProvider
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentioals",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // Authorize function to check the credentials and return the user
      async authorize(credentials: any): Promise<any> {
        // First connect to the database
        await dbConnect();

        try {
          // Find the user with the email or username
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });

          // If no user found, throw an error
          if (!user) {
            throw new Error("No user found");
          }

          // If the user is not verified, throw an error
          if (!user.isVerified) {
            throw new Error("Please verify your account before logging in");
          }

          // Check if the password is correct using bcrypt
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          // If the password is incorrect, throw an error
          if (!isPasswordCorrect) {
            throw new Error("Incorrect password");
          }

          // If everything is correct, return the user
          return user;
        } catch (error: any) {
          // If any error occurs, throw the error
          throw new Error(error);
        }
      },
    }),
  ],

  // Callbacks object to handle the JWT token and session which is used to set the user data in the token and session such that the user can stay logged in
  callbacks: {
    // Here user comes from the providers
    async jwt({ token, user }) {
      // If the user is found, set the token with the user data to store in the JWT token and return the token so that it can be stored in the session
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },
    // Here token comes from the jwt callback
    async session({ session, token }) {
      // If the token is found, set the session with the user data to store in the session and return the session so that the user can stay logged in
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
    // Because of this jwt and session callback, we have user in both the token as well as session which will help us to fetch the user data without making a database call
  },

  // Pages object for routing
  pages: {
    signIn: "/sign-in",
  },

  // Session object to set the session strategy
  session: {
    strategy: "jwt",
  },

  // Secret to encrypt the JWT token
  secret: process.env.NEXTAUTH_SECRET,
};
