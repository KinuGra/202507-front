"use client";

import { pusherClient } from "@/app/lib/pusher/client";
import { RoomDetails } from "../components/RoomDetails";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateRoomPage() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomId") || undefined;
  localStorage.setItem("roomId", roomId? roomId.toString() : "");
  const [username, setUsername] = useState<string | null>(null);
  const [uuid, setUuid] = useState<string | null>(null);
  const [users, setUsers] = useState({});

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setUuid(localStorage.getItem("uuid"));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <RoomDetails isHost={true} initialRoomId={roomId} users={users} />
    </div>
  );
}