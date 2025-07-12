"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PushButton } from "@/app/(pages)/Home/components/PushButton";

// Mock data - in a real application, this would come from props or an API call
const participants = [
  { name: "Player 1", avatarUrl: "/images/avatars/person_avatar_1.png" },
  { name: "Player 2", avatarUrl: "/images/avatars/person_avatar_2.png" },
  { name: "Player 3", avatarUrl: "/images/avatars/person_avatar_3.png" },
  { name: "Player 4", avatarUrl: "/images/avatars/person_avatar_4.png" },
];

const quizQuestion = {
  category: "Technology",
  question:
    "This is a very long question designed to test the text wrapping capabilities of the component. What is the name of the principle that states that for every action, there is an equal and opposite reaction?",
  answers: ["Kyoto", "Osaka", "Tokyo", "Hokkaido"],
};

const QuizScreenPage = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [displayedQuestion, setDisplayedQuestion] = useState("");

  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    setDisplayedQuestion(""); // Reset when question changes
    const fullQuestion = quizQuestion.question;
    let index = 0;
    const interval = setInterval(() => {
      setDisplayedQuestion((prev) => prev + fullQuestion.charAt(index));
      index++;
      if (index === fullQuestion.length) {
        clearInterval(interval);
      }
    }, 50); // Adjust speed of typing here

    return () => clearInterval(interval);
  }, [quizQuestion.question]);

  const progressValue = (timeLeft / 60) * 100;

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 p-4">
      {/* Header */}
      <header className="text-center mb-4">
        <h1 className="text-2xl font-bold">Quiz Time!</h1>
      </header>

      {/* Participants Display */}
      <div className="flex justify-center space-x-8 mb-4">
        {participants.map((p, index) => (
          <div key={index} className="flex flex-col items-center">
            <Avatar className="w-16 h-16">
              <AvatarImage src={p.avatarUrl} alt={p.name} />
              <AvatarFallback>{p.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-sm mt-2">{p.name}</span>
          </div>
        ))}
      </div>

      {/* Main Quiz Area */}
      <main className="relative flex-grow flex flex-col items-center justify-start">
        {/* Timer Bar */}
        <div className="w-full max-w-2xl mb-2">
          <Progress value={progressValue} className="w-full" />
          <p className="text-center mt-1 text-sm">{timeLeft} seconds remaining</p>
        </div>

        <Card className="w-full max-w-2xl flex-grow flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-center">Question</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow flex items-start justify-center pt-2">
            <p className="text-2xl text-center font-semibold break-words px-4">
              {displayedQuestion}
            </p>
          </CardContent>
        </Card>

        <div className="absolute bottom-2">
          <PushButton />
        </div>
      </main>
    </div>
  );
};

export default QuizScreenPage;
