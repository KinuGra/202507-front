import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { uuid, username, icon, loginId, password } = await req.json();
    const djangoUrl = process.env.DJANGO_API_URL;

    try {
        const res = await fetch(`${djangoUrl}/api/users/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uuid,
                username,
                icon,      // 文字列 (画像URL または base64想定)
                loginId,
                password
            })
        });

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json(
                { message: "Django API error", error: errorText },
                { status: res.status }
            );
        }

        const data = await res.json();
        console.log("ユーザー登録成功:", data);

        return NextResponse.json({ message: "成功", data }, { status: 201 });

    } catch (e) {
        console.error("Fetch error:", e);
        return NextResponse.json(
            { message: "エラーが発生しました", error: String(e) },
            { status: 500 }
        );
    }
}
