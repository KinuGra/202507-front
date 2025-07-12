import LoginButton from "@/app/components/LoginButton";
import GuestButton from "@/app/components/GuestButton";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500 via-blue-400 to-sky-300" />
      <div className="absolute bottom-0 w-full h-1/3 bg-amber-100" />
      <Card className="w-[90%] max-w-md transform transition-all hover:scale-105 border-none shadow-lg bg-white/60 backdrop-blur-md relative z-10">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 bg-clip-text text-transparent">
              ぼくらの早押しクイズ
          </CardTitle>
          <CardDescription className="text-gray-600 text-lg mt-2">
            夏の思い出作りに、みんなでクイズ対戦だッ！
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-2 pb-8 px-8">
          <LoginButton />
          <div className="relative group w-full">
            <GuestButton />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 rounded opacity-50 group-hover:opacity-100 transition-opacity -z-10" />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}