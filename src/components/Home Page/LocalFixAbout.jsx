import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle, Play, ArrowRight } from 'lucide-react';
import Intro from '../../assets/Intro.mp4';

export const LocalFixAbout = () => {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-100px" });
    const [isPlaying, setIsPlaying] = useState(false);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <section ref={containerRef} className="bg-slate-50 py-24 md:py-32 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="max-w-7xl mx-auto p-6 md:p-12"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* Left Side: Elaborate Image Composition */}
                    <motion.div variants={itemVariants} className="relative order-2 lg:order-1">
                        {/* Floating Experience Badge */}
                        <motion.div
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-8 -left-8 z-20 bg-blue-600 text-white p-6 rounded-3xl shadow-xl shadow-blue-600/30 border-4 border-white"
                        >
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black">10+</span>
                                <div className="text-[10px] leading-tight font-black uppercase tracking-widest text-blue-100">
                                    Years Of <br /> Excellence
                                </div>
                            </div>
                        </motion.div>

                        {/* Main Image */}
                        <div className="rounded-[2.5rem] overflow-hidden border-8 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative group">
                            <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                            <img
                                src="https://media.istockphoto.com/id/1943281621/photo/professional-plumber-taking-adjustable-wrench-from-tool-bag-indoors-closeup.jpg?s=612x612&w=0&k=20&c=dJE172R6CVz3ZSwcIbaNWWaqslvarEPHjHqcH1fk18g= "
                                alt="LocalFix Professional"
                                className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>

                        {/* Sub-image / Video Area */}
                        <div
                            className="absolute -bottom-10 -right-10 w-2/3 rounded-3xl overflow-hidden shadow-2xl border-8 border-white z-20 group cursor-pointer"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <video
                                ref={videoRef}
                                className={`w-full h-[250px] object-cover bg-slate-900 transition-all duration-500 ${isPlaying ? 'scale-105' : 'scale-100'}`}
                                loop
                                muted
                                playsInline
                            >
                                <source src={Intro} type="video/mp4" />
                            </video>
                            <div className={`absolute inset-0 bg-slate-900/40 flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                    <Play className="fill-blue-600 text-blue-600 ml-1" size={28} />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Content */}
                    <div className="space-y-10 order-1 lg:order-2">
                        <motion.div variants={itemVariants} className="flex items-center gap-4">
                            <div className="w-12 h-[3px] bg-blue-600 rounded-full" />
                            <span className="text-sm font-black uppercase tracking-[0.2em] text-blue-600">The LocalFix Standard</span>
                        </motion.div>

                        <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tighter text-slate-900">
                            Elite Experts Behind <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Your Home Solutions.</span>
                        </motion.h2>

                        <motion.p variants={itemVariants} className="text-slate-500 text-lg leading-relaxed font-medium max-w-xl">
                            We aren't just an app. We are a managed network of master technicians dedicated to elevating your home maintenance experience. No waiting. No hidden fees. Just perfection.
                        </motion.p>

                        {/* Feature Grid */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 pt-4">
                            {[
                                "Master Plumbers",
                                "Licensed Electricians",
                                "Custom Carpentry",
                                "Rigorous Background Checks",
                                "24/7 Emergency Teams",
                                "Ironclad Guarantee"
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-4 group">
                                    <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 group-hover:bg-blue-50 transition-colors">
                                        <CheckCircle className="text-blue-600 fill-blue-100" size={20} />
                                    </div>
                                    <span className="font-bold text-sm text-slate-700">{item}</span>
                                </div>
                            ))}
                        </motion.div>

                        {/* <motion.div variants={itemVariants} className="pt-6">
                            <button className="bg-slate-900 flex items-center gap-4 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 text-white font-black py-4 px-8 rounded-2xl text-sm uppercase tracking-widest group">
                                Standard Excellence
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div> */}
                    </div>
                </div>

                {/* Bottom Stats Section */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-40 max-w-5xl mx-auto"
                >
                    {[
                        { value: "15K+", label: "Projects Completed" },
                        { value: "4.9/5", label: "Average Rating" },
                        { value: "30 Min", label: "Guaranteed Response" }
                    ].map((stat, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 text-center transform transition-transform hover:-translate-y-2 duration-300">
                            <h3 className="text-5xl font-black text-slate-900 mb-2">{stat.value}</h3>
                            <p className="text-blue-600 font-black uppercase text-[10px] tracking-[0.2em]">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
};