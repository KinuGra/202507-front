"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Crown } from "lucide-react";

// --- Type Definitions ---
interface PlayerResult {
  rank: number;
  name: string;
  avatarUrl: string;
  score: number;
}

// --- Mock Data ---
const mockScores = [
  { name: "Player 3", avatarUrl: "/images/avatars/person_avatar_3.png", score: 20 },
  { name: "Player 1", avatarUrl: "/images/avatars/person_avatar_1.png", score: 30 },
  { name: "Player 4", avatarUrl: "/images/avatars/person_avatar_4.png", score: 10 },
  { name: "Player 2", avatarUrl: "/images/avatars/person_avatar_2.png", score: 20 },
  { name: "Player 5", avatarUrl: "/images/avatars/person_avatar_5.png", score: 0 },
  { name: "Player 6", avatarUrl: "/images/avatars/person_avatar_6.png", score: 0 },
];

// Sort players by score and assign ranks
const getRankedPlayers = (scores: Omit<PlayerResult, "rank">[]): PlayerResult[] => {
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  let rank = 1;
  return sortedScores.map((player, index) => {
    if (index > 0 && sortedScores[index].score < sortedScores[index - 1].score) {
      rank = index + 1;
    }
    return { ...player, rank };
  });
};

const rankedPlayers = getRankedPlayers(mockScores);
const topThree = rankedPlayers.filter((p) => p.rank <= 3);
const others = rankedPlayers.filter((p) => p.rank > 3);

// --- Component ---
export default function ResultScreenPage() {
  const [visiblePlayers, setVisiblePlayers] = useState<PlayerResult[]>([]);
  const [showOthers, setShowOthers] = useState(false);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    topThree.forEach((player, index) => {
      timeouts.push(
        setTimeout(() => {
          setVisiblePlayers((prev) => [...prev, player]);
        }, (index + 1) * 700) // Stagger the appearance of top 3
      );
    });

    if (others.length > 0) {
      timeouts.push(
        setTimeout(() => {
          setShowOthers(true);
        }, (topThree.length + 1) * 700)
      );
    }

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">最終結果</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 min-h-[280px]">
            {visiblePlayers.map((player) => (
              <div
                key={player.name}
                className={`flex items-center p-4 rounded-lg animate-fade-in-down`}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-2xl font-bold w-8 text-center">{player.rank}</div>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={player.avatarUrl} alt={player.name} />
                    <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="font-medium">{player.name}</div>
                </div>
                <div className="text-xl font-semibold">{player.score} pts</div>
                {player.rank === 1 && <Crown className="w-8 h-8 text-yellow-500 ml-4" />}
              </div>
            ))}
          </div>

          {showOthers && others.length > 0 && (
            <div className="mt-6 pt-4 border-t animate-fade-in">
              <div className="flex flex-wrap justify-start gap-4">
                {others.map((player) => (
                  <div key={player.name} className="flex flex-col">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={player.avatarUrl} alt={player.name} />
                      <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs mt-1">{player.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="mt-8 text-center">
        <Link href="/Home">
          <Button size="lg">ホームに戻る</Button>
        </Link>
      </div>
    </div>
  );
}

// Add this to your globals.css for the animation
/*
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in-down {
  animation: fade-in-down 0.5s ease-out forwards;
}

.animate-fade-in {
    animation: fade-in 1s ease-out forwards;
}
*/
