import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const {
        roomId,
        status,
        currentSeq,
        quizId,
        created_at,
        uuid,
        currentScore
    } = await req.json();

    const djangoUrl = process.env.DJANGO_API_URL;

    // ルーム作成
    let createdRoom = null;
    try {
        const res = await fetch(`${djangoUrl}/api/rooms/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roomId: roomId,
                status: status,
                currentSeq: currentSeq,
                quizId: quizId,
            }),
        });

        if (res.ok) {
            createdRoom = await res.json();
        }
    } catch (e) {
        return NextResponse.json({ message: "ルーム作成失敗", error: String(e) }, { status: 500 });
    }

    // 全件GETしてroomId一致のものを検索
    let foundRoom = null;
    try {
        const res = await fetch(`${djangoUrl}/api/rooms/`);
        if (res.ok) {
            const rooms = await res.json();
            foundRoom = rooms.find((room: any) => room.roomId === roomId);
        }
    } catch (e) {
        return NextResponse.json({ message: "ルーム検索失敗", error: String(e) }, { status: 500 });
    }

    return NextResponse.json({ message: "受け取り完了", createdRoom, foundRoom });
}
