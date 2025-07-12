"use client"

import { useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/navigation";
import { rootCertificates } from "tls";

export default function () {
    const [username, setUsername] = useState<string>("");

    const router = useRouter();

    const handleJoinRoom = () => {
        if (username) {
            const roomId = "000011"
            console.log(roomId);
            sessionStorage.setItem("roomId", roomId);
            sessionStorage.setItem("username", username);
            sessionStorage.setItem("uuid", uuidv4().toString());
            router.push('/pusher-test/waiting')
        }
    }

    return (
        <>
            <input
                type="text"
                value={username}
                className="border border-gray-300 rounded px-3 py-2 text-black"
                onChange={(e) => setUsername(e.target.value)}>
            </input>

            <button className="mr-3">部屋作成</button>
            <button onClick={handleJoinRoom}>参加</button>
        </>
    )
}