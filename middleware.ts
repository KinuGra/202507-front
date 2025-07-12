// middleware.ts  (Next.js 15 / Edge Runtime)
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet, JWTPayload } from "jose";

/* --- ① JWKS キャッシュ ------------------------------------------------------- */
const region   = process.env.NEXT_PUBLIC_COG_DOMAIN!.split(".")[1];
const poolId   = process.env.NEXT_PUBLIC_COG_POOL_ID!;
const clientId = process.env.NEXT_PUBLIC_COG_CLIENT_ID!;

const JWKS = createRemoteJWKSet(
  new URL(`https://cognito-idp.${region}.amazonaws.com/${poolId}/.well-known/jwks.json`)
);

/* --- ② JWT 検証 ------------------------------------------------------------- */
async function verifyJwt(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer:   `https://cognito-idp.${region}.amazonaws.com/${poolId}`,
      audience: clientId,
    });
    console.log("無事ミドルウェア通過ですね！！");
    return payload;
  } catch {
    return null;
  }
}

/* --- ③ 共通リダイレクト ----------------------------------------------------- */
function redirectToLogin(req: NextRequest) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.cookies.set("id_token", "", { maxAge: 0, path: "/" });
  return res;
}

/* --- ④ Edge Middleware 本体 -------------------------------------------------- */
export async function middleware(req: NextRequest) {
  console.log("ミドルウェアが動いたよ:", req.method, req.nextUrl.pathname);
  const { pathname } = req.nextUrl;

  /* 1) 静的アセットと除外パスは即通過 */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/robots.txt") ||
    pathname === "/" ||
    pathname.startsWith("/auth/callback")
  ) {
    return NextResponse.next();
  }

  /* 2) id_token が無ければログインへ */
  const token = req.cookies.get("id_token")?.value;
  if (!token) return redirectToLogin(req);

  /* 3) 署名・iss・aud・exp を検証 */
  const ok = await verifyJwt(token);
  if (!ok) return redirectToLogin(req);

  /* 4) 検証 OK → ページ／API へ通過 */
  return NextResponse.next();
}

/* --- ⑤ 適用パス ------------------------------------------------------------- */
export const config = {
  matcher: ["/auth/:path*"], // /auth 配下のみ
};
