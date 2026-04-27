import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const ServiceHero = () => {
    const slides = [
        {
            image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=2070",
            title: "Electrical Expert"
        },
        {
            image: "https://images.unsplash.com/photo-1581578731548-c64695cc6954?auto=format&fit=crop&q=80&w=2070",
            title: "Professional Cleaning"
        },
        {
            image: "https://images.unsplash.com/photo-1505798577917-a65157d3320a?auto=format&fit=crop&q=80&w=2070",
            title: "Master Plumbing"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="relative h-[95vh] min-h-[750px] w-full overflow-hidden bg-[#0A0F1C]">
            {/* Background Slider */}
            <div className="absolute inset-0 z-0">
                <Swiper
                    modules={[Autoplay, EffectFade]}
                    effect="fade"
                    autoplay={{ delay: 6000, disableOnInteraction: false }}
                    loop={true}
                    className="h-full w-full"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative h-full w-full">
                                <motion.img
                                    initial={{ scale: 1.05 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 10, ease: "linear" }}
                                    key={`img-${index}`}
                                    src={slide.image}
                                    alt={slide.title}
                                    className="h-full w-full object-cover"
                                />
                                {/* Sophisticated Dark Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0F1C] via-[#0A0F1C]/80 to-[#0A0F1C]/20" />
                                <div className="absolute inset-0 bg-black/30" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="max-w-3xl"
                >
                    {/* Badge */}
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-md shadow-[0_0_20px_rgba(59,130,246,0.15)] mb-8">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-300 text-sm font-bold uppercase tracking-[0.15em]">Elite Home Services</span>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight mb-8">
                        Elevate <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-200 to-white">
                            Your Space
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-lg md:text-2xl text-slate-300 mb-12 leading-relaxed max-w-2xl font-light">
                        Transform your home with elite vetted professionals. <br className="hidden md:block" />
                        <span className="font-medium text-slate-200">Excellence delivered to your doorstep.</span>
                    </motion.p>

                    {/* CTAs */}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-5">
                        <Link
                            to="/book"
                            className="group relative w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600" />
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            <span className="relative z-10 text-lg">Book Service</span>
                            <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
                        </Link>

                        <Link
                            to="/contact"
                            className="group w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-lg text-white font-bold rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 text-lg hover:border-white/30"
                        >
                            <span>Explore Plans</span>
                        </Link>
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div variants={itemVariants} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { label: "Verified Pros", icon: ShieldCheck },
                            { label: "4.9/5 Rating", icon: Star },
                            { label: "On-Time", icon: Clock },
                            { label: "Insured Work", icon: CheckCircle },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 group cursor-default">
                                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">{item.label}</span>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent z-10 pointer-events-none" />
        </div>
    );
};

export default ServiceHero;