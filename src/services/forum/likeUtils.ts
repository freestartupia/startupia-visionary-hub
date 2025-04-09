
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LikeResponse {
  success: boolean;
  message: string;
  liked: boolean;
  newCount: number;
}

// Function to check if a user is authenticated
export const checkAuthentication = async (): Promise<string | null> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    return userData.user?.id || null;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return null;
  }
};

// Safe RPC call with error handling
export const safeRpcCall = async <T>(
  functionName: string,
  params: Record<string, any>
): Promise<{ data: T | null; error: Error | null }> => {
  try {
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      console.error(`Error calling RPC function ${functionName}:`, error);
      return { data: null, error };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error(`Exception in RPC function ${functionName}:`, error);
    return { data: null, error: error as Error };
  }
};
