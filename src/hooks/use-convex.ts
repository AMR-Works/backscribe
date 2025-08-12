import { useUser } from "@clerk/clerk-react";
import { useMemo } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useUserData() {
  const { user } = useUser();

  const args = useMemo(() => {
    if (!user) return undefined;
    return {
      userId: user.id,
      email: user.emailAddresses[0]?.emailAddress || "",
    };
  }, [user]);

  // When args is undefined, the query is skipped
  const userData = useQuery(api.users.getOrCreateUser, args as any);

  return {
    userData: userData ?? null,
    isLoading: !!user && userData === undefined,
    user,
  };
}

export function useImageGeneration() {
  const increment = useMutation(api.users.incrementImageGeneration);

  const incrementGeneration = async (userId: string) => {
    return await increment({ userId });
  };

  const logGeneration = async (data: any) => {
    // Optional: add a mutation to persist generation logs if needed
    console.log("Logging generation:", data);
  };

  return {
    incrementGeneration,
    logGeneration,
  };
}
