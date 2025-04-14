
-- Add is_upvote column to post_upvotes table
ALTER TABLE IF EXISTS public.post_upvotes
ADD COLUMN IF NOT EXISTS is_upvote BOOLEAN DEFAULT TRUE;

-- Create an index on post_id and user_id columns for faster lookups
CREATE INDEX IF NOT EXISTS post_upvotes_post_id_user_id_idx
ON public.post_upvotes (post_id, user_id);
