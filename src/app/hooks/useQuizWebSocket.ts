import { useEffect, useState, useCallback } from 'react';
import { pusherClient } from '@/app/lib/pusher/client';
import { QuizQuestion, GameState, QuizApiResponse, Participant } from '@/app/types/quiz';

export const useQuizWebSocket = (roomId: string, userId: string) => {
    const [gameState, setGameState] = useState<GameState>({
        status: 'waiting',
        currentQuestion: null,
        questionIndex: 0,
        scores: {},
        participants: []
    });
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!roomId) return;

        // 参加者情報を取得
        const fetchParticipants = async () => {
            try {
                console.log('Fetching participants for room:', roomId);
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
                const response = await fetch(`${backendUrl}/api/quiz/participants/?roomId=${roomId}`);
                console.log('Participants response status:', response.status);
                const result = await response.json();
                console.log('Participants result:', result);
                if (result.participants) {
                    console.log('Setting participants:', result.participants);
                    setGameState(prev => ({ ...prev, participants: result.participants }));
                } else {
                    console.log('No participants found in response');
                }
            } catch (error) {
                console.error('Failed to fetch participants:', error);
            }
        };
        
        fetchParticipants();

        const channel = pusherClient.subscribe(`private-quiz-${roomId}`);
        
        channel.bind('pusher:subscription_succeeded', () => {
            setIsConnected(true);
        });

        channel.bind('game:start', () => {
            setGameState(prev => ({ ...prev, status: 'in_progress' as const }));
        });

        channel.bind('question:display', (data: { question: QuizQuestion; questionIndex: number }) => {
            setGameState(prev => ({
                ...prev,
                currentQuestion: data.question,
                questionIndex: data.questionIndex
            }));
        });

        channel.bind('answer:result', (data: { userId: string; isCorrect: boolean; correctAnswer: string }) => {
            console.log('Answer result:', data);
        });

        channel.bind('score:update', (data: { userId: string; score: number }) => {
            console.log('Received score update:', data);
            setGameState(prev => ({
                ...prev,
                scores: {
                    ...prev.scores,
                    [data.userId]: data.score
                },
                participants: prev.participants.map(p => 
                    p.uuid === data.userId ? { ...p, score: data.score } : p
                )
            }));
        });

        channel.bind('scores:update', (data: { scores: Record<string, number> }) => {
            setGameState(prev => ({ ...prev, scores: data.scores }));
        });

        channel.bind('participants:update', (data: { participants: Participant[] }) => {
            setGameState(prev => ({ ...prev, participants: data.participants }));
        });

        channel.bind('game:end', () => {
            setGameState(prev => ({ ...prev, status: 'finished' }));
        });

        return () => {
            channel.unbind_all();
            pusherClient.unsubscribe(`private-quiz-${roomId}`);
            setIsConnected(false);
        };
    }, [roomId]);

    const startGame = useCallback(async () => {
        try {
            console.log('Starting game for room:', roomId);
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
            
            // Django APIを直接呼び出し
            const response = await fetch(`${backendUrl}/api/quiz/start/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomId
                })
            });
            
            const result = await response.json();
            console.log('Start game result:', result);
            
            if (result.question) {
                // 問題を直接設定
                setGameState(prev => ({
                    ...prev,
                    status: 'in_progress',
                    currentQuestion: result.question,
                    questionIndex: 0
                }));
            }
        } catch (error) {
            console.error('Failed to start game:', error);
        }
    }, [roomId]);

    const submitAnswer = useCallback(async (answer: string) => {
        try {
            const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
            const response = await fetch(`${backendUrl}/api/quiz/submit/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roomId,
                    userUuid: userId,
                    answer
                })
            });
            
            console.log('Response status:', response.status);
            const result = await response.json();
            console.log('Submit answer result:', result);
            
            // 正解の場合、次の問題を取得
            if (result.isCorrect) {
                setTimeout(async () => {
                    try {
                        const nextResponse = await fetch(`${backendUrl}/api/quiz/question/?roomId=${roomId}`);
                        const nextResult = await nextResponse.json();
                        console.log('Next question result:', nextResult);
                        
                        if (nextResult.question) {
                            setGameState(prev => ({
                                ...prev,
                                currentQuestion: nextResult.question,
                                questionIndex: nextResult.currentSeq
                            }));
                        } else {
                            // 問題がない場合はゲーム終了
                            setGameState(prev => ({ ...prev, status: 'finished' }));
                        }
                    } catch (error) {
                        console.error('Failed to get next question:', error);
                    }
                }, 2000);
            }
            
            return result as QuizApiResponse;
        } catch (error) {
            console.error('Failed to submit answer:', error);
            return { success: false, error: 'Failed to submit answer' } as QuizApiResponse;
        }
    }, [roomId, userId]);

    return {
        gameState,
        isConnected,
        startGame,
        submitAnswer
    };
};