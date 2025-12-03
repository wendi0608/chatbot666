import React from 'react';
import { Message } from '../types';
import { Bot, User, BrainCircuit } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4 animate-fade-in">
        <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'} group animate-slide-up`}>
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
          isUser ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200'
        }`}>
          {isUser ? <User size={16} /> : (message.mode === 'cloud' ? <BrainCircuit size={16} className="text-blue-500" /> : <Bot size={16} className="text-emerald-600" />)}
        </div>

        {/* Bubble */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
            isUser 
              ? 'bg-indigo-600 text-white rounded-tr-none' 
              : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
          }`}>
            {message.content}
          </div>
          
          {/* Metadata */}
          <div className="flex items-center gap-2 mt-1 px-1">
             <span className="text-[10px] text-slate-400">
              {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </span>
            {!isUser && message.mode && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                message.mode === 'cloud' 
                  ? 'bg-blue-50 text-blue-600 border-blue-200' 
                  : 'bg-emerald-50 text-emerald-600 border-emerald-200'
              }`}>
                {message.mode === 'cloud' ? 'DeepSeek' : 'Local Bot'}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;