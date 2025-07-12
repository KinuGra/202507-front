export async function createRoomId() {
    let roomId = Math.floor(10000 + Math.random() * 90000);
    do {
        const res = await fetch(`/api/game/room-exists/?roomId=${encodeURIComponent(roomId)}`)
        const data = await res.json();
        console.log(`${roomId}は${data.exists}`);
        if (!data.exists) {
            const roomId = Math.floor(10000 + Math.random() * 90000);
            return roomId;
        }
    } while(true);
}