"use client";

import { pusherClient } from "@/app/lib/pusher/client";
import { RoomDetails } from "../components/RoomDetails";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateRoomPage() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId") || undefined;
  const [username, setUsername] = useState<string | null>(null);
  const [uuid, setUuid] = useState<string | null>(null);
  const [users, setUsers] = useState({});

  useEffect(() => {
    if (roomId) {
      localStorage.setItem("roomId", roomId.toString());
    }
    setUsername(localStorage.getItem("username"));
    setUuid(localStorage.getItem("uuid"));
  }, [roomId]);

  return (
    <div className="container mx-auto p-4">
      <RoomDetails isHost={true} initialRoomId={roomId} />
    </div>
  );
}