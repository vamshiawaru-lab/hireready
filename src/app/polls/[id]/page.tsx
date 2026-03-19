"use client";

import { use } from "react";
import Link from "next/link";
import { usePoll } from "@/context/PollContext";
import { PageShell } from "@/components/layout/PageShell";
import { Sidebar } from "@/components/layout/Sidebar";
import { PollCard } from "@/components/poll/PollCard";

export default function PollDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { polls } = usePoll();

  const poll = polls.find((p) => p.id === id);

  if (!poll) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900">Poll not found</h1>
        <Link href="/" className="text-purple-600 hover:underline mt-2 inline-block">
          Back to Feed
        </Link>
      </div>
    );
  }

  return (
    <PageShell sidebar={<Sidebar />}>
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">
        ← Back to Feed
      </Link>
      <PollCard poll={poll} />
    </PageShell>
  );
}
