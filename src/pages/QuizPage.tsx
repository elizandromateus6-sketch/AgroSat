import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Quiz, User } from '../types';
import { educationService } from '../services/educationService';
import { Award, CheckCircle2, HelpCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';

interface QuizPageProps {
  currentUser: User | null;
  onRefreshUser: () => void;
}

export const QuizPage: React.FC<QuizPageProps> = ({ currentUser, onRefreshUser }) => {
  const quizzes = educationService.getQuizzes();
  const [activeQuizId, setActiveQuizId] = useState<string>(quizzes[0]?.id || 'quiz_ndvi');

  const currentQuiz = quizzes.find((q) => q.id === activeQuizId) || quizzes[0];

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [quizFinished, setQuizFinished] = useState(false);
  const [score, setScore] = useState(0);

  const question = currentQuiz.questions[currentQuestionIdx];

  const handleNextQuestion = () => {
    if (selectedOption === null) return;

    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);

    if (currentQuestionIdx + 1 < currentQuiz.questions.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Calculate Score
      let correctCount = 0;
      const answersRecord: Record<string, number> = {};

      currentQuiz.questions.forEach((q, idx) => {
        answersRecord[q.id] = newAnswers[idx];
        if (newAnswers[idx] === q.correctOptionIndex) {
          correctCount += 1;
        }
      });

      setScore(correctCount);
      setQuizFinished(true);

      // Award Points
      educationService.submitQuizAnswers(
        currentUser?.id || 'usr_001',
        currentQuiz.id,
        answersRecord
      );
      onRefreshUser();

      // Trigger Confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setAnswers([]);
    setQuizFinished(false);
    setScore(0);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#E0E2D9] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-amber-500/10 text-amber-600 rounded-xl border border-amber-500/20">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold font-display text-[#1E291B]">
              Quizzes & Testes de Conhecimento
            </h1>
          </div>
          <p className="text-xs text-[#6B705C] pl-0.5">
            Teste suas habilidades em sensoriamento remoto, NDVI e práticas agrícolas em Angola.
          </p>
        </div>

        {/* Quiz Selector */}
        <select
          value={activeQuizId}
          onChange={(e) => {
            setActiveQuizId(e.target.value);
            handleRestartQuiz();
          }}
          className="bg-[#F7F8F3] text-[#1E291B] font-bold px-3.5 py-2.5 rounded-xl text-xs border border-[#E0E2D9] cursor-pointer shrink-0 focus:outline-none"
        >
          {quizzes.map((q) => (
            <option key={q.id} value={q.id}>
              🏆 {q.title}
            </option>
          ))}
        </select>
      </div>

      {/* Quiz Card */}
      {!quizFinished ? (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md space-y-6">
          {/* Progress Header */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-3 border-b border-slate-100">
            <span>
              Pergunta {currentQuestionIdx + 1} de {currentQuiz.questions.length}
            </span>
            <span className="text-emerald-700 font-mono">
              +10 Pontos por resposta correta
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-base sm:text-lg font-bold font-display text-slate-900">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-2.5">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-xs font-medium transition-all flex items-center space-x-3 ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full font-mono text-[11px] font-bold flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Footer Action */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <span>
                {currentQuestionIdx + 1 === currentQuiz.questions.length
                  ? 'Finalizar Quiz'
                  : 'Próxima Pergunta'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Quiz Summary Screen */
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold font-display text-slate-900">
              Quiz Concluído com Sucesso!
            </h2>
            <p className="text-xs text-slate-500">
              Você acertou <strong>{score}</strong> de <strong>{currentQuiz.questions.length}</strong> perguntas.
            </p>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 max-w-xs mx-auto">
            <span className="text-xs font-bold text-emerald-900 block">Pontos Adicionados:</span>
            <span className="text-3xl font-black font-display text-emerald-700">
              +{score * 10} pts
            </span>
          </div>

          <button
            onClick={handleRestartQuiz}
            className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs inline-flex items-center space-x-2 shadow-md"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tentar Novamente</span>
          </button>
        </div>
      )}
    </div>
  );
};
