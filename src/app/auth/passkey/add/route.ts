// app/auth/passkey/add/route.ts
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const {
  NEXT_PUBLIC_COG_DOMAIN: domain,
  NEXT_PUBLIC_COG_CLIENT_ID: clientId,
  NEXT_PUBLIC_REDIRECT_URI: redirectUri,
} = process.env;

if (!domain || !clientId || !redirectUri) {
  throw new Error("Cognito の環境変数 (DOMAIN / CLIENT_ID / REDIRECT_URI) が不足しています。");
}

export async function GET(req: NextRequest) {
  // 1) CSRF 対策用のランダム state を生成
  const state = crypto.randomUUID();

  // 2) state を HttpOnly Cookie に保存（有効期限 5 分）
  (await cookies()).set("pk_state", state, {
    path: "/auth",
    maxAge: 60 * 5,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  // 3) Hosted UI のパスキー追加 URL を組み立て
  const target = new URL(`${domain.replace(/\/$/, "")}/passkeys/add`);
  target.searchParams.set("client_id", clientId);
  target.searchParams.set("redirect_uri", redirectUri);
  target.searchParams.set("state", state);
  target.searchParams.set("lang", "ja");

  // 4) 302 リダイレクト
  return NextResponse.redirect(target.toString());
}
