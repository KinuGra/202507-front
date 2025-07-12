// app/components/LoginButton.tsx
// PKCE を用いた Cognito OAuth2 認証用ログインボタン
"use client";

import { createPKCE } from "@/app/lib/pkce";
import { setCookie } from "cookies-next";  

export default function LoginButton() {
  // ※ 関数本体は同期のまま
  const handleLogin = async () => {
    /* ------- 非同期処理 ------- */
    const { verifier, challenge } = await createPKCE();

    // 5 分間だけ生存する一時 Cookie (HttpOnly にはできないため最小限の情報に)
    setCookie("pkce_v", verifier, {
      secure:   true,
      sameSite: "lax",
      maxAge:   60 * 5,     // 5 分 (秒単位)  ← cookies-next は seconds 指定
      path:     "/auth",
    });

    const params = new URLSearchParams({
      client_id:            process.env.NEXT_PUBLIC_COG_CLIENT_ID!,
      response_type:        "code",
      scope:                "openid profile email",
      redirect_uri:         process.env.NEXT_PUBLIC_REDIRECT_URI!,
      code_challenge_method:"S256",
      code_challenge:       challenge,
    });

    // Cognito Hosted UI へリダイレクト
    window.location.href =
      `${process.env.NEXT_PUBLIC_COG_DOMAIN!}/oauth2/authorize?${params.toString()}`;
  };

  return (
    <button
      onClick={handleLogin}
      className="rounded bg-blue-600 px-6 py-2 text-white"
    >
      ログイン
    </button>
  );
}
