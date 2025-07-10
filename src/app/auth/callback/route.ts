// app/auth/callback/route.ts
// ログイン後の認証セッション発行 (cookies-next 版)
// 処理内容
// 1. code クエリパラメータの存在チェック
// 2. PKCE verifier の取得 (cookies-next)
// 3. /oauth2/token へ code と verifier を送信してトークン交換
// 4. id_token の署名と aud の検証
// 5. セッションクッキーを発行し、PKCE verifier を削除
// 6. 認証後のリダイレクト(/profile)


import { NextRequest, NextResponse } from "next/server";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import {
  getCookie,   // 読み取り
  setCookie,   // 設定
  deleteCookie // 削除
} from "cookies-next/server";

/* ---------- 環境変数 ---------- */
const {
  COG_DOMAIN,
  COG_CLIENT_ID,
  COG_POOL_ID,
  REDIRECT_URI,
} = process.env;

if (!COG_DOMAIN || !COG_CLIENT_ID || !COG_POOL_ID || !REDIRECT_URI) {
  throw new Error("Cognito 環境変数が不足しています。");
}

/* ---------- JWT Verifier は再利用 ---------- */
const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId: COG_POOL_ID,
  clientId:   COG_CLIENT_ID,
  tokenUse:  "id",
});

export async function GET(req: NextRequest) {
  const now = new Date().toISOString();
  const url   = new URL(req.url);
  const code  = url.searchParams.get("code");

  /* ❶ code 存在チェック */
  if (!code) {
    console.warn(`[${now}] code query missing`);
    return NextResponse.json({ error: "code query missing" }, { status: 400 });
  }

  /* ❷ PKCE verifier 取得（cookies-next で読み取り） */
  const verifier = (await getCookie("pkce_v", { req })) as string | undefined;
  if (!verifier) {
    console.warn(`[${now}] verifier cookie missing`);
    return NextResponse.json({ error: "verifier missing" }, { status: 400 });
  }

  /* ❸ /oauth2/token へ交換 */
  const tokenEndpoint = `${COG_DOMAIN.replace(/\/$/, "")}/oauth2/token`;
  const tokenRes = await fetch(tokenEndpoint, {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type:    "authorization_code",
      client_id:     COG_CLIENT_ID,
      code,
      redirect_uri:  REDIRECT_URI,
      code_verifier: verifier,
    }),
  });

  const tokenBody = await tokenRes.json().catch(() => ({}));
  // console.log(`[${now}] tokenRes.status=${tokenRes.status}`, tokenBody);

  if (!tokenRes.ok) {
    return NextResponse.json(
      { error: "token exchange failed", detail: tokenBody },
      { status: tokenRes.status },
    );
  }

  const id_token: string | undefined = tokenBody.id_token;
  if (!id_token) {
    console.error(`[${now}] id_token empty`);
    return NextResponse.json(
      { error: "id_token empty", detail: tokenBody },
      { status: 400 },
    );
  }

  /* ❹ 署名・aud 検証 */
  try {
    await jwtVerifier.verify(id_token);
    console.log(`[${now}] id_token verified OK`);
  } catch (e) {
    console.error(`[${now}] jwt invalid`, e);
    return NextResponse.json({ error: "jwt invalid" }, { status: 401 });
  }

  /* ❺ セッションクッキー発行 & verifier 削除（profile で設定） */
  const res = NextResponse.redirect(new URL("/profile", req.url));

  // HttpOnly な認証セッション
  await setCookie("id_token", id_token, {
    req,
    res,
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    path:     "/",
    maxAge:   60 * 60, // 1h
  });

  // 一時 cookie をクリア
  await deleteCookie("pkce_v", {
    req,
    res,
    path: "/auth",
  });

  return res;
}
