import { Course, Quiz, UserProgress } from '../types';
import { MOCK_COURSES, MOCK_QUIZZES } from '../data/mockData';
import confetti from 'canvas-confetti';

const PROGRESS_STORAGE_KEY = 'agrosat_user_progress';

export const educationService = {
  getCourses(): Course[] {
    return MOCK_COURSES;
  },

  getCourseById(id: string): Course | undefined {
    return MOCK_COURSES.find((c) => c.id === id);
  },

  getQuizzes(): Quiz[] {
    return MOCK_QUIZZES;
  },

  getQuizById(id: string): Quiz | undefined {
    return MOCK_QUIZZES.find((q) => q.id === id);
  },

  getUserProgress(userId: string): UserProgress {
    const saved = localStorage.getItem(`${PROGRESS_STORAGE_KEY}_${userId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Erro ao ler progresso do utilizador:', e);
      }
    }
    const initialProgress: UserProgress = {
      userId,
      completedLessonIds: [],
      quizScores: {},
      totalPoints: 0,
    };
    localStorage.setItem(`${PROGRESS_STORAGE_KEY}_${userId}`, JSON.stringify(initialProgress));
    return initialProgress;
  },

  markLessonCompleted(userId: string, lessonId: string): UserProgress {
    const progress = this.getUserProgress(userId);
    if (!progress.completedLessonIds.includes(lessonId)) {
      progress.completedLessonIds.push(lessonId);
      progress.totalPoints += 50; // 50 points per lesson
      localStorage.setItem(`${PROGRESS_STORAGE_KEY}_${userId}`, JSON.stringify(progress));
    }
    return progress;
  },

  submitQuizAnswers(userId: string, quizId: string, answers: Record<string, number>): { scorePercent: number; correctCount: number; totalCount: number } {
    const quiz = this.getQuizById(quizId);
    if (!quiz) return { scorePercent: 0, correctCount: 0, totalCount: 0 };

    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);

    const progress = this.getUserProgress(userId);
    const previousScore = progress.quizScores[quizId] || 0;
    progress.quizScores[quizId] = Math.max(previousScore, scorePercent);
    if (scorePercent >= 70 && previousScore < 70) {
      progress.totalPoints += 150; // Bonus 150 points for passing quiz
    }
    localStorage.setItem(`${PROGRESS_STORAGE_KEY}_${userId}`, JSON.stringify(progress));

    if (scorePercent >= 70) {
      // Trigger festive celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#15803d', '#22c55e', '#eab308', '#3b82f6'],
      });
    }

    return {
      scorePercent,
      correctCount,
      totalCount: quiz.questions.length,
    };
  },
};
