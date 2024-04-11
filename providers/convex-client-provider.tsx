"use client";

/**
 * Wraps the entire application with authentication providers for Clerk and Convex.
 * Clerk is used for sign-up and login functionality, while Convex serves as the database authentication.
 * This integration ensures seamless authentication across the website.
 */

// Importing necessary modules for authentication and database interaction
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { AuthLoading, Authenticated, ConvexReactClient } from "convex/react";

import { Loading } from "@/components/auth/loading";

/**
 * Provides Convex client and authentication capabilities to the entire application.
 */

// Defining the type of children that ConvexClientProvider component will receive
interface ConvexClientProviderProps {
  children: React.ReactNode;
}

// Fetching the Convex URL from environment variables
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
// The '!' indicates assertion that the variable will not be null or undefined.

// Creating a Convex client instance
const convex = new ConvexReactClient(convexUrl);

// Exporting the ConvexClientProvider component
export const ConvexClientProvider = ({
  children,
}: ConvexClientProviderProps) => {
  return (
    <ClerkProvider>
      {/* Providing Convex client along with Clerk authentication */}
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>{children}</Authenticated>
        <AuthLoading>
          <Loading />
        </AuthLoading>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
