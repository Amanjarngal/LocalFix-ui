import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Home, PhoneCall, ArrowRight } from 'lucide-react';

export const HouseRenovation = () => {
    const navigate = useNavigate();

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Massive background image with parallax feel */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80" 
                    alt="Premium Home Renovation" 
                    className="w-full h-full object-cover scale-105"
                />
                {/* Dual gradient overlay for text legibility and deep brand color */}
                <div className="absolute inset-0 bg-slate-900/80 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-slate-900/80 to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left Typography & CTA */}
                    <div className="py-12 md:py-24">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-md mb-8"
                        >
                            <Sparkles size={16} className="text-cyan-400" />
                            <span className="text-xs font-black uppercase tracking-widest text-cyan-50">LocalFix Signature</span>
                        </motion.div>

                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-8"
                        >
                            Full House <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Renovation.</span>
                        </motion.h2>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-300 font-medium leading-relaxed mb-12 max-w-lg"
                        >
                            Transform your living space entirely. From architectural restructuring to premium interior finishing—guaranteed quality, assured timelines, and seamless execution.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <button 
                                onClick={() => navigate('/renovation')}
                                className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black py-4 px-8 rounded-full text-sm uppercase tracking-widest transition-all duration-300 shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)] flex justify-center items-center gap-3 group"
                            >
                                Start Your Renovation
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                            
                            <button className="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 font-bold py-4 px-8 rounded-full text-sm transition-all duration-300 flex justify-center items-center gap-3 group">
                                <PhoneCall size={18} className="text-cyan-400 group-hover:scale-110 transition-transform" />
                                Talk to an Expert
                            </button>
                        </motion.div>
                    </div>

                    {/* Right Side Stats / Assurances */}
                    <div className="hidden lg:grid grid-cols-2 gap-4">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center translate-y-12 shadow-2xl"
                        >
                            <div className="text-4xl font-black text-cyan-400 mb-2">100%</div>
                            <div className="text-slate-300 font-medium text-sm">Quality Assured<br/>Materials</div>
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="bg-blue-600/40 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center shadow-2xl"
                        >
                            <div className="text-4xl font-black text-white mb-2">On Time</div>
                            <div className="text-blue-100 font-medium text-sm">Strict project<br/>delivery timelines</div>
                        </motion.div>
                    </div>

                </div>
            </div>
            
            {/* Elegant bottom divider to transition back to white sections smoothly */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent z-10 w-full" />
        </section>
    );
};
