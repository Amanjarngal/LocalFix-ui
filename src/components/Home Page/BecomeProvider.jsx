import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Briefcase, Zap } from 'lucide-react';
import providerImage from '../../assets/provider2.png';
import { useNavigate } from 'react-router-dom';

export const BecomeProvider = () => {
    const navigate = useNavigate();

    return (
        <section className="bg-slate-50 pt-20 pb-0 md:pt-32 md:pb-0 overflow-hidden relative">
            
            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    
                    {/* Left Side: Professional Image */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="w-full lg:w-1/2 flex justify-center lg:justify-end relative"
                    >
                        {/* Decorative background circle behind provider */}
                        <div className="absolute bottom-0 w-[400px] h-[400px] bg-gradient-to-tr from-slate-200 to-white rounded-full translate-y-10 z-0"></div>
                        
                        <img 
                            src={providerImage} 
                            alt="LocalFix Professional Partner" 
                            className="w-[85%] max-w-[500px] h-auto object-cover relative z-10 drop-shadow-2xl translate-y-4"
                            style={{ maskImage: 'linear-gradient(to top, transparent 0%, black 15%)', WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%)' }}
                        />
                    </motion.div>

                    {/* Right Side: Content */}
                    <div className="w-full lg:w-1/2 pb-24 lg:pb-0">
                        <motion.div 
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="max-w-xl"
                        >
                            <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-6">
                                Join the Revolution: <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Become a Partner.</span>
                            </h2>
                            
                            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
                                Elevate your professional journey by joining our dynamic network of elite service experts. Connect with massive customer demand and showcase your master skills.
                            </p>

                            {/* Mini Benefits Blocks */}
                            <div className="flex flex-col sm:flex-row gap-6 mb-12">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                                        <Trophy size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Premium Rates</h4>
                                        <p className="text-sm text-slate-500">Earn what you deserve.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                                        <Briefcase size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Flexible Schedule</h4>
                                        <p className="text-sm text-slate-500">Work strictly on your terms.</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate('/provider-enrollment')}
                                className="bg-slate-900 hover:bg-blue-600 transition-all duration-300 text-white font-black py-4 px-10 rounded-full text-sm uppercase tracking-widest shadow-xl shadow-blue-600/20 flex items-center gap-3 group"
                            >
                                Register Now
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};
