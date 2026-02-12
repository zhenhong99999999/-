import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, Bot, Sparkles, Quote } from 'lucide-react';
import { chatWithContext } from '../services/gemini';
import ReactMarkdown from 'react-markdown'; // Ensure this is available or use simple replacement if not

interface ChatSectionProps {
  transcript: string;
  hasReport: boolean;
  onCitationClick: (text: string) => void;
}

// Simple component to render text with clickable citation buttons
const FormattedMessage: React.FC<{ text: string; onCitationClick: (text: string) => void }> = ({ text, onCitationClick }) => {
  // Regex to match <<quote:content>>
  const parts = text.split(/(<<quote:.*?>>)/g);

  return (
    <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5">
      {parts.map((part, index) => {
        if (part.startsWith('<<quote:') && part.endsWith('>>')) {
          const content = part.slice(8, -2); // Remove <<quote: and >>
          return (
            <button
              key={index}
              onClick={() => onCitationClick(content)}
              className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 align-baseline text-[10px] font-medium text-blue-600 bg-blue-50 border border-blue-100 rounded-md hover:bg-blue-100 hover:border-blue-300 transition-all select-none transform hover:scale-105"
              title="点击定位到原文"
            >
              <Quote size={8} className="fill-current" />
              原文
            </button>
          );
        }
        // Render regular text. Note: If you want Markdown support, wrap this in ReactMarkdown
        // For simplicity and speed in this demo, we'll split newlines manually.
        return (
            <span key={index} className="whitespace-pre-wrap">{part}</span>
        );
      })}
    </div>
  );
};

export const ChatSection: React.FC<ChatSectionProps> = ({ transcript, hasReport, onCitationClick }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: '您好！我是您的调研助手。您可以基于报告向我提问，我会结合原文为您解答。',
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !hasReport || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const history = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const responseText = await chatWithContext(history, userMsg.text, transcript);

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "无法生成回复，请重试。",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "抱歉，连接 AI 时出现错误。",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-6 border-b border-black/5 flex items-center justify-between bg-white/40">
        <h2 className="font-bold text-slate-800 flex items-center gap-2 text-lg tracking-tight">
          <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-lg shadow-sm">
             <Sparkles size={16} />
          </div>
          Copilot
        </h2>
        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">Online</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-white border border-white shadow-sm flex items-center justify-center text-indigo-500 shrink-0 select-none">
                    <Bot size={16} />
                </div>
            )}
            <div className={`py-3 px-4 rounded-2xl text-sm leading-relaxed max-w-[90%] shadow-sm ${
                msg.role === 'user' 
                ? 'bg-black text-white rounded-br-sm' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-bl-sm'
            }`}>
              {msg.role === 'model' ? (
                <FormattedMessage text={msg.text} onCitationClick={onCitationClick} />
              ) : (
                msg.text
              )}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-end gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-white border border-white shadow-sm flex items-center justify-center text-indigo-500 shrink-0">
                    <Bot size={16} />
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm border border-slate-100 flex gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white/60 backdrop-blur-md border-t border-white/50">
        <div className="relative flex items-center">
            <input
            type="text"
            className="w-full pl-5 pr-12 py-3.5 bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black/20 text-sm shadow-sm transition-all"
            placeholder={hasReport ? "问点什么... (例如：用户提到的最大痛点是什么？)" : "请先生成报告"}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!hasReport || isLoading}
            />
            <button
            onClick={handleSend}
            disabled={!inputValue.trim() || !hasReport || isLoading}
            className="absolute right-2 p-2 bg-black text-white rounded-full hover:bg-slate-800 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
            >
            <Send size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};