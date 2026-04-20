import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
    MapPin,
    Star,
    Clock,
    Award,
    Search,
    ArrowRight,
    Filter,
    ShieldCheck,
    Briefcase,
    Loader2,
    SearchX
} from 'lucide-react';

const CategoryProviders = () => {
    const { id } = useParams();
    const [providers, setProviders] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [pincode, setPincode] = useState('');
    const [searching, setSearching] = useState(false);
    const [showReviewsModal, setShowReviewsModal] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [reviewedProvider, setReviewedProvider] = useState(null);

    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchReviews = async (provider) => {
        setReviewedProvider(provider);
        setShowReviewsModal(true);
        setLoadingReviews(true);
        try {
            const res = await axios.get(`${apiUrl}/api/providers/${provider._id}/reviews`);
            setReviews(res.data.data);
        } catch (err) {
            console.error("Failed to load reviews", err);
        } finally {
            setLoadingReviews(false);
        }
    };

    // Fetch initial providers and category info
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get Category Details
                const catRes = await axios.get(`${apiUrl}/api/services`);
                const foundCat = catRes.data.data.find(c => c._id === id);
                setCategory(foundCat);

                // Get Providers for this category
                const provRes = await axios.get(`${apiUrl}/api/providers/search?serviceId=${id}`);
                setProviders(provRes.data.data);
            } catch (err) {
                console.error("Failed to load providers", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, apiUrl]);

    const handleSearch = async () => {
        if (!pincode || pincode.length !== 6) return;
        setSearching(true);
        try {
            const res = await axios.get(`${apiUrl}/api/providers/search?serviceId=${id}&pincode=${pincode}`);
            setProviders(res.data.data);
        } catch (err) {
            console.error("Search failed", err);
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header / Search Section */}
            <div className="bg-white border-b border-slate-100 shadow-sm sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">
                            <Briefcase size={14} /> Available Experts
                        </div>
                        <h1 className="text-3xl font-black text-slate-900">
                            {category?.name || "Service"} <span className="text-blue-600">Experts</span>
                        </h1>
                        <p className="text-sm text-slate-500 font-medium">Top rated professionals in your vicinity</p>
                    </div>

                    <div className="relative flex-1 max-w-md w-full">
                        <div className="flex items-center bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                            <div className="pl-4 text-slate-400">
                                <MapPin size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Enter your 6-digit Pincode"
                                className="w-full bg-transparent px-4 py-3.5 font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
                                value={pincode}
                                maxLength={6}
                                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <button
                                onClick={handleSearch}
                                disabled={searching || pincode.length !== 6}
                                className="bg-blue-600 text-white px-6 py-3.5 font-black hover:bg-blue-700 transition flex items-center gap-2 disabled:bg-slate-300"
                            >
                                {searching ? <Loader2 className="animate-spin" size={20} /> : "Search"}
                            </button>
                        </div>
                        {pincode.length > 0 && pincode.length < 6 && (
                            <p className="absolute top-full left-0 mt-1 text-[10px] font-bold text-blue-500 animate-pulse">Enter 6 digits...</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Providers List Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(n => (
                            <div key={n} className="h-80 bg-white rounded-3xl border border-slate-100 animate-pulse shadow-sm" />
                        ))}
                    </div>
                ) : providers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6 border border-slate-100">
                            <SearchX size={48} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">No Experts Found</h2>
                        <p className="text-slate-500 mt-2 max-w-sm text-center font-medium">
                            We don't have any experts in <span className="text-blue-600 font-bold">"{pincode || 'this area'}"</span> yet. Try another pincode or check back later!
                        </p>
                        <button
                            onClick={() => { setPincode(''); fetchData(); }}
                            className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
                        >
                            Show All Experts
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...providers].sort((a, b) => {
                            const aAvail = a.isAvailable !== false;
                            const bAvail = b.isAvailable !== false;
                            if (aAvail === bAvail) return 0;
                            return aAvail ? -1 : 1;
                        }).map(provider => (
                            <div key={provider._id} className={`group rounded-[2.5rem] overflow-hidden border transition-all duration-500 flex flex-col h-full ${provider.isAvailable !== false ? 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-200/20' : 'bg-slate-50 border-slate-200 opacity-75 grayscale-[0.4]'}`}>
                                {/* Provider Banner/Photo Area */}
                                <div className="relative h-48 bg-slate-100 overflow-hidden">
                                    {provider.profilePhoto ? (
                                        <img
                                            src={provider.profilePhoto.startsWith('http') ? provider.profilePhoto : `${apiUrl}/${provider.profilePhoto}`}
                                            alt={provider.businessName}
                                            className={`w-full h-full object-cover transition-transform duration-700 ${provider.isAvailable !== false ? 'group-hover:scale-110' : ''}`}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-slate-100">
                                            <Briefcase size={64} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xl border border-white/50">
                                        <div className="flex items-center gap-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={`${i < Math.floor(provider.rating || 4)
                                                            ? 'fill-amber-500 text-amber-500'
                                                            : 'text-slate-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="ml-1 text-sm font-black text-slate-900">{(provider.rating || 4).toFixed(1)}</span>
                                        <button
                                            onClick={(e) => { e.preventDefault(); fetchReviews(provider); }}
                                            className="ml-2 pl-2 border-l border-slate-200 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-tight"
                                        >
                                            View Reviews
                                        </button>
                                    </div>
                                    {provider.emergencyAvailability && (
                                        <div className="absolute top-4 left-4 bg-amber-500 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl font-bold text-[10px] uppercase tracking-wider">
                                            <Clock className="w-3 h-3" /> Urgent Avail.
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h2 className={`text-xl font-black leading-tight transition-colors ${provider.isAvailable !== false ? 'text-slate-900 group-hover:text-blue-600' : 'text-slate-600'}`}>
                                                {provider.businessName}
                                            </h2>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                                                    {provider.ownerName}
                                                </p>
                                                {provider.isAvailable !== false ? (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                                        Online
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                                        Offline
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className={`p-2.5 rounded-xl ${provider.isAvailable !== false ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                            <ShieldCheck size={20} />
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6 font-medium">
                                        {provider.description || "Expert professional providing high-quality repair services with guaranteed customer satisfaction."}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter mb-1">Experience</p>
                                            <p className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                                                <Award size={14} className="text-blue-500" /> {provider.experience} Years
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter mb-1">Location</p>
                                            <p className="text-sm font-black text-slate-800 flex items-center gap-1.5 truncate">
                                                <MapPin size={14} className="text-orange-500" /> {provider.area}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"></div>
                                            ))}
                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] text-white font-black">
                                                +12
                                            </div>
                                        </div>
                                        {provider.isAvailable !== false ? (
                                            <Link
                                                to={`/services/${id}/pricing/${provider._id}`}
                                                className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-all group/btn"
                                            >
                                                Check Pricing <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                            </Link>
                                        ) : (
                                            <button
                                                disabled
                                                className="px-6 py-2.5 bg-slate-200 text-slate-500 cursor-not-allowed rounded-xl font-bold text-sm flex items-center gap-2"
                                            >
                                                Offline
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reviews Modal */}
            {showReviewsModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowReviewsModal(false)} />
                    <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300">
                        {/* Modal Header */}
                        <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">{reviewedProvider?.businessName}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <Star key={i} size={12} className={i <= Math.floor(reviewedProvider?.rating || 0) ? 'fill-amber-500 text-amber-500' : 'text-slate-300'} />
                                        ))}
                                    </div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{reviews.length} Verified Reviews</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowReviewsModal(false)}
                                className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-900"
                            >
                                <Plus className="w-6 h-6 rotate-45" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 overflow-y-auto max-h-[70vh]">
                            {loadingReviews ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Reviews...</p>
                                </div>
                            ) : reviews.length > 0 ? (
                                <div className="space-y-6">
                                    {reviews.map((rev) => (
                                        <div key={rev.id} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:border-blue-100 transition-colors">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 font-black shadow-sm border border-slate-100">
                                                        {rev.customer.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-900">{rev.customer}</h4>
                                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                                            {new Date(rev.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <Star key={i} size={14} className={i <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed font-medium bg-white/50 p-4 rounded-2xl italic border border-white/80">
                                                "{rev.review || "The expert did a fantastic job. Very professional and highly recommended for house services!"}"
                                            </p>
                                            <div className="mt-4 flex items-center justify-between">
                                                <span className="px-3 py-1 bg-white text-[10px] font-black text-blue-600 border border-slate-100 rounded-full uppercase tracking-wider">
                                                    {rev.type}: {rev.serviceName || 'Standard Service'}
                                                </span>
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-green-600">
                                                    <ShieldCheck size={12} /> Verified Service
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-slate-50 rounded-4xl border border-dashed border-slate-200">
                                    <Star size={48} className="mx-auto text-slate-200 mb-4" />
                                    <h3 className="text-lg font-bold text-slate-800">No reviews yet</h3>
                                    <p className="text-sm text-slate-500">This expert hasn't received any public reviews yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryProviders;
