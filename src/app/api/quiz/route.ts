import { NextRequest, NextResponse } from "next/server";
import { getPusherInstance } from "@/app/lib/pusher/server";

export async function POST(request: NextRequest) {
    try {
        const { action, roomId, data } = await request.json();
        const pusher = getPusherInstance();

        switch (action) {
            case 'start_game':
                await pusher.trigger(`private-quiz-${roomId}`, 'game:start', {
                    message: 'Game started',
                    timestamp: new Date().toISOString()
                });
                break;

            case 'display_question':
                await pusher.trigger(`private-quiz-${roomId}`, 'question:display', {
                    question: data.question,
                    questionIndex: data.questionIndex,
                    timestamp: new Date().toISOString()
                });
                break;

            case 'submit_answer':
                await pusher.trigger(`private-quiz-${roomId}`, 'answer:result', {
                    userId: data.userId,
                    isCorrect: data.isCorrect,
                    correctAnswer: data.correctAnswer,
                    timestamp: new Date().toISOString()
                });
                break;

            case 'update_scores':
                await pusher.trigger(`private-quiz-${roomId}`, 'scores:update', {
                    scores: data.scores,
                    timestamp: new Date().toISOString()
                });
                break;

            case 'end_game':
                await pusher.trigger(`private-quiz-${roomId}`, 'game:end', {
                    message: 'Game ended',
                    timestamp: new Date().toISOString()
                });
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Quiz API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}