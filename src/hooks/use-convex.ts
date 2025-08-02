import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";

// Mock user data hook for now - will be replaced with actual Convex integration
export function useUserData() {
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Simulate API call
      setTimeout(() => {
        setUserData({
          userId: user.id,
          email: user.emailAddresses[0]?.emailAddress || "",
          paid: false,
          subscriptionId: null,
          imagesGenerated: 2, // Mock data
          lastResetAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
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
    user
  };
}

export function useImageGeneration() {
  const incrementGeneration = async (userId: string) => {
    // Mock function - will be replaced with Convex mutation
    console.log("Incrementing generation for user:", userId);
    return {
      imagesGenerated: 3,
      maxImages: 5,
      canGenerate: true
    };
  };

  const logGeneration = async (data: any) => {
    // Mock function - will be replaced with Convex mutation
    console.log("Logging generation:", data);
  };
  
  return {
    incrementGeneration,
    logGeneration
  };
}