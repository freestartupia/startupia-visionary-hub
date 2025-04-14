
import { create } from 'zustand';

interface StartupVoteState {
  upvoted: boolean;
  downvoted: boolean;
  count: number;
}

interface StartupsStore {
  startupVotes: Record<string, StartupVoteState>;
  setStartupVotes: (updater: (prev: Record<string, StartupVoteState>) => Record<string, StartupVoteState>) => void;
}

export const useStartupsStore = create<StartupsStore>((set) => ({
  startupVotes: {},
  setStartupVotes: (updater) => set(state => ({ startupVotes: updater(state.startupVotes) })),
}));
