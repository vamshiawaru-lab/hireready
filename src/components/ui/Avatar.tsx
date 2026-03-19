"use client";

import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

interface AvatarProps {
  src?: string;
  name: string;
  size?: Size;
  className?: string;
}

const sizeStyles: Record<Size, string> = {
  sm: "w-6 h-6 text-[10px]",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-medium overflow-hidden shrink-0",
        sizeStyles[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            (e.target as HTMLImageElement).parentElement!.textContent =
              getInitials(name);
          }}
        />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}
