import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
    MapPin,
    Star,
    Award,
    Briefcase,
    ShieldCheck,
    ArrowRight,
    Search,
    Loader2,
    SearchX,
    ChevronRight,
    Zap,
    Building2,
    HardHat
} from 'lucide-react';

const FullHouseRenovation = () => {
    const navigate = useNavigate();
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pincode, setPincode] = useState('');
    const [searching, setSearching] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchProviders = async (searchPin = '') => {
        setSearching(true);
        try {
            let url = `${apiUrl}/api/renovations/providers`;
            if (searchPin) url += `?pincode=${searchPin}`;
            
            const res = await axios.get(url);
            setProviders(res.data.data);
            
            if (searchPin && res.data.data.length > 0) {
                toast.success(`Found experts in ${searchPin}`);
            } else if (searchPin) {
                toast.error(`No experts found in ${searchPin}`);
            }
        } catch (err) {
            console.error("Failed to load providers", err);
            toast.error("Error connecting to server");
        } finally {
            setSearching(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, [apiUrl]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (pincode.length === 6) {
            fetchProviders(pincode);
        } else {
            toast.error("Please enter a valid 6-digit pincode");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Premium Hero Section */}
            <div className="relative bg-[#0A0F1C] pt-24 pb-32 overflow-hidden border-b border-slate-200">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1600" 
                        alt="bg" 
                        className="w-full h-full object-cover opacity-20 object-center" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] to-transparent" />
                    <div className="absolute top-0 right-0 -mr-32 -mt-32 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs uppercase tracking-widest mb-6 backdrop-blur-sm"
                            >
                                <Zap size={14} fill="currentColor" /> Premium Architectural Services
                            </motion.div>
                            <h1 className="text-5xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-8">
                                Transform <br /> Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Sanctuary.</span>
                            </h1>
                            <p className="text-lg text-slate-300 font-medium max-w-xl mx-auto lg:mx-0 mb-10">
                                Connect with top-tier renovation experts. Enter your location to find verified professionals near you.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <Link
                                    to="/full-house-renovation/request"
                                    className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center gap-3"
                                >
                                    Post Your Project <ArrowRight size={20} />
                                </Link>
                                <Link
                                    to="/full-house-renovation/my-requests"
                                    className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm"
                                >
                                    My Dashboard
                                </Link>
                            </div>
                        </div>

                        {/* Search Card */}
                        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl relative">
                            <h3 className="text-2xl font-black text-slate-900 mb-2">Find Experts</h3>
                            <p className="text-sm text-slate-500 font-medium mb-8">Check availability of top firms in your area</p>
                            
                            <form onSubmit={handleSearch} className="space-y-6">
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-blue-500">
                                        <MapPin size={22} />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit Pincode"
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-slate-900 text-lg focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                                        value={pincode}
                                        maxLength={6}
                                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={searching || pincode.length !== 6}
                                    className="w-full bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white font-black py-5 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-3 text-lg"
                                >
                                    {searching ? <Loader2 className="animate-spin" size={24} /> : "Search Pros"}
                                    {!searching && <Search size={20} />}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Providers List Grid */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Verified Professionals</h2>
                        <p className="text-slate-500 font-medium">Top-rated firms for full house transformations.</p>
                    </div>
                    {providers.length > 0 && (
                        <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm border border-blue-100">
                            {providers.length} Firms Found
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="h-96 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse shadow-sm" />
                        ))}
                    </div>
                ) : providers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-xl">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-8 border border-slate-100">
                            <SearchX size={48} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900">No Pros Found</h2>
                        <p className="text-slate-500 mt-3 max-w-sm text-center font-medium">
                            We haven't found any renovation experts in <span className="text-blue-600 font-bold">"{pincode || 'your area'}"</span>. 
                            Try another pincode or check all experts.
                        </p>
                        <button
                            onClick={() => { setPincode(''); fetchProviders(); }}
                            className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                        >
                            Show All Experts
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {providers.map(provider => (
                            <div key={provider._id} className="group bg-white rounded-[3rem] overflow-hidden border border-slate-100 hover:border-blue-200 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-blue-600/10 flex flex-col">
                                {/* Photo Area */}
                                <div className="relative h-64 bg-slate-100 overflow-hidden">
                                    {provider.profilePhoto ? (
                                        <img
                                            src={provider.profilePhoto.startsWith('http') ? provider.profilePhoto : `${apiUrl}/${provider.profilePhoto}`}
                                            alt={provider.businessName}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-200 bg-gradient-to-br from-slate-50 to-slate-100">
                                            <Building2 size={80} />
                                        </div>
                                    )}
                                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl border border-white/50">
                                        <Star size={18} className="fill-amber-500 text-amber-500" />
                                        <span className="text-lg font-black text-slate-900">{(provider.rating || 4.5).toFixed(1)}</span>
                                    </div>
                                    <div className="absolute bottom-6 left-6 flex gap-2">
                                        <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                                            Verified Pro
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-10 flex-1 flex flex-col">
                                    <h2 className="text-2xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                        {provider.businessName}
                                    </h2>
                                    <div className="flex items-center gap-2 mb-6">
                                        <MapPin size={16} className="text-slate-400" />
                                        <p className="text-sm text-slate-500 font-bold">{provider.city}, {provider.area}</p>
                                    </div>

                                    <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-8 leading-relaxed">
                                        {provider.description || "Expert architectural firm specializing in complete home transformations and structural excellence."}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-10">
                                        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter mb-1">Experience</p>
                                            <p className="text-lg font-black text-slate-900">{provider.experience}+ Years</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter mb-1">Projects</p>
                                            <p className="text-lg font-black text-slate-900">150+ Done</p>
                                        </div>
                                    </div>

                                    <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                <Briefcase size={20} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Consultation</p>
                                                <p className="text-sm font-bold text-slate-900">Available</p>
                                            </div>
                                        </div>
                                        <Link
                                            to="/full-house-renovation/request"
                                            className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all active:scale-95"
                                        >
                                            Hire Firm
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FullHouseRenovation;
