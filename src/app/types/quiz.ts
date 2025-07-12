export interface QuizQuestion {
    questionId: number;
    quizId: number;
    question: string;
    answer_letters: string[] | null;
    answer_full: string;
    category: string | null;
}

export interface Participant {
    name: string;
    avatarUrl: string;
    score: number;
    uuid?: string;
}

export interface PlayerScore {
    name: string;
    score: number;
    uuid?: string;
}

export interface GameState {
    status: 'waiting' | 'in_progress' | 'finished';
    currentQuestion: QuizQuestion | null;
    questionIndex: number;
    scores: Record<string, number>;
    participants: Participant[];
}

export interface QuizApiResponse {
    success: boolean;
    isCorrect?: boolean;
    correctAnswer?: string;
    error?: string;
}