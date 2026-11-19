import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AgroSat ErrorBoundary capturou erro:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    try {
      localStorage.removeItem('agrosat_logged_out');
    } catch (_) {}
    window.location.href = '/';
  };

  public override render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#F7F8F3] text-[#1E291B] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-[#E0E2D9] shadow-xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-bold font-display text-[#1E291B]">
                Ops! Ocorreu uma interrupção inesperada
              </h2>
              <p className="text-xs text-[#556050] leading-relaxed">
                A plataforma AgroSat detectou um erro temporário na renderização do ecrã. Pode recarregar a aplicação com segurança para restaurar o estado normal.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-[#F7F8F3] p-3 rounded-xl border border-[#CCD0C2] text-[11px] font-mono text-[#3F483A] overflow-x-auto max-h-32">
                <span className="font-bold block text-red-700">Detalhe:</span>
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 py-3 px-4 bg-[#2E3F2A] hover:bg-[#1E291B] text-white text-xs font-bold rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Recarregar AgroSat</span>
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 bg-[#F7F8F3] hover:bg-[#EEF1E6] text-[#2E3F2A] text-xs font-bold rounded-xl border border-[#CCD0C2] flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Página Inicial</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
