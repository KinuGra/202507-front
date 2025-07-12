// app/actions/verify.ts
"use server";

import { cookies } from "next/headers";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const verifier = CognitoJwtVerifier.create({
  userPoolId: process.env.NEXT_PUBLIC_COG_POOL_ID!,
  clientId:   process.env.NEXT_PUBLIC_COG_CLIENT_ID!,
  tokenUse: "id",
});

export async function verifyIdToken(): Promise<{
  sub: string;
  email: string;
  name: string;
  exp: number;
} | null> {
  const token = (await cookies()).get("id_token")?.value;
  if (!token) return null;          // ★ ゲストは null を返す

  try {
    const p = await verifier.verify(token);
    return {
      sub:   p.sub as string,
      email: p.email as string,
      name:  p.name as string,
      exp:   p.exp as number,
    };
  } catch {
    return null; // 検証エラーもゲスト扱い
  }
}
