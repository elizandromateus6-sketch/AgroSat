import React, { useState } from 'react';
import { Course, Lesson, User, UserProgress } from '../types';
import { educationService } from '../services/educationService';
import { ArrowLeft, CheckCircle2, Play, BookOpen, Award, FileText } from 'lucide-react';

interface CourseDetailPageProps {
  courseId: string;
  currentUser: User | null;
  onBack: () => void;
  onNavigateQuizzes: () => void;
  onRefreshUser: () => void;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({
  courseId,
  currentUser,
  onBack,
  onNavigateQuizzes,
  onRefreshUser,
}) => {
  const course = educationService.getCourseById(courseId);
  const userProgress: UserProgress = educationService.getUserProgress(currentUser?.id || 'usr_001');

  const [activeLessonId, setActiveLessonId] = useState<string>(course?.lessons[0]?.id || '');

  if (!course) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-500">Curso não encontrado.</p>
        <button onClick={onBack} className="px-4 py-2 bg-slate-800 text-white font-bold rounded-xl text-xs">
          Voltar para Cursos
        </button>
      </div>
    );
  }

  const activeLesson = course.lessons.find((l) => l.id === activeLessonId) || course.lessons[0];
  const isLessonCompleted = userProgress.completedLessonIds.includes(activeLesson.id);

  const handleToggleComplete = () => {
    educationService.markLessonCompleted(currentUser?.id || 'usr_001', activeLesson.id);
    onRefreshUser();
  };

  return (
    <div className="space-y-6">
      {/* Back Button & Header Banner */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#E0E2D9] shadow-md flex items-center space-x-3">
        <button
          onClick={onBack}
          className="p-2.5 rounded-xl bg-[#F7F8F3] text-[#1E291B] hover:bg-[#E0E2D9] border border-[#E0E2D9] transition-colors"
          title="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] uppercase font-bold text-[#4B6344] tracking-wider">{course.categoryLabel}</span>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-[#1E291B]">{course.title}</h1>
        </div>
      </div>

      {/* Main Grid: Lesson Viewer + Syllabus Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Main Active Lesson Content (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-emerald-600" />
                <h2 className="font-bold text-slate-900 text-lg">{activeLesson.title}</h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">{activeLesson.duration}</span>
            </div>

            {/* Video / Visual Cover */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center text-white">
              <img
                src={course.image}
                alt={activeLesson.title}
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-2xl cursor-pointer hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
              </div>
            </div>

            {/* Lesson Body Text */}
            <div className="text-xs text-slate-700 leading-relaxed space-y-3 pt-2 font-sans">
              <p className="text-sm font-semibold text-slate-800">{activeLesson.summary}</p>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 whitespace-pre-line leading-relaxed text-slate-600">
                {activeLesson.contentText}
              </div>
            </div>

            {/* Complete Lesson Action */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span className="text-xs text-slate-600 font-medium">+15 Pontos ao Concluir</span>
              </div>

              <button
                onClick={handleToggleComplete}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all ${
                  isLessonCompleted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isLessonCompleted ? 'Aula Concluída ✓' : 'Marcar Aula como Concluída'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Course Syllabus / Lessons List */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider text-slate-500">
              Aulas do Curso ({course.lessons.length})
            </h3>

            <div className="space-y-2">
              {course.lessons.map((lesson, idx) => {
                const done = userProgress.completedLessonIds.includes(lesson.id);
                const active = lesson.id === activeLessonId;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonId(lesson.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start space-x-2.5 ${
                      active
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-mono font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{lesson.title}</span>
                        {done && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />}
                      </div>
                      <span className="text-[10px] text-slate-400 font-normal">{lesson.duration}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {course.quizId && (
              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={onNavigateQuizzes}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors"
                >
                  <Award className="w-4 h-4" />
                  <span>Realizar Quiz Final do Curso</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
