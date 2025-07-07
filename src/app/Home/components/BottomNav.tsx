import React from "react";
import { Users, Edit, FileText } from "lucide-react";

const BottomNav = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-2 shadow-t-lg">
      <div className="flex justify-around items-center">
        <button className="flex flex-col items-center p-2">
          <Users />
          <span className="text-xs mt-1">フレンド</span>
        </button>
        <button className="flex flex-col items-center p-2">
          <Edit />
          <span className="text-xs mt-1">問題作成</span>
        </button>
        <button className="flex flex-col items-center p-2">
          <FileText />
          <span className="text-xs mt-1">戦績</span>
        </button>
      </div>
    </footer>
  );
};

export default BottomNav;