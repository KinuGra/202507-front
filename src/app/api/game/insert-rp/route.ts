import { NextResponse } from "next/server";

export async function POST(req: Request) {
    // リクエストボディから必要な値を取得
    const { roomId, uuid, currentScore } = await req.json();

    // .envからDjangoのAPI URLを取得
    const djangoUrl = process.env.DJANGO_API_URL;

    try {
        // Django REST FrameworkのエンドポイントにPOSTリクエスト
        const res = await fetch(`${djangoUrl}/api/roomparticipants/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                room: roomId, // Django側のフィールド名に合わせてください
                uuid: uuid,
                currentScore: currentScore,
            }),
        });

        if (!res.ok) {
            const error = await res.text();
            return NextResponse.json({ message: "Django API error", error }, { status: res.status });
        }

        const result = await res.json();
        return NextResponse.json({ message: "保存完了", data: result });
    } catch (e) {
        return NextResponse.json({ message: "リクエスト失敗", error: String(e) }, { status: 500 });
    }
}