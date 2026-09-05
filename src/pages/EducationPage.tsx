import React, { useState } from 'react';
import { Course, User, UserProgress } from '../types';
import { educationService } from '../services/educationService';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  Play,
  Star,
  Clock,
  HelpCircle,
  Filter,
} from 'lucide-react';

interface EducationPageProps {
  currentUser: User | null;
  onSelectCourse: (courseId: string) => void;
  onNavigateQuizzes: () => void;
}

export const EducationPage: React.FC<EducationPageProps> = ({
  currentUser,
  onSelectCourse,
  onNavigateQuizzes,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'agricultura' | 'precisao' | 'ia'>('all');

  const courses = educationService.getCourses();
  const userProgress: UserProgress = educationService.getUserProgress(currentUser?.id || 'usr_001');

  const filteredCourses = courses.filter(
    (c) => selectedCategory === 'all' || c.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-[#E0E2D9] shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#4B6344]/10 text-[#4B6344] rounded-xl border border-[#4B6344]/20">
              <GraduationCap className="w-5 h-5 text-[#4B6344]" />
            </div>
            <h1 className="text-2xl font-bold font-display text-[#1E291B]">AgroSat Educação</h1>
          </div>
          <p className="text-xs text-[#6B705C] pl-0.5">
            Cursos, artigos e treinamento em agricultura de precisão, NDVI e IA para Angola e África.
          </p>
        </div>

        {/* Points & Progress Banner */}
        <div className="bg-[#1E291B] text-white px-5 py-3 rounded-2xl flex items-center space-x-3 shadow-md border border-[#2A3826] shrink-0">
          <div className="p-2 bg-[#4B6344] rounded-xl">
            <Award className="w-5 h-5 text-[#8BB174]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-[#A3B18A] block">Pontuação do Aluno</span>
            <strong className="text-base font-extrabold font-display text-white">{userProgress.totalPoints} Pontos</strong>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-[#E0E2D9] shadow-sm flex items-center gap-2.5 overflow-x-auto">
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#1E291B] text-white rounded-xl text-xs font-bold shrink-0 shadow-sm border border-[#2A3826]">
          <Filter className="w-3.5 h-3.5 text-[#8BB174]" />
          <span>Categorias</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto py-0.5">
          {[
            { id: 'all', label: 'Todos os Cursos' },
            { id: 'agricultura', label: '🌱 Agricultura Geral' },
            { id: 'precisao', label: '🛰️ Agricultura de Precisão & NDVI' },
            { id: 'ia', label: '🤖 Inteligência Artificial no Campo' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#4B6344] text-white shadow-sm ring-2 ring-[#8BB174]/40 scale-[1.02]'
                  : 'bg-[#F0F2EB] text-[#1E291B] hover:bg-[#E0E2D9] border border-[#E0E2D9]'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const completedCount = course.lessons.filter((l) =>
            userProgress.completedLessonIds.includes(l.id)
          ).length;
          const percent = Math.round((completedCount / course.lessonsCount) * 100);

          return (
            <div
              key={course.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#E0E2D9] shadow-sm hover:border-[#8BB174] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#1E291B]/85 backdrop-blur-md text-[#8BB174] font-bold text-[10px] border border-[#2A3826]">
                    {course.categoryLabel}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-[#1E291B]/90 text-white font-mono text-[10px] font-bold flex items-center space-x-1 border border-[#2A3826]">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-[#6B705C] font-medium">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-[#8BB174]" />
                      <span>{course.duration}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-[#F0F2EB] text-[#1E291B] font-bold border border-[#E0E2D9]">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="font-bold text-[#1E291B] text-base font-display leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-[#4A4E3D] line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Student Progress Bar */}
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-[10px] font-bold text-[#6B705C]">
                      <span>Progresso: {completedCount} / {course.lessonsCount} aulas</span>
                      <span className="text-[#4B6344]">{percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#F0F2EB] rounded-full overflow-hidden border border-[#E0E2D9]">
                      <div
                        className="h-full bg-[#4B6344] rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex items-center space-x-2">
                <button
                  onClick={() => onSelectCourse(course.id)}
                  className="flex-1 py-2.5 bg-[#4B6344] hover:bg-[#3B4E35] text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>{percent > 0 ? 'Continuar Curso' : 'Iniciar Curso'}</span>
                </button>

                {course.quizId && (
                  <button
                    onClick={onNavigateQuizzes}
                    className="p-2.5 bg-[#F0F2EB] hover:bg-[#E0E2D9] text-[#1E291B] rounded-xl border border-[#E0E2D9] transition-colors cursor-pointer"
                    title="Fazer Quiz"
                  >
                    <HelpCircle className="w-4 h-4 text-[#4B6344]" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
