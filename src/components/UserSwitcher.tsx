"use client";

import { usePoll } from "@/context/PollContext";
import { Avatar } from "@/components/ui/Avatar";

export function UserSwitcher() {
  const { currentUserId, users, switchUser } = usePoll();
  const current = users.find((u) => u.id === currentUserId)!;

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentUserId}
        onChange={(e) => switchUser(e.target.value)}
        className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white text-gray-700 cursor-pointer max-w-[120px] sm:max-w-none"
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name} ({u.role})
          </option>
        ))}
      </select>
      <div className="hidden sm:block"><Avatar src={current.avatar} name={current.name} size="md" /></div>
    </div>
  );
}
