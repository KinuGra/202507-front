"use client";

import { useSearchParams } from 'next/navigation';
import { RoomDetails } from "../components/RoomDetails";
import React from 'react';

export function WaitingRoomPageContent() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get('roomId') || 'default-room-id';

  return (
    <div className="container mx-auto p-4">
      <RoomDetails isHost={false} initialRoomId={roomId} />
    </div>
  );
}

export default function WaitingRoomPage() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <WaitingRoomPageContent />
    </React.Suspense>
  );
}
