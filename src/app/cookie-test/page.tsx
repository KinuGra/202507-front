// app/cookie-test/page.tsx
import { cookies } from 'next/headers';

export default function CookieTestPage() {
  // ★ Server Action をページの中にインライン定義するパターン
  async function action() {
    'use server';

    const cookieStore = cookies();
    const token = (await cookieStore).get('id_token');

    if (!token) {
      // ここでエラーを投げると、Next.js の error.tsx (またはエラーページ) が動きます
      throw new Error('id_token が存在しません。');
    }
    console.log('token =', token);
    console.log('===============id_token =', token.value);
  }

  return (
    <form action={action} className="space-y-4 p-4">
      <button className="btn-primary">サーバーで id_token を出力</button>
    </form>
  );
}
