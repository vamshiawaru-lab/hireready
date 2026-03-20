"use client";

import { usePoll } from "@/context/PollContext";
import { isImageOption } from "@/types/poll";
import type { Poll, TextOption, ImageOption } from "@/types/poll";
import { TextPollOptions } from "./TextPollOptions";
import { TextPollResults } from "./TextPollResults";
import { ImagePollOptions } from "./ImagePollOptions";
import { ImagePollResults } from "./ImagePollResults";
import { PollFooter } from "./PollFooter";
import { ReactionBar } from "./ReactionBar";

interface PollCardProps {
  poll: Poll;
  index?: number;
}

export function PollCard({ poll, index = 0 }: PollCardProps) {
  const {
    castVote,
    hasUserVoted,
    getUserVote,
    getPollResults,
    getPollComments,
    currentUserId,
  } = usePoll();

  const voted = hasUserVoted(poll.id);
  const userVote = getUserVote(poll.id);
  const results = getPollResults(poll.id);
  const comments = getPollComments(poll.id);
  const totalVotes = results.reduce((sum, r) => sum + r.votes, 0);
  const isCreator = poll.creatorId === currentUserId;
  const isClosed = poll.status === "closed";

  const handleVote = (optionId: string) => {
    castVote(poll.id, optionId);
  };

  return (
    <div
      className="bg-white rounded-2xl border border-[#ebebeb] p-4 md:p-6 space-y-4 animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Post title & description */}
      <div>
        <h3 className="text-base font-semibold text-[#171717] leading-[27px]">{poll.title}</h3>
        {poll.description && (
          <p className="mt-1 text-sm text-[#5c5c5c] leading-[21px] line-clamp-2">{poll.description}</p>
        )}
        <span className="text-xs text-[#5c5c5c] uppercase tracking-wider mt-1 inline-block">
          5 min read
        </span>
      </div>

      {/* Poll question */}
      <p className="text-[14px] font-medium text-[#171717] leading-[21px]">{poll.question}</p>

      {/* Options or Results */}
      {poll.type === "text" ? (
        voted || isClosed ? (
          <TextPollResults
            options={poll.options as TextOption[]}
            results={results}
            userVoteOptionId={userVote?.optionId}
          />
        ) : (
          <TextPollOptions
            options={poll.options as TextOption[]}
            onVote={handleVote}
            disabled={isClosed}
          />
        )
      ) : voted || isClosed ? (
        <ImagePollResults
          options={poll.options as ImageOption[]}
          results={results}
          userVoteOptionId={userVote?.optionId}
        />
      ) : (
        <ImagePollOptions
          options={poll.options as ImageOption[]}
          onVote={handleVote}
          disabled={isClosed}
        />
      )}

      {/* Footer */}
      <PollFooter
        poll={poll}
        voteCount={totalVotes}
        commentCount={comments.length}
        hasVoted={voted}
        isCreator={isCreator}
      />

      {/* Reaction Bar */}
      <ReactionBar
        pollId={poll.id}
        impressions={poll.impressions}
        commentCount={comments.length}
      />
    </div>
  );
}
