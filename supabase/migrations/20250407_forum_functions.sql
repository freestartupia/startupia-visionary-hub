
-- Function to check if a user has liked a post
CREATE OR REPLACE FUNCTION public.check_post_like(post_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM forum_post_likes
    WHERE post_id = post_id_param AND user_id = user_id_param
  );
END;
$$;

-- Function to check if a user has liked a reply
CREATE OR REPLACE FUNCTION public.check_reply_like(reply_id_param UUID, user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM forum_reply_likes
    WHERE reply_id = reply_id_param AND user_id = user_id_param
  );
END;
$$;

-- Function to toggle a post like and return the new status and count
CREATE OR REPLACE FUNCTION public.toggle_post_like(post_id_param UUID, user_id_param UUID)
RETURNS TABLE(liked BOOLEAN, new_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  like_exists BOOLEAN;
  current_count INTEGER;
BEGIN
  -- Check if the like already exists
  SELECT EXISTS (
    SELECT 1
    FROM forum_post_likes
    WHERE post_id = post_id_param AND user_id = user_id_param
  ) INTO like_exists;
  
  -- Get current like count
  SELECT likes FROM forum_posts
  WHERE id = post_id_param
  INTO current_count;
  
  IF current_count IS NULL THEN
    current_count := 0;
  END IF;
  
  IF like_exists THEN
    -- Remove the like
    DELETE FROM forum_post_likes
    WHERE post_id = post_id_param AND user_id = user_id_param;
    
    -- Decrement the count but don't go below 0
    current_count := GREATEST(0, current_count - 1);
    
    -- Update the post like count
    UPDATE forum_posts
    SET likes = current_count
    WHERE id = post_id_param;
    
    -- Return the new status
    liked := FALSE;
    new_count := current_count;
    RETURN NEXT;
  ELSE
    -- Add the like
    INSERT INTO forum_post_likes (post_id, user_id, created_at)
    VALUES (post_id_param, user_id_param, now());
    
    -- Increment the count
    current_count := current_count + 1;
    
    -- Update the post like count
    UPDATE forum_posts
    SET likes = current_count
    WHERE id = post_id_param;
    
    -- Return the new status
    liked := TRUE;
    new_count := current_count;
    RETURN NEXT;
  END IF;
END;
$$;

-- Function to toggle a reply like and return the new status and count
CREATE OR REPLACE FUNCTION public.toggle_reply_like(reply_id_param UUID, user_id_param UUID)
RETURNS TABLE(liked BOOLEAN, new_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  like_exists BOOLEAN;
  current_count INTEGER;
BEGIN
  -- Check if the like already exists
  SELECT EXISTS (
    SELECT 1
    FROM forum_reply_likes
    WHERE reply_id = reply_id_param AND user_id = user_id_param
  ) INTO like_exists;
  
  -- Get current like count
  SELECT likes FROM forum_replies
  WHERE id = reply_id_param
  INTO current_count;
  
  IF current_count IS NULL THEN
    current_count := 0;
  END IF;
  
  IF like_exists THEN
    -- Remove the like
    DELETE FROM forum_reply_likes
    WHERE reply_id = reply_id_param AND user_id = user_id_param;
    
    -- Decrement the count but don't go below 0
    current_count := GREATEST(0, current_count - 1);
    
    -- Update the reply like count
    UPDATE forum_replies
    SET likes = current_count
    WHERE id = reply_id_param;
    
    -- Return the new status
    liked := FALSE;
    new_count := current_count;
    RETURN NEXT;
  ELSE
    -- Add the like
    INSERT INTO forum_reply_likes (reply_id, user_id, created_at)
    VALUES (reply_id_param, user_id_param, now());
    
    -- Increment the count
    current_count := current_count + 1;
    
    -- Update the reply like count
    UPDATE forum_replies
    SET likes = current_count
    WHERE id = reply_id_param;
    
    -- Return the new status
    liked := TRUE;
    new_count := current_count;
    RETURN NEXT;
  END IF;
END;
$$;
