// app/profile/page.tsx
import { verifyIdToken } from "@/app/actions/verify";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  // ① Server Action を直接呼び出してペイロードを取得
  let user;
  try {
    user = await verifyIdToken();
  } catch {
    // 未ログイン・検証失敗なら / へ
    redirect("/");
  }

  // ② 取得した情報を描画 (= SSR ストリーミング)
  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold">プロフィール</h1>

      <section className="space-y-2 text-lg">
        <p><strong>ユーザー ID (sub):</strong> {user.sub}</p>
        <p><strong>メール:</strong> {user.email}</p>
        {user.name && <p><strong>表示名:</strong> {user.name}</p>}
        <p className="text-sm text-gray-500">
          トークン有効期限 (exp): {new Date(user.exp * 1000).toLocaleString()}
        </p>
      </section>
    </main>
  );
}
