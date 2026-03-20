"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePoll } from "@/context/PollContext";
import { Button } from "@/components/ui/Button";
import { PollTypeToggle } from "./PollTypeToggle";
import { OptionInput } from "./OptionInput";
import { ImageOptionInput } from "./ImageOptionInput";
import { AdvancedSettings } from "./AdvancedSettings";
import { DurationPicker } from "./DurationPicker";
import { MOCK_BOARDS } from "@/data/mock";
import type { PollType, PollSettings } from "@/types/poll";

const MAX_OPTIONS = 6;
const MIN_OPTIONS = 2;

interface OptionData {
  label: string;
  imageUrl: string;
}

export function CreatePollForm() {
  const router = useRouter();
  const { createPoll } = usePoll();

  const [type, setType] = useState<PollType>("text");
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState<OptionData[]>([
    { label: "", imageUrl: "" },
    { label: "", imageUrl: "" },
  ]);
  const [boardId, setBoardId] = useState("");
  const [durationDays, setDurationDays] = useState(7);
  const [settings, setSettings] = useState<PollSettings>({
    allowComments: true,
    allowVoteChanges: false,
    anonymousVoting: false,
    randomiseOptions: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addOption = () => {
    if (options.length < MAX_OPTIONS) {
      setOptions([...options, { label: "", imageUrl: "" }]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > MIN_OPTIONS) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, updates: Partial<OptionData>) => {
    setOptions(options.map((opt, i) => (i === index ? { ...opt, ...updates } : opt)));
  };

  const canSubmit = question.trim() && options.filter((o) => o.label.trim()).length >= MIN_OPTIONS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);

    // Brief delay for loading animation
    await new Promise((resolve) => setTimeout(resolve, 600));

    createPoll({
      type,
      title: question.trim(),
      question: question.trim(),
      description: description.trim(),
      options: options
        .filter((o) => o.label.trim())
        .map((o) => ({
          label: o.label.trim(),
          ...(type === "image" && o.imageUrl ? { imageUrl: o.imageUrl } : {}),
        })),
      boardId: boardId || MOCK_BOARDS[0].id,
      durationDays,
      settings,
    });

    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-xl font-semibold text-[#171717] leading-[1.5]" style={{ fontFamily: "'Inter Display', Inter, sans-serif" }}>
          Create Poll
        </h1>
        <p className="text-sm text-[#5c5c5c] mt-1">Create an engaging poll now</p>
      </div>

      <div className="animate-fade-in-up" style={{ animationDelay: "80ms" }}>
        <PollTypeToggle value={type} onChange={setType} />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: "160ms" }}>
        {/* Question */}
        <div className="border-b border-[#ebebeb] px-4 sm:px-8 py-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#171717] mb-2">
              Poll Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask the community something..."
              className="w-full px-4 py-3 border border-[#ebebeb] rounded-md text-sm text-[#171717] placeholder:text-[#171717]/50 focus:outline-none focus:ring-2 focus:ring-[#2d1bd3]/30 focus:border-[#2d1bd3] transition-all duration-[200ms]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#171717] mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed overview about the question"
              rows={3}
              className="w-full px-4 py-3 border border-[#ebebeb] rounded-md text-sm text-[#171717] placeholder:text-[#171717]/50 resize-none focus:outline-none focus:ring-2 focus:ring-[#2d1bd3]/30 focus:border-[#2d1bd3] transition-all duration-[200ms]"
            />
          </div>
        </div>

        {/* Answer Options */}
        <div className="border-b border-[#ebebeb] px-4 sm:px-8 py-6">
          <label className="block text-sm font-medium text-[#171717] mb-4">
            Answer Options
          </label>
          <div className="space-y-3">
            {options.map((opt, i) =>
              type === "text" ? (
                <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <OptionInput
                    index={i}
                    value={opt.label}
                    onChange={(v) => updateOption(i, { label: v })}
                    onRemove={() => removeOption(i)}
                    canRemove={options.length > MIN_OPTIONS}
                  />
                </div>
              ) : (
                <div key={i} className="animate-fade-in-up" style={{ animationDelay: `${i * 60}ms` }}>
                  <ImageOptionInput
                    index={i}
                    label={opt.label}
                    imageUrl={opt.imageUrl}
                    onLabelChange={(v) => updateOption(i, { label: v })}
                    onImageChange={(url) => updateOption(i, { imageUrl: url })}
                    onRemove={() => removeOption(i)}
                    canRemove={options.length > MIN_OPTIONS}
                  />
                </div>
              )
            )}
          </div>
          {options.length < MAX_OPTIONS && (
            <button
              type="button"
              onClick={addOption}
              className="mt-4 text-sm text-[#2d1bd3] font-medium hover:underline flex items-center gap-1 transition-colors duration-[150ms]"
            >
              + Add option ({options.length}/{MAX_OPTIONS})
            </button>
          )}
        </div>

        {/* Board & Duration */}
        <div className="border-b border-[#ebebeb] px-4 sm:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#171717] mb-2">
                Board
              </label>
              <select
                value={boardId}
                onChange={(e) => setBoardId(e.target.value)}
                className="w-full px-3 py-2.5 border border-[#ebebeb] rounded-md text-sm bg-white text-[#171717] focus:outline-none focus:ring-2 focus:ring-[#2d1bd3]/30 focus:border-[#2d1bd3] transition-all duration-[200ms]"
              >
                <option value="">Select Board</option>
                {MOCK_BOARDS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#171717] mb-2">
                Duration
              </label>
              <DurationPicker value={durationDays} onChange={setDurationDays} />
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="border-b border-[#ebebeb] px-4 sm:px-8 py-4">
          <AdvancedSettings settings={settings} onChange={setSettings} />
        </div>

        {/* AI Suggestions button */}
        <div className="px-4 sm:px-8 py-4">
          <Button type="button" variant="outline" size="md">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 1l2 5h5l-4 3 1.5 5L8 11l-4.5 3L5 9 1 6h5z" />
            </svg>
            Get AI suggestions
          </Button>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 animate-fade-in-up" style={{ animationDelay: "240ms" }}>
        <Button type="button" variant="ghost" onClick={() => router.push("/")}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit} loading={isSubmitting}>
          Create Poll
        </Button>
      </div>
    </form>
  );
}
