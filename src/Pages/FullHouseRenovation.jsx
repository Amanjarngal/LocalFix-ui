import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Hammer, 
  Paintbrush, 
  Lightbulb, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Home, 
  Layers, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  DollarSign,
  ChevronRight,
  Zap,
  Building2,
  HardHat,
  Gem
} from 'lucide-react';

const FullHouseRenovation = () => {
  const steps = [
    {
      icon: <Sparkles className="text-blue-600" />,
      title: "Define Vision",
      desc: "Share your structural goals and design preferences with our AI vetting system."
    },
    {
      icon: <Layers className="text-blue-600" />,
      title: "Receive Bids",
      desc: "Top-tier architectural firms review your scope and provide technical proposals."
    },
    {
      icon: <ShieldCheck className="text-blue-600" />,
      title: "Hire Experts",
      desc: "Compare quotes, verify certifications, and hire the perfect partner for your project."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      
      {/* Light Hero Section */}
      <section className="relative pt-32 pb-24 px-6 md:px-12 overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] -ml-64 -mb-64 opacity-60" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 text-center lg:text-left">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-8 border border-blue-100 shadow-sm"
              >
                <Zap size={14} fill="currentColor" /> Premium Architectural Services
              </motion.div>
              <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
                Transform <br /> Your <span className="text-blue-600">Sanctuary.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 font-medium mb-12 max-w-2xl leading-relaxed">
                Experience full-house renovation with a modern, transparent approach. 
                Connect with elite professionals and manage your home's transformation effortlessly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/full-house-renovation/request"
                  className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 active:scale-95"
                >
                  Post Your Project <ArrowRight size={20} />
                </Link>
                <Link
                  to="/full-house-renovation/my-requests"
                  className="px-10 py-5 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
                >
                  View Dashboard
                </Link>
              </div>
            </div>

            <div className="flex-1 relative">
                <div className="relative z-10 bg-white rounded-[3rem] p-4 shadow-2xl border border-slate-100">
                    <img 
                        src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1000" 
                        alt="Modern Interior" 
                        className="rounded-[2.5rem] w-full h-[500px] object-cover shadow-inner"
                    />
                    <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 max-w-[200px]">
                        <div className="flex items-center gap-3 mb-2">
                            <Gem className="text-blue-600" size={20} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Elite Rank</span>
                        </div>
                        <p className="text-sm font-black text-slate-900">Verified Professional Network</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Evolved Renovation.</h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">Our platform streamlines complex home transformations through technology and vetted partnerships.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100 hover:border-blue-200 transition-all"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-slate-100">
                  {step.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{step.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-32 px-6 md:px-12 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="flex-1">
              <h2 className="text-4xl md:text-6xl font-black mb-10 leading-tight tracking-tighter">
                Why Professionals <br /> Choose <span className="text-blue-500">LocalFix.</span>
              </h2>
              <div className="space-y-8">
                {[
                  { icon: <Building2 />, title: "Full Structural Support", desc: "From foundation to finishing, we cover every architectural discipline." },
                  { icon: <ShieldCheck />, title: "Certified Contractors", desc: "Every professional on our board is thoroughly vetted for quality and trust." },
                  { icon: <Clock />, title: "Real-Time Tracking", desc: "Monitor your project's progress and milestones from a centralized dashboard." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                      <p className="text-slate-400 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-6">
                <div className="space-y-6 pt-12">
                    <div className="aspect-square bg-blue-600 rounded-[2rem] p-8 flex flex-col justify-end">
                        <p className="text-4xl font-black mb-2">98%</p>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-80">Satisfaction Rate</p>
                    </div>
                    <div className="aspect-[4/5] bg-slate-800 rounded-[2rem] overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale opacity-50" />
                    </div>
                </div>
                <div className="space-y-6">
                    <div className="aspect-[4/5] bg-slate-800 rounded-[2rem] overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale opacity-50" />
                    </div>
                    <div className="aspect-square bg-white text-slate-900 rounded-[2rem] p-8 flex flex-col justify-end">
                        <p className="text-4xl font-black mb-2">500+</p>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-50 text-slate-400">Experts Joined</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-32 px-6 md:px-12 bg-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 tracking-tighter">Ready to Build?</h2>
          <p className="text-slate-500 text-lg mb-12 font-medium leading-relaxed">
            Take the first step towards your dream home today. Join hundreds of satisfied homeowners who transformed their living spaces with LocalFix.
          </p>
          <Link
            to="/full-house-renovation/request"
            className="inline-flex px-12 py-6 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 transition-all shadow-2xl shadow-blue-600/30 items-center justify-center gap-4 group"
          >
            Start Your Transformation <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FullHouseRenovation;
