import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Wrench, ArrowRight, ChevronRight, Star,
    Sparkles, ShieldCheck, Zap, Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await axios.get(`${apiUrl}/api/services`);
                setServices(res.data.data);
            } catch (error) {
                console.error("Failed to load services");
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [apiUrl]);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            {/* Premium Hero Section for Categories */}
            <div className="bg-white border-b border-slate-100 overflow-hidden relative">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50" />
                <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
                    <div className="flex items-center gap-2 text-blue-600 font-black text-xs uppercase tracking-[0.2em] mb-4">
                        <Sparkles size={16} /> Over 50+ Services Available
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
                        What do you need <br />
                        <span className="text-blue-600">help with today?</span>
                    </h1>
                    <p className="text-slate-500 mt-8 max-w-2xl text-xl font-medium leading-relaxed">
                        Select a category to find top-rated professionals near you. We ensure reliable, background-checked experts for all your home needs.
                    </p>

                    <div className="mt-12 flex flex-wrap gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center border border-green-100">
                                <ShieldCheck size={20} />
                            </div>
                            <span className="text-sm font-black text-slate-700 uppercase tracking-wider">Verified Pros</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center border border-amber-100">
                                <Zap size={20} />
                            </div>
                            <span className="text-sm font-black text-slate-700 uppercase tracking-wider">Instant Booking</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-2xl font-black text-slate-900">Explore All <span className="text-blue-600">Categories</span></h2>
                    <div className="h-px flex-1 mx-8 bg-slate-100" />
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-80 bg-white rounded-[3rem] border border-slate-100 animate-pulse shadow-sm" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {services.map((service) => (
                            <div
                                key={service._id}
                                onClick={() => navigate(`/services/${service._id}`)}
                                className="group relative bg-white rounded-[3rem] p-10 border border-slate-100 hover:border-blue-500 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-blue-200/20 active:scale-[0.98]"
                            >
                                <div className="flex justify-between items-start mb-10">
                                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm border border-slate-100">
                                        <Wrench className="w-10 h-10" />
                                    </div>
                                    <div className="flex items-center gap-1.5 text-amber-500 font-black text-xs bg-amber-50 px-4 py-2 rounded-full border border-amber-100">
                                        <Star className="w-3.5 h-3.5 fill-current" /> 4.9
                                    </div>
                                </div>

                                <h3 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                                    {service.name}
                                </h3>
                                <p className="text-slate-500 mb-10 line-clamp-2 text-base font-medium leading-relaxed group-hover:text-slate-600 transition-colors">
                                    {service.description}
                                </p>

                                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-blue-500 transition-colors">Find Experts</span>
                                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center group-hover:bg-blue-600 group-hover:translate-x-2 transition-all duration-300 shadow-xl">
                                        <ChevronRight className="w-6 h-6" />
                                    </div>
                                </div>

                                {/* Hover Glow */}
                                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 rounded-[3rem] transition-colors pointer-events-none" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Trust Section */}
            <div className="bg-slate-900 text-white py-24 mb-20 overflow-hidden relative">
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <Heart className="mx-auto text-blue-500 mb-8 w-12 h-12" />
                    <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">Join millions who trust LocalFix for their home repairs.</h2>
                    <p className="text-slate-400 text-lg mb-12 font-medium">From leaky faucets to full home renovations, we've got the experts you need to get the job done right.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10">
                            <p className="text-3xl font-black text-blue-400">5k+</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Verified Experts</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-8 py-4 rounded-3xl border border-white/10">
                            <p className="text-3xl font-black text-green-400">100k+</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-white/40">Happy Customers</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;


