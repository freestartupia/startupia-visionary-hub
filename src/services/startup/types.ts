
import { UpvoteResponse } from "@/types/community";

export interface VoteOptions {
  startupId: string;
  isUpvote: boolean;
}

export interface ExistingVote {
  id: string;
  is_upvote: boolean;
}

export interface VoteResult {
  message: string;
  new_count: number;
  is_upvoted: boolean;
}
