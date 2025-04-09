
import { SupabaseClient } from '@supabase/supabase-js';
import { toast } from 'sonner';

export interface LikeResponse {
  success: boolean;
  message: string;
  isLiked?: boolean;
  likeCount?: number;
}

export const handleToggleLike = async (
  supabase: SupabaseClient,
  table: string,
  field: string,
  id: string,
  userId: string
): Promise<LikeResponse> => {
  try {
    // Check if the user has already liked this item
    const { data: existingLike } = await supabase
      .from(table)
      .select('id')
      .eq(field, id)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike - remove the like
      const { error: deleteError } = await supabase
        .from(table)
        .delete()
        .eq(field, id)
        .eq('user_id', userId);

      if (deleteError) throw deleteError;

      return {
        success: true,
        message: 'Like removed successfully',
        isLiked: false,
      };
    } else {
      // Like - add a new like
      const { error: insertError } = await supabase
        .from(table)
        .insert({ [field]: id, user_id: userId });

      if (insertError) throw insertError;

      return {
        success: true,
        message: 'Liked successfully',
        isLiked: true,
      };
    }
  } catch (error) {
    console.error(`Error toggling like for ${table}:`, error);
    toast.error(`Une erreur est survenue. Veuillez réessayer.`);
    return {
      success: false,
      message: 'Error toggling like',
    };
  }
};
