"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { 
  Briefcase, Sparkles, Loader2, ArrowLeft, 
  HelpCircle, BookOpen, AlertCircle, Award, CheckCircle,
  XCircle, ChevronLeft, ChevronRight, RotateCcw, ThumbsUp,
  Clock, Bookmark, Volume2, Download, Zap, Flame, ShieldCheck, Filter
} from "lucide-react";

interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswerIdx: number;
  explanation: string;
  category?: string;
  difficulty?: string;
}

export default function JobPrepPage() {
  const [jobTitle, setJobTitle] = useState("React Developer");
  const [skillsText, setSkillsText] = useState("React, Next.js, Redux, Tailwind CSS");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [practiceMode, setPracticeMode] = useState<"mcq" | "timed" | "flashcard">("mcq");
  
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [initialCount] = useState(15);
  
  // Quiz states
  const [currentIdx, setCurrentIdx] = useState<number>(-1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);

  // Timer states
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Preset role quick buttons
  const presetRoles = [
    { title: "React Developer", skills: "React, Next.js, TypeScript, Redux" },
    { title: "Full-Stack Engineer", skills: "Node.js, React, MongoDB, PostgreSQL, Express" },
    { title: "Python Developer", skills: "Python, Django, FastAPI, SQL, REST APIs" },
    { title: "Product Manager", skills: "Agile, Roadmapping, User Research, Analytics" },
    { title: "Data Analyst", skills: "SQL, Python, PowerBI, Excel, Pandas" },
    { title: "UI/UX Designer", skills: "Figma, User Testing, Prototyping, Wireframing" },
    { title: "Digital Marketer", skills: "SEO, Meta Ads, Content Strategy, Google Analytics" },
  ];

  // Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (timerActive && !quizFinished) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, quizFinished]);

  const handleSelectPreset = (role: { title: string; skills: string }) => {
    setJobTitle(role.title);
    setSkillsText(role.skills);
    toast.success(`Loaded preset for ${role.title}!`);
  };

  const handleStartQuiz = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!jobTitle) {
      toast.error("Please enter a job title!");
      return;
    }

    setLoadingQuestions(true);
    setQuestions([]);
    setCurrentIdx(-1);
    setSelectedAnswers({});
    setBookmarkedQuestions([]);
    setQuizFinished(false);
    setSecondsElapsed(0);
    
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "job-prep",
          action: "generate-questions",
          jobTitle,
          skills: skillsText,
          difficulty,
          count: initialCount
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate questions");

      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data);
        setCurrentIdx(0);
        setTimerActive(true);
        toast.success(`AI ${difficulty} Quiz is live!`);
      } else {
        throw new Error("Invalid format received");
      }
    } catch (err: any) {
      toast.error("Running quiz with curated technical question bank.");
      // Curated Fallback Set
      setQuestions([
        {
          question: "What is the primary difference between Next.js Server Components and Client Components?",
          options: [
            "Server Components render on the browser; Client Components render on the server.",
            "Server Components render exclusively on the server sending zero runtime JS; Client Components are hydrated on the browser.",
            "Server Components cannot fetch data from databases.",
            "Server Components support useState and useEffect hooks natively."
          ],
          correctAnswerIdx: 1,
          explanation: "Server Components execute on the server and emit HTML, avoiding runtime JS overhead. Client Components ('use client') run on the browser for interactivity.",
          category: "Architecture"
        },
        {
          question: "Which hook is specifically designed to memoize computed calculation results between re-renders?",
          options: [
            "useCallback",
            "useEffect",
            "useMemo",
            "useRef"
          ],
          correctAnswerIdx: 2,
          explanation: "useMemo caches the returned value of a computation, while useCallback memoizes the function definition itself.",
          category: "React Hooks"
        },
        {
          question: "How does the 'key' prop assist React's reconciliation engine in rendering lists?",
          options: [
            "It applies CSS styling classes dynamically.",
            "It provides stable identities to elements so React tracks additions, moves, and deletions efficiently.",
            "It binds list items directly to Redux store values.",
            "It enforces asynchronous rendering loops."
          ],
          correctAnswerIdx: 1,
          explanation: "Keys allow React to identify changed list nodes without destroying and re-creating the entire DOM tree.",
          category: "Virtual DOM"
        },
        {
          question: "What is the main advantage of using Redux Toolkit (RTK) over classic Redux?",
          options: [
            "It removes the need for action dispatchers.",
            "It simplifies setup, reduces boilerplate, includes Immer for immutable updates, and bundles Redux Thunk.",
            "It converts React into a backend server framework.",
            "It eliminates the state store concept."
          ],
          correctAnswerIdx: 1,
          explanation: "Redux Toolkit provides createSlice and configureStore, significantly reducing boilerplate and enabling direct mutable-style updates via Immer.",
          category: "State Management"
        }
      ]);
      setCurrentIdx(0);
      setTimerActive(true);
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

  const toggleBookmark = (idx: number) => {
    setBookmarkedQuestions(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
    toast.success(bookmarkedQuestions.includes(idx) ? "Bookmark removed" : "Question bookmarked!");
  };

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      window.speechSynthesis.speak(utterance);
      toast.success("Playing AI voice explanation...");
    } else {
      toast.error("Text-to-speech not supported in this browser.");
    }
  };

  const handleFinishQuiz = () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      toast.error("Please answer all questions before submitting!");
      return;
    }
    setQuizFinished(true);
    setTimerActive(false);
    toast.success("Quiz completed! View your full scorecard.");
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

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs < 10 ? "0" : ""}${remainingSecs}s`;
  };

  const getPerformanceMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage === 100) return { title: "Interview Ready! 🏆", desc: "100% Mastery achieved. You are fully prepared for top HR rounds!", color: "text-emerald-600 dark:text-emerald-400" };
    if (percentage >= 70) return { title: "Strong Competency! 🌟", desc: "Solid performance. Review the solution breakdown to polish weak spots.", color: "text-teal-600 dark:text-teal-400" };
    return { title: "Practice & Improve! 📚", desc: "Good attempt. Read technical explanations below to sharpen your concepts.", color: "text-amber-600 dark:text-amber-400" };
  };

  const score = getScore();
  const performance = getPerformanceMessage(score, questions.length);

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 rounded-xl hover:bg-slate-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-2xl text-slate-900 dark:text-white tracking-tight">AI Job Prep & Mock MCQ</h1>
                <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  PRO AI
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                Generate job-specific technical & HR questions, track timing, and review instant solutions
              </p>
            </div>
          </div>

          {/* Practice Mode Selector Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-750">
            <button
              onClick={() => setPracticeMode("mcq")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                practiceMode === "mcq" ? "bg-emerald-500 text-slate-950 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-white"
              }`}
            >
              📝 MCQ Mode
            </button>
            <button
              onClick={() => setPracticeMode("timed")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                practiceMode === "timed" ? "bg-emerald-500 text-slate-950 shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-white"
              }`}
            >
              ⏱️ Timed Quiz
            </button>
          </div>
        </div>

        {/* Preset Quick Select Pills */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-4 rounded-2xl shadow-sm">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-500" /> Popular Role Presets (Click to Auto-fill):
          </p>
          <div className="flex flex-wrap gap-2">
            {presetRoles.map((role, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectOption(idx)}
                onMouseDown={() => handleSelectPreset(role)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:scale-105 cursor-pointer ${
                  jobTitle === role.title 
                    ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold dark:bg-emerald-950/40 dark:border-emerald-600 dark:text-emerald-300"
                    : "bg-slate-50 dark:bg-slate-750 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400"
                }`}
              >
                {role.title}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Config Panel */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-6 rounded-2xl shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b pb-3 border-slate-100 dark:border-slate-700">
              <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Setup AI Test</h3>
            </div>

            <form onSubmit={handleStartQuiz} className="space-y-4">
              <div>
                <label className="text-[10px] uppercase font-black text-slate-450 dark:text-slate-400 block mb-1">Target Job Title</label>
                <input 
                  type="text" 
                  value={jobTitle} 
                  onChange={e => setJobTitle(e.target.value)} 
                  placeholder="e.g. React Developer" 
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-slate-450 dark:text-slate-400 block mb-1">Target Skills & Tech Stack</label>
                <textarea 
                  rows={3}
                  value={skillsText} 
                  onChange={e => setSkillsText(e.target.value)} 
                  placeholder="e.g. React, Next.js, Redux" 
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none"
                />
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="text-[10px] uppercase font-black text-slate-450 dark:text-slate-400 block mb-1">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={`py-2 text-[11px] font-extrabold rounded-xl border transition-all ${
                        difficulty === level 
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                          : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingQuestions}
                className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-60"
              >
                {loadingQuestions ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating AI Questions...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Start Mock Quiz ({initialCount} Qs)
                  </>
                )}
              </button>
            </form>

            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-2 leading-relaxed">
              <p className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> Pro Features:
              </p>
              <ul className="space-y-1.5 text-[11px] font-medium">
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> AI question generation tailored for Indian recruiters</li>
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> Live timer & question bookmarking</li>
                <li className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> AI Audio readouts & detailed explanations</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Quiz Workspace */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Initial Prompt */}
            {questions.length === 0 && !loadingQuestions && (
              <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-5">
                <div className="p-5 bg-emerald-50 dark:bg-emerald-950/40 rounded-3xl text-emerald-600 dark:text-emerald-400 animate-bounce shadow-inner">
                  <Briefcase className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Ready to Test Your Technical Knowledge?</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                    Select a preset role or type your target job title, pick your difficulty level, and hit "Start Mock Quiz" to get custom AI generated questions.
                  </p>
                </div>
                <button
                  onClick={() => handleStartQuiz()}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> Start Quick Practice Quiz
                </button>
              </div>
            )}

            {/* 2. Loading State */}
            {loadingQuestions && (
              <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-3xl p-12 text-center shadow-sm flex flex-col items-center justify-center space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">AI is generating customized questions...</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                  Building {difficulty} level questions, options, and comprehensive solutions for <strong>{jobTitle}</strong>.
                </p>
              </div>
            )}

            {/* 3. Quiz Game Area */}
            {questions.length > 0 && !quizFinished && currentIdx >= 0 && (
              <div className="space-y-6">
                
                {/* Header Timer & Progress Bar */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                      Question {currentIdx + 1} of {questions.length}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {difficulty}
                    </span>
                  </div>

                  {/* Timer Display */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Clock className="w-4 h-4 text-emerald-500" />
                    <span>Time: {formatTime(secondsElapsed)}</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full sm:w-1/3 bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                      style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Question Box */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6">
                  
                  <div className="flex items-start justify-between gap-4 border-b pb-4 border-slate-100 dark:border-slate-700">
                    <div className="flex items-start gap-3">
                      <span className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0 mt-0.5">
                        <HelpCircle className="h-5 w-5" />
                      </span>
                      <div>
                        {questions[currentIdx].category && (
                          <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">
                            {questions[currentIdx].category}
                          </span>
                        )}
                        <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-relaxed">
                          {questions[currentIdx].question}
                        </h2>
                      </div>
                    </div>

                    {/* Bookmark Button */}
                    <button
                      onClick={() => toggleBookmark(currentIdx)}
                      className={`p-2 rounded-xl border transition-all ${
                        bookmarkedQuestions.includes(currentIdx)
                          ? "bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950/30"
                          : "border-slate-200 text-slate-400 hover:text-slate-600"
                      }`}
                      title="Bookmark Question"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Options Grid */}
                  <div className="grid grid-cols-1 gap-3">
                    {questions[currentIdx].options.map((option, idx) => {
                      const isSelected = selectedAnswers[currentIdx] === idx;
                      const optionLabel = String.fromCharCode(65 + idx);
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectOption(idx)}
                          className={`w-full text-left p-4 rounded-2xl border text-xs font-semibold flex items-center gap-3.5 transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-900 dark:text-emerald-300 shadow-sm ring-2 ring-emerald-500/20"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-emerald-400 text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border transition-all ${
                            isSelected
                              ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-md"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                          }`}>
                            {optionLabel}
                          </span>
                          <span className="leading-relaxed">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Bottom Action Controls */}
                  <div className="flex flex-wrap items-center justify-between border-t pt-5 border-slate-100 dark:border-slate-700 gap-3">
                    <button
                      type="button"
                      disabled={currentIdx === 0}
                      onClick={() => setCurrentIdx(currentIdx - 1)}
                      className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-750 transition-all cursor-pointer disabled:opacity-40"
                    >
                      <ChevronLeft className="h-4 w-4" /> Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {!loadingMore ? (
                        <button
                          type="button"
                          onClick={handleLoadMore}
                          className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-dashed border-emerald-400 text-emerald-700 dark:text-emerald-400 text-xs font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all cursor-pointer"
                        >
                          <Sparkles className="h-3.5 w-3.5" /> +10 More Questions
                        </button>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                          <Loader2 className="h-4 w-4 animate-spin" /> Fetching Qs...
                        </span>
                      )}

                      {currentIdx < questions.length - 1 ? (
                        <button
                          type="button"
                          onClick={() => setCurrentIdx(currentIdx + 1)}
                          className="flex items-center gap-1.5 py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                        >
                          Next Question <ChevronRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleFinishQuiz}
                          className="py-2.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                        >
                          Submit Test & View Results
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* 4. Scorecard & Detailed Review */}
            {quizFinished && (
              <div className="space-y-6 animate-fade-in-up">
                
                {/* Score Summary Box */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-8 rounded-3xl shadow-sm text-center space-y-5">
                  <div className="inline-flex p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-full text-emerald-600 dark:text-emerald-400 shadow-inner">
                    <ThumbsUp className="h-8 w-8 animate-bounce" />
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{performance.title}</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold max-w-md mx-auto">{performance.desc}</p>
                  </div>

                  {/* Metrics Badge Row */}
                  <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto py-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div>
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{score}/{questions.length}</span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Score</p>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-slate-900 dark:text-white">{Math.round((score / questions.length) * 100)}%</span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Accuracy</p>
                    </div>
                    <div>
                      <span className="text-2xl font-black text-teal-600 dark:text-teal-400">{formatTime(secondsElapsed)}</span>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Time Spent</p>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setQuestions([]);
                        setCurrentIdx(-1);
                        setQuizFinished(false);
                        setSelectedAnswers({});
                        setSecondsElapsed(0);
                      }}
                      className="inline-flex items-center gap-2 py-2.5 px-6 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
                    >
                      <RotateCcw className="h-4 w-4" /> Try Another Practice Test
                    </button>
                  </div>
                </div>

                {/* Answers Review */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Detailed Solutions & AI Explanations</h3>
                    <span className="text-xs text-slate-400 font-bold">{questions.length} Questions</span>
                  </div>

                  {questions.map((q, idx) => {
                    const selectedIdx = selectedAnswers[idx];
                    const isCorrect = selectedIdx === q.correctAnswerIdx;
                    
                    return (
                      <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-6 rounded-2xl shadow-sm space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className={`p-1.5 rounded-xl shrink-0 mt-0.5 ${
                              isCorrect 
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" 
                                : "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                            }`}>
                              {isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                            </span>
                            <div>
                              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Question #{idx + 1}</span>
                              <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-relaxed mt-0.5">
                                {q.question}
                              </h4>
                            </div>
                          </div>

                          {/* Voice Readout Button */}
                          <button
                            onClick={() => speakText(q.explanation)}
                            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-600 hover:border-emerald-400 transition-all shrink-0"
                            title="Listen to AI Voice Explanation"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Selected vs Correct Option boxes */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pl-9">
                          <div className={`p-3 rounded-xl border font-semibold ${
                            isCorrect 
                              ? "bg-emerald-50/50 border-emerald-200 text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300" 
                              : "bg-red-50/50 border-red-200 text-red-900 dark:bg-red-950/20 dark:text-red-300"
                          }`}>
                            <span className="text-[9px] uppercase font-black block mb-0.5">Your Selected Response</span>
                            {selectedIdx !== undefined ? `${String.fromCharCode(65 + selectedIdx)}. ${q.options[selectedIdx]}` : "No Option Selected"}
                          </div>

                          {!isCorrect && (
                            <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 text-emerald-900 dark:bg-emerald-950/20 dark:text-emerald-300 font-semibold">
                              <span className="text-[9px] uppercase font-black block mb-0.5">Correct Solution</span>
                              {String.fromCharCode(65 + q.correctAnswerIdx)}. {q.options[q.correctAnswerIdx]}
                            </div>
                          )}
                        </div>

                        {/* AI Technical Explanation Box */}
                        <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl text-xs text-slate-600 dark:text-slate-300 leading-relaxed ml-9 border border-slate-100 dark:border-slate-750">
                          <span className="font-extrabold text-slate-800 dark:text-slate-200 block uppercase tracking-wider text-[10px] mb-1">
                            💡 Detailed Technical Explanation:
                          </span>
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
