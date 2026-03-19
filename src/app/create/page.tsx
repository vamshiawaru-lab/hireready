"use client";

import { CreatePollForm } from "@/components/create/CreatePollForm";

export default function CreatePollPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#5c5c5c] mb-6 flex items-center gap-1.5 animate-fade-in">
        <span>Atlas</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4.5 3l3 3-3 3"/></svg>
        <span>...</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4.5 3l3 3-3 3"/></svg>
        <span>Classic Community Platform</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4.5 3l3 3-3 3"/></svg>
        <span className="font-medium text-[#171717]">Create a Poll</span>
      </nav>

      <CreatePollForm />
    </div>
  );
}
