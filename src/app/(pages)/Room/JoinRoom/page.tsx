"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Terminal } from "lucide-react";
import { mockRooms } from "./mock-rooms";

export default function JoinRoomPage() {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleJoinRoomById = () => {
    const room = mockRooms.find((r) => r.id === roomIdInput);
    if (room) {
      router.push(`/Room/WaitingRoom?roomId=${room.id}`);
    } else {
      setError("指定されたIDのルームが見つかりませんでした。");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <Link href="/Home" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">ルームに参加</h1>
      </div>
      <div className="space-y-4">
        {mockRooms.map((room) => (
          <Card key={room.id} className="w-full">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={room.creator.icon} alt={room.creator.name} />
                  <AvatarFallback>{room.creator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold">{room.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    カテゴリ: {room.category}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    問題数: {room.problemCount}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium">参加者</p>
                  <p className="text-lg font-bold">{room.participantCount}</p>
                </div>
                <Link href={`/Room/WaitingRoom?roomId=${room.id}`}>
                  <Button>参加する</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t">
        <h2 className="text-xl font-semibold mb-4">IDでルームに参加</h2>
        <div className="flex w-full max-w-sm items-center space-x-2">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="room-id-input">ルームID</Label>
            <Input
              id="room-id-input"
              type="text"
              placeholder="ルームIDを入力..."
              value={roomIdInput}
              onChange={(e) => {
                setRoomIdInput(e.target.value);
                setError(null); // Clear error when user types
              }}
            />
          </div>
          <Button onClick={handleJoinRoomById} className="self-end">
            参加
          </Button>
        </div>
        {error && (
          <Alert variant="destructive" className="mt-4 max-w-sm">
            <Terminal className="h-4 w-4" />
            <AlertTitle>エラー</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}