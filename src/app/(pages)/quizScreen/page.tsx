"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { PushButton } from "@/app/(pages)/Home/components/PushButton";
import { useRouter } from "next/navigation";
import Link from "next/link";

// --- Type Definitions ---
interface Participant {
  name: string;
  avatarUrl: string;
  score: number;
}

interface QuizQuestion {
  question: string;
  correctAnswer: string;
}

interface PlayerScore {
  name: string;
  score: number;
}

// --- Mock Data ---
const participants: Participant[] = [
  { name: "Player 1", avatarUrl: "/images/avatars/person_avatar_1.png", score: 0 },
  { name: "Player 2", avatarUrl: "/images/avatars/person_avatar_2.png", score: 0 },
  { name: "Player 3", avatarUrl: "/images/avatars/person_avatar_3.png", score: 0 },
  { name: "Player 4", avatarUrl: "/images/avatars/person_avatar_4.png", score: 0 },
];

const quizQuestions: QuizQuestion[] = [
  { question: "What is the Japanese word for 'apple'?", correctAnswer: "りんご" },
  { question: "What is the Japanese word for 'cat'?", correctAnswer: "ねこ" },
  { question: "What is the Japanese word for 'water'?", correctAnswer: "みず" },
];

// --- Helper Functions ---
const HIRAGANA = "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん".split("");

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const generateChoices = (correctChar: string): string[] => {
  const distractors = new Set<string>();
  while (distractors.size < 3) {
    const randomChar = HIRAGANA[Math.floor(Math.random() * HIRAGANA.length)];
    if (randomChar !== correctChar) distractors.add(randomChar);
  }
  return shuffleArray([correctChar, ...distractors]);
};

// --- Component ---
const QuizScreenPage = () => {
  // --- State ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>(participants.map((p) => ({ name: p.name, score: 0 })));
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [gamePhase, setGamePhase] = useState("question");
  const [isTypewriterActive, setIsTypewriterActive] = useState(true);
  const [currentAnswerer, setCurrentAnswerer] = useState<PlayerScore | null>(null);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [choices, setChoices] = useState<string[]>([]);

  const router = useRouter();
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const thisPlayer = playerScores[0];

  // --- Handlers ---
  const handleRetry = useCallback(() => {
    setCurrentAnswerer(null);
    setGamePhase("question");
    setIsTimerActive(true);
    setIsTypewriterActive(true);
    setUserAnswer("");
    setCurrentAnswerIndex(0);
  }, []);

  const handleNextQuestion = useCallback(() => {
    if (currentAnswerer) {
      setPlayerScores((prevScores) =>
        prevScores.map((p) => (p.name === currentAnswerer.name ? { ...p, score: p.score + 10 } : p))
      );
    }
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < quizQuestions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setUserAnswer("");
      setCurrentAnswerIndex(0);
      setCurrentAnswerer(null);
      setGamePhase("question");
      setIsTimerActive(true);
      setIsTypewriterActive(true);
      setTimeLeft(60);
    } else {
      setGamePhase("finished");
    }
  }, [currentAnswerer, currentQuestionIndex]);

  // --- Effects ---
  useEffect(() => {
    if (!isTimerActive || timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive]);

  useEffect(() => {
    if (!currentQuestion || !isTypewriterActive) return;
    const fullQuestion = currentQuestion.question;
    const start_index = displayedQuestion.length;
    if (start_index >= fullQuestion.length) return;
    let index = start_index;
    const interval = setInterval(() => {
      setDisplayedQuestion((prev) => prev + fullQuestion.charAt(index));
      index++;
      if (index >= fullQuestion.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [currentQuestion, isTypewriterActive, displayedQuestion.length]);

  useEffect(() => {
    setDisplayedQuestion("");
    setIsTypewriterActive(true);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (gamePhase === "incorrect") {
      const timer = setTimeout(handleRetry, 2000);
      return () => clearTimeout(timer);
    }
    if (gamePhase === "correct") {
      const timer = setTimeout(handleNextQuestion, 2000);
      return () => clearTimeout(timer);
    }
    if (gamePhase === "finished") {
        const timer = setTimeout(() => router.push('/resultScreen'), 2000);
        return () => clearTimeout(timer);
    }
  }, [gamePhase, handleRetry, handleNextQuestion, router]);

  const handleStartAnswering = () => {
    setIsTimerActive(false);
    setIsTypewriterActive(false);
    setCurrentAnswerer(thisPlayer);
    setGamePhase("answering");
    setChoices(generateChoices(currentQuestion.correctAnswer[0]));
  };

  const handleChoiceClick = (char: string) => {
    if (gamePhase !== "answering" || currentAnswerer?.name !== thisPlayer.name) return;
    if (char === currentQuestion.correctAnswer[currentAnswerIndex]) {
      const nextUserAnswer = userAnswer + char;
      setUserAnswer(nextUserAnswer);
      if (nextUserAnswer === currentQuestion.correctAnswer) {
        setGamePhase("correct");
      } else {
        const nextIndex = currentAnswerIndex + 1;
        setCurrentAnswerIndex(nextIndex);
        setChoices(generateChoices(currentQuestion.correctAnswer[nextIndex]));
      }
    } else {
      setGamePhase("incorrect");
    }
  };

  // --- Render ---
  const progressValue = (timeLeft / 60) * 100;

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 p-2 md:p-4">
      {/* Header */}
      <header className="flex-shrink-0 text-center">
        <h1 className="text-xl md:text-2xl font-bold">Quiz Time!</h1>
      </header>

      {/* Participants */}
      <div className="flex-shrink-0 flex justify-center space-x-2 md:space-x-4 my-1 md:my-2">
        {playerScores.map((p, index) => (
          <div key={index} className="flex flex-col items-center">
            <Avatar className="w-10 h-10 md:w-14 md:h-14">
              <AvatarImage src={participants[index].avatarUrl} alt={p.name} />
              <AvatarFallback>{p.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-xs mt-1">{p.name}</span>
            <span className="text-xs font-bold">{p.score}</span>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center min-h-0">
        <div className="w-full max-w-2xl flex-shrink-0">
          <Progress value={progressValue} className="w-full" />
          <p className="text-center mt-1 text-xs md:text-sm">{timeLeft}s</p>
        </div>

        <div className="relative w-full flex-grow flex flex-col items-center my-2">
            <Card className="w-full max-w-2xl flex-grow flex flex-col justify-between">
                {/* Question Area */}
                <div className="flex-grow flex flex-col justify-center">
                    <CardHeader className="p-2">
                        <CardTitle className="text-center text-lg md:text-xl">Question {currentQuestionIndex + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                        <p className="text-lg md:text-2xl text-center font-semibold break-words px-2 min-h-[6rem]">
                            {gamePhase === "finished" ? "Quiz Finished!" : displayedQuestion}
                        </p>
                    </CardContent>
                </div>

                {/* Answering Area */}
                <div className="flex-shrink-0 p-2 md:p-4 text-center">
                    {currentAnswerer && (
                        <div className="mb-2 text-sm md:text-lg">
                            Answering: <span className="font-bold">{currentAnswerer.name}</span>
                        </div>
                    )}
                    <div className="text-2xl md:text-4xl font-bold tracking-widest min-h-[3rem] md:min-h-[4rem] mb-2 border-b-2 pb-2">
                        {userAnswer || "　"}
                    </div>
                    <div className="min-h-[8rem] md:min-h-[9rem] flex items-center justify-center">
                        {gamePhase === "answering" && (
                            <div className="grid grid-cols-2 gap-2 md:gap-4 w-full">
                                {choices.map((char) => (
                                <Button key={char} onClick={() => handleChoiceClick(char)} disabled={currentAnswerer?.name !== thisPlayer.name} className="text-xl md:text-2xl h-12 md:h-16">
                                    {char}
                                </Button>
                                ))}
                            </div>
                        )}
                        {["correct", "incorrect", "finished"].includes(gamePhase) && (
                            <Alert variant={gamePhase === "incorrect" ? "destructive" : "default"} className={gamePhase === "correct" ? "bg-green-100 border-green-400" : ""}>
                                <AlertTitle className="font-bold">
                                    {gamePhase === "correct" && "正解 (Correct)!"}
                                    {gamePhase === "incorrect" && "不正解 (Incorrect)!"}
                                    {gamePhase === "finished" && <Link href="/resultScreen">Quiz Complete!</Link>}
                                </AlertTitle>
                            </Alert>
                        )}
                    </div>
                </div>
            </Card>
            {gamePhase === "question" && !currentAnswerer && (
                <div className="absolute bottom-0 mb-2 md:mb-4 transform scale-75 md:scale-90">
                    <PushButton onClick={handleStartAnswering} />
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default QuizScreenPage;
