import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Database } from 'lucide-react';
import { ChatMode } from '../types';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  currentMode: ChatMode;
  onToggleMode: (mode: ChatMode) => void;
  disabled: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  currentMode, 
  onToggleMode,
  disabled 
}) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || disabled) return;
    onSendMessage(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const isDeepSeek = currentMode === ChatMode.DEEPSEEK;

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="bg-white p-2 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-2">
        
        {/* Mode Toggle Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl w-fit">
          <button
            onClick={() => onToggleMode(ChatMode.LOCAL)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !isDeepSeek 
                ? 'bg-white text-emerald-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Database size={14} />
            <span>Local Bot</span>
          </button>
          <button
            onClick={() => onToggleMode(ChatMode.DEEPSEEK)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isDeepSeek 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles size={14} />
            <span>DeepSeek AI</span>
          </button>
        </div>

        {/* Input Area */}
        <div className="flex items-end gap-2 px-1 pb-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDeepSeek ? "Ask DeepSeek anything..." : "Ask about time, weather, or type '学习建议1'..."}
            className="w-full bg-transparent border-none focus:ring-0 p-3 text-slate-700 placeholder:text-slate-400 resize-none max-h-[120px] text-sm"
            rows={1}
            disabled={disabled}
          />
          
          <button
            onClick={() => handleSubmit()}
            disabled={!input.trim() || isLoading || disabled}
            className={`p-3 rounded-xl flex-shrink-0 transition-all ${
              !input.trim() || isLoading 
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                : isDeepSeek
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
      
      <div className="text-center mt-3">
        <p className="text-[10px] text-slate-400">
          {isDeepSeek 
            ? "DeepSeek V3 can make mistakes. Check important info." 
            : "Local mode runs offline with preset responses."}
        </p>
      </div>
    </div>
  );
};

export default ChatInput;