import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

// Temporary mock implementation until Convex is properly deployed
// Run 'npx convex dev' to generate the real API and replace this
export function useUserData() {
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Simulate API call with mock data
      setTimeout(() => {
        setUserData({
          userId: user.id,
          email: user.emailAddresses[0]?.emailAddress || "",
          paid: false,
          subscriptionId: null,
          imagesGenerated: 2,
          lastResetAt: new Date().toISOString(),
        });
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  return {
    userData,
    isLoading: isLoading && !!user,
    user,
  };
}

export function useImageGeneration() {
  const incrementGeneration = async (userId: string) => {
    console.log("Incrementing generation for user:", userId);
    return {
      imagesGenerated: 3,
      maxImages: 5,
      canGenerate: true
    };
  };

  const logGeneration = async (data: any) => {
    console.log("Logging generation:", data);
  };

  return {
    incrementGeneration,
    logGeneration
  };
}
