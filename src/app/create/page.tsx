"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { usePoll } from "@/context/PollContext";
import { MOCK_BOARDS } from "@/data/mock";
import type { PollSettings } from "@/types/poll";
import RichTextEditor from "@/components/create/RichTextEditor";

const STYLE_OPTIONS = ["Photorealistic", "Illustration", "Flat Vector", "3D Render", "Minimal"];
const ASPECT_RATIOS = ["1:1", "4:3", "16:9"];

interface ImageGenState {
  tab: "upload" | "generate";
  prompt: string;
  style: string;
  aspectRatio: string;
  generating: boolean;
  generated: boolean;
}

const defaultImageGen: ImageGenState = {
  tab: "generate",
  prompt: "",
  style: "Photorealistic",
  aspectRatio: "1:1",
  generating: false,
  generated: false,
};

export default function CreatePostPage() {
  const router = useRouter();
  const { createPoll } = usePoll();

  // Post fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [boardId, setBoardId] = useState("");

  // Poll toggle — hidden by default, user adds via toolbar
  const [showPoll, setShowPoll] = useState(false);

  // Poll fields
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState([
    { label: "", imageUrl: "" },
    { label: "", imageUrl: "" },
  ]);
  const [durationValue, setDurationValue] = useState("");
  const [durationUnit, setDurationUnit] = useState("Days");

  // Image generation panel — which option index is expanded (-1 = none)
  const [expandedImageOption, setExpandedImageOption] = useState(-1);
  const [imageGen, setImageGen] = useState<ImageGenState>(defaultImageGen);

  // Advanced Settings
  const [showAdvanced, setShowAdvanced] = useState(true);
  const [settings, setSettings] = useState<PollSettings>({
    allowComments: true,
    allowVoteChanges: false,
    anonymousVoting: false,
    randomiseOptions: false,
  });

  const addOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, { label: "", imageUrl: "" }]);
    }
  };

  const removeOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
      if (expandedImageOption === index) setExpandedImageOption(-1);
      else if (expandedImageOption > index) setExpandedImageOption(expandedImageOption - 1);
    }
  };

  const updateOptionLabel = (index: number, value: string) => {
    const updated = [...pollOptions];
    updated[index] = { ...updated[index], label: value };
    setPollOptions(updated);
  };

  const toggleImagePanel = (index: number) => {
    if (expandedImageOption === index) {
      setExpandedImageOption(-1);
      setImageGen(defaultImageGen);
    } else {
      setExpandedImageOption(index);
      setImageGen(defaultImageGen);
    }
  };

  const handleGenerate = (index: number) => {
    setImageGen((prev) => ({ ...prev, generating: true }));
    // Simulate AI generation
    setTimeout(() => {
      const placeholders = [
        "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop",
      ];
      const updated = [...pollOptions];
      updated[index] = { ...updated[index], imageUrl: placeholders[index % placeholders.length] };
      setPollOptions(updated);
      setImageGen((prev) => ({ ...prev, generating: false, generated: true }));
      // Auto-close after generation
      setTimeout(() => {
        setExpandedImageOption(-1);
        setImageGen(defaultImageGen);
      }, 600);
    }, 1500);
  };

  const handleUpload = (index: number) => {
    // Simulate upload — assign a placeholder
    const placeholders = [
      "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
    ];
    const updated = [...pollOptions];
    updated[index] = { ...updated[index], imageUrl: placeholders[index % placeholders.length] };
    setPollOptions(updated);
    setExpandedImageOption(-1);
    setImageGen(defaultImageGen);
  };

  const cancelImagePanel = () => {
    setExpandedImageOption(-1);
    setImageGen(defaultImageGen);
  };

  const removePoll = () => {
    setShowPoll(false);
    setPollQuestion("");
    setPollOptions([
      { label: "", imageUrl: "" },
      { label: "", imageUrl: "" },
    ]);
    setExpandedImageOption(-1);
  };

  const toggleSetting = (key: keyof PollSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Validation
  const isPollValid = showPoll
    ? pollQuestion.trim().length > 0 &&
      pollOptions.filter((o) => o.label.trim().length > 0).length >= 2
    : true;

  const canPost =
    (title.trim().length > 0 || (showPoll && isPollValid)) &&
    (!showPoll || isPollValid);

  const handlePost = useCallback(() => {
    if (!canPost) return;

    if (showPoll) {
      const validOptions = pollOptions.filter((o) => o.label.trim().length > 0);
      const hasImages = validOptions.some((o) => o.imageUrl);
      const days = parseInt(durationValue) || 7;
      createPoll({
        type: hasImages ? "image" : "text",
        title: title || pollQuestion,
        question: pollQuestion,
        description: description,
        options: validOptions.map((o) => ({
          label: o.label,
          ...(o.imageUrl ? { imageUrl: o.imageUrl } : {}),
        })),
        boardId: boardId || MOCK_BOARDS[0].id,
        durationDays: days,
        settings,
      });
    }
    router.push("/");
  }, [canPost, showPoll, pollOptions, pollQuestion, description, title, boardId, durationValue, settings, createPoll, router]);

  return (
    <div className="min-h-[calc(100vh-62px)] bg-[#ebebeb] flex items-start justify-center px-4 py-6 md:py-12">
      {/* Composer Modal */}
      <div className="w-full max-w-[588px] bg-white rounded-2xl border border-[#ebebeb] shadow-[0px_1px_2px_0px_rgba(10,13,20,0.03)] overflow-hidden animate-fade-in">
        {/* Header — "Create post" */}
        <div className="flex items-center justify-center h-[55px] border-b border-[#ebebeb]">
          <h1 className="font-medium text-[16px] leading-[21px] text-[#171717]">
            Create post
          </h1>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 pt-4">
          {/* Title + Description */}
          <div className="flex flex-col gap-4 px-5">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[14px] leading-[21px] text-[#171717]">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post Title"
                className="w-full px-4 py-3 text-[14px] leading-[21px] text-[#171717] placeholder:text-[rgba(23,23,23,0.5)] bg-white border border-[#ebebeb] rounded-xl outline-none focus:border-[#335cff] focus:ring-1 focus:ring-[#335cff]/20 transition-all duration-150"
              />
            </div>

            {/* Description — Rich Text Editor */}
            <div className="flex flex-col gap-2">
              <label className="font-medium text-[14px] leading-[21px] text-[#171717]">Description</label>
              <RichTextEditor
                value={description}
                onChange={(html) => setDescription(html)}
              />
            </div>
          </div>

          {/* Poll Module */}
          {showPoll && (
            <div className="mx-5 border border-[#ebebeb] rounded-xl overflow-hidden animate-fade-in-up">
              {/* Poll Header */}
              <div className="flex items-center justify-between h-[45px] px-4 bg-[rgba(235,235,235,0.2)] border-b border-[#ebebeb]">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="1" y="2" width="14" height="3" rx="1.5" stroke="#335cff" strokeWidth="1.2" />
                    <rect x="1" y="6.5" width="9" height="3" rx="1.5" stroke="#335cff" strokeWidth="1.2" />
                    <rect x="1" y="11" width="11.5" height="3" rx="1.5" stroke="#335cff" strokeWidth="1.2" />
                  </svg>
                  <span className="font-medium text-[12px] leading-[18px] text-[#171717]">Poll</span>
                </div>
                <button
                  onClick={removePoll}
                  className="flex items-center gap-1 text-[11px] font-medium leading-[16.5px] text-[#fb3748] hover:text-[#e0202f] transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M2 3h8M4.5 3V2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1M9 3v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3" />
                  </svg>
                  Remove
                </button>
              </div>

              {/* Poll Content */}
              <div className="bg-white px-6 py-4">
                <div className="flex flex-col gap-2">
                  {/* Question */}
                  <input
                    type="text"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    placeholder="Ask a question"
                    className="w-full px-3 py-[10px] text-[14px] text-[#171717] placeholder:text-[rgba(23,23,23,0.5)] bg-white border border-[#ebebeb] rounded-md outline-none focus:border-[#335cff] focus:ring-1 focus:ring-[#335cff]/20 transition-all duration-150"
                  />

                  {/* Options */}
                  {pollOptions.map((opt, i) => (
                    <div key={i} className="flex flex-col">
                      {/* Option Row */}
                      <div
                        className={`flex items-center gap-2 border border-[#ebebeb] overflow-hidden ${
                          expandedImageOption === i ? "rounded-t-md border-b-0" : "rounded-md"
                        }`}
                      >
                        {/* Drag handle */}
                        <div className="flex items-center pl-3">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <circle cx="5" cy="4" r="1" fill="#d1d1d1" />
                            <circle cx="9" cy="4" r="1" fill="#d1d1d1" />
                            <circle cx="5" cy="7" r="1" fill="#d1d1d1" />
                            <circle cx="9" cy="7" r="1" fill="#d1d1d1" />
                            <circle cx="5" cy="10" r="1" fill="#d1d1d1" />
                            <circle cx="9" cy="10" r="1" fill="#d1d1d1" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => updateOptionLabel(i, e.target.value)}
                          placeholder={`Option ${i + 1}`}
                          className="flex-1 py-[10px] text-[12px] text-[#171717] placeholder:text-[rgba(23,23,23,0.5)] bg-transparent outline-none"
                        />
                        {/* Add image / image status button */}
                        <button
                          onClick={() => toggleImagePanel(i)}
                          className={`flex items-center gap-1 px-3 py-[10px] text-[11px] font-medium leading-[16.5px] transition-colors whitespace-nowrap mr-2 ${
                            expandedImageOption === i
                              ? "text-[#335cff]"
                              : opt.imageUrl
                              ? "text-[#335cff]"
                              : "text-[#5c5c5c] hover:text-[#335cff]"
                          }`}
                        >
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <rect x="1.5" y="2.5" width="11" height="9" rx="1.5" />
                            <circle cx="5" cy="6" r="1" />
                            <path d="M12.5 9.5l-3-3.5-2.5 2.5-1.5-1.5L1.5 11" />
                          </svg>
                          {opt.imageUrl ? "Change image" : "Add image"}
                        </button>
                        {/* Remove option */}
                        {pollOptions.length > 2 && (
                          <button
                            onClick={() => removeOption(i)}
                            className="pr-3 text-[#d1d1d1] hover:text-[#fb3748] transition-colors"
                          >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M3 3l6 6M9 3l-6 6" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {/* Expanded Image Panel */}
                      {expandedImageOption === i && (
                        <div className="border border-[#ebebeb] border-t-0 rounded-b-md bg-[#fafafa] animate-fade-in">
                          {/* Tab bar: Upload / Generate with AI */}
                          <div className="flex border-b border-[#ebebeb]">
                            <button
                              onClick={() => setImageGen((prev) => ({ ...prev, tab: "upload" }))}
                              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[12px] font-medium transition-colors ${
                                imageGen.tab === "upload"
                                  ? "text-[#171717] bg-white border-b-2 border-[#335cff]"
                                  : "text-[#5c5c5c] hover:text-[#171717]"
                              }`}
                            >
                              {/* Upload icon */}
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
                                <path d="M7 9V3M7 3L4.5 5.5M7 3l2.5 2.5" />
                                <path d="M2.5 9.5v2a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-2" />
                              </svg>
                              Upload image
                            </button>
                            <button
                              onClick={() => setImageGen((prev) => ({ ...prev, tab: "generate" }))}
                              className={`flex-1 flex items-center justify-center gap-2 py-3 text-[12px] font-medium transition-colors ${
                                imageGen.tab === "generate"
                                  ? "text-[#335cff] bg-[rgba(51,92,255,0.06)] border-b-2 border-[#335cff]"
                                  : "text-[#5c5c5c] hover:text-[#335cff]"
                              }`}
                            >
                              {/* Sparkle / AI icon */}
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                                <path d="M7 1l1.5 4L13 7l-4.5 1.5L7 13l-1.5-4.5L1 7l4.5-2z" />
                              </svg>
                              Generate with AI
                            </button>
                          </div>

                          {/* Upload tab content */}
                          {imageGen.tab === "upload" && (
                            <div className="p-4">
                              <button
                                onClick={() => handleUpload(i)}
                                className="w-full flex flex-col items-center justify-center gap-2 py-6 border-2 border-dashed border-[#d1d1d1] rounded-lg text-[#5c5c5c] hover:border-[#335cff] hover:text-[#335cff] hover:bg-[rgba(51,92,255,0.02)] transition-all cursor-pointer"
                              >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                  <path d="M12 16V6M12 6l-4 4M12 6l4 4" />
                                  <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
                                </svg>
                                <span className="text-[12px] font-medium">Click to upload an image</span>
                                <span className="text-[10px] text-[#a0a0a0]">PNG, JPG, GIF up to 5MB</span>
                              </button>
                            </div>
                          )}

                          {/* Generate tab content */}
                          {imageGen.tab === "generate" && (
                            <div className="p-4 flex flex-col gap-3">
                              {/* Label */}
                              <p className="text-[13px] font-medium text-[#171717]">
                                Generate image for Option {i + 1}
                              </p>

                              {/* Prompt input */}
                              <input
                                type="text"
                                value={imageGen.prompt}
                                onChange={(e) => setImageGen((prev) => ({ ...prev, prompt: e.target.value }))}
                                placeholder="Describe the image for this option..."
                                className="w-full px-3 py-[10px] text-[12px] text-[#171717] placeholder:text-[rgba(23,23,23,0.5)] bg-white border border-[#ebebeb] rounded-md outline-none focus:border-[#335cff] focus:ring-1 focus:ring-[#335cff]/20 transition-all duration-150"
                              />

                              {/* Enhance prompt link */}
                              <button className="self-start text-[12px] font-medium text-[#335cff] hover:text-[#2d1bd3] transition-colors">
                                Enhance prompt with AI
                              </button>

                              {/* Style selector */}
                              <div className="flex flex-col gap-1.5">
                                <p className="text-[10px] font-semibold text-[#5c5c5c] uppercase tracking-wider">Style</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {STYLE_OPTIONS.map((s) => (
                                    <button
                                      key={s}
                                      onClick={() => setImageGen((prev) => ({ ...prev, style: s }))}
                                      className={`px-3 py-1.5 text-[11px] font-medium rounded-md border transition-all duration-150 ${
                                        imageGen.style === s
                                          ? "border-[#335cff] text-[#335cff] bg-[rgba(51,92,255,0.06)]"
                                          : "border-[#ebebeb] text-[#5c5c5c] hover:border-[#c0c0c0]"
                                      }`}
                                    >
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Aspect Ratio */}
                              <div className="flex flex-col gap-1.5">
                                <p className="text-[10px] font-semibold text-[#5c5c5c] uppercase tracking-wider">Aspect Ratio</p>
                                <div className="flex gap-1.5">
                                  {ASPECT_RATIOS.map((ar) => (
                                    <button
                                      key={ar}
                                      onClick={() => setImageGen((prev) => ({ ...prev, aspectRatio: ar }))}
                                      className={`px-3 py-1.5 text-[11px] font-medium rounded-md border transition-all duration-150 ${
                                        imageGen.aspectRatio === ar
                                          ? "border-[#335cff] text-[#335cff] bg-[rgba(51,92,255,0.06)]"
                                          : "border-[#ebebeb] text-[#5c5c5c] hover:border-[#c0c0c0]"
                                      }`}
                                    >
                                      {ar}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Generate + Cancel buttons */}
                              <div className="flex items-center gap-3 pt-1">
                                <button
                                  onClick={() => handleGenerate(i)}
                                  disabled={imageGen.generating || !imageGen.prompt.trim()}
                                  className={`px-4 py-2 text-[12px] font-medium text-white rounded-md transition-all duration-150 ${
                                    imageGen.generating
                                      ? "bg-[#335cff]/60 cursor-wait"
                                      : imageGen.prompt.trim()
                                      ? "bg-[#335cff] hover:bg-[#2a4de6] active:scale-[0.97] cursor-pointer"
                                      : "bg-[#335cff] opacity-40 cursor-not-allowed"
                                  }`}
                                >
                                  {imageGen.generating ? (
                                    <span className="flex items-center gap-2">
                                      <svg className="animate-spin" width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <circle cx="6" cy="6" r="5" stroke="white" strokeWidth="1.5" strokeDasharray="20" strokeLinecap="round" />
                                      </svg>
                                      Generating...
                                    </span>
                                  ) : imageGen.generated ? (
                                    "Generated!"
                                  ) : (
                                    "Generate"
                                  )}
                                </button>
                                <button
                                  onClick={cancelImagePanel}
                                  className="text-[12px] font-medium text-[#5c5c5c] hover:text-[#171717] transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Add option */}
                  {pollOptions.length < 6 && (
                    <button
                      onClick={addOption}
                      className="flex items-center gap-1 h-[30px] pl-3 text-[12px] font-medium leading-[18px] text-[#335cff] hover:text-[#2d1bd3] transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 3v8M3 7h8" />
                      </svg>
                      Add option
                    </button>
                  )}

                  {/* Board + Duration row */}
                  <div className="flex gap-2 items-start pt-1">
                    {/* Board */}
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="font-medium text-[12px] leading-[1.5] text-[#171717]">Board</label>
                      <div className="relative">
                        <select
                          value={boardId}
                          onChange={(e) => setBoardId(e.target.value)}
                          className="w-full appearance-none px-3 py-2 pr-8 text-[12px] text-[#171717] bg-white border border-[#ebebeb] rounded-md outline-none focus:border-[#335cff] transition-colors cursor-pointer"
                        >
                          <option value="" className="text-[rgba(23,23,23,0.5)]">Select Board</option>
                          {MOCK_BOARDS.map((b) => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                          ))}
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5c5c5c" strokeWidth="1.5">
                          <path d="M4 6l4 4 4-4" />
                        </svg>
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="flex-1 flex flex-col gap-1">
                      <label className="font-medium text-[12px] leading-[1.5] text-[#171717]">Duration</label>
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={durationValue}
                          onChange={(e) => setDurationValue(e.target.value.replace(/\D/g, ""))}
                          placeholder="Enter Duration"
                          className="flex-1 min-w-0 px-3 py-2 text-[12px] text-[#171717] placeholder:text-[rgba(23,23,23,0.5)] bg-white border border-[#ebebeb] rounded-md outline-none focus:border-[#335cff] transition-colors"
                        />
                        <div className="relative">
                          <select
                            value={durationUnit}
                            onChange={(e) => setDurationUnit(e.target.value)}
                            className="appearance-none px-3 py-2 pr-7 text-[12px] text-[rgba(23,23,23,0.5)] bg-white border border-[#ebebeb] rounded-md outline-none focus:border-[#335cff] transition-colors cursor-pointer"
                          >
                            <option>Days</option>
                            <option>Hours</option>
                            <option>Weeks</option>
                          </select>
                          <svg className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5c5c5c" strokeWidth="1.5">
                            <path d="M4 6l4 4 4-4" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          {showPoll && (
            <div className="mx-5 border border-[#ebebeb] rounded-xl overflow-hidden">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full flex items-center justify-between h-[45px] px-4 bg-[rgba(235,235,235,0.2)] border-b border-[#ebebeb] cursor-pointer hover:bg-[rgba(235,235,235,0.35)] transition-colors"
              >
                <span className="font-medium text-[12px] leading-[18px] text-[#171717]">Advanced Settings</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="#5c5c5c"
                  strokeWidth="1.5"
                  className={`transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
                >
                  <path d="M4 6l4 4 4-4" />
                </svg>
              </button>

              {showAdvanced && (
                <div className="bg-white px-6 py-4">
                  <div className="flex flex-col gap-3">
                    <ToggleRow
                      icon={
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5c5c5c" strokeWidth="1.2">
                          <rect x="1.5" y="2.5" width="13" height="9" rx="2" />
                          <path d="M5 13l-2-2h0" />
                          <path d="M5 7h6M5 9h3" />
                        </svg>
                      }
                      label="Allow comments"
                      enabled={settings.allowComments}
                      onToggle={() => toggleSetting("allowComments")}
                    />
                    <ToggleRow
                      icon={
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5c5c5c" strokeWidth="1.2">
                          <path d="M12 5l-5 5-3-3" />
                          <path d="M2 8a6 6 0 1 1 6 6" />
                          <path d="M2 14l2-2" />
                        </svg>
                      }
                      label="Allow vote changes"
                      enabled={settings.allowVoteChanges}
                      onToggle={() => toggleSetting("allowVoteChanges")}
                    />
                    <ToggleRow
                      icon={
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5c5c5c" strokeWidth="1.2">
                          <circle cx="8" cy="5" r="3" />
                          <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" />
                        </svg>
                      }
                      label="Anonymous voting"
                      enabled={settings.anonymousVoting}
                      onToggle={() => toggleSetting("anonymousVoting")}
                    />
                    <ToggleRow
                      icon={
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#5c5c5c" strokeWidth="1.2">
                          <path d="M3 4h4l2 2H3M3 8h6l2 2H3M3 12h4" />
                          <path d="M11 4h2M11 8h2M11 12h2" />
                        </svg>
                      }
                      label="Randomise polls"
                      enabled={settings.randomiseOptions}
                      onToggle={() => toggleSetting("randomiseOptions")}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between h-[53px] px-5 pt-[9px] border-t border-[#ebebeb]">
            <div className="flex items-center gap-1">
              <button className="flex items-center justify-center w-9 h-9 rounded-md text-[#5c5c5c] hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#335cff]/40 transition-colors" title="Photo" aria-label="Photo">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
                  <circle cx="7" cy="8" r="1.5" />
                  <path d="M17.5 13l-3.5-4-3 3-2-2L2.5 14" />
                </svg>
              </button>
              <button className="flex items-center justify-center w-9 h-9 rounded-md text-[#5c5c5c] hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#335cff]/40 transition-colors" title="Video" aria-label="Video">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="4" width="11" height="12" rx="2" />
                  <path d="M13 8.5l5-3v9l-5-3" />
                </svg>
              </button>
              <button className="flex items-center justify-center w-9 h-9 rounded-md text-[#5c5c5c] hover:bg-[#f5f5f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#335cff]/40 transition-colors" title="Document" aria-label="Document">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M11 2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7l-5-5z" />
                  <path d="M11 2v5h5" />
                  <path d="M7 10h6M7 13h3" />
                </svg>
              </button>
              <button
                onClick={() => setShowPoll(!showPoll)}
                className={`flex items-center justify-center w-9 h-9 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#335cff]/40 transition-colors ${
                  showPoll
                    ? "bg-[rgba(51,92,255,0.1)] text-[#335cff]"
                    : "text-[#5c5c5c] hover:bg-[#f5f5f5]"
                }`}
                title="Poll"
                aria-label="Poll"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2.5" y="3.5" width="15" height="3" rx="1.5" />
                  <rect x="2.5" y="8.5" width="10" height="3" rx="1.5" />
                  <rect x="2.5" y="13.5" width="12.5" height="3" rx="1.5" />
                </svg>
              </button>
            </div>

            <button
              onClick={handlePost}
              disabled={!canPost}
              className={`h-[30px] px-5 text-[12px] font-medium leading-[18px] text-white rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#335cff]/40 focus-visible:ring-offset-1 transition-all duration-150 ${
                canPost
                  ? "bg-[#335cff] hover:bg-[#2a4de6] active:scale-[0.97] shadow-sm cursor-pointer"
                  : "bg-[#335cff] opacity-40 cursor-not-allowed"
              }`}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Toggle Row component for Advanced Settings */
function ToggleRow({
  icon,
  label,
  enabled,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[12px] leading-[21px] text-[#171717]">{label}</span>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-[29px] h-[17.4px] rounded-full transition-colors duration-200 ${
          enabled ? "bg-[#2d1cd3]" : "bg-[#ebebeb]"
        }`}
      >
        <div
          className={`absolute top-[2.9px] w-[11.6px] h-[11.6px] bg-white rounded-full shadow-[0px_0.725px_2.175px_0px_rgba(0,0,0,0.1),0px_0.725px_1.45px_0px_rgba(0,0,0,0.1)] transition-all duration-200 ${
            enabled ? "left-[14.5px]" : "left-[2.9px]"
          }`}
        />
      </button>
    </div>
  );
}
