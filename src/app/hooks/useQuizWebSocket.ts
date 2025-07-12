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
            await fetch('/api/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'start_game',
                    roomId,
                    data: {}
                })
            });
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
            
            const result = await response.json();
            
            await fetch('/api/quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'submit_answer',
                    roomId,
                    data: {
                        userId,
                        isCorrect: result.isCorrect,
                        correctAnswer: result.correctAnswer
                    }
                })
            });
            
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