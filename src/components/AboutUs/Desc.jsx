import React from 'react';
import { Search, ClipboardCheck, Wrench, ShieldCheck, ArrowRight, MousePointer2 } from 'lucide-react';

const AboutDescription = () => {
    const steps = [
      {
        icon: <Search className="h-6 w-6" />,
        title: "Search & Discover",
        desc: "Browse our centralized database of verified local professionals filtered by your specific needs.",
        color: "bg-blue-500"
      },
      {
        icon: <ClipboardCheck className="h-6 w-6" />,
        title: "Raise Request",
        desc: "Detail your repair needs—from plumbing to carpentry—and manage bookings through our interface.",
        color: "bg-slate-900"
      },
      {
        icon: <Wrench className="h-6 w-6" />,
        title: "Expert Repair",
        desc: "A skilled local pro is dispatched to your location, equipped with the right tools for the job.",
        color: "bg-blue-600"
      },
      {
        icon: <ShieldCheck className="h-6 w-6" />,
        title: "Quality Fixed",
        desc: "Every job is backed by our verification system, ensuring consistent quality and transparent pricing.",
        color: "bg-emerald-500"
      }
    ];

    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-20">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 mb-4">
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">How It Works</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            From Request to Result: <br />
                            <span className="text-blue-600">The LocalFix Flow.</span>
                        </h2>
                    </div>
                    <div className="pb-2">
                        <p className="text-slate-500 font-medium max-w-sm">
                            We’ve eliminated the friction of unverified sources by creating a structured, four-step digital journey.
                        </p>
                    </div>
                </div>

                {/* Process Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Connecting Line (Desktop Only) */}
                    <div className="hidden lg:block absolute top-1/4 left-0 w-full h-px bg-slate-200 -z-0" />
                    
                    {steps.map((step, index) => (
                        <div key={index} className="relative z-10 group">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-100 transition-all duration-500 h-full">
                                {/* Step Number & Icon */}
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`${step.color} h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform`}>
                                        {step.icon}
                                    </div>
                                    <span className="text-4xl font-black text-slate-100 group-hover:text-blue-50 transition-colors italic">
                                        0{index + 1}
                                    </span>
                                </div>

                                <h3 className="text-xl font-black text-slate-900 mb-3">{step.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                                    {step.desc}
                                </p>

                                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    Learn More <ArrowRight className="h-3 w-3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Technical Bottom Banner */}
                <div className="mt-20 p-8 bg-slate-900 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="h-12 w-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                            <MousePointer2 className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-white font-bold">Driven by Modern Infrastructure</p>
                            <p className="text-slate-400 text-xs">Auth Security • Database Management • Real-time Requests</p>
                        </div>
                    </div>
                    <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all flex items-center gap-2">
                        Get Your First Fix
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default AboutDescription;