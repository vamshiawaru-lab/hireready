"use client";

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from "react";
import type {
  UserId,
  User,
  Poll,
  Vote,
  Comment,
  Reaction,
  ReactionType,
  PollAnalytics,
  CreatePollFormData,
} from "@/types/poll";
import {
  MOCK_USERS,
  MOCK_POLLS,
  MOCK_VOTES,
  MOCK_COMMENTS,
  MOCK_REACTIONS,
  MOCK_HOURLY_ACTIVITY,
} from "@/data/mock";
import { generateId, calculatePercentage } from "@/lib/utils";

// --- State ---
interface PollState {
  currentUserId: UserId;
  users: User[];
  polls: Poll[];
  votes: Vote[];
  comments: Comment[];
  reactions: Reaction[];
}

// --- Actions ---
type Action =
  | { type: "SWITCH_USER"; userId: UserId }
  | { type: "CAST_VOTE"; pollId: string; optionId: string; userId: UserId }
  | { type: "CHANGE_VOTE"; pollId: string; newOptionId: string; userId: UserId }
  | { type: "CREATE_POLL"; poll: Poll }
  | { type: "CLOSE_POLL"; pollId: string }
  | { type: "ARCHIVE_POLL"; pollId: string }
  | { type: "ADD_COMMENT"; comment: Comment }
  | { type: "TOGGLE_REACTION"; pollId: string; userId: UserId; reactionType: ReactionType };

function reducer(state: PollState, action: Action): PollState {
  switch (action.type) {
    case "SWITCH_USER":
      return { ...state, currentUserId: action.userId };

    case "CAST_VOTE":
      return {
        ...state,
        votes: [
          ...state.votes,
          {
            pollId: action.pollId,
            optionId: action.optionId,
            userId: action.userId,
            votedAt: new Date(),
          },
        ],
      };

    case "CHANGE_VOTE":
      return {
        ...state,
        votes: [
          ...state.votes.filter(
            (v) => !(v.pollId === action.pollId && v.userId === action.userId)
          ),
          {
            pollId: action.pollId,
            optionId: action.newOptionId,
            userId: action.userId,
            votedAt: new Date(),
          },
        ],
      };

    case "CREATE_POLL":
      return { ...state, polls: [action.poll, ...state.polls] };

    case "CLOSE_POLL":
      return {
        ...state,
        polls: state.polls.map((p) =>
          p.id === action.pollId ? { ...p, status: "closed" as const } : p
        ),
      };

    case "ARCHIVE_POLL":
      return {
        ...state,
        polls: state.polls.map((p) =>
          p.id === action.pollId ? { ...p, status: "archived" as const } : p
        ),
      };

    case "ADD_COMMENT":
      return { ...state, comments: [...state.comments, action.comment] };

    case "TOGGLE_REACTION": {
      const existing = state.reactions.find(
        (r) =>
          r.pollId === action.pollId &&
          r.userId === action.userId &&
          r.type === action.reactionType
      );
      if (existing) {
        return {
          ...state,
          reactions: state.reactions.filter((r) => r !== existing),
        };
      }
      return {
        ...state,
        reactions: [
          ...state.reactions,
          {
            pollId: action.pollId,
            userId: action.userId,
            type: action.reactionType,
          },
        ],
      };
    }

    default:
      return state;
  }
}

// --- Context Value ---
interface PollContextValue extends PollState {
  switchUser: (userId: UserId) => void;
  castVote: (pollId: string, optionId: string) => void;
  changeVote: (pollId: string, newOptionId: string) => void;
  createPoll: (data: CreatePollFormData) => string;
  closePoll: (pollId: string) => void;
  archivePoll: (pollId: string) => void;
  addComment: (pollId: string, text: string) => void;
  toggleReaction: (pollId: string, reactionType: ReactionType) => void;
  getUserVote: (pollId: string) => Vote | undefined;
  hasUserVoted: (pollId: string) => boolean;
  getPollResults: (pollId: string) => { optionId: string; votes: number; percentage: number }[];
  getPollAnalytics: (pollId: string) => PollAnalytics;
  getPollComments: (pollId: string) => Comment[];
  getPollReactions: (pollId: string) => Reaction[];
  getCurrentUser: () => User;
  getUserById: (userId: UserId) => User | undefined;
}

const PollContext = createContext<PollContextValue | null>(null);

// --- Provider ---
const initialState: PollState = {
  currentUserId: "user-bob", // Start as "voter" persona
  users: MOCK_USERS,
  polls: MOCK_POLLS,
  votes: MOCK_VOTES,
  comments: MOCK_COMMENTS,
  reactions: MOCK_REACTIONS,
};

export function PollProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const switchUser = useCallback((userId: UserId) => {
    dispatch({ type: "SWITCH_USER", userId });
  }, []);

  const castVote = useCallback(
    (pollId: string, optionId: string) => {
      dispatch({
        type: "CAST_VOTE",
        pollId,
        optionId,
        userId: state.currentUserId,
      });
    },
    [state.currentUserId]
  );

  const changeVote = useCallback(
    (pollId: string, newOptionId: string) => {
      dispatch({
        type: "CHANGE_VOTE",
        pollId,
        newOptionId,
        userId: state.currentUserId,
      });
    },
    [state.currentUserId]
  );

  const createPoll = useCallback(
    (data: CreatePollFormData): string => {
      const id = generateId();
      const now = new Date();
      const poll: Poll = {
        id,
        type: data.type,
        title: data.title,
        question: data.question,
        description: data.description,
        options: data.options.map((opt, i) => ({
          id: generateId(),
          label: opt.label,
          order: i,
          ...(data.type === "image" && opt.imageUrl
            ? { imageUrl: opt.imageUrl }
            : {}),
        })),
        creatorId: state.currentUserId,
        boardId: data.boardId,
        tags: [],
        durationDays: data.durationDays,
        createdAt: now,
        endsAt: new Date(now.getTime() + data.durationDays * 24 * 60 * 60 * 1000),
        status: "active",
        settings: data.settings,
        impressions: 0,
        isPinned: false,
      };
      dispatch({ type: "CREATE_POLL", poll });
      return id;
    },
    [state.currentUserId]
  );

  const closePoll = useCallback((pollId: string) => {
    dispatch({ type: "CLOSE_POLL", pollId });
  }, []);

  const archivePoll = useCallback((pollId: string) => {
    dispatch({ type: "ARCHIVE_POLL", pollId });
  }, []);

  const addComment = useCallback(
    (pollId: string, text: string) => {
      dispatch({
        type: "ADD_COMMENT",
        comment: {
          id: generateId(),
          pollId,
          userId: state.currentUserId,
          text,
          createdAt: new Date(),
        },
      });
    },
    [state.currentUserId]
  );

  const toggleReaction = useCallback(
    (pollId: string, reactionType: ReactionType) => {
      dispatch({
        type: "TOGGLE_REACTION",
        pollId,
        userId: state.currentUserId,
        reactionType,
      });
    },
    [state.currentUserId]
  );

  const getUserVote = useCallback(
    (pollId: string): Vote | undefined => {
      return state.votes.find(
        (v) => v.pollId === pollId && v.userId === state.currentUserId
      );
    },
    [state.votes, state.currentUserId]
  );

  const hasUserVoted = useCallback(
    (pollId: string): boolean => {
      return state.votes.some(
        (v) => v.pollId === pollId && v.userId === state.currentUserId
      );
    },
    [state.votes, state.currentUserId]
  );

  const getPollResults = useCallback(
    (pollId: string) => {
      const poll = state.polls.find((p) => p.id === pollId);
      if (!poll) return [];
      const pollVotes = state.votes.filter((v) => v.pollId === pollId);
      const total = pollVotes.length;
      return poll.options.map((opt) => {
        const votes = pollVotes.filter((v) => v.optionId === opt.id).length;
        return {
          optionId: opt.id,
          votes,
          percentage: calculatePercentage(votes, total),
        };
      });
    },
    [state.polls, state.votes]
  );

  const getPollAnalytics = useCallback(
    (pollId: string): PollAnalytics => {
      const poll = state.polls.find((p) => p.id === pollId);
      const pollVotes = state.votes.filter((v) => v.pollId === pollId);
      const pollComments = state.comments.filter((c) => c.pollId === pollId);
      const pollReactions = state.reactions.filter((r) => r.pollId === pollId);
      const total = pollVotes.length;
      const impressions = poll?.impressions ?? 0;

      return {
        totalVotes: total,
        impressions,
        participationRate: impressions > 0 ? Math.round((total / impressions) * 100) : 0,
        commentCount: pollComments.length,
        reactionCount: pollReactions.length,
        reportCount: 0,
        engagementRate: Math.min(92, Math.round(((total + pollComments.length + pollReactions.length) / Math.max(impressions, 1)) * 100)),
        optionBreakdown: (poll?.options ?? []).map((opt) => {
          const votes = pollVotes.filter((v) => v.optionId === opt.id).length;
          return {
            optionId: opt.id,
            label: opt.label,
            votes,
            percentage: calculatePercentage(votes, total),
          };
        }),
        hourlyActivity: MOCK_HOURLY_ACTIVITY,
      };
    },
    [state.polls, state.votes, state.comments, state.reactions]
  );

  const getPollComments = useCallback(
    (pollId: string) => state.comments.filter((c) => c.pollId === pollId),
    [state.comments]
  );

  const getPollReactions = useCallback(
    (pollId: string) => state.reactions.filter((r) => r.pollId === pollId),
    [state.reactions]
  );

  const getCurrentUser = useCallback(
    () => state.users.find((u) => u.id === state.currentUserId)!,
    [state.users, state.currentUserId]
  );

  const getUserById = useCallback(
    (userId: UserId) => state.users.find((u) => u.id === userId),
    [state.users]
  );

  const value: PollContextValue = {
    ...state,
    switchUser,
    castVote,
    changeVote,
    createPoll,
    closePoll,
    archivePoll,
    addComment,
    toggleReaction,
    getUserVote,
    hasUserVoted,
    getPollResults,
    getPollAnalytics,
    getPollComments,
    getPollReactions,
    getCurrentUser,
    getUserById,
  };

  return <PollContext.Provider value={value}>{children}</PollContext.Provider>;
}

export function usePoll(): PollContextValue {
  const ctx = useContext(PollContext);
  if (!ctx) throw new Error("usePoll must be used within PollProvider");
  return ctx;
}
