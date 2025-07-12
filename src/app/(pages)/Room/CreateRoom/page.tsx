"use client";

import { RoomDetails } from "../components/RoomDetails";
import { useSearchParams } from "next/navigation";

export default function CreateRoomPage() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId") || undefined;
  return (
    <div className="container mx-auto p-4">
      <RoomDetails isHost={true} initialRoomId={roomId} />
    </div>
  );
}