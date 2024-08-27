// Importing NextAuth from next-auth/next
import NextAuth from "next-auth/next";

// Importing authOptions from options.ts
import { authOptions } from "./options";

// Creating a handler method with NextAuth in which we'll pass all the authOptions created in options.ts
const handler = NextAuth(authOptions);

// Exporting the handler method as GET and POST for using further in routing purposes
export { handler as GET, handler as POST };
