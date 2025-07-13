// app/components/GuestButton.tsx
"use client";

import Link from "next/link";

export default function GuestButton() {
  return (
    <Link
      href="/profile"      // サーバーリダイレクト用ルート
      prefetch={false}         // 外部遷移と同様にプリフェッチさせない
      className="w-full text-center rounded border border-black px-4 py-4 transition-all hover:scale-105 hover:bg-gray-50"
    >
      ゲストとして参加
    </Link>
  );
}
