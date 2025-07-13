"use client";

import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card, CardContent, CardTitle,
} from "@/components/ui/card";
import { Plus, ArrowLeft } from 'lucide-react';
import { saveToDynamoDB, fetchProblemsFromDynamoDB } from '@/app/features/lambda/db';

interface Problem {
  id: string;
  question: string;
  answer: string;
}

interface Genre {
  id: number;
  name: string;
  problems: Problem[];
}

const CreateProblemPage = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);

  const [isGenreDialogOpen, setIsGenreDialogOpen] = useState(false);
  const [newGenreName, setNewGenreName] = useState('');
  const [isEditGenreDialogOpen, setIsEditGenreDialogOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [genreNameToEdit, setGenreNameToEdit] = useState('');

  const [isProblemDialogOpen, setIsProblemDialogOpen] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const [isEditProblemDialogOpen, setIsEditProblemDialogOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [problemQuestionToEdit, setProblemQuestionToEdit] = useState('');
  const [problemAnswerToEdit, setProblemAnswerToEdit] = useState('');

  useEffect(() => {
    const loadProblems = async () => {
      const problems = await fetchProblemsFromDynamoDB();
      const genreMap: { [key: string]: Problem[] } = {};
      problems.forEach((p: Problem) => {
        if (!p.id) p.id = uuidv4(); // 安全策
        const genreName = "デフォルトジャンル";
        if (!genreMap[genreName]) genreMap[genreName] = [];
        genreMap[genreName].push(p);
      });
      const loadedGenres = Object.entries(genreMap).map(([name, problems], index) => ({
        id: index,
        name,
        problems,
      }));
      setGenres(loadedGenres);
    };
    loadProblems();
  }, []);

  const handleCreateGenre = () => {
    if (newGenreName.trim() === '') return;
    const newGenre: Genre = { id: Date.now(), name: newGenreName, problems: [] };
    setGenres([...genres, newGenre]);
    setNewGenreName('');
    setIsGenreDialogOpen(false);
  };

  const handleOpenEditGenreDialog = (genre: Genre) => {
    setEditingGenre(genre);
    setGenreNameToEdit(genre.name);
    setIsEditGenreDialogOpen(true);
  };

  const handleUpdateGenreName = () => {
    if (!editingGenre || genreNameToEdit.trim() === '') return;
    const updatedGenres = genres.map(g => g.id === editingGenre.id ? { ...g, name: genreNameToEdit } : g);
    setGenres(updatedGenres);
    if (selectedGenre && selectedGenre.id === editingGenre.id) {
      const updatedSelectedGenre = updatedGenres.find(g => g.id === editingGenre.id);
      setSelectedGenre(updatedSelectedGenre || null);
    }
    setIsEditGenreDialogOpen(false);
    setEditingGenre(null);
  };

  const handleCreateProblem = async () => {
    if (!selectedGenre || newQuestion.trim() === '' || newAnswer.trim() === '') return;
    const newProblem: Problem = {
      id: uuidv4(),
      question: newQuestion,
      answer: newAnswer
    };
    try {
      await saveToDynamoDB(newProblem);
    } catch (error) {
      console.error("Error saving to DynamoDB:", error);
      return;
    }
    const updatedGenres = genres.map(g =>
      g.id === selectedGenre.id ? { ...g, problems: [...g.problems, newProblem] } : g
    );
    setGenres(updatedGenres);
    setSelectedGenre(updatedGenres.find(g => g.id === selectedGenre.id) || null);
    setNewQuestion('');
    setNewAnswer('');
    setIsProblemDialogOpen(false);
  };

  const handleOpenEditProblemDialog = (problem: Problem) => {
    setEditingProblem(problem);
    setProblemQuestionToEdit(problem.question);
    setProblemAnswerToEdit(problem.answer);
    setIsEditProblemDialogOpen(true);
  };

  const handleUpdateProblem = () => {
    if (!selectedGenre || !editingProblem || problemQuestionToEdit.trim() === '' || problemAnswerToEdit.trim() === '') return;
    const updatedProblems = selectedGenre.problems.map(p =>
      p.id === editingProblem.id ? { ...p, question: problemQuestionToEdit, answer: problemAnswerToEdit } : p
    );
    const updatedGenres = genres.map(g =>
      g.id === selectedGenre.id ? { ...g, problems: updatedProblems } : g
    );
    setGenres(updatedGenres);
    setSelectedGenre(updatedGenres.find(g => g.id === selectedGenre.id) || null);
    setIsEditProblemDialogOpen(false);
    setEditingProblem(null);
  };

  if (!selectedGenre) {
    return (
      <div className="h-full w-full max-w-4xl p-4 md:p-6">
        <div className="grid grid-cols-1 gap-4 mb-24">
          {genres.map((genre) => (
            <Card key={`genre-${genre.id}`} className="w-full">
              <div className="flex items-center justify-between p-4" onClick={() => setSelectedGenre(genre)}>
                <div className="flex-1 cursor-pointer">
                  <CardTitle className="text-lg font-medium">{genre.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">問題数: {genre.problems.length}</p>
                </div>
                <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleOpenEditGenreDialog(genre); }}>編集</Button>
              </div>
            </Card>
          ))}
        </div>
        <Dialog open={isGenreDialogOpen} onOpenChange={setIsGenreDialogOpen}>
          <DialogTrigger asChild><Button className="fixed bottom-20 right-8 rounded-full w-16 h-16 shadow-lg"><Plus className="h-8 w-8" /></Button></DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新しいジャンルを作成</DialogTitle>
            </DialogHeader>
            <Input value={newGenreName} onChange={(e) => setNewGenreName(e.target.value)} placeholder="ジャンル名" />
            <DialogFooter><Button onClick={handleCreateGenre}>完了</Button></DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isEditGenreDialogOpen} onOpenChange={setIsEditGenreDialogOpen}>
          <DialogContent>
            <DialogHeader><DialogTitle>ジャンル名を編集</DialogTitle></DialogHeader>
            <Input value={genreNameToEdit} onChange={(e) => setGenreNameToEdit(e.target.value)} placeholder="新しいジャンル名" />
            <DialogFooter><Button onClick={handleUpdateGenreName}>保存</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="h-full w-full max-w-4xl p-4 md:p-6">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="icon" onClick={() => setSelectedGenre(null)}><ArrowLeft className="h-6 w-6" /></Button>
        <h1 className="text-2xl font-bold ml-2">{selectedGenre?.name}</h1>
      </div>
      <div className="grid grid-cols-1 gap-4 mb-24">
        {selectedGenre.problems.length === 0 ? (
          <p className="text-center text-muted-foreground">まだ問題がありません。</p>
        ) : (
          selectedGenre.problems.map((problem) => (
            <Card key={`problem-${problem.id}`} className="w-full cursor-pointer hover:bg-gray-50" onClick={() => handleOpenEditProblemDialog(problem)}>
              <CardContent className="p-4">
                <p className="font-semibold">問題:</p><p>{problem.question}</p>
                <p className="font-semibold mt-2">回答:</p><p>{problem.answer}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      <Dialog open={isProblemDialogOpen} onOpenChange={setIsProblemDialogOpen}>
        <DialogTrigger asChild><Button className="fixed bottom-20 right-8 rounded-full w-16 h-16 shadow-lg"><Plus className="h-8 w-8" /></Button></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新しい問題を作成</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="question">問題文</Label>
            <Textarea id="question" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)} placeholder="問題文を入力" />
            <Label htmlFor="answer">回答</Label>
            <Input id="answer" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)} placeholder="回答を入力" />
          </div>
          <DialogFooter><Button onClick={handleCreateProblem}>保存</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditProblemDialogOpen} onOpenChange={setIsEditProblemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>問題を編集</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="edit-question">問題文</Label>
            <Textarea id="edit-question" value={problemQuestionToEdit} onChange={(e) => setProblemQuestionToEdit(e.target.value)} placeholder="問題文を入力" />
            <Label htmlFor="edit-answer">回答</Label>
            <Input id="edit-answer" value={problemAnswerToEdit} onChange={(e) => setProblemAnswerToEdit(e.target.value)} placeholder="回答を入力" />
          </div>
          <DialogFooter><Button onClick={handleUpdateProblem}>保存</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateProblemPage;