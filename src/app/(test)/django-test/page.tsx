"use client"

import { useEffect, useState } from "react";

export default function TestPage() {
    const [items, setItems] = useState([]);

    const fetchUrl = "http://localhost:8000"

    useEffect(() => {
        console.log('api/itemsリクエスト')
        fetch(fetchUrl + '/api/users/')
            .then(response => response.json())
            .then(data => setItems(data));
    }, []);

    async function handleDelete() {
        // const res = await fetch(fetchUrl + '/api/users/2/', {
        //     method: 'DELETE',
        // });
        // console.log(res);
    }

    const [roomId, setRoomId] = useState("");
    const [roomExists, setRoomExists] = useState(false);
    const checkRoom = async () => {
        try {
            const res = await fetch(`/api/game/room-exists/?roomId=${encodeURIComponent(roomId)}`)
            const data = await res.json();
            console.log("data.exists: ", data.exists)
            setRoomExists(data.exists);
        } catch (e) {
            console.error(e);
        }
    }

    const handlerp = async () => {
        try {
            const res = await fetch("/api/game/insert-rp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    roomId: 2,
                    uuid: 3,
                    currentScore: 2,
                }),
            });
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <>
            <ul>
                {items.map(item => (
                    <li key={item.id}>{item.uuid}: {item.username}</li>
                ))}
            </ul>
            <button onClick={handleDelete}>users/2 Deleteボタン</button>

            <div>
                <input
                    type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)}
                />
                <button onClick={() => checkRoom()}>roomIdを調べる</button>
                <div>
                    roomId: {roomId}は{roomExists ? "存在する" : "存在しない"}
                </div>
            </div>

            <button onClick={handlerp}>ボタン</button>

        </>
    )
}