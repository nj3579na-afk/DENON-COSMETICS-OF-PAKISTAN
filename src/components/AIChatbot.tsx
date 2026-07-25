import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, MessageSquare, X, Send, Bot, User, ArrowRight, RefreshCw, MessageCircle } from 'lucide-react';
import { sendChatMessage } from '../services/api';
import { ChatMessage, Product } from '../types';

interface AIChatbotProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  whatsappNumber: string;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ products, onSelectProduct, whatsappNumber }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'bot',
      text: 'Assalamu Alaikum! I am the DENON COSMETICS AI Assistant. How can I help you today with skincare advice, Rice Water products, or Cash on Delivery orders in Pakistan?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Which product is best for dark spots?',
    'How do I use Denon Hair Removal Spray?',
    'What are the COD delivery charges?',
    'Tell me about Denon Anti Acne Cream',
  ];

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const replyText = await sendChatMessage(text.trim(), messages);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'bot',
          text: 'Thank you for reaching out! You can also chat directly with our customer support team on WhatsApp at ' + whatsappNumber,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        id="ai-chatbot-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-6 z-40 bg-stone-900 text-amber-300 hover:bg-stone-800 p-3.5 rounded-full shadow-2xl border border-amber-500/40 flex items-center gap-2 transition-all duration-300 hover:scale-105"
        title="Ask Denon AI Skincare Assistant"
      >
        <Sparkles className="w-5 h-5 animate-pulse text-amber-400" />
        <span className="text-xs font-bold text-amber-100 hidden sm:inline">Denon AI Assistant</span>
      </button>

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="fixed bottom-28 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[520px] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 bg-stone-900 text-stone-100 flex items-center justify-between border-b border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-900/60 text-amber-300 rounded-lg">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-amber-200">Denon AI Assistant</h3>
                <p className="text-[10px] text-stone-400">Skincare & Product Consultation</p>
              </div>
            </div>
            <button
              id="close-chatbot-btn"
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-stone-400 hover:text-white rounded-full hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50/50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] p-3 rounded-2xl space-y-1 ${
                    msg.sender === 'user'
                      ? 'bg-stone-900 text-amber-100 rounded-tr-none font-medium'
                      : 'bg-white text-stone-800 border border-stone-200/80 rounded-tl-none shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line leading-relaxed">{msg.text}</p>
                  <span className="block text-[9px] text-stone-400 text-right">{msg.timestamp}</span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-stone-800 text-amber-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2 justify-start items-center text-stone-500">
                <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span className="text-xs italic bg-white p-2.5 rounded-xl border border-stone-200">
                  Denon AI is analyzing skincare formula...
                </span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2.5 bg-stone-100/70 border-t border-stone-200 overflow-x-auto flex gap-1.5 text-[10px]">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-2.5 py-1 bg-white border border-stone-300/80 rounded-full text-stone-700 hover:bg-amber-100 hover:text-amber-900 shrink-0 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about ingredients, skin issues, COD..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3 py-2 border border-stone-300 rounded-xl text-xs focus:ring-1 focus:ring-amber-800 focus:outline-hidden"
            />
            <button
              id="send-chat-btn"
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2 bg-stone-900 text-amber-300 rounded-xl hover:bg-stone-800 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
