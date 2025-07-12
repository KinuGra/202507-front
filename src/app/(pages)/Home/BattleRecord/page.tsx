import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// 戦績のモックデータ
const battleRecord = {
  wins: 15,
  correctAnswers: 120,
  accuracy: 85.7,
  responseRate: 92.3,
};

/**
 * 戦績の各項目を表示するカードコンポーネント
 */
export function BattleRecordStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">優勝回数</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{battleRecord.wins}回</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">正解数</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{battleRecord.correctAnswers}問</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">正答率</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{battleRecord.accuracy}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">回答率</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{battleRecord.responseRate}%</div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * 戦績ページ
 */
export default function BattleRecordPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">戦績</h1>
      <BattleRecordStats />
    </div>
  );
}
