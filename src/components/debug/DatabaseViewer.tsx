"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DatabaseData {
  rooms: any[];
  users: any[];
  answers: any[];
  participants: any[];
  rankings: any[];
  summaries: any[];
}

export const DatabaseViewer = () => {
  const [data, setData] = useState<DatabaseData>({
    rooms: [],
    users: [],
    answers: [],
    participants: [],
    rankings: [],
    summaries: []
  });
  const [isVisible, setIsVisible] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/debug/database/');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch database data:', error);
    }
  };

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchData, 2000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  useEffect(() => {
    fetchData();
  }, []);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsVisible(true)} variant="outline" size="sm">
          DB Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-4 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 max-w-6xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Database Viewer</h2>
          <div className="flex gap-2">
            <Button
              onClick={() => setAutoRefresh(!autoRefresh)}
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
            >
              Auto Refresh
            </Button>
            <Button onClick={fetchData} variant="outline" size="sm">
              Refresh
            </Button>
            <Button onClick={() => setIsVisible(false)} variant="outline" size="sm">
              Close
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Rooms ({data.rooms.length})</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              {data.rooms.map((room, i) => (
                <div key={i} className="border rounded p-2">
                  <div>ID: {room.roomId}</div>
                  <div>Status: <Badge variant="outline">{room.status}</Badge></div>
                  <div>Seq: {room.currentSeq}</div>
                  <div>Quiz: {room.quizId}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Users ({data.users.length})</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              {data.users.map((user, i) => (
                <div key={i} className="border rounded p-2">
                  <div>UUID: {user.uuid.substring(0, 8)}...</div>
                  <div>Name: {user.username || 'N/A'}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Participants ({data.participants.length})</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              {data.participants.map((p, i) => (
                <div key={i} className="border rounded p-2">
                  <div>Room: {p.roomId}</div>
                  <div>User: {p.uuid.substring(0, 8)}...</div>
                  <div>Score: {p.currentScore}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Answers ({data.answers.length})</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              {data.answers.slice(-10).map((answer, i) => (
                <div key={i} className="border rounded p-2">
                  <div>User: {answer.uuid.substring(0, 8)}...</div>
                  <div>Room: {answer.roomId}</div>
                  <div>Q: {answer.questionId}</div>
                  <div>Correct: <Badge variant={answer.isCorrect ? "default" : "destructive"}>{answer.isCorrect ? "Yes" : "No"}</Badge></div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Rankings ({data.rankings.length})</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              {data.rankings.map((rank, i) => (
                <div key={i} className="border rounded p-2">
                  <div>Name: {rank.username || 'Anonymous'}</div>
                  <div>Score: {rank.finalScore}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Summaries ({data.summaries.length})</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-2">
              {data.summaries.map((summary, i) => (
                <div key={i} className="border rounded p-2">
                  <div>User: {summary.uuid.substring(0, 8)}...</div>
                  <div>Score: {summary.finalScore}</div>
                  <div>Correct: {summary.correctAnswers}/{summary.totalQuestions}</div>
                  <div>Rank: {summary.finalRank}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};