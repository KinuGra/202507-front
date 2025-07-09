import React from "react";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModeToggle } from "./ModeToggle";

interface HeaderProps {
  onIconClick: () => void;
  characterIcon: string | null;
  username: string;
}

export function Header({ onIconClick, characterIcon, username }: HeaderProps) {
  return (
    <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center gap-4">
        <button onClick={onIconClick} className="w-12 h-12 bg-blue-500 flex items-center justify-center rounded-md">
          {characterIcon ? (
            <img src={characterIcon} alt="Character" className="w-10 h-10 rounded-md object-cover" />
          ) : (
            <span className="text-white font-bold text-2xl">M</span>
          )}
        </button>
        <span className="text-lg font-semibold text-gray-800 dark:text-white">{username}</span>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-10 h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md">
            <Menu className="text-gray-600 dark:text-gray-300" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <ModeToggle />
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
