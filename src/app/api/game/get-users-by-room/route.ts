import next from "next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const roomId = req.nextUrl.searchParams.get('roomId');
    if (!roomId) {
        return NextResponse.json({error: 'roomId is required'}, {status: 400});
    }

    const djangoUrl = process.env.DJANGO_API_URL;
    const res = await fetch(`${djangoUrl}/api/users/by-room/?roomId=${roomId}`);

    if (!res.ok) {
        const error = await res.text();
        return NextResponse.json({ error: 'Failed to fetch users', detail: error }, { status: res.status });
    }

    const users = await res.json();
    return NextResponse.json({ users })
}