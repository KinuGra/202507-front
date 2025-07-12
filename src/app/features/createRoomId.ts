export async function createRoomId() {
    let roomId = Math.floor(10000 + Math.random() * 90000);
    while (true) {
        try {
            const res = await fetch(`/api/game/room-exists/?roomId=${encodeURIComponent(roomId)}`);
            if (!res.ok) throw new Error('API response not ok');
            const data = await res.json();
            console.log(`${roomId}は${data.exists}`);
            if (!data.exists) {
                return roomId;
            }
            roomId = Math.floor(10000 + Math.random() * 90000);
        } catch (e) {
            console.error('Failed to check roomId:', e);
            // 必要に応じてデフォルト値やリトライ回数制限を追加
            throw e;
        }
    }
}