"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { 
  Briefcase, Sparkles, Loader2, ArrowLeft, 
  HelpCircle, BookOpen, AlertCircle, Award, CheckCircle,
  XCircle, ChevronLeft, ChevronRight, RotateCcw, ThumbsUp
} from "lucide-react";

interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswerIdx: number;
  explanation: string;
}

export default function JobPrepPage() {
  const [jobTitle, setJobTitle] = useState("React Developer");
  const [skillsText, setSkillsText] = useState("React, Next.js, Redux, Tailwind CSS");
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [initialCount] = useState(15);
  
  // Quiz states
  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  const handleStartQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle) {
      toast.error("Please enter a job title!");
      return;
    }

    setLoadingQuestions(true);
    setQuestions([]);
    setCurrentIdx(-1);
    setSelectedAnswers({});
    setQuizFinished(false);
    
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "job-prep",
          action: "generate-questions",
          jobTitle,
          skills: skillsText,
          count: initialCount
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate questions");

      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data);
        setCurrentIdx(0);
        toast.success("AI MCQ Quiz is ready!");
      } else {
        throw new Error("Invalid format received");
      }
    } catch (err: any) {
      toast.error(err.message || "Running quiz in fallback mode.");
      // Fallback
      setQuestions([
        {
          question: "What is the primary difference between Next.js Server Components and Client Components?",
          options: [
            "Server Components render on the browser; Client Components render on the server.",
            "Server Components render exclusively on the server and send zero JS to the client; Client Components are hydrated on the browser for interactivity.",
            "Server Components cannot fetch data from databases; Client Components can.",
            "Server Components support React hooks like useState, while Client Components do not."
          ],
          correctAnswerIdx: 1,
          explanation: "Server Components run on the server and do not ship runtime JS to the client. Client Components ('use client') run on both server and client, allowing browser hooks and interaction."
        },
        {
          question: "Which of the following hooks is used to memoize the computed value of an expensive calculation in React?",
          options: [
            "useCallback",
            "useEffect",
            "useMemo",
            "useRef"
          ],
          correctAnswerIdx: 2,
          explanation: "useMemo caches the result of a function calculation between renders, whereas useCallback memoizes the callback function itself."
        },
        {
          question: "How does the 'key' prop help React in handling list items?",
          options: [
            "It applies styling attributes dynamically.",
            "It helps React identify which items have changed, been added, or been removed in a list.",
            "It links list items to global context parameters.",
            "It forces list items to render synchronously."
          ],
          correctAnswerIdx: 1,
          explanation: "Keys provide stable identities to elements in a list, enabling React's reconciliation algorithm to efficiently match and update elements instead of re-rendering everything."
        }
      ]);
      setCurrentIdx(0);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "job-prep",
          action: "generate-questions",
          jobTitle,
          skills: skillsText,
          count: 10,
          existingQuestions: questions.map(q => q.question)
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch more questions");
      if (Array.isArray(data) && data.length > 0) {
        setQuestions(prev => [...prev, ...data]);
        toast.success(`Added ${data.length} more questions!`);
      } else {
        throw new Error("Invalid format received");
      }
    } catch (err: any) {
      toast.error(err.message || "Could not load more questions.");
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSelectOption = (optionIdx: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIdx]: optionIdx
    }));
  };

  const handleFinishQuiz = () => {
    // Check if all questions are answered
    if (Object.keys(selectedAnswers).length < questions.length) {
      toast.error("Please answer all questions before submitting!");
      return;
    }
    setQuizFinished(true);
    toast.success("Quiz completed! View your results.");
  };

  const getScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIdx) {
        score++;
      }
    });
    return score;
  };

  const getPerformanceMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return { title: "Perfect Score! 🏆", desc: "You have complete mastery of this subject. Ready for interview!", color: "text-emerald-600 dark:text-emerald-400" };
    if (percentage >= 70) return { title: "Strong Candidate! 🌟", desc: "Great technical knowledge. Just review the incorrect answers.", color: "text-blue-600 dark:text-blue-400" };
    return { title: "Keep Practicing! 📚", desc: "Good effort. Review the explanations below to improve your skills.", color: "text-orange-600 dark:text-orange-400" };
  };

  const score = getScore();
  const performance = getPerformanceMessage(score, questions.length);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Back Link Header */}
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors shadow-sm">
            <ArrowLeft className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </Link>
          <div>
            <h1 className="font-extrabold text-2xl text-slate-900 dark:text-white tracking-tight">AI MCQ Practice</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Practice mock Multiple-Choice questions & get instant grading</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Form Settings */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b pb-3 border-slate-100 dark:border-slate-700">
              <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Setup MCQ Quiz</h3>
            </div>

            <form onSubmit={handleStartQuiz} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-black text-slate-450 dark:text-slate-400 block mb-1">Target Job Title</label>
                <input 
                  type="text" 
                  value={jobTitle} 
                  onChange={e => setJobTitle(e.target.value)} 
                  placeholder="e.g. React Developer" 
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs bg-transparent font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-slate-450 dark:text-slate-400 block mb-1">Target Skills (Optional)</label>
                <textarea 
                  rows={3}
                  value={skillsText} 
                  onChange={e => setSkillsText(e.target.value)} 
                  placeholder="e.g. React, Next.js, Redux" 
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs bg-transparent font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loadingQuestions}
                className="w-full flex items-center justify-center py-2.5 px-4 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 font-bold text-xs shadow-md shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-60"
              >
                {loadingQuestions ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                    Generating MCQ Test...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1.5" />
                    Start Mock Quiz
                  </>
                )}
              </button>
            </form>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-700 text-[10px] text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed">
              <p className="font-bold flex items-center gap-1 text-slate-700 dark:text-slate-350 uppercase tracking-wider">
                <AlertCircle className="h-3.5 w-3.5 text-slate-450" /> Guidelines:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>AI generates <strong>{initialCount} questions</strong> to start.</li>
                <li>Click <strong>"+ More Questions"</strong> to add 10 more anytime.</li>
                <li>Choose the most accurate option for each.</li>
                <li>View final scores, statistics, and detailed explanations at the end.</li>
              </ul>
            </div>
          </div>

          {/* Right Column: AI MCQ Workspace Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Setup Prompt view */}
            {questions.length === 0 && !loadingQuestions && (
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-full text-emerald-600 dark:text-emerald-400 animate-bounce">
                  <Briefcase className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Start your MCQ Quiz</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-normal">
                  Configure your target job role in the side settings panel and click "Start Mock Quiz" to get custom generated Multiple-Choice questions.
                </p>
              </div>
            )}

            {/* 2. Loading State */}
            {loadingQuestions && (
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">AI is writing MCQ questions...</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-normal">
                  Drafting customized multiple-choice options and expert detailed solutions for {jobTitle}.
                </p>
              </div>
            )}

            {/* 3. Quiz Game Area */}
            {questions.length > 0 && !quizFinished && currentIdx >= 0 && (
              <div className="space-y-6">
                
                {/* Header details: current question index and progress bar */}
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-xl shadow-sm flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Question {currentIdx + 1} of {questions.length}
                  </span>
                  
                  {/* Progress bar container */}
                  <div className="w-1/2 bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full transition-all duration-300"
                      style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Block */}
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl shadow-sm space-y-6">
                  <div className="flex items-start gap-3 border-b pb-4 border-slate-100 dark:border-slate-700">
                    <span className="p-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-lg shrink-0 mt-0.5">
                      <HelpCircle className="h-4 w-4" />
                    </span>
                    <h2 className="text-sm font-extrabold text-slate-900 dark:text-white leading-relaxed">
                      {questions[currentIdx].question}
                    </h2>
                  </div>

                  {/* Options List */}
                  <div className="grid grid-cols-1 gap-3">
                    {questions[currentIdx].options.map((option, idx) => {
                      const isSelected = selectedAnswers[currentIdx] === idx;
                      const optionLabel = String.fromCharCode(65 + idx); // A, B, C, D
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left p-4 rounded-xl border text-xs font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 text-emerald-700 dark:text-emerald-400 shadow-sm"
                              : "bg-transparent border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-750/50 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 border transition-all ${
                            isSelected
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-650"
                          }`}>
                            {optionLabel}
                          </span>
                          <span className="leading-relaxed">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Navigation controls */}
                  <div className="flex justify-between items-center border-t pt-4 border-slate-100 dark:border-slate-700">
                    <button
                      type="button"
                      disabled={currentIdx === 0}
                      onClick={() => setCurrentIdx(currentIdx - 1)}
                      className="flex items-center gap-1 py-2 px-4 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-750 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {/* Generate More Questions button — available during quiz */}
                      {!loadingMore ? (
                        <button
                          type="button"
                          onClick={handleLoadMore}
                          className="flex items-center gap-1 py-2 px-3 rounded-lg border border-dashed border-emerald-400 dark:border-emerald-600 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all cursor-pointer"
                        >
                          <Sparkles className="h-3 w-3" /> +10 More
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 py-2 px-3 text-[10px] text-emerald-600 font-semibold">
                          <Loader2 className="h-3 w-3 animate-spin" /> Loading...
                        </span>
                      )}

                      {currentIdx < questions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentIdx(currentIdx + 1)}
                          className="flex items-center gap-1 py-2 px-4 rounded-lg bg-slate-900 hover:bg-slate-950 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          Next <ChevronRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleFinishQuiz}
                          className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-emerald-500/10"
                        >
                          Submit Quiz
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Scoreboard Dashboard */}
            {quizFinished && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* Main Grading score overview */}
                <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-8 rounded-3xl shadow-sm text-center space-y-4">
                  <div className="inline-flex p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-full text-emerald-600 dark:text-emerald-400">
                    <ThumbsUp className="h-8 w-8 animate-bounce" />
                  </div>
                  
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">{performance.title}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{performance.desc}</p>
                  </div>

                  {/* Circular Score representation */}
                  <div className="flex justify-center py-2">
                    <div className="relative flex items-center justify-center">
                      <div className="w-28 h-28 rounded-full border-8 border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center bg-transparent">
                        <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                          {score}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                          / {questions.length} Correct
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setQuestions([]);
                        setCurrentIdx(-1);
                        setQuizFinished(false);
                        setSelectedAnswers({});
                      }}
                      className="inline-flex items-center gap-1.5 py-2 px-5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-750 transition-all cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" /> Try Another Quiz
                    </button>
                  </div>
                </div>

                {/* Detailed Q&A Breakdown */}
                <div className="space-y-4">
                  <h3 className="font-extrabold text-slate-800 dark:text-white text-base pl-1">Detailed Answers Review</h3>
                  
                  {questions.map((q, idx) => {
                    const selectedIdx = selectedAnswers[idx];
                    const isCorrect = selectedIdx === q.correctAnswerIdx;
                    
                    return (
                      <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-2xl shadow-sm space-y-4">
                        <div className="flex items-start gap-2.5">
                          <span className={`p-1 rounded-lg shrink-0 mt-0.5 ${
                            isCorrect 
                              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450" 
                              : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
                          }`}>
                            {isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                          </span>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400">Question #{idx + 1}</span>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-relaxed mt-0.5">
                              {q.question}
                            </h4>
                          </div>
                        </div>

                        {/* Selected vs Correct Option tags */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pl-8">
                          <div className={`p-2.5 rounded-xl border font-semibold ${
                            isCorrect 
                              ? "bg-emerald-50/20 border-emerald-200 text-emerald-800 dark:text-emerald-400" 
                              : "bg-red-50/20 border-red-200 text-red-800 dark:text-red-400"
                          }`}>
                            <span className="text-[9px] uppercase font-black block mb-0.5">Your Response</span>
                            {selectedIdx !== undefined ? `${String.fromCharCode(65 + selectedIdx)}. ${q.options[selectedIdx]}` : "No Answer Selected"}
                          </div>

                          {!isCorrect && (
                            <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/20 text-emerald-800 dark:text-emerald-400 font-semibold">
                              <span className="text-[9px] uppercase font-black block mb-0.5">Correct Answer</span>
                              {String.fromCharCode(65 + q.correctAnswerIdx)}. {q.options[q.correctAnswerIdx]}
                            </div>
                          )}
                        </div>

                        {/* Technical Explanation collapse box */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed pl-4 ml-8 border border-slate-100 dark:border-slate-750">
                          <span className="font-bold text-slate-700 dark:text-slate-350 block uppercase tracking-wider mb-0.5">Technical Explanation:</span>
                          {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
