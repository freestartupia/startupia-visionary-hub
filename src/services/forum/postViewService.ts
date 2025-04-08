
import { supabase } from "@/integrations/supabase/client";

// Function to increment the view count of a post
export const incrementPostViews = async (postId: string): Promise<void> => {
  try {
    const { data: post, error: getError } = await supabase
      .from('forum_posts')
      .select('views')
      .eq('id', postId)
      .single();
      
    if (getError) {
      console.error("Error fetching post views:", getError);
      return;
    }
    
    const newViewCount = (post.views || 0) + 1;
    
    const { error: updateError } = await supabase
      .from('forum_posts')
      .update({ views: newViewCount })
      .eq('id', postId);
      
    if (updateError) {
      console.error("Error updating views:", updateError);
    }
  } catch (error) {
    console.error("Error in incrementPostViews:", error);
  }
};
