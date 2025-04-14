
-- Function to handle startup votes in a transaction
CREATE OR REPLACE FUNCTION public.handle_startup_vote(
  p_startup_id UUID,
  p_user_id UUID,
  p_is_upvote BOOLEAN,
  p_existing_vote_id UUID,
  p_was_upvote BOOLEAN
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_count INT;
  v_new_count INT;
  v_message TEXT;
  v_is_upvoted BOOLEAN;
BEGIN
  -- Get current vote count
  SELECT upvotes_count INTO v_current_count
  FROM public.startups
  WHERE id = p_startup_id;
  
  v_current_count := COALESCE(v_current_count, 0);
  v_new_count := v_current_count;
  v_is_upvoted := FALSE;
  
  -- Process the vote inside a transaction
  BEGIN
    -- Case 1: No existing vote - create new
    IF p_existing_vote_id IS NULL THEN
      INSERT INTO public.startup_votes(startup_id, user_id, is_upvote)
      VALUES (p_startup_id, p_user_id, p_is_upvote);
      
      -- Update count
      IF p_is_upvote THEN
        v_new_count := v_current_count + 1;
        v_message := 'Vote positif ajouté';
        v_is_upvoted := TRUE;
      ELSE
        v_new_count := GREATEST(0, v_current_count - 1);
        v_message := 'Vote négatif ajouté';
        v_is_upvoted := FALSE;
      END IF;
      
    -- Case 2: Existing vote with same type - remove it
    ELSIF p_was_upvote = p_is_upvote THEN
      DELETE FROM public.startup_votes
      WHERE id = p_existing_vote_id;
      
      -- Update count
      IF p_is_upvote THEN
        v_new_count := GREATEST(0, v_current_count - 1);
      ELSE
        v_new_count := v_current_count + 1;
      END IF;
      
      v_message := 'Vote retiré';
      v_is_upvoted := FALSE;
      
    -- Case 3: Existing vote with different type - change it
    ELSE
      UPDATE public.startup_votes
      SET is_upvote = p_is_upvote
      WHERE id = p_existing_vote_id;
      
      -- Update count
      IF p_is_upvote THEN
        -- From downvote to upvote: +2
        v_new_count := v_current_count + 2;
        v_message := 'Vote changé en positif';
        v_is_upvoted := TRUE;
      ELSE
        -- From upvote to downvote: -2
        v_new_count := GREATEST(0, v_current_count - 2);
        v_message := 'Vote changé en négatif';
        v_is_upvoted := FALSE;
      END IF;
    END IF;
    
    -- Update the startup's upvote count
    UPDATE public.startups
    SET upvotes_count = v_new_count
    WHERE id = p_startup_id;
    
    -- Return the result
    RETURN json_build_object(
      'message', v_message,
      'new_count', v_new_count,
      'is_upvoted', v_is_upvoted
    );
  END;
END;
$$;

-- Make sure users can execute this function
GRANT EXECUTE ON FUNCTION public.handle_startup_vote TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_startup_vote TO anon;
