export type UserId = string;

export interface User {
  id: UserId;
  name: string;
  avatar: string;
  role: string;
  kudos: number;
}

export type PollType = "text" | "image";
export type PollStatus = "active" | "closed" | "archived";

export interface PollSettings {
  allowComments: boolean;
  allowVoteChanges: boolean;
  anonymousVoting: boolean;
  randomiseOptions: boolean;
}

export interface TextOption {
  id: string;
  label: string;
  order: number;
}

export interface ImageOption {
  id: string;
  label: string;
  imageUrl: string;
  order: number;
}

export type PollOption = TextOption | ImageOption;

export function isImageOption(option: PollOption): option is ImageOption {
  return "imageUrl" in option;
}

export interface Poll {
  id: string;
  type: PollType;
  question: string;
  description: string;
  options: PollOption[];
  creatorId: UserId;
  boardId: string;
  tags: string[];
  durationDays: number;
  createdAt: Date;
  endsAt: Date;
  status: PollStatus;
  settings: PollSettings;
  impressions: number;
  isPinned: boolean;
}

export interface Vote {
  pollId: string;
  optionId: string;
  userId: UserId;
  votedAt: Date;
}

export interface Comment {
  id: string;
  pollId: string;
  userId: UserId;
  text: string;
  createdAt: Date;
}

export type ReactionType = "like" | "love" | "insightful" | "need_this";

export interface Reaction {
  pollId: string;
  userId: UserId;
  type: ReactionType;
}

export interface OptionBreakdown {
  optionId: string;
  label: string;
  votes: number;
  percentage: number;
}

export interface PollAnalytics {
  totalVotes: number;
  impressions: number;
  participationRate: number;
  commentCount: number;
  reactionCount: number;
  reportCount: number;
  engagementRate: number;
  optionBreakdown: OptionBreakdown[];
  hourlyActivity: { hour: number; votes: number }[];
}

export interface CreatePollFormData {
  type: PollType;
  question: string;
  description: string;
  options: { label: string; imageUrl?: string }[];
  boardId: string;
  durationDays: number;
  settings: PollSettings;
}
