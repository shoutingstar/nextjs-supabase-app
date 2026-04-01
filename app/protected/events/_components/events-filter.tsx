"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

// 이벤트 상태 필터 타입
export type EventFilter = "all" | "upcoming" | "ongoing" | "ended";

// 필터 옵션 정의
const FILTER_OPTIONS: { value: EventFilter; label: string; emoji: string }[] = [
  { value: "all", label: "전체", emoji: "🎉" },
  { value: "upcoming", label: "예정", emoji: "📅" },
  { value: "ongoing", label: "진행중", emoji: "🔥" },
  { value: "ended", label: "종료", emoji: "✅" },
];

interface EventsFilterProps {
  currentFilter: EventFilter;
}

export function EventsFilter({ currentFilter }: EventsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (filter: EventFilter) => {
    const params = new URLSearchParams(searchParams.toString());
    if (filter === "all") {
      params.delete("filter");
    } else {
      params.set("filter", filter);
    }
    startTransition(() => {
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {FILTER_OPTIONS.map((option) => {
        const isActive = currentFilter === option.value;
        return (
          <button
            key={option.value}
            onClick={() => handleFilterChange(option.value)}
            disabled={isPending}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              isActive
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-white text-gray-600 hover:bg-gray-100"
            } disabled:opacity-50`}
          >
            <span>{option.emoji}</span>
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
