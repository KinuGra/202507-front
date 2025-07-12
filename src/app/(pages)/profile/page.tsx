// app/(pages)/profile/page.tsx
import { verifyIdToken } from "@/app/actions/verify";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await verifyIdToken();

  // ── ログイン必須にしたい場合はここで弾く ──
  // if (!user) redirect("/");   ← 今回はゲストも許すので削除

  return (
    <main className="mx-auto max-w-xl px-4 py-10 space-y-8">
      <h1 className="text-2xl font-bold">プロフィール</h1>

      {user ? (
        /* 認証ユーザー用ビュー */
        <section className="space-y-2 text-lg">
          <p><strong>ユーザー ID (sub):</strong> {user.sub}</p>
          <p><strong>メール:</strong> {user.email}</p>
          {user.name && <p><strong>表示名:</strong> {user.name}</p>}
          <p className="text-sm text-gray-500">
            トークン有効期限: {new Date(user.exp * 1000).toLocaleString()}
          </p>
        </section>
      ) : (
        /* ★ ゲスト用ビュー */
        <section className="space-y-4 text-center">
          <p className="text-lg">あなたは <strong>ゲスト</strong> としてプレイ中です。</p>
          <p className="text-sm text-gray-500">
            ログインすると戦績の保存やパスキー登録ができます。
          </p>
        </section>
      )}

      {/* 認証ユーザーのみ表示したいボタンはガード */}
      {user && (
        <section>
          <a
            href="/auth/passkey/add"
            className="inline-block rounded bg-blue-600 px-4 py-2 text-white"
          >
            パスキーを追加
          </a>
        </section>
      )}
    </main>
  );
}
