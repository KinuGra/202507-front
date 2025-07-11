import { NextRequest, NextResponse } from "next/server";

// roomIdが存在するかどうかを返すAPI
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get('roomId');

    if (!roomId) {
        return NextResponse.json({ error: 'roomId is required' }, { status: 400});
    }

    const djangoUrl = process.env.DJANGO_API_URL;

    const res = await fetch(`${djangoUrl}/api/room-exists/?roomId=${roomId}`);
    const data = await res.json();

    return NextResponse.json({ exists: data.exists });
}