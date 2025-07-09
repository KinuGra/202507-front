import React from "react";
import { Menu } from "lucide-react";

interface HeaderProps {
  onIconClick: () => void;
  characterIcon: string | null;
  username: string;
}

const Header: React.FC<HeaderProps> = ({ onIconClick, characterIcon, username }) => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="flex items-center gap-4">
        <button onClick={onIconClick} className="w-12 h-12 bg-blue-500 flex items-center justify-center rounded-md">
          {characterIcon ? (
            <img src={characterIcon} alt="Character" className="w-10 h-10 rounded-md object-cover" />
          ) : (
            <span className="text-white font-bold text-2xl">M</span>
          )}
        </button>
        <span className="text-lg font-semibold text-gray-800">{username}</span>
      </div>
      <button className="w-10 h-10 bg-gray-200 flex items-center justify-center rounded-md">
        <Menu className="text-gray-600" />
      </button>
    </header>
  );
};

export default Header;