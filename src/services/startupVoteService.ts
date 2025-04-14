
import { toggleStartupVote } from "./startup/voteService";

// Wrapper functions for backward compatibility
export const toggleStartupUpvote = (startupId: string) => toggleStartupVote({ startupId, isUpvote: true });
export const toggleStartupDownvote = (startupId: string) => toggleStartupVote({ startupId, isUpvote: false });

// Re-export the main function for direct use
export { toggleStartupVote };
