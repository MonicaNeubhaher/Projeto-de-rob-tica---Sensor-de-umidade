import React, { useState, useEffect, useRef } from 'react';
import { Message, Sender } from '../types';
import { createChatSession, sendMessageToGemini } from '../services/geminiService';
import { Send, Bot, User, Cpu } from 'lucide-react';
import { Chat } from '@google/genai';

export const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: 'Olá! Eu sou seu assistente virtual de eletrônica. Posso ajudar com dúvidas sobre o código, conexões do circuito ou como o sensor DHT11 funciona. O que você gostaria de saber?',
      sender: Sender.Bot,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSessionRef.current = createChatSession();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !chatSessionRef.current) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: Sender.User,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToGemini(chatSessionRef.current, newMessage.text);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: Sender.Bot,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
        console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="bg-slate-900 p-4 border-b border-slate-700 flex items-center gap-2">
        <Cpu className="text-purple-400" size={20} />
        <h3 className="font-semibold text-white">Assistente AI Arduino</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${
              msg.sender === Sender.User ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === Sender.User ? 'bg-blue-600' : 'bg-purple-600'
              }`}
            >
              {msg.sender === Sender.User ? <User size={14} /> : <Bot size={14} />}
            </div>
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap ${
                msg.sender === Sender.User
                  ? 'bg-blue-600/20 text-blue-100 rounded-tr-none border border-blue-500/30'
                  : 'bg-slate-700 text-slate-200 rounded-tl-none border border-slate-600'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                    <Bot size={14} />
                 </div>
                 <div className="bg-slate-700 p-3 rounded-lg rounded-tl-none text-sm text-slate-400 italic">
                    Digitando...
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-900 border-t border-slate-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre o circuito..."
            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white disabled:opacity-50 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
