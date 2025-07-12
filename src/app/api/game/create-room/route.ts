import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const {
        roomId,
        status,
        currentSeq,
        quizId,
        created_at
    } = await req.json();

    const djangoUrl = process.env.DJANGO_API_URL;

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
            const result = await res.json();
            console.log(result);
        }
    } catch (e) {
        console.log(e);
    }

    return NextResponse.json({ message: "受け取り完了"});
}