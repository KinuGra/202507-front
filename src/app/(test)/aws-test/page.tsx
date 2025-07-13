"use client";

import { saveToDynamoDB } from "@/app/features/lambda/db";
import { v4 as uuidv4 } from "uuid";

export default function Lambda() {
  const handleClick = () => {
    const data = {
      uuid: uuidv4(),                      // ✅ 必須フィールド
      question: "日本の首都は？",           // ✅ 必須フィールド
      answer: "東京"                        // ✅ 必須フィールド
    };

    console.log("送信データ:", data); // ✅ デバッグログを追加

    saveToDynamoDB(data);
  };

  return <button onClick={handleClick}>保存</button>;
}
