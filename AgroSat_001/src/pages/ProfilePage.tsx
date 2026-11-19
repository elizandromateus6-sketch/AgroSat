import React, { useState, useRef } from 'react';
import { User, UserRole } from '../types';
import { ANGOLA_21_PROVINCES } from '../data/angolaLocations';
import officialAvatar from '../assets/images/agrosat_official_avatar.svg';
import {
  User as UserIcon,
  Camera,
  Mail,
  MapPin,
  Briefcase,
  CheckCircle2,
  Award,
  Upload,
  Save,
  ShieldCheck,
  Calendar,
  RefreshCw,
} from 'lucide-react';

interface ProfilePageProps {
  currentUser: User;
  onUpdateUser: (updates: Partial<User>) => void;
}

const ANGOLA_PROVINCES = ANGOLA_21_PROVINCES;

const PRESET_AVATARS = [officialAvatar];

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  onUpdateUser,
}) => {
  const [name, setName] = useState<string>(currentUser.name || '');
  const [email, setEmail] = useState<string>(currentUser.email || '');
  const [province, setProvince] = useState<string>(currentUser.province || 'Huambo');
  const [role, setRole] = useState<UserRole>(currentUser.role || 'agricultor');
  const [avatarUrl, setAvatarUrl] = useState<string>(
    currentUser.avatarUrl || PRESET_AVATARS[0]
  );

  // Status feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Local image preview from device
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setErrorMessage('A imagem deve ter no máximo 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatarUrl(base64String);
      setSuccessMessage('Nova foto pré-visualizada localmente! Clique em Guardar para aplicar.');
      setTimeout(() => setSuccessMessage(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!name.trim()) {
      setErrorMessage('Por favor, introduza o seu nome.');
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      onUpdateUser({
        name: name.trim(),
        email: email.trim(),
        province,
        role,
        avatarUrl,
      });

      setIsSaving(false);
      setSuccessMessage('Perfil atualizado localmente com sucesso!');

      setTimeout(() => {
        setSuccessMessage(null);
      }, 4000);
    }, 250);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="bg-[#1E291B] text-white rounded-3xl p-6 sm:p-8 border border-[#2A3826] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-[#8BB174]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar container with photo change overlay */}
          <div className="relative group">
            <img
              src={avatarUrl}
              alt={name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-[#8BB174] shadow-lg bg-white"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/50 rounded-2xl flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity p-1 text-center cursor-pointer"
              title="Alterar Imagem de Perfil"
            >
              <Camera className="w-6 h-6 mb-1 text-[#8BB174]" />
              <span className="text-[10px] font-bold">Alterar Foto</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* User info overview */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#2A3826] text-[#8BB174] font-mono font-bold uppercase tracking-wider border border-[#33422F]">
                {role === 'admin'
                  ? 'Administrador'
                  : role === 'tecnico' || role === 'agronomist'
                  ? 'Engenheiro Agrónomo / Técnico'
                  : role === 'estudante' || role === 'researcher'
                  ? 'Estudante / Investigador'
                  : 'Produtor / Agricultor'}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#2A3826] text-white font-medium flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-[#8BB174]" />
                <span>{province}, Angola</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              {currentUser.name}
            </h1>

            <p className="text-xs text-[#A3B18A] flex items-center justify-center sm:justify-start space-x-1.5">
              <Mail className="w-3.5 h-3.5 text-[#8BB174]" />
              <span>{currentUser.email}</span>
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] text-[#D0D7C9]">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-[#8BB174]" />
                <span>Perfil Demonstrativo: {currentUser.createdAt || '2026'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Award className="w-3.5 h-3.5 text-[#8BB174]" />
                <span>Cursos Concluídos: {currentUser.completedCourses?.length || 0}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Edit Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Status Alerts */}
        {successMessage && (
          <div className="p-4 bg-[#F0F2EB] border border-[#8BB174] text-[#1E291B] rounded-2xl flex items-center space-x-3 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-[#4B6344] shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-center space-x-3 text-xs font-semibold animate-in fade-in">
            <ShieldCheck className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Section 1: Avatar Selection */}
        <div className="bg-white rounded-2xl p-6 border border-[#E0E2D9] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0F2EB]">
            <div className="flex items-center space-x-2">
              <Camera className="w-5 h-5 text-[#4B6344]" />
              <h3 className="font-bold text-base font-display text-[#1E291B]">
                Foto de Perfil
              </h3>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-1.5 bg-[#4B6344] hover:bg-[#3B4E35] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Carregar do Dispositivo</span>
            </button>
          </div>

          <div>
            <p className="text-xs text-[#6B705C] mb-3">
              Imagem padrão do AgroSat ou selecione uma foto local para pré-visualização:
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {PRESET_AVATARS.map((preset, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => setAvatarUrl(preset)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all aspect-square cursor-pointer ${
                    avatarUrl === preset
                      ? 'border-[#4B6344] ring-4 ring-[#4B6344]/20 scale-105 shadow-md'
                      : 'border-[#E0E2D9] opacity-80 hover:opacity-100 hover:border-[#4B6344]'
                  }`}
                  title="Avatar Padrão AgroSat"
                >
                  <img
                    src={preset}
                    alt="Avatar AgroSat Padrão"
                    className="w-full h-full object-cover"
                  />
                  {avatarUrl === preset && (
                    <div className="absolute top-1.5 right-1.5 bg-[#4B6344] text-white p-0.5 rounded-full shadow">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              ))}

              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#CCD0C2] hover:border-[#4B6344] bg-[#F7F8F3] flex flex-col items-center justify-center text-[#6B705C] hover:text-[#4B6344] cursor-pointer transition-colors"
                title="Carregar nova foto"
              >
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold">Enviar Foto</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Personal Information */}
        <div className="bg-white rounded-2xl p-6 border border-[#E0E2D9] shadow-sm space-y-4">
          <div className="flex items-center space-x-2 pb-3 border-b border-[#F0F2EB]">
            <UserIcon className="w-5 h-5 text-[#4B6344]" />
            <h3 className="font-bold text-base font-display text-[#1E291B]">
              Dados Pessoais & Localização
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#1E291B] mb-1">
                Nome Completo
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#6B705C] absolute left-3 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu Nome Completo"
                  required
                  className="w-full bg-[#F7F8F3] border border-[#E0E2D9] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1E291B] focus:outline-none focus:ring-2 focus:ring-[#4B6344] focus:bg-white"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-[#1E291B] mb-1">
                Endereço de E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6B705C] absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@agrosat.ao"
                  required
                  className="w-full bg-[#F7F8F3] border border-[#E0E2D9] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1E291B] focus:outline-none focus:ring-2 focus:ring-[#4B6344] focus:bg-white"
                />
              </div>
            </div>

            {/* Province Selection */}
            <div>
              <label className="block text-xs font-bold text-[#1E291B] mb-1">
                Província em Angola
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#6B705C] absolute left-3 top-3" />
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-[#F7F8F3] border border-[#E0E2D9] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1E291B] focus:outline-none focus:ring-2 focus:ring-[#4B6344] focus:bg-white"
                >
                  {ANGOLA_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* User Role / Occupation */}
            <div>
              <label className="block text-xs font-bold text-[#1E291B] mb-1">
                Função / Perfil Agrícola
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-[#6B705C] absolute left-3 top-3" />
                <select
                  id="user-profile-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-[#F7F8F3] border border-[#E0E2D9] rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#1E291B] focus:outline-none focus:ring-2 focus:ring-[#4B6344] focus:bg-white"
                >
                  <option value="agricultor">🌾 Agricultor / Produtor Rural</option>
                  <option value="tecnico">👨‍🌾 Engenheiro Agrónomo / Técnico</option>
                  <option value="estudante">🎓 Estudante / Investigador</option>
                  <option value="admin">🛡️ Administrador</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#4B6344] hover:bg-[#3B4E35] disabled:bg-slate-300 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg transition-all cursor-pointer"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>A guardar...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Alterações do Perfil</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
