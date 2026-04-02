import Link from "next/link";

// 이벤트 배경색 팔레트 (이미지가 없을 때 사용)
const CARD_COLORS = [
  "from-violet-400 to-purple-500",
  "from-blue-400 to-cyan-500",
  "from-emerald-400 to-teal-500",
  "from-orange-400 to-amber-500",
  "from-rose-400 to-pink-500",
  "from-indigo-400 to-blue-500",
];

// 이벤트 이모지 (카테고리 느낌)
const CARD_EMOJIS = ["🎉", "🎊", "🏖️", "🎶", "🍽️", "⚽", "🎮", "🎨"];

// 이벤트 상태 계산
function getEventStatus(eventDate: string) {
  const now = new Date();
  const date = new Date(eventDate);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  if (date > now) return "upcoming";
  if (endOfDay >= now) return "ongoing";
  return "ended";
}

// 상태별 배지 스타일
const STATUS_STYLES = {
  upcoming: "bg-blue-100 text-blue-700",
  ongoing: "bg-emerald-100 text-emerald-700",
  ended: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS = {
  upcoming: "예정",
  ongoing: "진행중",
  ended: "종료",
};

interface EventCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any;
  index: number;
}

export function EventCard({ event, index }: EventCardProps) {
  const status = getEventStatus(event.event_date);
  const colorClass = CARD_COLORS[index % CARD_COLORS.length];
  const emoji = CARD_EMOJIS[index % CARD_EMOJIS.length];

  // 참여자 수
  const participantCount = event.event_participants?.length ?? 0;
  const maxParticipants = event.max_participants;

  // 날짜 포맷
  const eventDate = new Date(event.event_date);
  const dateStr = eventDate.toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  const timeStr = eventDate.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link href={`/protected/events/${event.id}`} className="group block">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* 이미지 / 배경색 영역 */}
        <div
          className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${colorClass}`}
        >
          {/* 상태 배지 */}
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
          >
            {STATUS_LABELS[status]}
          </span>

          {/* 이모지 */}
          <span className="text-6xl drop-shadow-md transition-transform duration-300 group-hover:scale-110">
            {emoji}
          </span>

          {/* 참여자 현황 (오른쪽 상단) */}
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
            <span>👥</span>
            <span>
              {participantCount}
              {maxParticipants ? `/${maxParticipants}` : ""}
            </span>
          </div>
        </div>

        {/* 카드 본문 */}
        <div className="p-4">
          {/* 제목 */}
          <h3 className="line-clamp-1 text-base font-bold text-gray-900 group-hover:text-gray-600">
            {event.title}
          </h3>

          {/* 설명 */}
          {event.description && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-500">
              {event.description}
            </p>
          )}

          {/* 날짜/장소 정보 */}
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-base">📅</span>
              <span>
                {dateStr} {timeStr}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-base">📍</span>
                <span className="line-clamp-1">{event.location}</span>
              </div>
            )}
          </div>

          {/* 하단 구분선 + 액션 */}
          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
            {/* 주최자 */}
            <div className="flex items-center gap-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs">
                {(event.profiles?.full_name ?? "?").charAt(0)}
              </div>
              <span className="text-xs text-gray-500">
                {event.profiles?.full_name ?? "주최자"}
              </span>
            </div>

            {/* 자세히 보기 버튼 */}
            <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white transition-colors group-hover:bg-gray-700">
              자세히 보기
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
