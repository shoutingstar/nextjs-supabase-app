"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";

import { CarpoolActionsDialog } from "@/app/protected/events/[eventId]/carpool/carpool-actions-dialog";
import { CarpoolRequestDialog } from "@/app/protected/events/[eventId]/carpool/carpool-request-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CarpoolContentProps {
  slot: any;

  userCarpoolStatus: any;
  eventId: string;
}

export function CarpoolContent({
  slot,
  userCarpoolStatus,
  eventId,
}: CarpoolContentProps) {
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [actionsDialogOpen, setActionsDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");

  const approvedRequests =
    slot?.carpool_requests?.filter((r: any) => r.status === "approved") || [];
  const availableSeats = slot ? slot.total_seats - approvedRequests.length : 0;

  function openApproveDialog(requestId: string, userName: string) {
    setPendingAction("approve");
    setSelectedRequestId(requestId);
    setSelectedUserName(userName);
    setActionsDialogOpen(true);
  }

  function openRejectDialog(requestId: string, userName: string) {
    setPendingAction("reject");
    setSelectedRequestId(requestId);
    setSelectedUserName(userName);
    setActionsDialogOpen(true);
  }

  return (
    <>
      <div className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold">출발 정보</h3>
              <p className="mt-2 text-gray-700">📍 {slot.departure_location}</p>
              <p className="text-gray-700">
                🕐 {new Date(slot.departure_time).toLocaleTimeString("ko-KR")}
              </p>
            </div>

            <div>
              <h3 className="font-bold">운전자</h3>
              <p className="text-gray-700">
                {slot.profiles?.full_name || "이름 없음"}
              </p>
            </div>

            <div>
              <h3 className="font-bold">남은 좌석</h3>
              <div className="mt-2 flex items-center gap-4">
                <div className="text-2xl font-bold">{availableSeats}</div>
                <Badge
                  className={
                    availableSeats > 0
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }
                >
                  {availableSeats > 0 ? "모집 중" : "마감"}
                </Badge>
              </div>
            </div>

            {slot.note && (
              <div>
                <h3 className="font-bold">특이사항</h3>
                <p className="text-gray-700">{slot.note}</p>
              </div>
            )}

            {availableSeats > 0 && !userCarpoolStatus && (
              <Button
                className="w-full"
                onClick={() => setRequestDialogOpen(true)}
              >
                동승 신청
              </Button>
            )}
            {userCarpoolStatus && (
              <div className="rounded-md bg-blue-50 p-3 text-sm">
                <p className="text-blue-700">
                  상태:{" "}
                  {userCarpoolStatus.status === "approved"
                    ? "✓ 승인됨"
                    : "⏳ 대기 중"}
                </p>
              </div>
            )}
          </div>
        </Card>

        <div>
          <h3 className="mb-4 text-lg font-bold">
            동승자 ({approvedRequests.length}/{slot.total_seats})
          </h3>
          {approvedRequests.length === 0 ? (
            <Card className="p-6 text-center text-gray-500">
              동승자가 없습니다
            </Card>
          ) : (
            <div className="space-y-3">
              {}
              {approvedRequests.map((request: any) => (
                <Card key={request.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold">
                        {request.profiles?.full_name || "이름 없음"}
                      </p>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      승인됨
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold">신청 대기</h3>
          {}
          {(slot.carpool_requests || []).filter(
            (r: any) => r.status === "pending",
          ).length === 0 ? (
            <Card className="p-6 text-center text-gray-500">
              신청이 없습니다
            </Card>
          ) : (
            <div className="space-y-3">
              {}
              {(slot.carpool_requests || [])
                .filter((r: any) => r.status === "pending")
                .map((request: any) => (
                  <Card key={request.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold">
                            {request.profiles?.full_name || "이름 없음"}
                          </p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-700">
                          대기 중
                        </Badge>
                      </div>
                      {request.message && (
                        <p className="text-sm text-gray-700">
                          {request.message}
                        </p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() =>
                            openApproveDialog(
                              request.id,
                              request.profiles?.full_name || "이름 없음",
                            )
                          }
                        >
                          승인
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() =>
                            openRejectDialog(
                              request.id,
                              request.profiles?.full_name || "이름 없음",
                            )
                          }
                        >
                          거절
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </div>

      <CarpoolRequestDialog
        open={requestDialogOpen}
        onOpenChange={setRequestDialogOpen}
        carpoolSlotId={slot.id}
        eventId={eventId}
      />

      <CarpoolActionsDialog
        open={actionsDialogOpen}
        onOpenChange={setActionsDialogOpen}
        action={pendingAction}
        requestId={selectedRequestId}
        eventId={eventId}
        userName={selectedUserName}
      />
    </>
  );
}
