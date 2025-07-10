"use server";

import { cookies } from "next/headers";
import { CognitoJwtVerifier } from "aws-jwt-verify";

// ① Verifier をシングルトンで作成
const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.NEXT_PUBLIC_COG_POOL_ID!,
  clientId:   process.env.NEXT_PUBLIC_COG_CLIENT_ID!,
  tokenUse: "id",
});

/**
 * フォーム submit で呼ばれる Server Action
 * - id_token Cookie を取得
 * - 署名・iss・aud・exp を検証
 */
export async function verifyIdToken(): Promise<{
  sub: string;
  email: string;
  name: string;
  exp: number;
}> {
  const token = (await cookies()).get("id_token")?.value;

  if (!token) {
    throw new Error("id_token が存在しません。");
  }

  // ② 署名検証（失敗すると例外）
  const payload = await verifier.verify(token);

  // 検証後のペイロードを戻り値として返す（ページ側で利用可能）
  return {
    sub:          payload.sub as string,
    email:        payload.email as string,
    name:         payload.name as string,
    exp:          payload.exp as number,
  };
}
