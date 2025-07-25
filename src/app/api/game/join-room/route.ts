import Pusher from "pusher";
import { NextResponse } from "next/server";
import { getPusherInstance } from "@/app/lib/pusher/server";

// Pusher設定（サーバー用）
const pusherServer = getPusherInstance();

export interface joinInfo {
    username: string;
    roomId: number;
    uuid: string;
    icon: string;
    joined_at: string;
}

export async function POST(req: Request) {
    const {
        username,
        roomId,
        uuid,
        icon,
        joined_at
    }: joinInfo = await req.json();

    // TODO Djangoに対する処理（room_participants)
    

    // Pusherでイベント発火（クライアントが受信する）
    // pusher.trigger(channel名, event名, データ)
    await pusherServer.trigger(`room-${roomId}`, "user-joined", {
        username,
        uuid,
        icon,
        joined_at
    });

    return NextResponse.json({ success: true })
}