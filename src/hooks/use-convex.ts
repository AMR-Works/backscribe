import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

export function useUserData() {
  const { user } = useUser();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      const email = user.emailAddresses[0]?.emailAddress || "";
      
      // Try to get user from Supabase
      let { data: existingUser, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user:', error);
      }

      // If user doesn't exist, create them
      if (!existingUser) {
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            email,
            clerk_user_id: user.id,
            paid: false,
            images_generated: 0,
            last_reset_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating user:', createError);
          // Fallback to mock data
          setUserData({
            userId: user.id,
            email,
            paid: false,
            subscriptionId: null,
            imagesGenerated: 0,
            lastResetAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
        } else {
          setUserData({
            userId: newUser.clerk_user_id,
            email: newUser.email,
            paid: newUser.paid,
            subscriptionId: newUser.subscription_id,
            imagesGenerated: newUser.images_generated,
            lastResetAt: newUser.last_reset_at,
            createdAt: newUser.created_at,
            updatedAt: newUser.updated_at,
          });
        }
      } else {
        setUserData({
          userId: existingUser.clerk_user_id,
          email: existingUser.email,
          paid: existingUser.paid,
          subscriptionId: existingUser.subscription_id,
          imagesGenerated: existingUser.images_generated,
          lastResetAt: existingUser.last_reset_at,
          createdAt: existingUser.created_at,
          updatedAt: existingUser.updated_at,
        });
      }
    } catch (error) {
      console.error('Error in fetchUserData:', error);
      // Fallback to mock data
      setUserData({
        userId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        paid: false,
        subscriptionId: null,
        imagesGenerated: 0,
        lastResetAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    userData,
    isLoading: isLoading && !!user,
    user,
    refetchUserData: fetchUserData
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