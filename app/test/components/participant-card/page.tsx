/**
 * ParticipantCard 컴포넌트 테스트 페이지
 * default/compact variant, 호스트 표시, 다양한 상태 테스트
 */

import type { Metadata } from "next";
import Link from "next/link";

import { ParticipantCard } from "@/components/participants/participant-card";
import { MOCK_HOST_PARTICIPANT, MOCK_PARTICIPANTS } from "@/lib/data/mock-data";

export const metadata: Metadata = {
  title: "ParticipantCard 테스트 | Dev",
};

export default function ParticipantCardTestPage() {
  // 각 상태별 테스트 데이터
  const approvedParticipant = MOCK_PARTICIPANTS.find(
    (p) => p.status === "approved",
  );
  const pendingParticipant = MOCK_PARTICIPANTS.find(
    (p) => p.status === "pending",
  );
  const rejectedParticipant = MOCK_PARTICIPANTS.find(
    (p) => p.status === "rejected",
  );

  // RSVP별 테스트 데이터
  const attendingParticipant = MOCK_PARTICIPANTS.find(
    (p) => p.rsvp === "attending",
  );
  const notAttendingParticipant = MOCK_PARTICIPANTS.find(
    (p) => p.rsvp === "not_attending",
  );
  const maybeParticipant = MOCK_PARTICIPANTS.find((p) => p.rsvp === "maybe");

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <Link
          href="/test/components"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← 컴포넌트 목록
        </Link>
        <h1 className="mt-2 text-3xl font-bold">ParticipantCard 테스트</h1>
        <p className="mt-1 text-muted-foreground">
          참여자 카드 컴포넌트의 다양한 variant와 상태를 테스트합니다.
        </p>
      </div>

      {/* ================================================================
       * 섹션 1: Default Variant - 상태별
       * ================================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">
          Default Variant - 참여 상태별
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 호스트 */}
          <div>
            <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
              호스트 (isHost=true)
            </p>
            <ParticipantCard
              participant={MOCK_HOST_PARTICIPANT}
              variant="default"
              isHost={true}
            />
          </div>

          {/* 승인된 참여자 */}
          {approvedParticipant && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                승인됨 (approved)
              </p>
              <ParticipantCard
                participant={approvedParticipant}
                variant="default"
              />
            </div>
          )}

          {/* 대기중 참여자 */}
          {pendingParticipant && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                대기중 (pending)
              </p>
              <ParticipantCard
                participant={pendingParticipant}
                variant="default"
              />
            </div>
          )}

          {/* 거절된 참여자 */}
          {rejectedParticipant && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                거절됨 (rejected)
              </p>
              <ParticipantCard
                participant={rejectedParticipant}
                variant="default"
              />
            </div>
          )}
        </div>
      </section>

      {/* ================================================================
       * 섹션 2: Default Variant - RSVP 상태별
       * ================================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">
          Default Variant - RSVP 상태별
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {attendingParticipant && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                참석 확정
              </p>
              <ParticipantCard
                participant={attendingParticipant}
                variant="default"
              />
            </div>
          )}

          {notAttendingParticipant && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                불참
              </p>
              <ParticipantCard
                participant={notAttendingParticipant}
                variant="default"
              />
            </div>
          )}

          {maybeParticipant && (
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-muted-foreground">
                미정
              </p>
              <ParticipantCard
                participant={maybeParticipant}
                variant="default"
              />
            </div>
          )}
        </div>
      </section>

      {/* ================================================================
       * 섹션 3: Compact Variant
       * ================================================================ */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-semibold">Compact Variant</h2>

        <div className="max-w-md space-y-2">
          {/* 호스트 (compact) */}
          <ParticipantCard
            participant={MOCK_HOST_PARTICIPANT}
            variant="compact"
            isHost={true}
          />
          {/* 일반 참여자 목록 (compact) */}
          {MOCK_PARTICIPANTS.slice(0, 8).map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              variant="compact"
            />
          ))}
        </div>
      </section>

      {/* ================================================================
       * 섹션 4: 전체 참여자 목록 (더미 데이터 확인)
       * ================================================================ */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">
          전체 참여자 ({MOCK_PARTICIPANTS.length}명)
        </h2>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_PARTICIPANTS.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              variant="default"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
