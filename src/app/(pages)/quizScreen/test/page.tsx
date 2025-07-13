"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QuizTestPage() {
  const router = useRouter();

  useEffect(() => {
    // テスト用のデータをlocalStorageに設定
    localStorage.setItem("uuid", "test-user-uuid");
    localStorage.setItem("currentRoomId", "test-room");
    
    // quizScreenページにリダイレクト
    router.push("/quizScreen?roomId=test-room");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="text-lg">Setting up test data...</div>
        <div className="text-sm text-gray-500 mt-2">Redirecting to quiz...</div>
      </div>
    </div>
  );
}