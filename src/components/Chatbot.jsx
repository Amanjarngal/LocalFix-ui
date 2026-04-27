import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, AlertCircle, Wrench, Clock, CreditCard, ShieldAlert, RotateCcw, UserX, Smartphone, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

// ─── Complaint category definitions ───
const COMPLAINT_CATEGORIES = [
    { id: 'service_quality', icon: Wrench, label: 'Service Quality', color: 'blue', prompt: 'I want to raise a complaint about Service Quality — the work was poor, incomplete, or my property was damaged.' },
    { id: 'delay_time', icon: Clock, label: 'Delay / No-Show', color: 'amber', prompt: 'I want to complain about a Delay or Time issue — provider arrived late, never showed up, or took too long.' },
    { id: 'payment_related', icon: CreditCard, label: 'Pricing / Payment', color: 'emerald', prompt: 'I have a Pricing and Payment complaint — I was overcharged, faced hidden fees, or had a double payment issue.' },
    { id: 'provider_behavior', icon: UserX, label: 'Provider Behavior', color: 'orange', prompt: 'I want to report Provider Behavior issues — the provider was rude, unprofessional, or did not follow instructions.' },
    { id: 'safety_trust', icon: ShieldAlert, label: 'Safety / Trust', color: 'red', prompt: 'I have a HIGH PRIORITY Safety concern — I felt unsafe, faced harassment, or an unauthorized person showed up.' },
    { id: 'refund_cancellation', icon: RotateCcw, label: 'Refund / Cancel', color: 'violet', prompt: 'I need help with a Refund or Cancellation issue — my refund is delayed, charges are too high, or it was not processed.' },
    { id: 'technical_system', icon: Smartphone, label: 'App / Technical', color: 'slate', prompt: 'I am facing a Technical or App issue — payment failed but money deducted, app crashed, or booking not showing.' },
];

const colorMap = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', hover: 'hover:bg-blue-100' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', hover: 'hover:bg-amber-100' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', hover: 'hover:bg-emerald-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', hover: 'hover:bg-orange-100' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', hover: 'hover:bg-red-100' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-600', border: 'border-violet-200', hover: 'hover:bg-violet-100' },
    slate: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-200', hover: 'hover:bg-slate-200' },
};

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: "Hey there! 👋 I'm the **LocalFix AI Assistant** powered by Gemini 2.0.\n\nI can help you with:\n• Check your **booking status & updates**\n• **Raise complaints** (service quality, delays, refunds…)\n• Answer questions about **services, pricing, providers**\n\nHow can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showComplaintPicker, setShowComplaintPicker] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const [pulseVisible, setPulseVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setPulseVisible(false), 6000);
        return () => clearTimeout(timer);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, isOpen, showComplaintPicker]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const handleSend = async (customInitialMessage = null) => {
        const textToSend = customInitialMessage || input;
        if (!textToSend.trim() || isTyping) return;

        const newMessages = [...messages, { sender: 'user', text: textToSend }];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);
        setShowComplaintPicker(false);

        try {
            const openRouterHistory = newMessages
                .filter(m => m.sender !== 'bot' || !m.text.includes('Error:'))
                .map(m => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.text
                }));

            const res = await axios.post(`${apiUrl}/api/chat`, {
                messages: openRouterHistory
            }, {
                withCredentials: true
            });

            setMessages([...newMessages, { sender: 'bot', text: res.data.response }]);
        } catch (error) {
            console.error("Chat API Error:", error);
            let botError = "I'm experiencing technical difficulties. Please try again later.";
            if (error.response?.data?.error?.includes("OPEN_ROUTER_API_KEY")) {
                botError = "⚠️ **Error:** Backend is missing `OPEN_ROUTER_API_KEY`. Please restart your backend server.";
            } else if (error.response?.data?.error === "INVALID_KEY_FORMAT") {
                botError = `⚠️ **Key Error:** ${error.response.data.message}`;
            }
            setMessages([...newMessages, { sender: 'bot', text: botError }]);
        } finally {
            setIsTyping(false);
        }
    };

    // ─── Rich Markdown Parser ───
    const formatMessage = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, lineIdx) => {
            const parts = line.split(/(\*\*.*?\*\*|\`.*?\`)/g);
            const rendered = parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
                }
                if (part.startsWith('`') && part.endsWith('`')) {
                    return <code key={i} className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[12px] font-mono">{part.slice(1, -1)}</code>;
                }
                return <span key={i}>{part}</span>;
            });
            return (
                <React.Fragment key={lineIdx}>
                    {rendered}
                    {lineIdx < text.split('\n').length - 1 && <br />}
                </React.Fragment>
            );
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-[999]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute bottom-20 right-0 w-[400px] sm:w-[480px] h-[520px] bg-white rounded-[2rem] shadow-2xl flex flex-col border border-slate-200 overflow-hidden"
                        style={{ boxShadow: '0 25px 80px -12px rgba(0,0,0,0.25)' }}
                    >
                        {/* ─── HEADER ─── */}
                        <div className="bg-slate-900 px-5 py-4 flex items-center justify-between relative overflow-hidden flex-shrink-0">
                            <div className="absolute -top-8 -right-8 w-40 h-40 bg-blue-500 rounded-full blur-[60px] opacity-15 pointer-events-none" />
                            <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-cyan-400 rounded-full blur-[50px] opacity-10 pointer-events-none" />
                            <div className="flex items-center gap-3 relative z-10">
                                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg rotate-3">
                                    <Sparkles className="text-white w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-base leading-tight">LocalFix AI</h3>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 mt-0.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Gemini 2.0 · Online
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors relative z-10">
                                <X size={16} />
                            </button>
                        </div>

                        {/* ─── MESSAGES AREA ─── */}
                        <div className="flex-1 px-4 py-4 overflow-y-auto bg-gradient-to-b from-slate-50 to-white space-y-4" id="chatbot-messages">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex items-end gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.sender === 'bot' && (
                                        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-50 flex items-center justify-center flex-shrink-0 border border-blue-200/50 shadow-sm">
                                            <Sparkles size={12} className="text-blue-600" />
                                        </div>
                                    )}
                                    <div className={`max-w-[82%] px-4 py-3 text-[13px] leading-[1.65] shadow-sm ${
                                        msg.sender === 'user'
                                        ? 'bg-slate-800 text-white rounded-2xl rounded-br-lg font-medium'
                                        : 'bg-white border border-slate-100 text-slate-700 rounded-2xl rounded-bl-lg'
                                    }`}>
                                        {msg.sender === 'bot' ? formatMessage(msg.text) : msg.text}
                                    </div>
                                </motion.div>
                            ))}

                            {/* ─── COMPLAINT CATEGORY PICKER (renders IN the chat) ─── */}
                            {showComplaintPicker && (
                                <motion.div
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-start gap-2.5"
                                >
                                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-50 flex items-center justify-center flex-shrink-0 border border-blue-200/50 shadow-sm">
                                        <Sparkles size={12} className="text-blue-600" />
                                    </div>
                                    <div className="max-w-[88%] bg-white border border-slate-100 rounded-2xl rounded-bl-lg p-4 shadow-sm">
                                        <p className="text-[13px] text-slate-700 font-medium mb-3">What type of issue are you facing? Select one:</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {COMPLAINT_CATEGORIES.map((cat) => {
                                                const c = colorMap[cat.color];
                                                return (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => handleSend(cat.prompt)}
                                                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wide border transition-all ${c.bg} ${c.text} ${c.border} ${c.hover} active:scale-95`}
                                                    >
                                                        <cat.icon size={14} />
                                                        <span className="truncate">{cat.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* typing indicator */}
                            {isTyping && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-end gap-2.5">
                                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-50 flex items-center justify-center border border-blue-200/50 shadow-sm">
                                        <Sparkles size={12} className="text-blue-600" />
                                    </div>
                                    <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-lg px-4 py-3.5 flex gap-1.5 shadow-sm">
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* ─── BOTTOM ACTION BAR ─── */}
                        <div className="border-t border-slate-100 bg-white flex-shrink-0">
                            {/* Quick Actions */}
                            <div className="px-4 pt-3 pb-1 flex gap-2 overflow-x-auto no-scrollbar">
                                <button onClick={() => handleSend('What are the live statuses of my recent bookings?')} className="flex-shrink-0 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-100 transition">
                                    <Wrench size={11} className="text-blue-500" /> My Bookings
                                </button>
                                <button onClick={() => { setShowComplaintPicker(prev => !prev); scrollToBottom(); }} className="flex-shrink-0 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-100 transition">
                                    <AlertCircle size={11} className="text-red-500" /> Raise Complaint
                                </button>
                                <button onClick={() => handleSend('Show me the status of all my complaints and their admin responses.')} className="flex-shrink-0 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-100 transition">
                                    <Clock size={11} className="text-amber-500" /> Track Complaints
                                </button>
                            </div>

                            {/* Input */}
                            <div className="px-4 pb-4 pt-2">
                                <div className="flex bg-slate-50 rounded-2xl border border-slate-200 focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-400 transition-all p-1.5">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                        placeholder="Ask anything about LocalFix..."
                                        className="flex-1 bg-transparent px-3 py-2 text-sm font-medium focus:outline-none text-slate-800 placeholder:text-slate-400"
                                    />
                                    <button
                                        onClick={() => handleSend()}
                                        disabled={!input.trim() || isTyping}
                                        className="bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white rounded-xl w-10 h-10 flex items-center justify-center transition-colors shadow-md disabled:shadow-none"
                                    >
                                        <Send size={15} className={input.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ─── FAB ─── */}
            <div className="relative">
                {/* Notification pulse */}
                {pulseVisible && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute -top-2 -left-2 bg-white shadow-lg border border-slate-200 rounded-2xl px-4 py-2 text-[12px] font-semibold text-slate-700 whitespace-nowrap pointer-events-none"
                        style={{ right: '80px', top: '10px' }}
                    >
                        Need help? Chat with AI ✨
                    </motion.div>
                )}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setIsOpen(!isOpen); setPulseVisible(false); }}
                    className={`w-[64px] h-[64px] rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 ${
                        isOpen
                        ? 'bg-slate-800 rotate-0 border-2 border-slate-300'
                        : 'bg-gradient-to-br from-blue-600 to-cyan-500 border-4 border-white hover:shadow-blue-500/30'
                    }`}
                >
                    {isOpen ? (
                        <X className="w-6 h-6 text-white" />
                    ) : (
                        <Sparkles className="w-7 h-7 text-white" />
                    )}
                </motion.button>
            </div>
        </div>
    );
};

export default Chatbot;
