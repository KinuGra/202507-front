// HomeClientLayout.tsx (修正後)

"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DialogTitle } from "@/components/ui/dialog";
import { BottomNav } from "./BottomNav";
import { CharacterSelector } from "./CharacterSelector";

interface HomeClientLayoutProps {
  children: React.ReactNode;
}

export function HomeClientLayout({ children }: HomeClientLayoutProps) {
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [characterIcon, setCharacterIcon] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("ゲスト");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedIcon = localStorage.getItem("characterIcon");
      const savedUsername = localStorage.getItem("username");
      if (savedIcon) setCharacterIcon(savedIcon);
      if (savedUsername) setUsername(savedUsername);
    } catch (error) {
      // ignore
    }
  }, []);

  function handleCharacterSelect(icon: string, name: string) {
    try {
      localStorage.setItem("characterIcon", icon);
      localStorage.setItem("username", name);
    } catch (error) {}
    setCharacterIcon(icon);
    setUsername(name);
    setShowCharacterSelector(false);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b px-4 py-2 flex items-center gap-2">
        {/* ▼▼▼▼▼ ここから変更 ▼▼▼▼▼ */}
        {!isMounted ? (
          <>
            {/* マウント前はサーバーと同じスケルトンを表示 */}
            <Button variant="ghost" size="icon" disabled aria-label="キャラクター選択">
              <Avatar>
                <AvatarFallback>G</AvatarFallback>
              </Avatar>
            </Button>
            <span className="font-bold">ゲスト</span>
          </>
        ) : (
          <>
            {/* マウント後にlocalStorageの値を反映したUIを表示 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCharacterSelector(true)}
              aria-label="キャラクター選択"
            >
              <Avatar>
                {characterIcon ? (
                  <AvatarImage src={characterIcon} alt={username} />
                ) : (
                  <AvatarFallback>G</AvatarFallback>
                )}
              </Avatar>
            </Button>
            <span className="font-bold">{username}</span>
          </>
        )}
        {/* ▲▲▲▲▲ ここまで変更 ▲▲▲▲▲ */}
      </header>
      <main className="flex-1 flex flex-col items-center justify-start">{children}</main>
      <BottomNav />
      <Sheet open={showCharacterSelector} onOpenChange={setShowCharacterSelector}>
        <SheetContent side="top" className="max-w-md mx-auto">
          <DialogTitle className="sr-only">キャラクター選択</DialogTitle>
          <CharacterSelector
            onSelectCharacter={handleCharacterSelect}
            onClose={() => setShowCharacterSelector(false)}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}
