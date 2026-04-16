import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
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

    return (
        <div className="relative h-[90vh] min-h-[700px] w-full overflow-hidden bg-slate-900">
            {/* Background Slider */}
            <div className="absolute inset-0 z-0">
                <Swiper
                    modules={[Autoplay, EffectFade]}
                    effect="fade"
                    autoplay={{ delay: 5000, disableOnInteraction: false }}
                    loop={true}
                    className="h-full w-full"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative h-full w-full">
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    className="h-full w-full object-cover"
                                />
                                {/* Sophisticated Dark Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/40 to-transparent" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Content Layer */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
                <div className="max-w-3xl">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 backdrop-blur-md text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-left-4 duration-700">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>Premium Home Services</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 animate-in fade-in slide-in-from-left-6 duration-700 delay-100">
                        Modern Care for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                            Your Smart Home
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-xl animate-in fade-in slide-in-from-left-8 duration-700 delay-200">
                        Expert technicians and verified professionals delivered to your doorstep. Transparent pricing, guaranteed satisfaction.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-left-10 duration-700 delay-300">
                        <Link
                            to="/book"
                            className="group w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-2xl shadow-blue-600/30 hover:bg-blue-500 transition-all flex items-center justify-center gap-2 overflow-hidden relative"
                        >
                            <span className="relative z-10">Book a Service</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
                        </Link>

                        <Link
                            to="/contact"
                            className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-lg text-white font-bold rounded-2xl border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            Get a Quote
                        </Link>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                        {[
                            { label: "Verified Pros", icon: ShieldCheck },
                            { label: "4.9/5 Rating", icon: Star },
                            { label: "On-Time", icon: Clock },
                            { label: "Insured", icon: CheckCircle },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2.5">
                                <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                                    <item.icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-semibold text-slate-200">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F8FAFC] to-transparent z-10" />
        </div>
    );
};

export default ServiceHero;