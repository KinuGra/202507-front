import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CharacterSelectorProps {
  onSelectCharacter: (icon: string, name: string) => void;
  onClose: () => void;
}

const AVAILABLE_CHARACTERS = [
  "/images/avatars/person_avatar_1.png",
  "/images/avatars/person_avatar_2.png",
  "/images/avatars/person_avatar_3.png",
  "/images/avatars/person_avatar_4.png",
  "/images/avatars/person_avatar_5.png",
  "/images/avatars/person_avatar_6.png",
];

const DEFAULT_USERNAME = "ゲスト";

export function CharacterSelector({ onSelectCharacter, onClose }: CharacterSelectorProps) {
  const [username, setUsername] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("icon", selectedIcon ? selectedIcon : "");
  })

  return (
    <div className="p-4 bg-white/90 backdrop-blur-lg rounded-lg shadow-xl border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Select Your Character</h3>
      <div className="mb-4">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <Input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        {AVAILABLE_CHARACTERS.map((icon, index) => {
          const isSelected = selectedIcon === icon;
          const borderColor = isSelected ? "border-orange-500" : "border-gray-300";
          
          return (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              onClick={() => setSelectedIcon(icon)}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 border-2 ${borderColor} hover:border-orange-500 bg-gray-100 shadow-lg hover:shadow-orange-500/20`}
            >
              <img 
                src={icon} 
                alt={`Character ${index + 1}`} 
                className="w-16 h-16 object-contain rounded-full" 
              />
            </Button>
          );
        })}
      </div>
      <Button
        onClick={() => {
          const finalIcon = selectedIcon || AVAILABLE_CHARACTERS[0];
          const finalUsername = username || DEFAULT_USERNAME;
          onSelectCharacter(finalIcon, finalUsername);
          onClose();
        }}
        className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white"
      >
        決定
      </Button>
    </div>
  );
}