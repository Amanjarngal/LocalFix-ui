import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
    {
        name: "Priya Sharma",
        location: "Mumbai",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        text: "The electrician arrived exactly on time and fixed the massive wiring issue we had within an hour. Extremely professional and courteous service. LocalFix is my permanent go-to now!",
        service: "Electrical Repair"
    },
    {
        name: "Rahul Verma",
        location: "Delhi",
        image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        text: "I booked a full house deep cleaning service before Diwali. The team was phenomenal. They didn't miss a single corner and left the house literally sparkling. 10/10 recommended.",
        service: "Deep Cleaning"
    },
    {
        name: "Sneha Patel",
        location: "Ahmedabad",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        text: "Our AC broke down during peak summer. LocalFix assigned a technician within 20 mins. He diagnosed the gas leak, fixed it transparently without any hidden charges. Superb platform.",
        service: "Appliance Repair"
    },
    {
        name: "Amit Desai",
        location: "Pune",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        rating: 4,
        text: "Used their carpentry services to fix a broken wardrobe and assemble an IKEA bed. The carpenter was highly skilled and wrapped up the job perfectly. Pricing is very fair compared to local markets.",
        service: "Carpentry"
    },
    {
        name: "Neha Gupta",
        location: "Bangalore",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        rating: 5,
        text: "The sheer professionalism of the plumbers on this app is mind-blowing. No bargaining, no nonsense. They came, fixed the massive kitchen sink leak, cleaned up the mess, and left.",
        service: "Plumbing"
    }
];

export const Testimonials = () => {
    const scrollRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: scrollRef,
        offset: ["start end", "end start"]
    });

    const translateY = useTransform(scrollYProgress, [0, 1], [50, -50]);

    return (
        <section ref={scrollRef} className="py-24 md:py-32 bg-slate-50 relative overflow-hidden">
            {/* Ambient Background Blur */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent pointer-events-none z-0"></div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                {/* Header Sequence */}
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100"
                    >
                        <Star size={14} className="text-blue-600 fill-blue-600" />
                        <span className="text-xs font-black uppercase tracking-widest text-blue-600">Verified Reviews</span>
                    </motion.div>
                    
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter"
                    >
                        Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Thousands.</span>
                    </motion.h2>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-slate-500 font-medium"
                    >
                        Don't just take our word for it. Here is what homeowners across the country have to say about the elite LocalFix experience.
                    </motion.p>
                </div>

                {/* Horizontal Scrolling Reviews container */}
                <motion.div 
                    style={{ y: translateY }}
                    className="relative w-full"
                >
                    {/* Fade Edges for slick UI */}
                    <div className="absolute top-0 left-0 bottom-0 w-12 md:w-32 bg-gradient-to-r from-slate-50 to-transparent z-20 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 bottom-0 w-12 md:w-32 bg-gradient-to-l from-slate-50 to-transparent z-20 pointer-events-none"></div>

                    <div className="flex overflow-hidden pb-12 pt-4 w-full">
                        <div className="flex w-max gap-6 md:gap-8 animate-marquee">
                            {/* Duplicate the array to create a seamless infinite loop */}
                            {[...reviews, ...reviews].map((review, idx) => (
                                <div 
                                    key={idx}
                                    className="shrink-0 w-[85vw] md:w-[450px] bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.08)] border border-slate-100 flex flex-col justify-between relative group hover:-translate-y-2 transition-transform duration-500"
                                >
                                    <Quote size={80} className="absolute top-6 right-6 text-slate-50 opacity-50 group-hover:text-blue-50 transition-colors duration-500 pointer-events-none" />
                                    
                                    <div>
                                        <div className="flex gap-1 mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    size={18} 
                                                    className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} 
                                                />
                                            ))}
                                        </div>
                                        <p className="text-slate-600 text-lg leading-relaxed font-medium mb-8 relative z-10">
                                            "{review.text}"
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-end relative z-10">
                                        <div className="flex gap-4 items-center mt-auto">
                                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 shadow-sm shrink-0">
                                                <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-lg">{review.name}</h4>
                                                <p className="text-slate-500 text-sm font-medium">{review.location}</p>
                                            </div>
                                        </div>
                                        <div className="hidden md:block">
                                            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 py-1.5 px-3 rounded-lg">
                                                {review.service}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Custom CSS for seamless infinite marquee and pausing on hover */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(calc(-50% - 1.5rem + 1px)); } 
                }
                .animate-marquee {
                    animation: marquee 35s linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}} />
        </section>
    );
};
