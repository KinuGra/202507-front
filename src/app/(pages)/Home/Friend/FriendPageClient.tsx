"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type UserProfile = {
  uuid: string;
  username: string;
};

type FriendPageClientProps = {
  user: UserProfile | null;
};

export default function FriendPageClient({ user }: FriendPageClientProps) {
  const [friendUuid, setFriendUuid] = useState("");

  if (!user) {
    // ゲストユーザーの場合は何も表示しない
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">フレンド</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>自分の情報</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback>{user.username?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user.username}</p>
            <p className="text-sm text-gray-500">UUID: {user.uuid}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>フレンドを追加</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="相手のUUIDを入力"
              value={friendUuid}
              onChange={(e) => setFriendUuid(e.target.value)}
            />
            <Button type="submit">追加</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}