import { NextResponse } from "next/server";
import { getPusherInstance } from "@/app/lib/pusher/server";

export async function POST(req: Request) {
    const { roomId } = await req.json();
    
    try {
        const pusher = getPusherInstance();
        
        // 参加者にゲーム開始を通知
        await pusher.trigger(`room-${roomId}`, "game-started", {
            roomId,
            timestamp: new Date().toISOString()
        });
        
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Failed to start game:', error);
        return NextResponse.json({ error: 'Failed to start game' }, { status: 500 });
    }
}