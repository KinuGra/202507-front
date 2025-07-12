'use client';

import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import { pusherClient } from '@/app/lib/pusher/client';
import { joinInfo } from '@/app/api/game/join-room/route';
import { join } from 'path';

export default function Home() {
    const [roomId, setRoomId] = useState<string | null>(null);
    const [users, setUsers] = useState<string[]>([]);
    const [username, setUsername] = useState<string | null>(null);
    const [uuid, setUuid] = useState<string | null>(null);

    const handleJoin = async () => {
        try {
            await fetch("/api/game/join-room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: sessionStorage.getItem("username"),
                    roomId,
                    uuid: sessionStorage.getItem("uuid"),
                    joined_at: new Date().toISOString(),
                }),
            });
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        setRoomId(sessionStorage.getItem("roomId"));
        setUsername(sessionStorage.getItem("username"));
        setUuid(sessionStorage.getItem("uuid"));
    }, []);


    useEffect(() => {
        if (!roomId) return;

        // Pusherクライアントの初期化
        const pusher = pusherClient;
        // チャンネル購読
        const channel = pusher.subscribe(`room-${roomId}`);

        // イベント受信
        channel.bind('user-joined', (data: {
            username,
            roomId,
            uuid,
            joined_at
        }) => {
            console.log('User joined', data.username);
            setUsers((prev) => [...prev, data.username]);
        });

        // 参加を通知する
        handleJoin();

        // クリーンアップ
        return () => {
            channel.unbind_all();
            pusher.unsubscribe(`room-${roomId}`);
        };
    }, [roomId]);

    return (
        <main className="p-6">
            <h1>参加ユーザー</h1>
            <ul>
                {users.map((u, i) => (
                    <li key={i}>{u}</li>
                ))}
            </ul>
        </main>
    )
}