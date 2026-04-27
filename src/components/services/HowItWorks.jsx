import React from 'react';
import { motion } from 'framer-motion';
import { Search, UserCheck, CalendarCheck, ThumbsUp, ArrowRight } from 'lucide-react';

const steps = [
    {
        number: "01",
        icon: Search,
        title: "Choose a Service",
        description: "Browse our wide range of professional home services and select the one that fits your needs.",
        color: "from-blue-500 to-blue-600",
        bgLight: "bg-blue-50",
        textColor: "text-blue-600",
        borderColor: "border-blue-200",
    },
    {
        number: "02",
        icon: UserCheck,
        title: "Pick an Expert",
        description: "View verified professionals, check their ratings, reviews, and pricing — then select your preferred expert.",
        color: "from-violet-500 to-purple-600",
        bgLight: "bg-violet-50",
        textColor: "text-violet-600",
        borderColor: "border-violet-200",
    },
    {
        number: "03",
        icon: CalendarCheck,
        title: "Book & Schedule",
        description: "Pick a convenient date and time, add to cart, and confirm your booking in just a few clicks.",
        color: "from-amber-500 to-orange-500",
        bgLight: "bg-amber-50",
        textColor: "text-amber-600",
        borderColor: "border-amber-200",
    },
    {
        number: "04",
        icon: ThumbsUp,
        title: "Get It Done",
        description: "Your expert arrives on time, completes the job to perfection, and you pay securely — satisfaction guaranteed.",
        color: "from-emerald-500 to-green-600",
        bgLight: "bg-emerald-50",
        textColor: "text-emerald-600",
        borderColor: "border-emerald-200",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
};

const HowItWorks = () => {
    return (
        <section className="relative py-24 bg-white overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-50/60 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16 max-w-2xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-blue-600 text-xs font-bold uppercase tracking-[0.15em]">Simple Process</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Works</span>
                    </h2>
                    <p className="text-slate-500 text-lg font-medium leading-relaxed">
                        Get your home fixed in four simple steps — it's fast, transparent, and hassle-free.
                    </p>
                </motion.div>

                {/* Steps Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="group relative"
                        >
                            {/* Connector Line (between cards, desktop only) */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-16 -right-3 w-6 z-20">
                                    <ArrowRight className="w-5 h-5 text-slate-300" />
                                </div>
                            )}

                            <div className={`relative h-full bg-white rounded-3xl p-7 border ${step.borderColor} hover:shadow-xl transition-all duration-500 group-hover:-translate-y-1`}>
                                {/* Step Number */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                        <step.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <span className="text-5xl font-black text-slate-100 group-hover:text-slate-200 transition-colors select-none">
                                        {step.number}
                                    </span>
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {step.title}
                                </h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                    {step.description}
                                </p>

                                {/* Bottom accent line */}
                                <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${step.color} rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default HowItWorks;
