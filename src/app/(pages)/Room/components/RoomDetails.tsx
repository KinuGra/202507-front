"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pusherClient } from "@/app/lib/pusher/client";
import { fetchUsersByRoom } from "@/app/features/getUsersByRoom";

/* --------------------- 型定義 --------------------- */
interface User {
  uuid: string;
  name: string;
  icon: string | null;
}

type ApiUser = {
  uuid: string;
  username: string | null;
  icon: string | null;
};

/* --------------------- コンポーネント --------------------- */
interface RoomDetailsProps {
  isHost: boolean;
  initialRoomId?: string;
}

export function RoomDetails({ isHost, initialRoomId }: RoomDetailsProps) {
  const searchParams = useSearchParams();
  const queryRoomId = searchParams.get("roomId");
  const [roomId, setRoomId] = useState(queryRoomId || initialRoomId || "");
  const [participants, setParticipants] = useState<User[]>([]);

  // ルームID変化に対応
  useEffect(() => {
    if (queryRoomId && queryRoomId !== roomId) {
      setRoomId(queryRoomId);
    }
  }, [queryRoomId]);

  // Django から初期参加者を取得
  useEffect(() => {
    const loadInitialParticipants = async () => {
      if (!roomId) return;

      try {
        const apiUsers: ApiUser[] = await fetchUsersByRoom(roomId);
        const normalized: User[] = apiUsers.map((u) => ({
          uuid: u.uuid,
          name: (u.username || "").trim() || "ゲスト",
          icon: u.icon,
        }));

        setParticipants((prev) => {
          const existing = new Set(prev.map((p) => p.uuid));
          return [...prev, ...normalized.filter((u) => !existing.has(u.uuid))];
        });
      } catch (err) {
        console.error("初期参加者取得失敗:", err);
      }
    };

    loadInitialParticipants();
  }, [roomId]);

  // localStorage から自分を追加
  useEffect(() => {
    try {
      const rawUsername = localStorage.getItem("username") || "";
      const currentUser: User = {
        uuid: localStorage.getItem("uuid") || "",
        name: rawUsername.trim() || "ゲスト",
        icon: localStorage.getItem("characterIcon"),
      };
      setParticipants((prev) =>
        prev.some((p) => p.uuid === currentUser.uuid) ? prev : [...prev, currentUser]
      );
    } catch (err) {
      console.error("localStorage取得失敗:", err);
    }
  }, [roomId]);

  // Pusher購読・自分の参加通知
  useEffect(() => {
    if (!roomId) return;

    const pusher = pusherClient;
    const channel = pusher.subscribe(`room-${roomId}`);

    // 他のユーザーの参加イベント
    channel.bind("user-joined", (data: {
      username: string;
      roomId: string;
      uuid: string;
      icon: string | null;
      joined_at: string;
    }) => {
      const displayName = (data.username || "").trim() || "ゲスト";
      setParticipants((prev) =>
        prev.some((p) => p.uuid === data.uuid)
          ? prev
          : [...prev, { uuid: data.uuid, name: displayName, icon: data.icon }]
      );
    });

    // 自分の参加を通知
    const notifyJoin = async () => {
      try {
        await fetch("/api/game/join-room", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: localStorage.getItem("username"),
            roomId,
            uuid: localStorage.getItem("uuid"),
            icon: localStorage.getItem("characterIcon"),
            joined_at: new Date().toISOString(),
          }),
        });
      } catch (e) {
        console.error("join-room失敗:", e);
      }
    };
    notifyJoin();

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`room-${roomId}`);
    };
  }, [roomId]);

  // 表示部分
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>ルーム詳細</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* ルームID */}
        <div className="space-y-2">
          <Label htmlFor="room-id">ルームID</Label>
          <div className="flex items-center space-x-2">
            <Input id="room-id" value={roomId} readOnly />
            <Button
              onClick={() => navigator.clipboard.writeText(roomId)}
              disabled={!isHost}
            >
              IDをコピー
            </Button>
          </div>
        </div>

        {/* 参加者一覧 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">参加者</h3>
          <div className="flex flex-wrap gap-4">
            {participants.map((user) => {
              const displayName = user.name || "ゲスト";
              return (
                <div key={user.uuid} className="flex flex-col items-center space-y-1">
                  <Avatar>
                    {user.icon && (
                      <AvatarImage src={user.icon} alt={displayName} />
                    )}
                    <AvatarFallback>
                      {displayName.charAt(0) || "G"}
                    </AvatarFallback>
                  </Avatar>
                  <span>{displayName}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end space-x-2">
        <Link href={isHost ? "/Home" : "/Room/JoinRoom"}>
          <Button variant="outline">キャンセル</Button>
        </Link>
        {isHost && (
          <Link href={`/quizScreen?roomid=${roomId}`}>
            <Button>スタート</Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
