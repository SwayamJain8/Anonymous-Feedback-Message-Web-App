// "use client" is used
"use client";

// Importing SessionProvider from next-auth/react to provide the session to the app.
import { SessionProvider } from "next-auth/react";

// AuthProvider component is created to wrap the children components with SessionProvider.
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Returning the children wrapped with SessionProvider.
  return <SessionProvider>{children}</SessionProvider>;
}
