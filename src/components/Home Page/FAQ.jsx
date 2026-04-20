import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageCircleQuestion } from 'lucide-react';

const faqs = [
    {
        question: "How are LocalFix professionals verified?",
        answer: "Every service expert on our platform goes through a rigorous multi-step background check, including identity verification, skill assessment, and historical performance reviews before they are allowed to accept bookings."
    },
    {
        question: "Is there any hidden booking fee?",
        answer: "Absolutely not. LocalFix believes in 100% transparent pricing. The cost you see before confirming your booking is the exact amount you pay. We do not charge hidden convenience fees."
    },
    {
        question: "What happens if I'm not satisfied with the service?",
        answer: "Your satisfaction is heavily guaranteed. If the service does not meet our elite standards, simply report it via the app within 24 hours. We will send a senior technician to resolve the issue for free, or issue a refund."
    },
    {
        question: "Can I reschedule or cancel my booking?",
        answer: "Yes, you can easily reschedule or cancel your booking through the dashboard up to 2 hours before the scheduled time without any penalty."
    },
    {
        question: "How do I pay for the service?",
        answer: "You can pay securely inside the app using UPI, Credit/Debit cards, or Net Banking after the service is successfully completed. Cash payments directly to providers are also fully supported."
    },
    {
        question: "Are spare parts and materials included in the price?",
        answer: "The initial booking or estimated cost covers only the service and labor charges. If any spare parts, wires, or hardware materials are required, the technician will provide you with a transparent quote for those items before proceeding."
    },
    {
        question: "Are your services available 24/7?",
        answer: "While you can book a service 24/7 through the app, our professionals typically operate between 8:00 AM and 9:00 PM. Emergency services after hours are available but may incur a slight night-time surcharge."
    }
];

export const FAQ = () => {
    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="py-12 lg:py-16 bg-white relative overflow-hidden">
            {/* Top Border Divider */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>

            <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100"
                    >
                        <MessageCircleQuestion size={16} className="text-blue-600" />
                        <span className="text-xs font-black uppercase tracking-widest text-blue-600">Support Center</span>
                    </motion.div>

                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter"
                    >
                        Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Questions.</span>
                    </motion.h2>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-500 font-medium"
                    >
                        Everything you need to know about seamlessly booking services and utilizing the LocalFix platform.
                    </motion.p>
                </div>

                {/* Accordion Container */}
                <div className="space-y-3">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;

                        return (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 * idx }}
                                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                                    isOpen 
                                        ? "bg-slate-50 border-blue-100 shadow-[0_10px_40px_-15px_rgba(37,99,235,0.1)]" 
                                        : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                                }`}
                            >
                                {/* Question Header */}
                                <button 
                                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                                    className="w-full flex items-center justify-between py-4 px-5 text-left focus:outline-none group"
                                >
                                    <h3 className={`text-lg md:text-xl font-black transition-colors duration-300 pr-6 ${isOpen ? "text-blue-600" : "text-slate-900 group-hover:text-blue-600"}`}>
                                        {faq.question}
                                    </h3>
                                    
                                    <div className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 rotate-180" : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"}`}>
                                        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                                    </div>
                                </button>

                                {/* Animated Answer Body */}
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: "easeInOut" }}
                                        >
                                            <div className="px-5 pb-5 pt-0 text-slate-500 font-medium text-base md:text-lg leading-relaxed">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
