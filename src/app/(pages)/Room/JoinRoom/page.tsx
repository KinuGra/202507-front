"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, Terminal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PushButton } from "@/app/(pages)/Home/components/PushButton";

export default function JoinRoomPage() {
  const [roomIdInput, setRoomIdInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleJoinRoomById = async () => {
    setError(null);
    if (!roomIdInput) {
      setError("ルームIDを入力してください。");
      return;
    }
    try {
      // 1. ルーム存在確認
      const existsRes = await fetch(
        `/api/game/room-exists?roomId=${roomIdInput}`
      );
      const existsData = await existsRes.json();
      if (!existsData.exists) {
        setError("指定されたIDのルームが見つかりませんでした。");
        return;
      }

      // 2. ルーム参加API
      const username = localStorage.getItem("username") || "ゲスト";
      const uuid = localStorage.getItem("uuid") || "";
      const icon = localStorage.getItem("characterIcon") || "";
      const joined_at = new Date().toISOString();

      const joinRes = await fetch("/api/game/join-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          roomId: roomIdInput,
          uuid,
          icon,
          joined_at,
        }),
      });

      if (!joinRes.ok) {
        const errorData = await joinRes.json();
        setError(errorData.message || "ルーム参加に失敗しました。");
        return;
      }

      // 3. 待機画面へ遷移
      router.push(`/Room/WaitingRoom?roomId=${roomIdInput}`);
    } catch (err) {
      setError("通信エラーが発生しました。");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center p-4">
        <Link href="/Home" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">ルームに参加</h1>
      </header>
      <main className="flex-grow flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>IDでルームに参加</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6 pt-6">
            <div className="w-full grid gap-1.5">
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
                onKeyDown={(e) => e.key === 'Enter' && handleJoinRoomById()}
              />
            </div>
            {error && (
              <Alert variant="destructive" className="w-full">
                <Terminal className="h-4 w-4" />
                <AlertTitle>エラー</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <PushButton onClick={handleJoinRoomById}>
              ルームに参加する
            </PushButton>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
