
import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Score, Problem, HistoryEntry } from './types';

const App: React.FC = () => {
  const [score, setScore] = useState<Score>({ correct: 0, incorrect: 0 });
  const [problem, setProblem] = useState<Problem | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const generateProblem = () => {
    const num1 = Math.floor(Math.random() * 12) + 1;
    const num2 = Math.floor(Math.random() * 12) + 1;
    setProblem({ num1, num2, answer: num1 * num2 });
    setInputValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    generateProblem();
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || !problem) return;

    const userAnswer = parseInt(inputValue, 10);
    const isCorrect = userAnswer === problem.answer;

    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
      setFeedback({ message: 'CORRECT!', isCorrect: true });
    } else {
      setScore(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      setFeedback({ message: `NICE TRY! The answer was ${problem.answer}.`, isCorrect: false });
    }

    const newHistoryEntry: HistoryEntry = {
      problem: `${problem.num1} × ${problem.num2}`,
      userAnswer: inputValue,
      correctAnswer: problem.answer,
      isCorrect,
    };
    setHistory(prev => [newHistoryEntry, ...prev]);

    generateProblem();
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <p className="text-3xl text-cyan-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-2xl text-center mb-8">
        <h1 className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
          Multiplication Master
        </h1>
        <div className="flex justify-center gap-8 text-2xl">
          <div className="bg-green-500/20 text-green-400 p-3 rounded-lg shadow-lg">
            <span className="font-semibold">Correct:</span> {score.correct}
          </div>
          <div className="bg-red-500/20 text-red-400 p-3 rounded-lg shadow-lg">
            <span className="font-semibold">Incorrect:</span> {score.incorrect}
          </div>
        </div>
      </header>

      <main className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center transition-all duration-300">
        <div className="mb-6 text-center">
          <p className="text-7xl sm:text-8xl font-black tracking-tighter text-cyan-300">
            {problem.num1} <span className="text-purple-400">×</span> {problem.num2}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <input
            ref={inputRef}
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full text-center text-4xl sm:text-5xl font-bold bg-slate-700 border-2 border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition mb-4"
            placeholder="?"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-2xl py-3 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200"
          >
            Submit
          </button>
        </form>

        {feedback && (
          <div
            key={history.length}
            className={`mt-6 text-xl font-semibold p-3 rounded-lg animate-fade-in ${
              feedback.isCorrect ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'
            }`}
          >
            {feedback.message}
          </div>
        )}
      </main>

      {history.length > 0 && (
        <section className="w-full max-w-2xl mt-12">
          <h2 className="text-3xl font-bold text-center mb-4 text-slate-400">History</h2>
          <div className="bg-slate-800 rounded-lg shadow-lg p-4 max-h-80 overflow-y-auto">
            <ul className="space-y-3">
              {history.map((item, index) => (
                <li
                  key={index}
                  className={`flex justify-between items-center p-3 rounded-md ${
                    item.isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}
                >
                  <span className="text-lg font-mono text-slate-300">
                    {item.problem} = {item.correctAnswer}
                  </span>
                  <span
                    className={`text-lg font-bold px-3 py-1 rounded-full ${
                      item.isCorrect
                        ? 'text-green-300'
                        : 'text-red-300'
                    }`}
                  >
                    You said: {item.userAnswer}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
};

export default App;
