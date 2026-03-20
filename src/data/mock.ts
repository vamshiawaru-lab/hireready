import { User, Poll, Vote, Comment, Reaction } from "@/types/poll";

export const MOCK_USERS: User[] = [
  {
    id: "user-alice",
    name: "Alice Chen",
    avatar: "https://picsum.photos/seed/alice/100/100",
    role: "Community Leader",
    kudos: 2893,
  },
  {
    id: "user-bob",
    name: "Bob Martinez",
    avatar: "https://picsum.photos/seed/bob/100/100",
    role: "Member",
    kudos: 2413,
  },
  {
    id: "user-carol",
    name: "CarolineS",
    avatar: "https://picsum.photos/seed/carol/100/100",
    role: "Boss",
    kudos: 2084,
  },
  {
    id: "user-dan",
    name: "JasonHill",
    avatar: "https://picsum.photos/seed/dan/100/100",
    role: "Boss",
    kudos: 2098,
  },
  {
    id: "user-eve",
    name: "PerBonomi",
    avatar: "https://picsum.photos/seed/eve/100/100",
    role: "Boss",
    kudos: 2014,
  },
];

const now = new Date();
const twoDaysLater = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
const fiveDaysLater = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
const eighteenHoursLater = new Date(now.getTime() + 18 * 60 * 60 * 1000);
const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

export const MOCK_POLLS: Poll[] = [
  {
    id: "poll-1",
    type: "text",
    question: "What's your go-to trail running shoe brand for technical terrain?",
    description:
      "Is anyone else seeing a major spike in Community Traffic—Page Views, Visits, and Unique Visitors from Nov 11 to Nov 13 and going on..? This seems to have started after the 25.10 release. I'm curious ...",
    options: [
      { id: "opt-1a", label: "Solomon", order: 0 },
      { id: "opt-1b", label: "Hoka", order: 1 },
      { id: "opt-1c", label: "Altra", order: 2 },
      { id: "opt-1d", label: "La Sportiva", order: 3 },
      { id: "opt-1e", label: "Nike Trail", order: 4 },
    ],
    creatorId: "user-alice",
    boardId: "board-1",
    tags: ["COMMUNITIES AURORA", "COMMUNITIES CLASSIC", "PRODUCT UPDATES", "RELEASE NOTES"],
    durationDays: 7,
    createdAt: threeDaysAgo,
    endsAt: twoDaysLater,
    status: "active",
    settings: {
      allowComments: true,
      allowVoteChanges: false,
      anonymousVoting: false,
      randomiseOptions: false,
    },
    impressions: 689,
    isPinned: true,
  },
  {
    id: "poll-2",
    type: "text",
    question: "Which design system approach do you prefer for new projects?",
    description:
      "Trying to decide the best path forward for our team's next project.",
    options: [
      { id: "opt-2a", label: "Tailwind CSS + Custom Components", order: 0 },
      { id: "opt-2b", label: "Material UI / Ant Design", order: 1 },
      { id: "opt-2c", label: "Build from scratch", order: 2 },
      { id: "opt-2d", label: "Shadcn/ui + Radix", order: 3 },
    ],
    creatorId: "user-alice",
    boardId: "board-2",
    tags: ["Design & UX"],
    durationDays: 14,
    createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
    endsAt: fiveDaysLater,
    status: "active",
    settings: {
      allowComments: true,
      allowVoteChanges: false,
      anonymousVoting: false,
      randomiseOptions: false,
    },
    impressions: 689,
    isPinned: false,
  },
  {
    id: "poll-3",
    type: "image",
    question: "What's your go-to trail running shoe brand for technical terrain?",
    description:
      "Is anyone else seeing a major spike in Community Traffic—Page Views, Visits, and Unique Visitors from Nov 11 to Nov 13 and going on..? This seems to have started after the 25.10 release. I'm curious ...",
    options: [
      {
        id: "opt-3a",
        label: "Minimalist Light",
        imageUrl: "https://picsum.photos/seed/minimalist/400/300",
        order: 0,
      },
      {
        id: "opt-3b",
        label: "Dark & Bold",
        imageUrl: "https://picsum.photos/seed/darkbold/400/300",
        order: 1,
      },
    ],
    creatorId: "user-bob",
    boardId: "board-1",
    tags: ["COMMUNITIES AURORA", "COMMUNITIES CLASSIC", "PRODUCT UPDATES", "RELEASE NOTES"],
    durationDays: 7,
    createdAt: threeDaysAgo,
    endsAt: twoDaysLater,
    status: "active",
    settings: {
      allowComments: true,
      allowVoteChanges: false,
      anonymousVoting: false,
      randomiseOptions: false,
    },
    impressions: 542,
    isPinned: false,
  },
  {
    id: "poll-4",
    type: "image",
    question: "Which homepage design direction do you prefer for the Q1 update?",
    description: "We're exploring three visual directions for the homepage redesign.",
    options: [
      {
        id: "opt-4a",
        label: "Abstract Gradient",
        imageUrl: "https://picsum.photos/seed/gradient/400/300",
        order: 0,
      },
      {
        id: "opt-4b",
        label: "Flat Illustration",
        imageUrl: "https://picsum.photos/seed/flatillust/400/300",
        order: 1,
      },
      {
        id: "opt-4c",
        label: "Minimalist Line Art",
        imageUrl: "https://picsum.photos/seed/lineart/400/300",
        order: 2,
      },
    ],
    creatorId: "user-alice",
    boardId: "board-2",
    tags: ["Design & UX"],
    durationDays: 5,
    createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    endsAt: eighteenHoursLater,
    status: "active",
    settings: {
      allowComments: true,
      allowVoteChanges: true,
      anonymousVoting: false,
      randomiseOptions: false,
    },
    impressions: 320,
    isPinned: false,
  },
  {
    id: "poll-5",
    type: "text",
    question: "Which feature would most improve your community management workflow?",
    description: "Help us prioritize the next quarter's roadmap.",
    options: [
      { id: "opt-5a", label: "Advanced analytics dashboard", order: 0 },
      { id: "opt-5b", label: "AI-powered content moderation", order: 1 },
      { id: "opt-5c", label: "Custom member segments", order: 2 },
      { id: "opt-5d", label: "Automated engagement campaigns", order: 3 },
    ],
    creatorId: "user-carol",
    boardId: "board-1",
    tags: ["PRODUCT UPDATES"],
    durationDays: 10,
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
    endsAt: fiveDaysLater,
    status: "active",
    settings: {
      allowComments: true,
      allowVoteChanges: false,
      anonymousVoting: false,
      randomiseOptions: false,
    },
    impressions: 410,
    isPinned: false,
  },
];

// Pre-seed votes from OTHER users only — Bob (default user) starts fresh with no votes
export const MOCK_VOTES: Vote[] = [
  { pollId: "poll-1", optionId: "opt-1a", userId: "user-carol", votedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
  { pollId: "poll-1", optionId: "opt-1b", userId: "user-dan", votedAt: new Date(now.getTime() - 1.5 * 24 * 60 * 60 * 1000) },
  { pollId: "poll-1", optionId: "opt-1e", userId: "user-eve", votedAt: new Date(now.getTime() - 0.5 * 24 * 60 * 60 * 1000) },
  { pollId: "poll-2", optionId: "opt-2a", userId: "user-carol", votedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
  { pollId: "poll-2", optionId: "opt-2d", userId: "user-dan", votedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
  { pollId: "poll-2", optionId: "opt-2d", userId: "user-eve", votedAt: new Date(now.getTime() - 1.5 * 24 * 60 * 60 * 1000) },
  { pollId: "poll-2", optionId: "opt-2b", userId: "user-alice", votedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
  { pollId: "poll-3", optionId: "opt-3a", userId: "user-alice", votedAt: new Date(now.getTime() - 0.5 * 24 * 60 * 60 * 1000) },
  { pollId: "poll-3", optionId: "opt-3b", userId: "user-dan", votedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
  { pollId: "poll-3", optionId: "opt-3b", userId: "user-eve", votedAt: new Date(now.getTime() - 0.8 * 24 * 60 * 60 * 1000) },
  { pollId: "poll-4", optionId: "opt-4a", userId: "user-carol", votedAt: new Date(now.getTime() - 0.5 * 24 * 60 * 60 * 1000) },
  { pollId: "poll-4", optionId: "opt-4b", userId: "user-dan", votedAt: new Date(now.getTime() - 0.7 * 24 * 60 * 60 * 1000) },
  { pollId: "poll-4", optionId: "opt-4c", userId: "user-eve", votedAt: new Date(now.getTime() - 0.2 * 24 * 60 * 60 * 1000) },
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: "comment-1",
    pollId: "poll-1",
    userId: "user-bob",
    text: "Great question! I've been using Solomon for years on technical trails.",
    createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: "comment-2",
    pollId: "poll-1",
    userId: "user-carol",
    text: "Hoka has really improved their trail line recently.",
    createdAt: new Date(now.getTime() - 0.5 * 24 * 60 * 60 * 1000),
  },
  {
    id: "comment-3",
    pollId: "poll-1",
    userId: "user-dan",
    text: "La Sportiva for technical terrain, no question.",
    createdAt: new Date(now.getTime() - 0.3 * 24 * 60 * 60 * 1000),
  },
  {
    id: "comment-4",
    pollId: "poll-2",
    userId: "user-dan",
    text: "Shadcn/ui has been a game changer for our team.",
    createdAt: new Date(now.getTime() - 1.5 * 24 * 60 * 60 * 1000),
  },
];

export const MOCK_REACTIONS: Reaction[] = [
  { pollId: "poll-1", userId: "user-bob", type: "like" },
  { pollId: "poll-1", userId: "user-carol", type: "love" },
  { pollId: "poll-1", userId: "user-dan", type: "insightful" },
  { pollId: "poll-1", userId: "user-eve", type: "need_this" },
  { pollId: "poll-2", userId: "user-alice", type: "like" },
  { pollId: "poll-2", userId: "user-bob", type: "insightful" },
  { pollId: "poll-3", userId: "user-alice", type: "love" },
];

// Mock hourly activity data for analytics
export const MOCK_HOURLY_ACTIVITY = [
  { hour: 9, votes: 12 },
  { hour: 10, votes: 25 },
  { hour: 11, votes: 45 },
  { hour: 12, votes: 38 },
  { hour: 13, votes: 52 },
  { hour: 14, votes: 68 },
  { hour: 15, votes: 72 },
  { hour: 16, votes: 55 },
  { hour: 17, votes: 40 },
  { hour: 18, votes: 30 },
  { hour: 19, votes: 25 },
  { hour: 20, votes: 18 },
];

export const MOCK_BOARDS = [
  { id: "board-1", name: "Classic Community Platform" },
  { id: "board-2", name: "Design & UX" },
  { id: "board-3", name: "Product Updates" },
];
