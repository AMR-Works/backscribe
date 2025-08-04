import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useUserData() {
  const { user } = useUser();
  
  const userData = useQuery(
    api.users.getOrCreateUser,
    user ? {
      userId: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
    } : "skip"
  );

  return {
    userData,
    isLoading: userData === undefined && !!user,
    user,
  };
}

export function useImageGeneration() {
  const incrementGeneration = useMutation(api.users.incrementImageGeneration);
  const logGeneration = useMutation(api.analytics.logGeneration);

  return {
    incrementGeneration,
    logGeneration
  };
}