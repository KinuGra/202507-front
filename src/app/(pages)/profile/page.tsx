// app/(pages)/profile/page.tsx
import { verifyIdToken } from "@/app/actions/verify";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const user = await verifyIdToken();

  return <ProfileClient user={user} />;
}
