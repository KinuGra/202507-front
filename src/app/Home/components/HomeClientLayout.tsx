"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Header from "./Header";
import BottomNav from "./BottomNav";
import CharacterSelector from "./CharacterSelector";

interface HomeClientLayoutProps {
  children: React.ReactNode;
}

export default function HomeClientLayout({ children }: HomeClientLayoutProps) {
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [characterIcon, setCharacterIcon] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("ゲスト");

  useEffect(() => {
    try {
      const savedIcon = localStorage.getItem("characterIcon");
      const savedUsername = localStorage.getItem("username");
      if (savedIcon) {
        setCharacterIcon(savedIcon);
      }
      if (savedUsername) {
        setUsername(savedUsername);
      }
    } catch (error) {
      console.error("Failed to load user data from localStorage", error);
    }
  }, []);

  const handleCharacterSelect = (icon: string, name: string) => {
    try {
      localStorage.setItem("characterIcon", icon);
      localStorage.setItem("username", name);
    } catch (error) {
      console.error("Failed to save user data to localStorage", error);
    }
    setCharacterIcon(icon);
    setUsername(name);
    setShowCharacterSelector(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        onIconClick={() => setShowCharacterSelector(true)}
        characterIcon={characterIcon}
        username={username}
      />
      <main className="flex-1 flex flex-col items-center justify-start">
        {children}
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