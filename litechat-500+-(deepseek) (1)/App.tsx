import React, { useState, useEffect, useRef } from 'react';
import { Message, ChatMode } from './types';
import { QA_COUNT, getLocalResponse } from './services/localBotService';
import { getDeepSeekResponse } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { Bot, Info } from 'lucide-react';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mode, setMode] = useState<ChatMode>(ChatMode.LOCAL);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial greeting
  useEffect(() => {
    const initialMsg: Message = {
      id: 'init-1',
      role: 'assistant',
      content: `你好！我是简易聊天机器人 (Web版)。\n\n✅ 已加载本地知识库：${QA_COUNT} 条\n💡 包含：学习建议、效率技巧、心情鼓励、健康提醒等。\n\n试着问我 "时间"、"笑话" 或输入 "学习建议1"！\n或者切换到 DeepSeek 模式进行自由对话。`,
      timestamp: Date.now(),
      mode: 'local'
    };
    setMessages([initialMsg]);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: content,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // 2. Determine Response based on Mode
    try {
      let responseText = '';
      
      if (mode === ChatMode.LOCAL) {
        // Simulate a slight network delay for realism even in local mode
        await new Promise(resolve => setTimeout(resolve, 400));
        responseText = getLocalResponse(content);
      } else {
        responseText = await getDeepSeekResponse(content);
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
        mode: mode === ChatMode.LOCAL ? 'local' : 'cloud'
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Error generating response", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: "Error: Something went wrong processing your request.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Header */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm relative">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-blue-200 shadow-md">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800 text-lg tracking-tight">LiteChat 500+</h1>
            <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
              {mode === ChatMode.LOCAL 
                ? <span className="text-emerald-600">● Local Mode ({QA_COUNT} Entries)</span>
                : <span className="text-blue-600">● Connected to DeepSeek API</span>}
            </p>
          </div>
        </div>
        <div className="hidden sm:block">
           <button 
             className="text-slate-400 hover:text-slate-600 transition-colors"
             title="LiteChat with DeepSeek Integration"
           >
             <Info size={20} />
           </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 custom-scrollbar">
        <div className="max-w-3xl mx-auto flex flex-col min-h-full justify-end">
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center text-slate-300 pb-20">
              <span className="text-4xl font-light opacity-50">Start a conversation</span>
            </div>
          )}
          
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          
          {isLoading && (
            <div className="flex items-center gap-2 mb-6 ml-12 animate-pulse">
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          )}
          
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </main>

      {/* Footer / Input */}
      <footer className="flex-shrink-0 bg-gradient-to-t from-slate-50 via-slate-50 to-transparent pt-4 pb-4">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          isLoading={isLoading} 
          currentMode={mode}
          onToggleMode={setMode}
          disabled={false}
        />
      </footer>
    </div>
  );
};

export default App;