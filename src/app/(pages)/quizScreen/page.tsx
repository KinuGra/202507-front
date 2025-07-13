"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { PushButton } from "@/app/(pages)/Home/components/PushButton";
import { useRouter } from "next/navigation";

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
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [gamePhase, setGamePhase] = useState("question");
  const [isTypewriterActive, setIsTypewriterActive] = useState(true);
  const [currentAnswerer, setCurrentAnswerer] = useState<string | null>(null);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [choices, setChoices] = useState<string[]>([]);
  
  const [questions] = useState([
    {
      questionId: 0,
      question: '夏の大三角とは、こと座のベガ、わし座のアルタイル、はくちょう座の何？',
      answer_full: 'デネブ'
    },
    {
      questionId: 1,
      question: '「夏草や 兵どもが 夢の中」という句を読んだ俳人は誰？',
      answer_full: '松尾芭蕉'
    },
    {
      questionId: 2,
      question: '毎年7月に行われ、京の三大祭の一つとしても知られる祭は何？',
      answer_full: '祇園祭'
    },
    {
      questionId: 3,
      question: '13年周期や17年周期など周期的に大量発生するセミのことを、その周期の特徴から何と呼ぶ？',
      answer_full: '素数ゼミ'
    },
    {
      questionId: 4,
      question: 'テングサという海藻を煮て作られ、漢字では「心太」と書かれるゼリー状の食品は何？',
      answer_full: 'ところてん'
    }
  ]);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];
  
  const [participants] = useState([
    { name: "田中太郎", avatarUrl: "/images/avatars/person_avatar_1.png", score: 100, uuid: "1" },
    { name: "佐藤花子", avatarUrl: "/images/avatars/person_avatar_2.png", score: 80, uuid: "2" }
  ]);
  
  const router = useRouter();

  useEffect(() => {
    setDisplayedQuestion("");
    setIsTypewriterActive(true);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (!currentQuestion?.question || !isTypewriterActive) return;
    const fullQuestion = currentQuestion.question;
    
    let index = 0;
    setDisplayedQuestion("");
    
    const interval = setInterval(() => {
      if (index < fullQuestion.length) {
        setDisplayedQuestion(fullQuestion.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTypewriterActive(false);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [currentQuestion?.question, isTypewriterActive]);

  useEffect(() => {
    if (!isTimerActive || timeLeft === 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive]);

  useEffect(() => {
    if (gamePhase === "correct" || gamePhase === "incorrect") {
      const timer = setTimeout(() => {
        if (gamePhase === "correct" && currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
          setTimeLeft(60);
        }
        setGamePhase("question");
        setUserAnswer("");
        setCurrentAnswerIndex(0);
        setCurrentAnswerer(null);
        setIsTimerActive(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gamePhase, currentQuestionIndex, questions.length]);

  const handleStartAnswering = () => {
    setIsTimerActive(false);
    setIsTypewriterActive(false);
    setCurrentAnswerer("田中太郎");
    setGamePhase("answering");
    setChoices(generateChoices(currentQuestion.answer_full[0]));
  };

  const handleChoiceClick = (char: string) => {
    if (gamePhase !== "answering" || currentAnswerer !== "田中太郎") return;
    
    const nextUserAnswer = userAnswer + char;
    setUserAnswer(nextUserAnswer);
    
    if (nextUserAnswer === currentQuestion.answer_full) {
      setGamePhase("correct");
    } else if (char === currentQuestion.answer_full[currentAnswerIndex]) {
      const nextIndex = currentAnswerIndex + 1;
      setCurrentAnswerIndex(nextIndex);
      if (nextIndex < currentQuestion.answer_full.length) {
        setChoices(generateChoices(currentQuestion.answer_full[nextIndex]));
      }
    } else {
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
            <span className="text-xs font-bold">{p.score}</span>
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
                  Question {currentQuestionIndex + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <p className="text-lg md:text-2xl text-center font-semibold break-words px-2 min-h-[6rem]">
                  {displayedQuestion}
                </p>
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
                        disabled={currentAnswerer !== "田中太郎"} 
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