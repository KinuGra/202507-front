"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { mockGenres, Genre } from "../CreateRoom/mock-genres";
import { createRoomId } from "@/app/features/createRoomId";

interface User {
  name: string;
  icon: string | null;
}

// Mock user data
export const mockUsers: User[] = [
  { name: "User 1", icon: "/images/avatars/person_avatar_1.png" },
  { name: "User 2", icon: "/images/avatars/person_avatar_2.png" },
  { name: "User 3", icon: "/images/avatars/person_avatar_3.png" },
];

interface RoomDetailsProps {
  isHost: boolean;
  initialRoomId?: string;
}

export function RoomDetails({ isHost, initialRoomId }: RoomDetailsProps) {
  const searchParams = useSearchParams();
  const queryRoomId = searchParams.get("roomId");
  const [roomId, setRoomId] = useState(queryRoomId || initialRoomId || "");
  // const [userGenres, setUserGenres] = useState<Genre[]>([]);
  // const [showUserGenres, setShowUserGenres] = useState(false);
  // const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  // const [numProblems, setNumProblems] = useState(10);
  const [participants, setParticipants] = useState<User[]>(mockUsers);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    // クエリパラメータが変わった場合もroomIdを更新
    if (queryRoomId && queryRoomId !== roomId) {
      setRoomId(queryRoomId);
    }

    try {
      // const savedGenres = localStorage.getItem('problem-genres');
      // if (savedGenres) {
      //   setUserGenres(JSON.parse(savedGenres));
      // }

      const savedUsername = localStorage.getItem("username");
      const savedIcon = localStorage.getItem("characterIcon");
      const currentUser: User = {
        name: savedUsername || "ゲスト",
        icon: savedIcon,
      };

      setParticipants(prevParticipants => {
        const userExists = prevParticipants.some(p => p.name === currentUser.name);
        if (userExists) {
          return prevParticipants.map(p => p.name === currentUser.name ? currentUser : p);
        }
        return [currentUser, ...prevParticipants];
      });

    } catch (error) {
      console.error("Failed to load data from localStorage", error);
    }
  }, [isHost, queryRoomId, hasGenerated]);

  // const displayedGenres = showUserGenres ? userGenres : mockGenres;

  // const handleGenreChange = (value: string) => {
  //   const genre = displayedGenres.find(g => g.id.toString() === value);
  //   setSelectedGenre(genre || null);
  //   setNumProblems(10); 
  // };

  // const handleNumProblemsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = parseInt(e.target.value, 10);
  //   if (selectedGenre && value > selectedGenre.problems.length) {
  //     setNumProblems(selectedGenre.problems.length);
  //   } else {
  //     setNumProblems(value);
  //   }
  // };

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

        {/*
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>カテゴリ</Label>
            <div className="flex items-center space-x-2">
              <Label htmlFor="genre-switch">マイクイズ</Label>
              <Switch id="genre-switch" checked={showUserGenres} onCheckedChange={setShowUserGenres} disabled={!isHost} />
            </div>
          </div>
          <Select onValueChange={handleGenreChange} disabled={!isHost}>
            <SelectTrigger>
              <SelectValue placeholder="ジャンルを選択" />
            </SelectTrigger>
            <SelectContent>
              {displayedGenres.map((genre) => (
                <SelectItem key={genre.id} value={genre.id.toString()}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="num-problems">問題数</Label>
          <Input 
            id="num-problems" 
            type="number" 
            value={numProblems}
            onChange={handleNumProblemsChange}
            min={1}
            max={selectedGenre ? selectedGenre.problems.length : 100}
            disabled={!isHost || !selectedGenre}
          />
          {selectedGenre && <p className="text-sm text-muted-foreground">最大: {selectedGenre.problems.length}</p>}
        </div>
        */}

        <div className="space-y-4">
          <h3 className="text-lg font-medium">参加者</h3>
          <div className="flex items-center space-x-4">
            {participants.map((user, index) => (
              <div key={index} className="flex flex-col items-center space-y-1">
                <Avatar>
                  {user.icon && <AvatarImage src={user.icon} alt={user.name} />}
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
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
