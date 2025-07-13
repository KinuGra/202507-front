"use client";

import React from "react";
import { Home /*, Users, Edit, FileText, Crown */ } from "lucide-react";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/Home", icon: Home, label: "ホーム" },
    // { href: "/Home/Friend", icon: Users, label: "フレンド" },
    // { href: "/Home/CreateProblem", icon: Edit, label: "問題作成" },
    // { href: "/Home/BattleRecord", icon: FileText, label: "戦績" },
    // { href: "/Home/Ranking", icon: Crown, label: "ランキング" },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-2 shadow-t-lg">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 ${isActive ? 'text-sky-400' : ''}`}
            >
              <Icon />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </footer>
  );
}
