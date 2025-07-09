"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import PushButton from "./components/PushButton";

export default function HomePage() {
  return (
    <>
      <div className="p-4 text-center">
        <h1 className="text-4xl font-bold text-orange-500 mb-8">
          みんなで
          <br />
          早押しクイズ
        </h1>
        <PushButton />
        <div className="mt-8 w-full max-w-md flex justify-center space-x-4">
          <Button className="w-1/2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg">
            ルーム作成
          </Button>
          <Button className="w-1/2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg">
            ルーム参加
          </Button>
        </div>
      </div>
    </>
  );
}
