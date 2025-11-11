import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Score, Problem, HistoryEntry } from './types';

const HistoryDetailModal = ({ history, onClose }: { history: HistoryEntry[], onClose: () => void }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      <div 
        className="bg-slate-800 rounded-lg shadow-2xl p-6 sm:p-8 w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 id="history-modal-title" className="text-3xl font-bold text-cyan-300">Detailed History</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-4xl font-bold leading-none"
            aria-label="Close detailed history"
          >
            &times;
          </button>
        </div>
        <div className="overflow-y-auto pr-2 -mr-4">
          {history.length === 0 ? (
            <p className="text-slate-400 text-center text-lg">No history to display yet. Solve some problems first!</p>
          ) : (
            <ul className="space-y-4">
              {history.map((item, index) => (
                <li
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    item.isCorrect ? 'border-green-500 bg-slate-700/50' : 'border-red-500 bg-slate-700/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <p className="text-2xl font-mono text-slate-200">{item.problem}</p>
                    {item.isCorrect ? (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                       </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                  </div>
                  <div className="mt-2 text-lg">
                    <p className="text-slate-400">You answered: <span className={`font-bold ${item.isCorrect ? 'text-green-400' : 'text-red-400'}`}>{item.userAnswer}</span></p>
                    {!item.isCorrect && (
                      <p className="text-slate-400">Correct answer: <span className="font-bold text-green-400">{item.correctAnswer}</span></p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [score, setScore] = useState<Score>({ correct: 0, incorrect: 0 });
  const [problem, setProblem] = useState<Problem | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistoryDetail, setShowHistoryDetail] = useState(false);
  const [answerStatus, setAnswerStatus] = useState<'correct' | 'incorrect' | null>(null);
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
    if (!inputValue.trim() || !problem || answerStatus) return;

    const userAnswer = parseInt(inputValue, 10);
    const isCorrect = userAnswer === problem.answer;
    
    setAnswerStatus(isCorrect ? 'correct' : 'incorrect');

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

    setTimeout(() => {
        generateProblem();
        setAnswerStatus(null);
    }, 1200);
  };

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-900 flex justify-center items-center">
        <p className="text-3xl text-cyan-400">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
        <header className="w-full max-w-2xl text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-4">
            Multiplication Master
          </h1>
          <div className="flex justify-center gap-8 text-2xl">
            <div className={`bg-green-500/20 text-green-400 p-3 rounded-lg shadow-lg transition-transform ${answerStatus === 'correct' ? 'animate-pop' : ''}`}>
              <span className="font-semibold">Correct:</span> {score.correct}
            </div>
            <div className={`bg-red-500/20 text-red-400 p-3 rounded-lg shadow-lg transition-transform ${answerStatus === 'incorrect' ? 'animate-pop' : ''}`}>
              <span className="font-semibold">Incorrect:</span> {score.incorrect}
            </div>
          </div>
        </header>

        <main className={`w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 flex flex-col items-center transition-all duration-300 ${answerStatus === 'correct' ? 'animate-flash-green' : answerStatus === 'incorrect' ? 'animate-flash-red' : ''}`}>
          <div className={`mb-6 text-center ${answerStatus === 'incorrect' ? 'animate-shake' : ''}`}>
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
              className="w-full text-center text-4xl sm:text-5xl font-bold bg-slate-700 border-2 border-slate-600 rounded-lg p-3 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:border-purple-500 transition mb-4 disabled:opacity-70"
              placeholder="?"
              autoFocus
              disabled={!!answerStatus}
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold text-2xl py-3 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              disabled={!!answerStatus}
            >
              Submit
            </button>
          </form>

          {feedback && answerStatus && (
            <div
              key={history.length}
              className={`mt-6 text-xl font-semibold p-3 rounded-lg animate-slide-in-up ${
                feedback.isCorrect ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'
              }`}
            >
              {feedback.message}
            </div>
          )}
        </main>

        {history.length > 0 && (
          <section className="w-full max-w-2xl mt-12">
            <div className="flex justify-center items-center gap-4 mb-4">
              <h2 className="text-3xl font-bold text-slate-400">History</h2>
              <button 
                onClick={() => setShowHistoryDetail(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105"
                aria-label="Show detailed history"
              >
                Show Details
              </button>
            </div>
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
      {showHistoryDetail && (
        <HistoryDetailModal
          history={history}
          onClose={() => setShowHistoryDetail(false)}
        />
      )}
    </>
  );
};

export default App;