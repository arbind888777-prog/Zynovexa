'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { aiApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SUGGESTIONS = [
  'Write a viral Instagram caption',
  'Best posting times for TikTok?',
  'Give me 5 content ideas for YouTube',
  'How to grow followers on LinkedIn?',
];

const DEMO_TOKEN = 'demo-token-zynovexa';

function getChatErrorMessage(error: any) {
  const status = error?.response?.status;
  const message = error?.response?.data?.message;

  if (status === 401 || status === 403) {
    return 'AI chat abhi sirf logged-in account ke liye available hai. Login karke phir try karo.';
  }

  if (Array.isArray(message)) {
    return message.join(' ');
  }

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  return "I'm having trouble connecting right now. Please try again in a moment!";
}

export default function AiChatbot() {
  const { isAuthenticated, accessToken, _hydrated } = useAuthStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hey! 👋 I'm **Zyx**, your AI social media assistant. Ask me anything about content creation, captions, hashtags, growth strategies, or scheduling tips!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isDemoSession = accessToken === DEMO_TOKEN;
  const useGuestMode = _hydrated && (!isAuthenticated || isDemoSession);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    if (!_hydrated) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await (useGuestMode
        ? aiApi.publicChat({ message: text.trim() })
        : aiApi.chat({ message: text.trim() }));
      const reply = res.data?.reply || res.data?.message || "Sorry, I couldn't process that. Try again!";
      setMessages(prev => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: 'assistant', content: reply, timestamp: new Date() },
      ]);
    } catch (error) {
      const errorMessage = getChatErrorMessage(error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: errorMessage,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [_hydrated, isTyping, useGuestMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        className="fixed bottom-6 right-6 z-[120] pointer-events-auto touch-manipulation w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
        }}
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        {/* Pulse indicator */}
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 animate-pulse" style={{ borderColor: 'var(--bg, #06061a)' }} />
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-[120] isolate pointer-events-auto w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl shadow-2xl overflow-hidden animate-fade-in"
          style={{
            background: 'var(--surface, #0e0e28)',
            border: '1px solid var(--border, rgba(99,102,241,0.15))',
            maxHeight: 'min(600px, calc(100vh - 140px))',
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center gap-3"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))', borderBottom: '1px solid var(--border)' }}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              Z
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold" style={{ color: 'var(--text, #e2e8f0)' }}>Zyx AI Assistant</h3>
              <p className="text-xs" style={{ color: 'var(--text3, #64748b)' }}>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1" />
                {useGuestMode ? 'Guest mode' : 'Always online'}
              </p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="p-1.5 rounded-lg transition-colors hover:bg-white/10 touch-manipulation" style={{ color: 'var(--text3)' }} aria-label="Close chat">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="px-4 py-4 space-y-4 overflow-y-auto" style={{ maxHeight: 'min(400px, calc(100vh - 300px))' }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user' ? 'text-white rounded-br-md' : 'rounded-bl-md'
                  }`}
                  style={{
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #6366f1, #a855f7)'
                      : 'var(--card, #141432)',
                    color: msg.role === 'user' ? '#fff' : 'var(--text, #e2e8f0)',
                    border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                  }}
                >
                  {msg.content.split('**').map((part, i) =>
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions (show only if few messages) */}
          {messages.length <= 2 && !isTyping && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map(s => (
                <button key={s} type="button" onClick={() => sendMessage(s)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-[1.03] touch-manipulation"
                  style={{ background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="px-4 py-3 flex gap-2" style={{ borderTop: '1px solid var(--border)' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={useGuestMode ? 'Ask Zyx anything as guest...' : 'Ask Zyx anything...'}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all pointer-events-auto"
              style={{
                background: 'var(--bg, #06061a)',
                color: 'var(--text, #e2e8f0)',
                border: '1px solid var(--border)',
              }}
              disabled={isTyping}
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40 hover:scale-105 active:scale-95 shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}
              aria-label="Send message"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
