"use client";

import Link from "next/link";
import type React from "react";
import { Button } from "@/components/ui/button";
import { PushButton } from "./components/PushButton";
import { useRouter } from "next/navigation";
import { createRoomId } from "@/app/features/createRoomId";
import { v4 as uuidv4 } from "uuid";

export default function HomePage() {
  const router = useRouter();

  const handleCreateRoom = async () => {
    // ルームIDとUUIDの生成
    const roomId = await createRoomId();
    const uuid = uuidv4();

    // UUID を保存（後で別ページで使えるように）
    localStorage.setItem("uuid", uuid);

    // ルームを保存
    const savedRoom = await saveRoom({
      roomId: roomId.toString(),
      status: "waiting",
      currentSeq: 0,
      quizId: 1,
    });

    // roomIdのPKも保存
    localStorage.setItem("roomIdPK", savedRoom.foundRoom.id);

    // ユーザー作成
    try {
      const res = await fetch("/api/game/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid: uuid,
          username: localStorage.getItem("username"),
          icon: localStorage.getItem("icon"),
          loginId: uuid,
          password: "default",
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("create-user 失敗:", error);
      }
    } catch (e) {
      console.error("create-user 通信エラー:", e);
    }

    // 参加者登録
    try {
      const res = await fetch("/api/game/insert-rp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: roomId,
          uuid: uuid,
          currentScore: 0,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("insert-rp 失敗:", error);
      }
    } catch (e) {
      console.error("insert-rp 通信エラー:", e);
    }

    // ルーム画面へ遷移
    router.push(`/Room/CreateRoom?roomId=${roomId}`);
  };

  // 部屋情報保存用API
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

    if (!res.ok) {
      const error = await res.json();
      console.error("create-room 失敗:", error);
      throw new Error("ルーム作成失敗");
    }

    const data = await res.json();
    console.log("api/game/create-room", data);
    return data;
  }

  return (
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
  );
}
