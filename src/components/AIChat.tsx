import React, { useState, useEffect, useRef } from 'react';
import { Farm } from '../types';
import { aiService, AgroAIChatResponse } from '../services/aiService';
import { Bot, Send, Sparkles, AlertCircle, RefreshCw, User as UserIcon, ShieldCheck } from 'lucide-react';

interface AIChatProps {
  farms: Farm[];
  selectedFarmId?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  disclaimer?: string;
}

export const AIChat: React.FC<AIChatProps> = ({ farms, selectedFarmId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_welcome',
      sender: 'ai',
      text: 'Olá! Sou o AgroSat Assistente, seu especialista em inteligência agrícola, NDVI e sensoriamento remoto para Angola. Como posso ajudar a sua lavoura hoje?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      disclaimer: 'Esta é uma indicação baseada nos dados disponíveis e não substitui a avaliação de um técnico agrícola de campo.',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentFarmId, setCurrentFarmId] = useState<string>(selectedFarmId || farms[0]?.id || '');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedFarm = farms.find((f) => f.id === currentFarmId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || loading) return;

    const userMsg: Message = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setLoading(true);

    try {
      const currentNdvi = (selectedFarm as any)?.currentNdvi || (selectedFarm?.id === 'farm_001' ? 0.78 : selectedFarm?.id === 'farm_002' ? 0.54 : 0.72);
      const farmContextData = selectedFarm
        ? {
            name: selectedFarm.name,
            crop: selectedFarm.mainCrop,
            location: selectedFarm.locationName,
            area: selectedFarm.totalArea,
            ndvi: currentNdvi,
          }
        : undefined;

      const aiRes: AgroAIChatResponse = await aiService.sendMessage(text, farmContextData);

      const aiMsg: Message = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: aiRes.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        disclaimer: aiRes.disclaimer,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error('Erro na conversa com AgroSat AI:', error);
      const errorReply: Message = {
        id: 'ai_' + Date.now(),
        sender: 'ai',
        text: 'Não foi possível obter resposta no momento. Por favor verifique a sua ligação à internet ou tente novamente.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        disclaimer: 'Esta é uma indicação baseada nos dados disponíveis e não substitui a avaliação de um técnico agrícola de campo.',
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    'Como está a minha cultura?',
    'O que significa o valor de NDVI 0,72?',
    'Como melhorar a saúde do solo em Angola?',
    'Explique o conceito de agricultura de precisão.',
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E0E2D9] shadow-lg flex flex-col h-[600px] overflow-hidden">
      {/* Header Bar */}
      <div className="bg-[#1E291B] text-white p-4 flex items-center justify-between border-b border-[#2A3826]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#8BB174] flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold font-display text-base text-white">AgroSat AI Assistente</h3>
              <span className="px-1.5 py-0.5 rounded bg-[#2A3826] text-[#8BB174] font-mono text-[10px] font-bold border border-[#8BB174]/30">
                GEMINI AI
              </span>
            </div>
            <p className="text-[11px] text-[#A3B18A]">Consultoria de Sensoriamento & Diagnóstico Agrícola</p>
          </div>
        </div>

        {/* Property Selector for Context */}
        {farms.length > 0 && (
          <div className="hidden sm:flex items-center space-x-1.5 bg-[#2A3826] px-3 py-1.5 rounded-xl border border-[#33422F] text-xs">
            <span className="text-[#A3B18A]">Contexto:</span>
            <select
              value={currentFarmId}
              onChange={(e) => setCurrentFarmId(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id} className="bg-[#1E291B] text-white">
                  🌱 {f.name} ({f.mainCrop})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Suggested Quick Questions */}
      <div className="bg-[#F0F2EB] p-2.5 border-b border-[#E0E2D9] flex items-center gap-1.5 overflow-x-auto text-xs">
        <Sparkles className="w-3.5 h-3.5 text-[#4B6344] shrink-0 ml-1" />
        <span className="font-bold text-[#1E291B] shrink-0 text-[11px]">Perguntas Rápidas:</span>
        <div className="flex items-center space-x-1.5">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 rounded-lg bg-white border border-[#E0E2D9] text-[#2D3628] hover:bg-[#4B6344] hover:text-white transition-all whitespace-nowrap text-[11px] font-medium shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[#F7F8F3]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="w-8 h-8 rounded-lg bg-[#4B6344] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl p-4 shadow-xs text-xs leading-relaxed space-y-2 ${
                m.sender === 'user'
                  ? 'bg-[#4B6344] text-white rounded-tr-none'
                  : 'bg-white text-[#2D3628] border border-[#E0E2D9] rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>

              {m.disclaimer && m.sender === 'ai' && (
                <div className="pt-2 border-t border-[#F0F2EB] text-[10px] text-[#6B705C] flex items-start space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#4B6344]" />
                  <span>{m.disclaimer}</span>
                </div>
              )}

              <span
                className={`text-[9px] block text-right font-mono ${
                  m.sender === 'user' ? 'text-[#DDE5B6]' : 'text-[#6B705C]'
                }`}
              >
                {m.timestamp}
              </span>
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-[#1E291B] text-white flex items-center justify-center shrink-0">
                <UserIcon className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-[#1E291B] bg-[#F0F2EB] p-3 rounded-2xl w-fit border border-[#E0E2D9] animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-[#4B6344]" />
            <span>O AgroSat AI está analisando os dados da propriedade e do satélite...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Field Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 bg-white border-t border-[#E0E2D9] flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Digite sua dúvida sobre a lavoura, NDVI ou clima em Angola..."
          className="flex-1 bg-[#F7F8F3] text-[#2D3628] border border-[#E0E2D9] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#4B6344] focus:bg-white transition-all"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || loading}
          className="px-4 py-2.5 bg-[#4B6344] hover:bg-[#3B4E35] disabled:bg-slate-300 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors shadow-sm"
        >
          <span>Enviar</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
