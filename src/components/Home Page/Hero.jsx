import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Zap, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
    const [pincode, setPincode] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleFindExperts = () => {
        // If pincode is provided, we pass it to the services page
        // If searchQuery is provided, we can also pass it
        const params = new URLSearchParams();
        if (pincode) params.append('pincode', pincode);
        if (searchQuery) params.append('search', searchQuery);

        navigate(`/services?${params.toString()}`);
    };

    return (
        <section className="relative pt-32 pb-20 bg-white overflow-hidden min-h-screen flex flex-col items-center justify-center">
            {/* Massive Abstract Glows */}
            <div className="absolute top-0 -translate-y-1/2 w-full h-[600px] bg-gradient-to-b from-blue-50 to-white -z-10" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6 w-full text-center relative z-10">
                
                {/* Badge */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="inline-flex items-center gap-2 px-6 py-2 bg-slate-50 border border-slate-100 rounded-full mb-10 shadow-sm"
                >
                    <Star className="text-blue-500 fill-blue-500" size={14} />
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-600">Rated #1 Home Service App 2026</span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-6xl md:text-8xl font-black text-slate-900 leading-[0.95] tracking-tighter mb-8 max-w-5xl mx-auto"
                >
                    Don't DIY It. <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Just LocalFix It.</span>
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-14 font-medium"
                >
                    Book top-rated plumbers, electricians, and carpenters in your neighborhood instantly. Transparent pricing. Zero hassle.
                </motion.p>

                {/* Floating Search / Booking Bar */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-4xl mx-auto bg-white p-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col md:flex-row items-center gap-3 relative z-20"
                >
                    <div className="flex-1 flex items-center gap-3 px-6 py-4 w-full md:w-auto">
                        <MapPin className="text-slate-400" size={24} />
                        <input 
                            type="text" 
                            placeholder="Pincode (e.g. 184142)" 
                            value={pincode}
                            onChange={(e) => setPincode(e.target.value)}
                            className="bg-transparent border-none outline-none text-slate-900 w-full font-bold placeholder:font-medium placeholder:text-slate-400"
                        />
                    </div>
                    <div className="hidden md:block w-[1px] h-10 bg-slate-100" />
                    <div className="flex-1 flex items-center gap-3 px-6 py-4 w-full md:w-auto">
                        <Search className="text-slate-400" size={24} />
                        <input 
                            type="text" 
                            placeholder="What do you need help with?" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-slate-900 w-full font-bold placeholder:font-medium placeholder:text-slate-400"
                        />
                    </div>
                    <button 
                        onClick={handleFindExperts}
                        className="w-full md:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs rounded-full transition-colors flex-shrink-0 shadow-lg shadow-blue-600/30"
                    >
                        Find Experts
                    </button>
                </motion.div>

                {/* Dynamic Image Grid Trailer */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-20 relative px-4"
                >
                    {/* Floating Info Card */}
                    <div className="absolute top-10 -left-10 md:left-0 z-20 bg-white p-5 rounded-2xl shadow-2xl border border-slate-50 flex items-center gap-4 animate-[bounce_4s_ease-in-out_infinite]">
                        <div className="bg-blue-50 p-3 rounded-xl"><Zap className="text-blue-600" size={24} fill="currentColor" /></div>
                        <div className="text-left">
                            <p className="text-sm font-black text-slate-900">Under 60 Mins</p>
                            <p className="text-[10px] font-bold uppercase text-slate-500">Average Response</p>
                        </div>
                    </div>

                    {/* Main Visual */}
                    <div className="h-[400px] md:h-[500px] w-full rounded-[3rem] overflow-hidden relative shadow-2xl group">
                        <img 
                            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                            alt="Clean Home Renovation" 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                        
                        {/* Internal Label */}
                        <div className="absolute bottom-10 left-10 text-left">
                            <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-white font-bold text-sm border border-white/30">
                                🔧 Plumbing & Maintenance
                            </div>
                        </div>
                    </div>

                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

