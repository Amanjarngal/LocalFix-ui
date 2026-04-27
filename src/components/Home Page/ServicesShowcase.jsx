import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wrench, ShieldCheck, ArrowRight } from 'lucide-react';
import axios from 'axios';

export const ServicesShowcase = () => {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchServices = async () => {
            const cached = sessionStorage.getItem('cachedServices');
             if (cached) {
                 const parsed = JSON.parse(cached);
                 setTotalCount(parsed.length);
                 setServices(parsed.slice(0, 4));
                 setLoading(false);
             }
            try {
                const res = await axios.get(`${apiUrl}/api/services`);
                sessionStorage.setItem('cachedServices', JSON.stringify(res.data.data));
                setTotalCount(res.data.data.length);
                // Show only first 4 services on homepage
                setServices(res.data.data.slice(0, 4));
            } catch (error) {
                console.error("Failed to load services");
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [apiUrl]);

    const remainingCount = totalCount - 4;

    // Bento grid layout pattern — alternating col spans for 4 cards
    const getColSpan = (index) => {
        const pattern = [2, 1, 1, 2];
        return `md:col-span-${pattern[index % pattern.length]}`;
    };

    // Accent gradient for cards without images
    const gradients = [
        "from-blue-500 to-blue-600",
        "from-violet-500 to-purple-600",
        "from-amber-400 to-orange-500",
        "from-cyan-400 to-blue-500",
        "from-emerald-400 to-green-600",
        "from-rose-400 to-pink-600",
    ];

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                    <div className="max-w-2xl">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4"
                        >
                            Expertise For <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Every Corner.</span>
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-slate-500 font-medium"
                        >
                            From a dripping faucet to a completely shorted circuit, our verified professionals are equipped, trained, and ready to deploy to your doorstep.
                        </motion.p>
                    </div>

                    <motion.button 
                        onClick={() => navigate('/services')}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 font-bold py-3 px-8 rounded-full flex items-center gap-2 group shrink-0"
                    >
                        Explore All {totalCount > 0 ? `${totalCount}+` : ''} Services
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[2, 1, 1, 2].map((span, i) => (
                            <div
                                key={i}
                                className={`h-72 bg-slate-100 rounded-[2rem] animate-pulse md:col-span-${span}`}
                            />
                        ))}
                    </div>
                ) : (
                    /* Bento Grid layout */
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {services.map((service, idx) => (
                            <motion.div
                                key={service._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.5 }}
                                onClick={() => navigate(`/services/${service._id}`)}
                                className={`group relative overflow-hidden rounded-[2rem] cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)] ${getColSpan(idx)}`}
                            >
                                {service.image ? (
                                    /* Card WITH image */
                                    <div className="relative h-72 md:h-80">
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                        />
                                        {/* Gradient overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

                                        {/* Content on image */}
                                        <div className="absolute bottom-0 left-0 right-0 p-8">
                                            <h3 className="text-2xl font-black text-white mb-2 tracking-tight group-hover:text-blue-300 transition-colors duration-300">
                                                {service.name}
                                            </h3>
                                            <p className="text-slate-300 font-medium text-sm line-clamp-2">
                                                {service.description}
                                            </p>
                                        </div>

                                        {/* Arrow button */}
                                        <div className="absolute top-6 right-6 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-lg">
                                                <ArrowRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    /* Card WITHOUT image — colored fallback */
                                    <div className="relative h-72 md:h-80 bg-slate-50 border border-slate-100 p-8 md:p-10 flex flex-col justify-between">
                                        {/* Decorative background shape */}
                                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/40 rounded-full blur-3xl group-hover:bg-blue-100/50 transition-colors duration-500" />

                                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[idx % gradients.length]} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                                            <Wrench size={32} className="text-white" />
                                        </div>
                                        
                                        <div className="relative z-10">
                                            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                                                {service.name}
                                            </h3>
                                            <p className="text-slate-500 font-medium text-sm line-clamp-2">
                                                {service.description}
                                            </p>
                                        </div>

                                        {/* Arrow button */}
                                        <div className="absolute bottom-8 right-8 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">
                                                <ArrowRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}

                        {/* View More Card — shown when more than 4 services exist */}
                        {remainingCount > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                onClick={() => navigate('/services')}
                                className="md:col-span-3 group relative overflow-hidden rounded-[2rem] cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_-15px_rgba(37,99,235,0.2)]"
                            >
                                <div className="relative h-44 bg-gradient-to-r from-blue-50 via-white to-cyan-50 border border-blue-100 flex items-center justify-center gap-8 p-8">
                                    {/* Decorative blobs */}
                                    <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-100/60 rounded-full blur-3xl" />
                                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-100/60 rounded-full blur-3xl" />

                                    <div className="relative z-10 text-center">
                                        <div className="flex items-center justify-center gap-3 mb-3">
                                            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                                                +{remainingCount}
                                            </span>
                                            <span className="text-xl font-bold text-slate-700">More Services</span>
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium mb-4">Discover all our professional home service categories</p>
                                        <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold text-sm group-hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                                            View All Services
                                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Upsell / Assurance Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="md:col-span-3 bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 mt-4 relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                            
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-16 h-16 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center backdrop-blur-md">
                                    <ShieldCheck size={32} className="text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-black text-white mb-1">The LocalFix Guarantee</h3>
                                    <p className="text-slate-300 font-medium max-w-xl">100% verified professionals, upfront pricing, and absolute satisfaction on every single booking.</p>
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate('/services')}
                                className="w-full md:w-auto relative z-10 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-black py-4 px-8 rounded-full transition-colors duration-300 flex items-center justify-center gap-2"
                            >
                                Book A Service
                            </button>
                        </motion.div>

                    </div>
                )}
            </div>
        </section>
    );
};
