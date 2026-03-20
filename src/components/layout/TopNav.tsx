"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { UserSwitcher } from "@/components/UserSwitcher";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#ebebeb]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-[62px] flex items-center justify-between">
        <Link href="/" className="transition-opacity duration-[150ms] hover:opacity-80 flex items-center">
          <Image src="/khoros-logo.png" alt="Khoros" width={114} height={40} priority />
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/create">
            <Button variant="primary" size="sm">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 3v10M3 8h10" />
              </svg>
              Create
            </Button>
          </Link>

          {/* Nav icons */}
          <button className="hidden sm:block p-2 text-[#5c5c5c] hover:text-[#171717] transition-colors duration-[150ms]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="8" cy="8" r="5.5" />
              <path d="M12.5 12.5L16 16" />
            </svg>
          </button>
          <button className="hidden sm:block p-2 text-[#5c5c5c] hover:text-[#171717] transition-colors duration-[150ms]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="2" y="4" width="14" height="10" rx="2" />
              <path d="M2 6l7 4 7-4" />
            </svg>
          </button>
          <button className="p-2 text-[#5c5c5c] hover:text-[#171717] transition-colors duration-[150ms] relative">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 2a5.5 5.5 0 0 1 5.5 5.5v2.5l1.5 1.5H2l1.5-1.5V7.5A5.5 5.5 0 0 1 9 2z" />
              <path d="M7.5 15.5a1.5 1.5 0 0 0 3 0" />
            </svg>
          </button>

          <UserSwitcher />
        </div>
      </div>
    </header>
  );
}
