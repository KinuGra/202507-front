"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { PushButton } from "@/app/(pages)/Home/components/PushButton";

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
const HIRAGANA =
  "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん".split(
    ""
  );

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const generateChoices = (correctChar: string): string[] => {
  const distractors = new Set<string>();
  while (distractors.size < 3) {
    const randomChar = HIRAGANA[Math.floor(Math.random() * HIRAGANA.length)];
    if (randomChar !== correctChar) {
      distractors.add(randomChar);
    }
  }
  return shuffleArray([correctChar, ...distractors]);
};

// --- Component ---
const QuizScreenPage = () => {
  // --- State ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [playerScores, setPlayerScores] = useState<PlayerScore[]>(
    participants.map((p) => ({ name: p.name, score: 0 }))
  );
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [gamePhase, setGamePhase] = useState("question"); // 'question', 'answering', 'correct', 'incorrect', 'finished'
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [choices, setChoices] = useState<string[]>([]);

  const currentQuestion = quizQuestions[currentQuestionIndex];

  // --- Handlers ---
  const handleRetry = useCallback(() => {
    setGamePhase("question");
    setIsTimerActive(true); // Resume timer
    setUserAnswer("");
    setCurrentAnswerIndex(0);
  }, []);

  const handleNextQuestion = useCallback(() => {
    // For now, we'll just add points to the first player for simplicity
    const newScores = [...playerScores];
    newScores[0].score += 10;
    setPlayerScores(newScores);

    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < quizQuestions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setUserAnswer("");
      setCurrentAnswerIndex(0);
      setGamePhase("question");
      setIsTimerActive(true);
      setTimeLeft(60); // Reset timer for next question
    } else {
      setGamePhase("finished");
    }
  }, [currentQuestionIndex, playerScores]);

  // --- Effects ---
  // Timer effect
  useEffect(() => {
    if (!isTimerActive || timeLeft === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive]);

  // Typewriter effect for the question
  useEffect(() => {
    if (!currentQuestion) return;
    setDisplayedQuestion("");
    const fullQuestion = currentQuestion.question;
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedQuestion((prev) => prev + fullQuestion.charAt(index));
      index++;
      if (index === fullQuestion.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [currentQuestion]);

  // Auto-advance on correct/incorrect answer
  useEffect(() => {
    if (gamePhase === "incorrect") {
      const timer = setTimeout(() => {
        handleRetry();
      }, 2000); // Auto-retry after 2 seconds
      return () => clearTimeout(timer);
    }
    if (gamePhase === "correct") {
      const timer = setTimeout(() => {
        handleNextQuestion();
      }, 2000); // Auto-proceed after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [gamePhase, handleRetry, handleNextQuestion]);

  const handleStartAnswering = () => {
    setIsTimerActive(false);
    setGamePhase("answering");
    setChoices(generateChoices(currentQuestion.correctAnswer[0]));
  };

  const handleChoiceClick = (char: string) => {
    if (gamePhase !== "answering") return;

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
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <header className="text-center mb-4">
        <h1 className="text-2xl font-bold">Quiz Time!</h1>
      </header>

      <div className="flex justify-center space-x-8 mb-4">
        {playerScores.map((p, index) => (
          <div key={index} className="flex flex-col items-center">
            <Avatar className="w-16 h-16">
              <AvatarImage src={participants[index].avatarUrl} alt={p.name} />
              <AvatarFallback>{p.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-sm mt-2">{p.name}</span>
            <span className="text-xs font-bold">Score: {p.score}</span>
          </div>
        ))}
      </div>

      <main className="relative flex-grow flex flex-col items-center justify-start">
        <div className="w-full max-w-2xl mb-2">
          <Progress value={progressValue} className="w-full" />
          <p className="text-center mt-1 text-sm">{timeLeft} seconds remaining</p>
        </div>

        <Card className="w-full max-w-2xl flex-grow flex flex-col justify-between">
          <div>
            <CardHeader className="pb-2">
              <CardTitle className="text-center">Question {currentQuestionIndex + 1}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-2xl text-center font-semibold break-words px-4 min-h-[6rem]">
                {gamePhase === "finished" ? "Quiz Finished!" : displayedQuestion}
              </p>
            </CardContent>
          </div>

          <div className="p-4 text-center">
            <div className="text-4xl font-bold tracking-widest min-h-[4rem] mb-4 border-b-2 pb-2">
              {userAnswer || "　"}
            </div>

            {gamePhase === "answering" && (
              <div className="grid grid-cols-2 gap-4">
                {choices.map((char) => (
                  <Button
                    key={char}
                    onClick={() => handleChoiceClick(char)}
                    className="text-2xl h-16"
                  >
                    {char}
                  </Button>
                ))}
              </div>
            )}
            {gamePhase === "correct" && (
              <Alert variant="default" className="bg-green-100 border-green-400">
                <AlertTitle className="text-green-800 font-bold">正解 (Correct)!</AlertTitle>
                <AlertDescription className="text-green-700">
                  You answered correctly! +10 points
                </AlertDescription>
              </Alert>
            )}
            {gamePhase === "incorrect" && (
              <Alert variant="destructive">
                <AlertTitle className="font-bold">不正解 (Incorrect)!</AlertTitle>
                <AlertDescription>That was not the right character. Resuming...</AlertDescription>
              </Alert>
            )}
            {gamePhase === "finished" && (
              <Alert>
                <AlertTitle className="font-bold">Quiz Complete!</AlertTitle>
                <AlertDescription>
                  Thanks for playing. Check the final scores above.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </Card>

        {gamePhase === "question" && (
          <div className="absolute bottom-8">
            <PushButton onClick={handleStartAnswering} />
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizScreenPage;
