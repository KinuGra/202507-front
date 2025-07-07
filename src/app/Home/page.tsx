"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import PushButton from "./components/PushButton";
import CharacterSelector from "./components/CharacterSelector";

export default function HomePage() {
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [characterIcon, setCharacterIcon] = useState<string | null>(null);

  const handleCharacterSelect = (icon: string) => {
    setCharacterIcon(icon);
    setShowCharacterSelector(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        onIconClick={() => setShowCharacterSelector(true)}
        characterIcon={characterIcon}
      />
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-bold text-orange-500 mb-8">
          みんなで
          <br />
          早押しクイズ
        </h1>
        <PushButton />
        <div className="mt-8 w-full max-w-md flex justify-center space-x-4">
          <Button className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg">
            ルーム作成
          </Button>
          <Button className="w-1/2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg">
            ルーム参加
          </Button>
        </div>
      </main>
      <BottomNav />

      {showCharacterSelector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCharacterSelector(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <CharacterSelector 
              onSelectCharacter={handleCharacterSelect}
              onClose={() => setShowCharacterSelector(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
