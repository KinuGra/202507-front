import LoginButton from "@/app/components/LoginButton";
import GuestButton from "@/app/components/GuestButton";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
        <LoginButton />
        <GuestButton />
    </main>
  );
}