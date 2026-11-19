import React, { useState } from 'react';
import { Course, User, UserProgress, Article } from '../types';
import { educationService } from '../services/educationService';
import { MOCK_ARTICLES } from '../data/mockArticles';
import { Modal } from '../components/Modal';
import { EmptyState } from '../components/EmptyState';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  Play,
  Clock,
  HelpCircle,
  Filter,
  Search,
  BookMarked,
  ArrowRight,
  Sparkles,
  Share2,
  FileText,
  UserCheck,
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
  const [activeTab, setActiveTab] = useState<'articles' | 'courses'>('articles');
  const [selectedArticleCategory, setSelectedArticleCategory] = useState<string>('all');
  const [selectedCourseCategory, setSelectedCourseCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  const [readArticleIds, setReadArticleIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('agrosat_read_articles');
      return saved ? JSON.parse(saved) : ['art_01'];
    } catch {
      return ['art_01'];
    }
  });

  const courses = educationService.getCourses();
  const userProgress: UserProgress = educationService.getUserProgress(currentUser?.id || 'usr_001');

  // Filter Articles
  const filteredArticles = MOCK_ARTICLES.filter((art) => {
    const matchesCategory =
      selectedArticleCategory === 'all' || art.category === selectedArticleCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Filter Courses
  const filteredCourses = courses.filter((c) => {
    const matchesCategory =
      selectedCourseCategory === 'all' || c.category === selectedCourseCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleMarkAsRead = (articleId: string) => {
    if (!readArticleIds.includes(articleId)) {
      const updated = [...readArticleIds, articleId];
      setReadArticleIds(updated);
      localStorage.setItem('agrosat_read_articles', JSON.stringify(updated));
    }
  };

  const articleCategories = [
    { id: 'all', label: 'Todos os Artigos' },
    { id: 'ndvi', label: '🛰️ NDVI & Espectro' },
    { id: 'precisao', label: '🌱 Precisão & Solos' },
    { id: 'satelite', label: '📡 Sentinel-2 & GIS' },
    { id: 'irrigacao', label: '💧 Irrigação & Água' },
    { id: 'pragas', label: '🐛 Pragas & Fitossanidade' },
    { id: 'gestao', label: '📊 Gestão & Crédito' },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-[#E0E2D9] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-[#2E3F2A]/10 text-[#2E3F2A] rounded-xl border border-[#2E3F2A]/20">
              <GraduationCap className="w-5 h-5 text-[#2E3F2A]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-display text-[#1E291B]">Academia AgroSat</h1>
            </div>
          </div>
          <p className="text-xs text-[#525B4C] pl-0.5">
            Capacitação técnica em sensoriamento remoto, interpretação de NDVI, agrometeorologia e boas práticas agronómicas para África.
          </p>
        </div>

        {/* User Points & Quizzes CTA */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="bg-[#1E291B] text-white px-4 py-2.5 rounded-xl flex items-center space-x-2.5 shadow-sm border border-[#2A3826]">
            <Award className="w-4 h-4 text-[#8BB174]" />
            <div>
              <span className="text-[10px] uppercase font-bold text-[#A3B18A] block leading-tight">
                Pontuação
              </span>
              <strong className="text-xs font-bold text-white">
                {userProgress.totalPoints + readArticleIds.length * 25} pts
              </strong>
            </div>
          </div>

          <button
            onClick={onNavigateQuizzes}
            className="inline-flex items-center space-x-1.5 bg-[#2E3F2A] hover:bg-[#3D5237] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Testar em Quizzes</span>
          </button>
        </div>
      </div>

      {/* Main Tabs (Artigos vs Cursos) */}
      <div className="bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-[#E0E2D9] shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex bg-[#F2F4EB] p-1 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('articles')}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'articles'
                ? 'bg-white text-[#2E3F2A] shadow-xs'
                : 'text-[#6B705C] hover:text-[#1E291B]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Artigos Técnicos ({MOCK_ARTICLES.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
              activeTab === 'courses'
                ? 'bg-white text-[#2E3F2A] shadow-xs'
                : 'text-[#6B705C] hover:text-[#1E291B]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cursos Estruturados ({courses.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#6B705C] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Pesquisar por tema, NDVI, praga, irrigação..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F7F8F3] border border-[#CCD0C2] rounded-xl pl-9 pr-3 py-2 text-xs text-[#1E291B] focus:ring-2 focus:ring-[#3D5237] focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* Category Pills for Articles */}
      {activeTab === 'articles' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {articleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedArticleCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedArticleCategory === cat.id
                  ? 'bg-[#2E3F2A] text-white shadow-xs'
                  : 'bg-white/90 text-[#525B4C] hover:bg-[#F2F4EB] border border-[#E0E2D9]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* ARTICLES GRID */}
      {activeTab === 'articles' && (
        <>
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArticles.map((article) => {
                const isRead = readArticleIds.includes(article.id);

                return (
                  <div
                    key={article.id}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-[#E0E2D9] hover:border-[#8BB174] shadow-sm flex flex-col justify-between transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F2F4EB] text-[#2E3F2A] border border-[#CCD0C2]">
                          {article.categoryLabel}
                        </span>

                        <div className="flex items-center space-x-1.5 text-[11px] text-[#6B705C]">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-[#1E291B] leading-snug mb-2 font-display">
                        {article.title}
                      </h3>

                      <p className="text-xs text-[#525B4C] leading-relaxed line-clamp-3 mb-4">
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#EDF0E7] flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        {isRead ? (
                          <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Lido</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-[#777] bg-[#F7F8F3] px-2 py-0.5 rounded border border-[#E5E8DD]">
                            +25 pts
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setReadingArticle(article);
                          handleMarkAsRead(article.id);
                        }}
                        className="inline-flex items-center space-x-1 text-xs font-bold text-[#2E3F2A] hover:text-[#3D5237] hover:underline cursor-pointer"
                      >
                        <span>Ler Artigo</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="Nenhum artigo encontrado"
              description="Não encontramos artigos correspondentes à pesquisa ou categoria selecionada."
              actionLabel="Ver Todos os Artigos"
              onAction={() => {
                setSelectedArticleCategory('all');
                setSearchQuery('');
              }}
            />
          )}
        </>
      )}

      {/* COURSES GRID */}
      {activeTab === 'courses' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const completedCount = course.lessons.filter((l) =>
                userProgress.completedLessonIds.includes(l.id)
              ).length;
              const percent = Math.round((completedCount / course.lessonsCount) * 100);

              return (
                <div
                  key={course.id}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-[#E0E2D9] hover:border-[#8BB174] shadow-sm flex flex-col justify-between transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-lg bg-[#F2F4EB] text-[#2E3F2A] border border-[#CCD0C2]">
                        {course.category === 'precisao'
                          ? 'Precisão & NDVI'
                          : course.category === 'ia'
                          ? 'Inteligência Artificial'
                          : 'Agricultura Geral'}
                      </span>
                      <span className="text-[11px] font-medium text-[#6B705C] bg-white px-2 py-0.5 rounded border border-[#E0E2D9]">
                        {course.level}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#1E291B] mb-2 font-display">
                      {course.title}
                    </h3>
                    <p className="text-xs text-[#525B4C] leading-relaxed mb-4">
                      {course.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex justify-between text-[11px] text-[#556050]">
                        <span>Progresso do Módulo:</span>
                        <strong className="text-[#1E291B]">{percent}%</strong>
                      </div>
                      <div className="w-full bg-[#E5E8DD] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#2E3F2A] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#EDF0E7] flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-[11px] text-[#6B705C]">
                      <span className="flex items-center space-x-1">
                        <BookOpen className="w-3 h-3 text-[#3D5237]" />
                        <span>{course.lessonsCount} lições</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-[#3D5237]" />
                        <span>{course.duration}</span>
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectCourse(course.id)}
                      className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#2E3F2A] hover:bg-[#3D5237] text-white transition-colors cursor-pointer shadow-xs"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{percent > 0 ? 'Continuar' : 'Iniciar'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Modal de Leitura de Artigo Completo */}
      {readingArticle && (
        <Modal
          isOpen={Boolean(readingArticle)}
          onClose={() => setReadingArticle(null)}
          title=""
          size="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#EDF0E7] pb-3">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#F2F4EB] text-[#2E3F2A] border border-[#CCD0C2]">
                {readingArticle.categoryLabel}
              </span>
              <div className="flex items-center space-x-3 text-[11px] text-[#6B705C]">
                <span>Nível: {readingArticle.level}</span>
                <span>•</span>
                <span>{readingArticle.readTime}</span>
              </div>
            </div>

            <h2 className="text-xl font-bold font-display text-[#1E291B] leading-tight">
              {readingArticle.title}
            </h2>

            <div className="flex items-center space-x-2 text-[11px] text-[#556050] bg-[#F7F8F3] p-2 rounded-xl border border-[#CCD0C2]">
              <UserCheck className="w-3.5 h-3.5 text-[#3D5237]" />
              <span>Por: <strong>{readingArticle.author}</strong></span>
              <span>•</span>
              <span>Publicado: {readingArticle.publishedAt}</span>
            </div>

            {/* Content paragraphs */}
            <div className="space-y-3 pt-2 text-[#2D3628] leading-relaxed text-xs sm:text-sm">
              {readingArticle.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Key Takeaways */}
            <div className="bg-[#F5F8F2] border border-[#CCD8C4] rounded-2xl p-4 mt-4 space-y-2">
              <h4 className="font-bold text-[#1E291B] text-xs flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-[#3D5237]" />
                <span>Pontos-chave para Aplicação no Terreno:</span>
              </h4>
              <ul className="space-y-1.5 pl-1">
                {readingArticle.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start space-x-2 text-xs text-[#2B3B27]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3D5237] shrink-0 mt-0.5" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#EDF0E7]">
              <div className="text-[11px] text-emerald-800 font-semibold flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Artigo registado no seu histórico de aprendizagem</span>
              </div>

              <button
                type="button"
                onClick={() => setReadingArticle(null)}
                className="px-4 py-2 bg-[#2E3F2A] hover:bg-[#3D5237] text-white font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Concluir Leitura
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
