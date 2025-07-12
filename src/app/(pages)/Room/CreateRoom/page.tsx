"use client";

import { RoomDetails } from "../components/RoomDetails";

export default function CreateRoomPage() {
  return (
    <div className="container mx-auto p-4">
      <RoomDetails isHost={true} />
    </div>
  );
}