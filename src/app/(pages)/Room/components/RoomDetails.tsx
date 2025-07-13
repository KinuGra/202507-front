"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRoomId } from "@/app/features/createRoomId";
import { pusherClient } from "@/app/lib/pusher/client";

interface User {
  name: string;
  icon: string | null;
  uuid: string;
}

// Mock user data
export const mockUsers: User[] = [
  { name: "User 1", icon: "/images/avatars/person_avatar_1.png", uuid: "mock-uuid-1" },
  { name: "User 2", icon: "/images/avatars/person_avatar_2.png", uuid: "mock-uuid-2" },
  { name: "User 3", icon: "/images/avatars/person_avatar_3.png", uuid: "mock-uuid-3" },
];

interface RoomDetailsProps {
  isHost: boolean;
  initialRoomId?: string;
  users?: {};
}

export function RoomDetails({ isHost, initialRoomId, users = {} }: RoomDetailsProps) {
  const searchParams = useSearchParams();
  const queryRoomId = searchParams.get("roomId");
  const [roomId, setRoomId] = useState(queryRoomId || initialRoomId || "");
  const [participants, setParticipants] = useState<User[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    // クエリパラメータが変わった場合もroomIdを更新
    if (queryRoomId && queryRoomId !== roomId) {
      setRoomId(queryRoomId);
    }

    try {
      const savedUsername = localStorage.getItem("username");
      const savedIcon = localStorage.getItem("characterIcon"); // キーを統一
      const savedUuid = localStorage.getItem("uuid");
      const currentUser: User = {
        name: savedUsername || "ゲスト",
        icon: savedIcon,
        uuid: savedUuid || "",
      };
      setParticipants(prevParticipants => {
        // uuidで重複排除
        if (prevParticipants.some(p => p.uuid === currentUser.uuid)) {
          return prevParticipants;
        }
        return [...prevParticipants, currentUser];
      });
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, [isHost, queryRoomId, hasGenerated]);

    const handleJoin = async () => {
        try {
            await fetch("/api/game/join-room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: localStorage.getItem("username"),
                  roomId,
                  uuid: localStorage.getItem("uuid"),
                  icon: localStorage.getItem("icon"),
                  joined_at: new Date().toISOString(),
                }),
            });
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        if (!roomId) return;

        // Pusherクライアントの初期化
        const pusher = pusherClient;
        // チャンネル購読
        const channel = pusher.subscribe(`room-${roomId}`);

        // イベント受信
        channel.bind('user-joined', (data: {
      username: string,
      roomId: string,
      uuid: string,
      icon: string,
      joined_at: string
    }) => {
      console.log('User joined', data);
      setParticipants(prevParticipants => {
        // uuidで重複排除
        if (prevParticipants.some(p => p.uuid === data.uuid)) {
          return prevParticipants;
        }
        return [
          ...prevParticipants,
          {
            name: data.username,
            icon: data.icon,
            uuid: data.uuid,
          }
        ];
      });
    });

        // 参加を通知する
        handleJoin();

        // クリーンアップ
        return () => {
            channel.unbind_all();
            pusher.unsubscribe(`room-${roomId}`);
        };
    }, [roomId]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>ルーム詳細</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="room-id">ルームID</Label>
          <div className="flex items-center space-x-2">
            <Input id="room-id" value={roomId} readOnly />
            <Button onClick={() => navigator.clipboard.writeText(roomId)} disabled={!isHost}>
              IDをコピー
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">参加者</h3>
          <div className="flex items-center space-x-4">
            {participants.map((user, index) => (
              <div key={user.uuid || index} className="flex flex-col items-center space-y-1">
                <Avatar>
                  {user.icon && <AvatarImage src={user.icon} alt={user.name} />}
                  <AvatarFallback>{user.name?.charAt(0) || 'G'}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Link href={isHost ? "/Home" : "/Room/JoinRoom"}>
          <Button variant="outline">キャンセル</Button>
        </Link>
        {isHost && <Button>スタート</Button>}
      </CardFooter>
    </Card>
  );
}
