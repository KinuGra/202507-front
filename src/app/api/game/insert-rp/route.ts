import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { roomId, uuid, currentScore } = await req.json();
    const djangoUrl = process.env.DJANGO_API_URL;

    try {
        const res = await fetch(`${djangoUrl}/api/roomparticipants/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ roomId, uuid, currentScore })
        });

        if (!res.ok) {
            let errorText = "Unknown error";
            try {
                const json = await res.json();
                errorText = JSON.stringify(json);
            } catch (_) {
                try {
                    errorText = await res.text();
                } catch (_) {
                    errorText = "Failed to read response body";
                }
            }

            return NextResponse.json(
                { message: "Django API error", error: errorText },
                { status: res.status }
            );
        }

        const data = await res.json();
        console.log("room participant", data);

        return NextResponse.json({ message: "成功", data }, { status: 201 });

    } catch (e) {
        console.error("Fetch error:", e);
        return NextResponse.json(
            { message: "エラーが発生しました", error: String(e) },
            { status: 500 }
        );
    }
}
