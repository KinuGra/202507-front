// app/components/GuestButton.tsx
"use client";

import Link from "next/link";

export default function GuestButton() {
  return (
    <Link
      href="/profile"      // サーバーリダイレクト用ルート
      prefetch={false}         // 外部遷移と同様にプリフェッチさせない
      className="inline-block rounded border px-4 py-2"
    >
      ゲストとして入る
    </Link>
  );
}
