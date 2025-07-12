"use client";

import Link from "next/link";
import type React from "react";
import { Button } from "@/components/ui/button";
import { PushButton } from "./components/PushButton";
import { useRouter } from "next/navigation";
import { createRoomId } from "@/app/features/createRoomId";
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {
  const router = useRouter();

  const handleCreateRoom = async () => {
    const id = await createRoomId();
    const uuid = uuidv4();
    localStorage.setItem("uuid", uuid.toString());

    await saveRoom({
      roomId: id.toString(),
      status: "waiting",
      currentSeq: 0,
      quizId: 1,
    });

    try {
      const res = await fetch('/api/game/insert-rp', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: id,
          uuid: uuid,
          currentScore: 0
        })
      })
    } catch (e) { console.log(e) }

    router.push(`/Room/CreateRoom?roomId=${id}`);
  };

  async function saveRoom(roomData: {
    roomId: string;
    status: string;
    currentSeq: number;
    quizId: number;
    created_at?: string;
  }) {
    const res = await fetch("/api/game/create-room", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roomData),
    });
    const data = await res.json();
    console.log("api/game/create-room", data);
    localStorage.setItem("roomIdPK", data.foundRoom.id);
    return data;
  }

  return (
    <>
      <div className="p-4 text-center">
        <h1 className="text-4xl font-bold text-orange-500 mb-8">
          僕らの
          <br />
          早押しクイズ
        </h1>
        <PushButton />
        <div className="mt-8 w-full max-w-md flex justify-center space-x-4">
          <Button
            className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg"
            onClick={handleCreateRoom}
          >
            ルーム作成
          </Button>
          <Link href="/Room/JoinRoom" className="w-1/2">
            <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg">
              ルーム参加
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
