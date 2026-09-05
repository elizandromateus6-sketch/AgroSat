import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';
import { Modal } from './Modal';
import { AgroSatLogo } from './AgroSatLogo';
import {
  Lock,
  Mail,
  User as UserIcon,
  Globe,
  CheckCircle2,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  defaultIsRegister?: boolean;
  message?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultIsRegister = false,
  message,
}) => {
  const [isRegister, setIsRegister] = useState(defaultIsRegister);

  // Login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form additional
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<UserRole>('agricultor');
  const [country] = useState('Angola');
  const [province, setProvince] = useState('Huambo');

  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsRegister(defaultIsRegister);
    setErrorMsg('');
  }, [defaultIsRegister, isOpen]);

  const angolaProvinces = [
    'Bengo',
    'Benguela',
    'Bié',
    'Cabinda',
    'Cuando Cubango',
    'Cuanza Norte',
    'Cuanza Sul',
    'Cunene',
    'Huambo',
    'Huíla',
    'Luanda',
    'Lunda Norte',
    'Lunda Sul',
    'Malanje',
    'Moxico',
    'Namibe',
    'Uíge',
    'Zaire',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!fullName.trim() || !email.trim() || !password) {
          setErrorMsg('Preencha todos os campos obrigatórios.');
          setLoading(false);
          return;
        }

        const newUser = authService.register(
          fullName.trim(),
          email.trim(),
          role,
          province
        );

        onSuccess(newUser);
        onClose();
      } else {
        if (!email.trim() || !password) {
          setErrorMsg('Informe o e-mail e a palavra-passe.');
          setLoading(false);
          return;
        }

        const user = authService.login(email.trim(), password, role);
        onSuccess(user);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocorreu um erro no acesso.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isRegister ? 'Criar Conta no AgroSat' : 'Acessar Plataforma AgroSat'}
    >
      <div className="flex flex-col items-center justify-center pb-2 text-center">
        <AgroSatLogo size="lg" variant="full" className="max-w-[200px] border border-[#E0E2D9] mb-1" />
        <p className="text-[11px] text-[#6B705C] font-medium">
          Inteligência agrícola vinda do espaço para Angola
        </p>
      </div>

      {message && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-semibold flex items-start space-x-2">
          <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
            ⚠️ {errorMsg}
          </div>
        )}

        {isRegister && (
          <div>
            <label htmlFor="auth-fullname" className="block font-bold text-slate-700 mb-1">Nome Completo *</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                id="auth-fullname"
                type="text"
                required
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Manuel Agostinho"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs focus:ring-2 focus:ring-[#4B6344] focus:bg-white"
              />
            </div>
          </div>
        )}

        <div>
          <label htmlFor="auth-email" className="block font-bold text-slate-700 mb-1">Endereço de E-mail *</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs focus:ring-2 focus:ring-[#4B6344] focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label htmlFor="auth-password" className="block font-bold text-slate-700 mb-1">Palavra-passe (Senha) *</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              id="auth-password"
              type="password"
              required
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs focus:ring-2 focus:ring-[#4B6344] focus:bg-white"
            />
          </div>
        </div>

        {isRegister && (
          <>
            <div>
              <label htmlFor="auth-role" className="block font-bold text-slate-700 mb-1">Perfil do Utilizador *</label>
              <select
                id="auth-role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#4B6344] focus:bg-white cursor-pointer"
              >
                <option value="agricultor">🌾 Agricultor / Produtor Rural</option>
                <option value="tecnico">👨‍🌾 Técnico Agrícola / Agrônomo</option>
                <option value="estudante">🎓 Estudante / Acadêmico</option>
                <option value="admin">🛡️ Administrador do Sistema</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="auth-country" className="block font-bold text-slate-700 mb-1">País *</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    id="auth-country"
                    type="text"
                    disabled
                    value={country}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-bold text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="auth-province" className="block font-bold text-slate-700 mb-1">Província *</label>
                <select
                  id="auth-province"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-[#4B6344] focus:bg-white cursor-pointer"
                >
                  {angolaProvinces.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#4B6344] hover:bg-[#3B4E35] disabled:bg-slate-300 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
        >
          {loading ? (
            <span>A carregar...</span>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{isRegister ? 'Concluir Registo e Entrar' : 'Entrar no AgroSat'}</span>
            </>
          )}
        </button>

        <div className="text-center pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrorMsg('');
            }}
            className="text-[#4B6344] font-bold hover:underline cursor-pointer"
          >
            {isRegister
              ? 'Já possui uma conta? Faça Login'
              : 'Ainda não tem conta? Registe-se gratuitamente'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
