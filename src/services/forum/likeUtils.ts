
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define the interface for like operation responses
export interface LikeResponse {
  liked: boolean;
  newCount: number;
}

// Utility function to check authentication
export async function checkAuthentication(): Promise<string> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  
  if (userError || !userData.user) {
    console.error("User not authenticated:", userError);
    throw userError || new Error("User not authenticated");
  }
  
  return userData.user.id;
}

/**
 * A type-safe wrapper for RPC calls
 * @param functionName Name of the Postgres function to call
 * @param params Parameters to pass to the function
 * @returns Result of the RPC call
 */
export async function safeRpcCall<T, P extends Record<string, any>>(
  functionName: string, 
  params: P
): Promise<{ data: T | null; error: PostgrestError | null }> {
  return supabase.rpc(functionName, params);
}

/**
 * Converts query string parameters to the correct types for RPC calls
 * @param postId Post ID from URL
 * @returns Properly typed post ID for RPC calls
 */
export function preparePostId(postId: string | undefined): string {
  if (!postId) {
    throw new Error("Post ID is required");
  }
  
  // Return the post ID as a string, which is compatible with the RPC function
  return postId;
}
