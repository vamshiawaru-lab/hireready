"use client";

import { PollProvider } from "@/context/PollContext";
import { TopNav } from "@/components/layout/TopNav";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <PollProvider>
      <TopNav />
      {children}
    </PollProvider>
  );
}
