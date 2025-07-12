import { verifyIdToken } from "@/app/actions/verify";
import FriendPageClient from "./FriendPageClient";

export default async function FriendPage() {
  // サーバーサイドで認証情報を取得
  const token = await verifyIdToken();

  if (!token) {
    // トークンがない場合（未ログイン状態）はクライアントにnullを渡す
    return <FriendPageClient user={null} />;
  }

  // ユーザー情報を整形 (iconは削除)
  const userProfile = {
    uuid: token.sub,
    username: token.name,
  };

  // クライアントコンポーネントにユーザー情報を渡してレンダリング
  return <FriendPageClient user={userProfile} />;
}
