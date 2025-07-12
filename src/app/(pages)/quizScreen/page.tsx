"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { PushButton } from "@/app/(pages)/Home/components/PushButton";
import { useQuizWebSocket } from "@/app/hooks/useQuizWebSocket";
import { useRouter } from "next/navigation";

const participants = [
  { name: "Player 1", avatarUrl: "/images/avatars/person_avatar_1.png", score: 0 },
  { name: "Player 2", avatarUrl: "/images/avatars/person_avatar_2.png", score: 0 },
  { name: "Player 3", avatarUrl: "/images/avatars/person_avatar_3.png", score: 0 },
  { name: "Player 4", avatarUrl: "/images/avatars/person_avatar_4.png", score: 0 },
];

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

const QuizScreenPage = () => {
  const roomId = "test-room";
  const userId = "test-user";
  const { gameState, isConnected, startGame, submitAnswer } = useQuizWebSocket(roomId, userId);
  const router = useRouter();
  
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [gamePhase, setGamePhase] = useState("question");
  const [isTypewriterActive, setIsTypewriterActive] = useState(true);
  const [currentAnswerer, setCurrentAnswerer] = useState<string | null>(null);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [choices, setChoices] = useState<string[]>([]);

  const currentQuestion = gameState.currentQuestion;
  const thisPlayer = participants[0];

  useEffect(() => {
    if (currentQuestion?.question) {
      setDisplayedQuestion("");
      setIsTypewriterActive(true);
      setGamePhase("question");
      setUserAnswer("");
      setCurrentAnswerIndex(0);
      setCurrentAnswerer(null);
    }
  }, [currentQuestion]);

  useEffect(() => {
    if (!currentQuestion?.question || !isTypewriterActive) return;
    const fullQuestion = currentQuestion.question;
    const startIndex = displayedQuestion.length;
    if (startIndex >= fullQuestion.length) return;
    
    let index = startIndex;
    const interval = setInterval(() => {
      setDisplayedQuestion((prev) => prev + fullQuestion.charAt(index));
      index++;
      if (index >= fullQuestion.length) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [currentQuestion?.question, isTypewriterActive, displayedQuestion.length]);

  useEffect(() => {
    if (!isTimerActive || timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive]);

  useEffect(() => {
    if (gamePhase === "correct" || gamePhase === "incorrect") {
      const timer = setTimeout(() => {
        setGamePhase("question");
        setUserAnswer("");
        setCurrentAnswerIndex(0);
        setCurrentAnswerer(null);
        setTimeLeft(60);
        setIsTimerActive(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gamePhase]);

  useEffect(() => {
    if (gameState.status === "finished") {
      const timer = setTimeout(() => router.push("/resultScreen"), 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState.status, router]);

  const handleStartAnswering = () => {
    if (!currentQuestion) return;
    setIsTimerActive(false);
    setIsTypewriterActive(false);
    setCurrentAnswerer(thisPlayer.name);
    setGamePhase("answering");
    setChoices(generateChoices(currentQuestion.answer_full[0]));
  };

  const handleChoiceClick = async (char: string) => {
    if (gamePhase !== "answering" || currentAnswerer !== thisPlayer.name || !currentQuestion) return;
    
    const nextUserAnswer = userAnswer + char;
    setUserAnswer(nextUserAnswer);
    
    console.log('Choice clicked:', {
      char,
      nextUserAnswer,
      correctAnswer: currentQuestion.answer_full,
      currentAnswerIndex,
      isComplete: nextUserAnswer === currentQuestion.answer_full
    });
    
    if (nextUserAnswer === currentQuestion.answer_full) {
      console.log('Submitting complete answer:', nextUserAnswer);
      const result = await submitAnswer(nextUserAnswer);
      console.log('Submit result:', result);
      setGamePhase(result.isCorrect ? "correct" : "incorrect");
    } else if (char === currentQuestion.answer_full[currentAnswerIndex]) {
      const nextIndex = currentAnswerIndex + 1;
      setCurrentAnswerIndex(nextIndex);
      if (nextIndex < currentQuestion.answer_full.length) {
        setChoices(generateChoices(currentQuestion.answer_full[nextIndex]));
      }
    } else {
      console.log('Wrong character selected');
      setGamePhase("incorrect");
    }
  };

  const progressValue = (timeLeft / 60) * 100;

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 p-2 md:p-4">
      <header className="flex-shrink-0 text-center">
        <h1 className="text-xl md:text-2xl font-bold">Quiz Time!</h1>
      </header>

      <div className="flex-shrink-0 flex justify-center space-x-2 md:space-x-4 my-1 md:my-2">
        {participants.map((p, index) => (
          <div key={index} className="flex flex-col items-center">
            <Avatar className="w-10 h-10 md:w-14 md:h-14">
              <AvatarImage src={p.avatarUrl} alt={p.name} />
              <AvatarFallback>{p.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-xs mt-1">{p.name}</span>
            <span className="text-xs font-bold">{gameState.scores[p.name] || 0}</span>
          </div>
        ))}
      </div>

      <main className="flex-grow flex flex-col items-center min-h-0">
        <div className="w-full max-w-2xl flex-shrink-0">
          <Progress value={progressValue} className="w-full" />
          <p className="text-center mt-1 text-xs md:text-sm">{timeLeft}s</p>
        </div>

        <div className="relative w-full flex-grow flex flex-col items-center my-2">
          <Card className="w-full max-w-2xl flex-grow flex flex-col justify-between">
            <div className="flex-grow flex flex-col justify-center">
              <CardHeader className="p-2">
                <CardTitle className="text-center text-lg md:text-xl">
                  Question {gameState.questionIndex + 1}
                </CardTitle>
                <div className="text-xs text-center text-gray-500">
                  Debug: Status={gameState.status}, Index={gameState.questionIndex}, Connected={isConnected ? 'Yes' : 'No'}
                </div>
              </CardHeader>
              <CardContent className="p-2">
                <p className="text-lg md:text-2xl text-center font-semibold break-words px-2 min-h-[6rem]">
                  {gameState.status === "finished" ? "Quiz Finished!" : displayedQuestion}
                </p>
                {!isConnected && (
                  <p className="text-sm text-red-500 text-center">接続中...</p>
                )}
              </CardContent>
            </div>

            <div className="flex-shrink-0 p-2 md:p-4 text-center">
              {currentAnswerer && (
                <div className="mb-2 text-sm md:text-lg">
                  Answering: <span className="font-bold">{currentAnswerer}</span>
                </div>
              )}
              <div className="text-2xl md:text-4xl font-bold tracking-widest min-h-[3rem] md:min-h-[4rem] mb-2 border-b-2 pb-2">
                {userAnswer || "　"}
              </div>
              {currentQuestion && (
                <div className="text-xs text-gray-500 mb-2">
                  正解: {currentQuestion.answer_full} | 入力: {userAnswer} | 進行: {currentAnswerIndex}/{currentQuestion.answer_full.length}
                </div>
              )}
              <div className="min-h-[8rem] md:min-h-[9rem] flex items-center justify-center">
                {gamePhase === "answering" && (
                  <div className="grid grid-cols-2 gap-2 md:gap-4 w-full">
                    {choices.map((char) => (
                      <Button 
                        key={char} 
                        onClick={() => handleChoiceClick(char)} 
                        disabled={currentAnswerer !== thisPlayer.name} 
                        className="text-xl md:text-2xl h-12 md:h-16"
                      >
                        {char}
                      </Button>
                    ))}
                  </div>
                )}
                {["correct", "incorrect"].includes(gamePhase) && (
                  <Alert variant={gamePhase === "incorrect" ? "destructive" : "default"} 
                        className={gamePhase === "correct" ? "bg-green-100 border-green-400" : ""}>
                    <AlertTitle className="font-bold">
                      {gamePhase === "correct" && "正解 (Correct)!"}
                      {gamePhase === "incorrect" && "不正解 (Incorrect)!"}
                    </AlertTitle>
                  </Alert>
                )}
                {gameState.status === "finished" && (
                  <Alert className="bg-blue-100 border-blue-400">
                    <AlertTitle className="font-bold">Quiz Complete!</AlertTitle>
                  </Alert>
                )}
              </div>
            </div>
          </Card>
          
          {gameState.status === 'waiting' && (
            <div className="absolute bottom-0 mb-2 md:mb-4">
              <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700">
                ゲーム開始
              </Button>
            </div>
          )}
          
          {gamePhase === "question" && !currentAnswerer && gameState.status === 'in_progress' && (
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