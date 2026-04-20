import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, MapPin, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';
import providerImage from '../../assets/provider1.png';
import { useNavigate } from 'react-router-dom';

export const HowItWorks = () => {
    const containerRef = useRef(null);
    const leftColRef = useRef(null);
    const navigate = useNavigate();
    
    // Track scroll specifically for the left column (timeline)
    const { scrollYProgress } = useScroll({
        target: leftColRef,
        offset: ["start center", "end center"]
    });

    const steps = [
        {
            title: "Describe the Issue",
            description: "Simply tell us what needs fixing and provide your ZIP code. No complex forms to fill out.",
            icon: <MapPin size={24} className="text-white" />,
            color: "from-blue-600 to-blue-400"
        },
        {
            title: "Instant Verification",
            description: "Our AI matches your request instantly with the perfect LocalFix expert available in your area.",
            icon: <Search size={24} className="text-white" />,
            color: "from-cyan-500 to-blue-500"
        },
        {
            title: "Expert Resolution",
            description: "Your master technician arrives on time, fully equipped to resolve the problem perfectly.",
            icon: <Wrench size={24} className="text-white" />,
            color: "from-blue-500 to-indigo-500"
        },
        {
            title: "Guaranteed Satisfaction",
            description: "Pay securely only when the job satisfies the elite LocalFix standard.",
            icon: <ShieldCheck size={24} className="text-white" />,
            color: "from-indigo-500 to-blue-600"
        }
    ];

    const timelineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <section ref={containerRef} className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    
                    {/* Left Column: Text & Vertical Timeline */}
                    <div className="relative pt-8 lg:pt-0 order-2 lg:order-1" ref={leftColRef}>
                        
                        {/* Headers */}
                        <div className="space-y-6 mb-16">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm"
                            >
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                <span className="text-xs font-black uppercase tracking-widest text-slate-900">Simplicity By Design</span>
                            </motion.div>
                            
                            <motion.h2 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]"
                            >
                                How LocalFix <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Works.</span>
                            </motion.h2>
                            
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-slate-500 font-medium leading-relaxed max-w-md"
                            >
                                Four simple steps stand between your home headache and a flawless resolution. We've eliminated the friction of traditional booking completely.
                            </motion.p>
                        </div>

                        {/* Vertical Tracking Line */}
                        <div className="absolute left-8 lg:left-12 top-[320px] bottom-12 w-[2px] bg-slate-200 rounded-full">
                            <motion.div 
                                style={{ height: timelineHeight }}
                                className="absolute top-0 w-full bg-gradient-to-b from-blue-600 to-cyan-400 rounded-full"
                            />
                        </div>

                        {/* Steps Stack */}
                        <div className="space-y-16">
                            {steps.map((step, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                                    className="relative flex gap-8 pl-24 lg:pl-32 group"
                                >
                                    {/* Abstract Connector Node */}
                                    <div className="absolute left-8 lg:left-12 -translate-x-1/2 top-0">
                                        <div className="absolute inset-0 bg-white rounded-2xl shadow-xl shadow-slate-200/50 group-hover:scale-110 transition-transform duration-500 rotate-3 group-hover:rotate-6 -m-3 p-3 border border-slate-100"></div>
                                        <div className="absolute inset-0 bg-white rounded-2xl shadow-sm -rotate-3 group-hover:-rotate-6 transition-transform duration-500 -m-3 p-3"></div>
                                        
                                        <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${step.color} shadow-lg shadow-blue-500/30 flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300 z-10 -translate-y-2`}>
                                            {step.icon}
                                        </div>
                                        
                                        {/* Number Badge floating */}
                                        <div className="absolute -top-4 -right-4 w-7 h-7 rounded-full bg-slate-900 border-2 border-white text-white font-black flex items-center justify-center text-xs shadow-lg z-20">
                                            {idx + 1}
                                        </div>
                                    </div>

                                    {/* Text Content */}
                                    <div className="pt-2 pb-6 w-full">
                                        <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-blue-600 transition-colors">
                                            {step.title}
                                        </h3>
                                        <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        {/* CTA Button */}
                        <motion.button 
                            onClick={() => navigate('/services')}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="mt-8 bg-slate-900 hover:bg-blue-600 transition-all duration-300 text-white font-black py-4 px-8 rounded-2xl text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 flex items-center gap-3 group w-full justify-center md:w-auto"
                        >
                            Start Your Request
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </div>

                    {/* Right Column: Full Image White BG Layout */}
                    <div className="lg:sticky lg:top-32 order-1 lg:order-2 h-full">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, x: 30 }}
                            whileInView={{ opacity: 1, scale: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.7 }}
                            className="w-full h-full lg:h-[800px] bg-white rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden border border-slate-100 p-4"
                        >
                            <div className="w-full h-full relative rounded-[2.5rem] overflow-hidden bg-slate-100 group">
                                <img 
                                    src={providerImage} 
                                    alt="LocalFix Expert Workflow" 
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};
