"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import { useCallback, useEffect, useState, useRef } from "react";

// ─── Toolbar Button ────────────────────────────────────────────────
function ToolbarButton({
  onClick,
  isActive = false,
  disabled = false,
  ariaLabel,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  ariaLabel: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      title={title}
      className={`flex items-center justify-center w-[30px] h-[30px] rounded-md transition-all duration-150 ${
        isActive
          ? "bg-[rgba(51,92,255,0.1)] text-[#335cff]"
          : "text-[#5c5c5c] hover:bg-[#f5f5f5] hover:text-[#171717]"
      } ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </button>
  );
}

// ─── Divider ───────────────────────────────────────────────────────
function ToolbarDivider() {
  return <div className="w-px h-[18px] bg-[#ebebeb] mx-0.5" />;
}

// ─── Heading Dropdown ──────────────────────────────────────────────
function HeadingDropdown({
  editor,
}: {
  editor: ReturnType<typeof useEditor> | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!editor) return null;

  const getCurrentLabel = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    return "Paragraph";
  };

  const options = [
    { label: "Paragraph", action: () => editor.chain().focus().setParagraph().run() },
    { label: "Heading 1", action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { label: "Heading 2", action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Heading 3", action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 h-[30px] px-2.5 rounded-md text-[11px] font-medium text-[#5c5c5c] hover:bg-[#f5f5f5] hover:text-[#171717] transition-all duration-150 cursor-pointer whitespace-nowrap"
        aria-label="Text style"
        title="Text style"
      >
        {getCurrentLabel()}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M2.5 4l2.5 2.5L7.5 4" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-[34px] left-0 z-50 min-w-[140px] bg-white border border-[#ebebeb] rounded-lg shadow-[0px_4px_16px_rgba(0,0,0,0.08)] py-1 animate-fade-in">
          {options.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => {
                opt.action();
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-[12px] transition-colors ${
                getCurrentLabel() === opt.label
                  ? "text-[#335cff] bg-[rgba(51,92,255,0.05)] font-medium"
                  : "text-[#5c5c5c] hover:bg-[#f5f5f5] hover:text-[#171717]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Link Input Popup ──────────────────────────────────────────────
function LinkPopup({
  editor,
  onClose,
}: {
  editor: ReturnType<typeof useEditor> | null;
  onClose: () => void;
}) {
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    if (editor) {
      const existing = editor.getAttributes("link").href;
      if (existing) setUrl(existing);
    }
  }, [editor]);

  const handleSubmit = () => {
    if (!editor) return;
    if (url.trim()) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    onClose();
  };

  return (
    <div className="absolute top-[34px] right-0 z-50 flex items-center gap-1.5 bg-white border border-[#ebebeb] rounded-lg shadow-[0px_4px_16px_rgba(0,0,0,0.08)] p-2 animate-fade-in">
      <input
        ref={inputRef}
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="https://..."
        className="w-[200px] px-2.5 py-1.5 text-[12px] text-[#171717] placeholder:text-[rgba(23,23,23,0.4)] bg-[#fafafa] border border-[#ebebeb] rounded-md outline-none focus:border-[#335cff] transition-colors"
      />
      <button
        type="button"
        onClick={handleSubmit}
        className="px-2.5 py-1.5 text-[11px] font-medium text-white bg-[#335cff] rounded-md hover:bg-[#2a4de6] transition-colors"
      >
        Apply
      </button>
      <button
        type="button"
        onClick={onClose}
        className="px-2 py-1.5 text-[11px] font-medium text-[#5c5c5c] hover:text-[#171717] transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Toolbar ───────────────────────────────────────────────────────
function EditorToolbar({ editor }: { editor: ReturnType<typeof useEditor> | null }) {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const linkRef = useRef<HTMLDivElement>(null);

  if (!editor) return null;

  return (
    <div className="flex items-center flex-wrap gap-0.5 px-2 py-1.5 border-b border-[#ebebeb] bg-[#fafafa] rounded-t-xl relative z-10">
      {/* Heading dropdown */}
      <HeadingDropdown editor={editor} />

      <ToolbarDivider />

      {/* Bold */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        ariaLabel="Bold (Ctrl+B)"
        title="Bold (Ctrl+B)"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M4 2.5h4a2.5 2.5 0 0 1 0 5H4V2.5z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 7.5h4.5a2.5 2.5 0 0 1 0 5H4V7.5z" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </ToolbarButton>

      {/* Italic */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        ariaLabel="Italic (Ctrl+I)"
        title="Italic (Ctrl+I)"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5.5 12L8.5 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M4 12h4M6 2h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </ToolbarButton>

      {/* Underline */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        ariaLabel="Underline (Ctrl+U)"
        title="Underline (Ctrl+U)"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3.5 2v4.5a3.5 3.5 0 0 0 7 0V2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M2.5 12.5h9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </ToolbarButton>

      {/* Strikethrough */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        ariaLabel="Strikethrough"
        title="Strikethrough"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M9.5 3.5C9 2.8 8 2.2 7 2.2c-1.5 0-2.8 1-2.8 2.3 0 .7.3 1.3.8 1.7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M4.5 10.5c.5.7 1.5 1.3 2.5 1.3 1.5 0 2.8-1 2.8-2.3 0-.5-.2-.9-.5-1.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </ToolbarButton>

      <ToolbarDivider />

      {/* Bullet List */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        ariaLabel="Bullet list"
        title="Bullet list"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="3" cy="3.5" r="1" fill="currentColor" />
          <circle cx="3" cy="7" r="1" fill="currentColor" />
          <circle cx="3" cy="10.5" r="1" fill="currentColor" />
          <path d="M6 3.5h6M6 7h6M6 10.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </ToolbarButton>

      {/* Ordered List */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        ariaLabel="Numbered list"
        title="Numbered list"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <text x="1.5" y="5" fill="currentColor" fontSize="4.5" fontWeight="600" fontFamily="Inter, sans-serif">1</text>
          <text x="1.5" y="8.5" fill="currentColor" fontSize="4.5" fontWeight="600" fontFamily="Inter, sans-serif">2</text>
          <text x="1.5" y="12" fill="currentColor" fontSize="4.5" fontWeight="600" fontFamily="Inter, sans-serif">3</text>
          <path d="M6 3.5h6M6 7h6M6 10.5h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </ToolbarButton>

      <ToolbarDivider />

      {/* Blockquote */}
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        ariaLabel="Quote"
        title="Quote"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M3 9.5c-.7 0-1.2-.3-1.5-.7-.3-.4-.5-1-.5-1.8 0-1 .3-2 .9-2.8.6-.8 1.4-1.4 2.4-1.7l.4.8c-.8.3-1.4.7-1.8 1.3-.4.5-.5 1-.5 1.5h.8c.6 0 1 .2 1.3.5.3.3.5.7.5 1.2S4.7 9 4.4 9.3c-.3.2-.8.3-1.4.2zM9 9.5c-.7 0-1.2-.3-1.5-.7-.3-.4-.5-1-.5-1.8 0-1 .3-2 .9-2.8.6-.8 1.4-1.4 2.4-1.7l.4.8c-.8.3-1.4.7-1.8 1.3-.4.5-.5 1-.5 1.5h.8c.6 0 1 .2 1.3.5.3.3.5.7.5 1.2s-.2.9-.5 1.2c-.3.2-.8.3-1.4.2z" fill="currentColor" />
        </svg>
      </ToolbarButton>

      {/* Link */}
      <div ref={linkRef} className="relative">
        <ToolbarButton
          onClick={() => setShowLinkInput(!showLinkInput)}
          isActive={editor.isActive("link")}
          ariaLabel="Link (Ctrl+K)"
          title="Link (Ctrl+K)"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </ToolbarButton>
        {showLinkInput && (
          <LinkPopup editor={editor} onClose={() => setShowLinkInput(false)} />
        )}
      </div>
    </div>
  );
}

// ─── Main Editor Component ─────────────────────────────────────────
export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#335cff] underline cursor-pointer" },
      }),
      Placeholder.configure({
        placeholder: "Post Description",
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose-editor outline-none min-h-[80px] max-h-[250px] overflow-y-auto px-4 py-3 text-[14px] leading-[21px] text-[#171717]",
      },
    },
    immediatelyRender: false,
  });

  // Sync external value changes (rare, but safe)
  useEffect(() => {
    if (editor && value === "" && editor.getHTML() !== "<p></p>") {
      editor.commands.clearContent();
    }
  }, [value, editor]);

  return (
    <div className="rich-text-editor w-full border border-[#ebebeb] rounded-xl focus-within:border-[#335cff] focus-within:ring-1 focus-within:ring-[#335cff]/20 transition-all duration-150 bg-white relative">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />

      {/* Editor Styles */}
      <style jsx global>{`
        /* Placeholder */
        .prose-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: rgba(23, 23, 23, 0.5);
          pointer-events: none;
          height: 0;
          font-size: 14px;
          line-height: 21px;
        }

        /* Base typography */
        .prose-editor {
          font-family: 'Inter Display', Inter, sans-serif;
        }
        .prose-editor p {
          margin: 0 0 0.5em 0;
        }
        .prose-editor p:last-child {
          margin-bottom: 0;
        }

        /* Headings */
        .prose-editor h1 {
          font-size: 20px;
          font-weight: 600;
          line-height: 1.3;
          margin: 0 0 0.4em 0;
          color: #171717;
        }
        .prose-editor h2 {
          font-size: 17px;
          font-weight: 600;
          line-height: 1.3;
          margin: 0 0 0.4em 0;
          color: #171717;
        }
        .prose-editor h3 {
          font-size: 15px;
          font-weight: 600;
          line-height: 1.4;
          margin: 0 0 0.3em 0;
          color: #171717;
        }

        /* Lists */
        .prose-editor ul {
          list-style: disc;
          padding-left: 1.4em;
          margin: 0.3em 0;
        }
        .prose-editor ol {
          list-style: decimal;
          padding-left: 1.4em;
          margin: 0.3em 0;
        }
        .prose-editor li {
          margin: 0.15em 0;
        }
        .prose-editor li p {
          margin: 0;
        }

        /* Blockquote */
        .prose-editor blockquote {
          border-left: 3px solid #335cff;
          padding-left: 12px;
          margin: 0.5em 0;
          color: #5c5c5c;
          font-style: italic;
        }

        /* Links */
        .prose-editor a {
          color: #335cff;
          text-decoration: underline;
        }

        /* Strong / Em / Strike */
        .prose-editor strong {
          font-weight: 600;
        }
        .prose-editor em {
          font-style: italic;
        }
        .prose-editor s {
          text-decoration: line-through;
        }

        /* Images in editor */
        .prose-editor img {
          max-width: 100%;
          border-radius: 8px;
          margin: 0.5em 0;
        }

        /* Scrollbar */
        .prose-editor::-webkit-scrollbar {
          width: 4px;
        }
        .prose-editor::-webkit-scrollbar-track {
          background: transparent;
        }
        .prose-editor::-webkit-scrollbar-thumb {
          background: #d1d1d1;
          border-radius: 2px;
        }

        /* Animation */
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.15s ease-out;
        }
      `}</style>
    </div>
  );
}
