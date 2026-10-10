import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Trash2, 
  X, 
  Copy,
  Check,
  Minimize2, 
  Maximize2,
  HelpCircle,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { CurrencyCode } from '../types/phone';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface GeminiVoiceChatProps {
  userCurrency: CurrencyCode;
  isOpen: boolean;
  onClose: () => void;
  onSelectPhone?: (phoneId: string) => void;
}

const QUICK_PROMPTS = [
  'قارن لي بين iPhone 16 Pro Max و Samsung Galaxy S25 Ultra',
  'ما هو أرخص متجر يبيع هاتف بوكو F6 برو حالياً؟',
  'معي ميزانية 2000 ريال، ما هو أفضل هاتف للألعاب والتصوير؟',
  'هل يستحق آيفون 16 العادي الشراء أم انتظر Pro؟',
  'ما هو الهاتف صاحب أطول عمر بطارية وأسرع شاحن؟',
];

export const GeminiVoiceChat: React.FC<GeminiVoiceChatProps> = ({
  userCurrency,
  isOpen,
  onClose,
  onSelectPhone,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome_1',
      role: 'assistant',
      content: `مرحباً بك! أنا **مستشار قارن تك الذكي** مدعوم بنموذج **Google Gemini 3.8**. 🎙️
يمكنك التحدث معي صوتياً أو كتابياً لمقارنة أسعار الهواتف، معرفة أفضل المتاجر (أمازون، نون، جرير، إكسترا)، أو ترشيح الهاتف الأنسب لميزانيتك.

تفضل، كيف أساعدك اليوم؟`,
      timestamp: 'الآن',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Initialize Speech Recognition & Synthesis
  useEffect(() => {
    // Check speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'ar-SA';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setRecognitionSupported(false);
    }

    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('المتصفح الحالي لا يدعم التعرف على الصوت. يرجى استخدام Google Chrome أو Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      // Stop any existing text-to-speech before listening
      stopSpeaking();
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error starting speech:', err);
      }
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // Clean markdown symbols for cleaner speech readout
    const cleanText = text
      .replace(/[*#_~`>]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick best Arabic voice if available
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar') || v.lang.includes('AR'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      activeUtteranceRef.current = utterance;
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      activeUtteranceRef.current = null;
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      activeUtteranceRef.current = null;
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    // Stop recording if running
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    stopSpeaking();

    const userMsg: Message = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          userCurrency: userCurrency,
        }),
      });

      const data = await response.json();
      const replyText = data.reply || data.error || 'عذراً، لم أتلقَّ رداً صالحاً.';

      const botMsg: Message = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);

      // If autoSpeak is active, speak the reply
      if (autoSpeak) {
        speakText(replyText);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errMsg: Message = {
        id: 'bot_err_' + Date.now(),
        role: 'assistant',
        content: 'تعذر الاتصال بخدمة Gemini. يرجى المحاولة مرة أخرى.',
        timestamp: 'الآن',
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    stopSpeaking();
    setMessages([
      {
        id: 'welcome_reset',
        role: 'assistant',
        content: 'تم بدء محادثة جديدة! اسألني عن أي هاتف أو قارن الأسعار بصوتك أو كتابة.',
        timestamp: 'الآن',
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl h-[88vh] max-h-[720px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center relative shadow-xs">
              <Bot className="w-5 h-5" />
              {isSpeaking && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm sm:text-base text-white">مستشار قارن تك الصوتي</h2>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono font-semibold border border-amber-400/30">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                {isListening ? '🎙️ يستمع لصوتك الآن...' : isSpeaking ? '🔊 يقرأ الإجابة بصوت واضح...' : 'جاهز لمساعدتك في مقارنة الأسعار واختيار الهاتف'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Audio Auto-read toggle */}
            <button
              onClick={() => {
                if (isSpeaking) stopSpeaking();
                setAutoSpeak(!autoSpeak);
              }}
              title={autoSpeak ? 'تعطيل القراءة الصوتية التلقائية' : 'تفعيل القراءة الصوتية التلقائية'}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                autoSpeak
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/30 hover:bg-amber-500/30'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Clear conversation */}
            <button
              onClick={clearChat}
              title="مسح المحادثة"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close */}
            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Audio Indicator Banner (when listening or speaking) */}
        {(isListening || isSpeaking) && (
          <div className={`py-2 px-4 text-xs font-bold flex items-center justify-between border-b ${
            isListening 
              ? 'bg-rose-50 text-rose-700 border-rose-200' 
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}>
            <div className="flex items-center gap-2">
              {isListening ? (
                <>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-4 bg-rose-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-6 bg-rose-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
                    <span className="w-2 h-3 bg-rose-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
                  </div>
                  <span>تحدث الآن... الميكروفون نشط ويلتقط صوتك بالعربية</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 animate-pulse text-emerald-600" />
                  <span>المستشار يتحدث الآن... استمع للإجابة</span>
                </>
              )}
            </div>

            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="text-[11px] underline text-emerald-900 font-bold hover:text-emerald-700"
              >
                إيقاف الصوت
              </button>
            )}
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                      : 'bg-slate-900 text-white shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-400" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 rounded-tr-none font-medium'
                      : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans text-right select-text">
                    {msg.content}
                  </div>

                  <div className="flex items-center justify-between gap-3 mt-2 pt-2 border-t border-black/5 text-[10px] opacity-75">
                    <span>{msg.timestamp}</span>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleCopyText(msg.id, msg.content)}
                        className="hover:opacity-100 flex items-center gap-1 font-semibold text-slate-700 hover:text-amber-700 transition-colors"
                        title="نسخ نص المحادثة الصوتية"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">تم النسخ!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>نسخ النص</span>
                          </>
                        )}
                      </button>

                      {!isUser && (
                        <button
                          onClick={() => speakText(msg.content)}
                          className="hover:opacity-100 flex items-center gap-1 font-semibold text-slate-700 hover:text-amber-700 transition-colors"
                          title="استمع لهذه الإجابة صوتياً"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>استمع</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-amber-400" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-xs text-slate-500 mr-2">جاري البحث ومقارنة الأسعار عبر Gemini...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="bg-white px-4 py-2 border-t border-slate-100 overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={loading}
              className="text-[11px] font-medium bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200/80 transition-colors shrink-0 disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Chat Input & Voice Controller */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-end gap-2"
          >
            {/* Voice Input Button */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              disabled={loading || !recognitionSupported}
              title={
                !recognitionSupported
                  ? 'المتصفح لا يدعم التسجيل الصوتي'
                  : isListening
                  ? 'إيقاف الاستماع'
                  : 'تحدث صوتياً الآن'
              }
              className={`p-3 rounded-xl flex items-center justify-center transition-all shrink-0 ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200'
                  : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-800 border border-slate-200'
              } disabled:opacity-40`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Input textarea */}
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening
                    ? 'جاري الاستماع لصوتك الآن...'
                    : 'اسأل عن سعر هاتف، قارن، أو انقر على الميكروفون للتحدث...'
                }
                rows={1}
                className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200/50 rounded-xl py-2.5 px-3.5 text-sm text-slate-900 resize-none transition-colors focus:outline-none max-h-24"
              />
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-xs"
            >
              <Send className="w-5 h-5 rtl:rotate-180" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span>مدعوم بنموذج Google Gemini مع قاعدة بيانات الأسعار الحية</span>
            <div className="flex items-center gap-2">
              <span>Enter للإرسال</span>
              <span aria-hidden="true">·</span>
              <span>يدعم الإدخال والقراءة الصوتية العربية</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
