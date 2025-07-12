// 自分より先に参加している参加者情報の取得
export async function fetchUsersByRoom(roomId: string) {
    const res = await fetch(`/api/game/get-users-by-room?roomId=${roomId}`);
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || 'ユーザー情報の取得に失敗しました');
    }
    const data = await res.json();
    return data.users;
}