
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface LikeResponse {
  liked: boolean;
  newCount: number;
}

// Utility function to check authentication
export const checkAuthentication = async (): Promise<string> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error("User not authenticated:", userError);
    throw userError || new Error("User not authenticated");
  }
  
  return userData.user.id;
};

// Safe RPC call function that handles null response data
export const safeRpcCall = async <T>(
  functionName: string, 
  params: Record<string, any>
): Promise<T> => {
  const { data, error } = await supabase.rpc(functionName, params);
  
  if (error) {
    console.error(`Error calling RPC function ${functionName}:`, error);
    throw error;
  }
  
  // Handle potentially null data
  return (data as T) || ({ liked: false, new_count: 0 } as unknown as T);
};
