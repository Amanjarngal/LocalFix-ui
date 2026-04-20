import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Droplet, Hammer, Wind, Paintbrush, ShieldCheck, ArrowRight, Home } from 'lucide-react';

const services = [
    {
        title: "Electrical Experts",
        description: "Certified electricians for repairs, wiring, and installations.",
        icon: <Zap size={32} className="text-white" />,
        color: "bg-gradient-to-br from-amber-400 to-orange-500",
        colSpan: "md:col-span-2"
    },
    {
        title: "Plumbing Masters",
        description: "Leak fixes to fresh pipelines.",
        icon: <Droplet size={32} className="text-white" />,
        color: "bg-gradient-to-br from-blue-400 to-blue-600",
        colSpan: "md:col-span-1"
    },
    {
        title: "Carpentry & Furniture",
        description: "Bespoke woodwork and swift furniture repair.",
        icon: <Hammer size={32} className="text-white" />,
        color: "bg-gradient-to-br from-stone-600 to-stone-800",
        colSpan: "md:col-span-1"
    },
    {
        title: "Appliance Repair",
        description: "Revive your ACs, fridges, and washing machines instantly.",
        icon: <Wind size={32} className="text-white" />,
        color: "bg-gradient-to-br from-cyan-400 to-blue-500",
        colSpan: "md:col-span-2"
    },
];

export const ServicesShowcase = () => {
    const navigate = useNavigate();

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
                        Explore All 50+ Services
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </div>

                {/* Bento Grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {services.map((service, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                            className={`group relative overflow-hidden rounded-[2rem] p-8 md:p-10 cursor-pointer transition-transform duration-500 hover:-translate-y-2 ${service.colSpan} bg-slate-50 border border-slate-100 hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.15)]`}
                        >
                            {/* Decorative background shape */}
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/40 rounded-full blur-3xl group-hover:bg-blue-100/50 transition-colors duration-500"></div>

                            <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-16 shadow-lg transform group-hover:scale-110 transition-transform duration-500`}>
                                {service.icon}
                            </div>
                            
                            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                                {service.title}
                            </h3>
                            <p className="text-slate-500 font-medium">
                                {service.description}
                            </p>
                            
                            <div className="absolute bottom-8 right-8 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </motion.div>
                    ))}

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
            </div>
        </section>
    );
};
