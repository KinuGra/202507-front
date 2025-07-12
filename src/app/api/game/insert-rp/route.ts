import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { roomId, uuid, currentScore } = await req.json();
    const djangoUrl = process.env.DJANGO_API_URL;

    try {
        const res = await fetch(`${djangoUrl}/api/roomparticipants/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                roomId: roomId,
                uuid: uuid,
                currentScore: currentScore
            })
        });

        if (!res.ok) {
            const errorText = await res.text();
            return NextResponse.json(
                { message: "Django API error", error: errorText },
                { status: res.status }
            );
        }

        const data = await res.json();
        console.log("room participant", data);

        return NextResponse.json({ message: "成功", data }, { status: 201 });

    } catch (e) {
        console.error("Fetch error:", e);
        return NextResponse.json(
            { message: "エラーが発生しました", error: String(e) },
            { status: 500 }
        );
    }
}

// export async function POST(req: Request) {
//     // 必要な値のみ取得
//     const { roomId, uuid, currentScore } = await req.json();
//     const djangoUrl = process.env.DJANGO_API_URL;

//     // RoomのPK取得（全件取得して絞り込み）
//     let roomPk = null;
//     try {
//         const res = await fetch(`${djangoUrl}/api/rooms/`);
//         if (res.ok) {
//             const rooms = await res.json();
//             const found = rooms.find((room: any) => room.roomId === roomId);
//             if (found) {
//                 roomPk = found.id;
//             }
//         }
//     } catch (e) {
//         return NextResponse.json({ message: "Room PK取得失敗", error: String(e) }, { status: 500 });
//     }

//     // UserのPK取得（全件取得して絞り込み）
//     let userPk = null;
//     try {
//         const res = await fetch(`${djangoUrl}/api/users/`);
//         if (res.ok) {
//             const users = await res.json();
//             const found = users.find((user: any) => String(user.uuid) === String(uuid));
//             if (found) {
//                 userPk = found.id;
//             }
//         }
//     } catch (e) {
//         return NextResponse.json({ message: "User PK取得失敗", error: String(e) }, { status: 500 });
//     }

//     if (!roomPk || !userPk) {
//         return NextResponse.json({ message: "roomまたはuserのPKが取得できません", roomPk, userPk }, { status: 400 });
//     }

//     // RoomParticipantsに新規レコード追加
//     try {
//         const res = await fetch(`${djangoUrl}/api/roomparticipants/`, {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 room: roomPk,
//                 uuid: userPk,
//                 currentScore: currentScore,
//             }),
//         });
//         if (!res.ok) {
//             const error = await res.text();
//             console.log(error);
//             return NextResponse.json({ message: "Django API error (POST)", error }, { status: res.status });
//         }
//         const result = await res.json();
//         return NextResponse.json({ message: "保存完了", data: result });
//     } catch (e) {
//         return NextResponse.json({ message: "リクエスト失敗", error: String(e) }, { status: 500 });
//     }
// }