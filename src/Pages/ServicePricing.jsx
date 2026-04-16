import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {
    Wrench, ArrowRight, CheckCircle2, AlertCircle,
    X, Phone, Calendar, Hammer, ShoppingCart,
    Plus, Minus, ChevronRight, Star, ArrowLeft,
    Sparkles, ShieldCheck, Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ServicePricing = () => {
    const { id, providerId } = useParams();
    const [category, setCategory] = useState(null);
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState(null);
    const [settings, setSettings] = useState({ platformFee: 50, feeType: 'fixed' });
    const { user } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get Category and Settings
                const [catRes, setRes] = await Promise.all([
                    axios.get(`${apiUrl}/api/services`),
                    axios.get(`${apiUrl}/api/admin/settings`)
                ]);
                
                const foundCat = catRes.data.data.find(c => c._id === id);
                setCategory(foundCat);
                if (setRes.data.data) setSettings(setRes.data.data);

                // Get Problems (Global + Provider Specific)
                const probRes = await axios.get(`${apiUrl}/api/problems/service/${id}?providerId=${providerId}`);
                setProblems(probRes.data.data);
            } catch (error) {
                console.error("Failed to load pricing data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        if (user) fetchCart();
    }, [id, providerId, user, apiUrl]);

    const fetchCart = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/cart/${user._id}`);
            setCart(res.data.cart);
        } catch (error) {
            console.error("Failed to fetch cart");
        }
    };

    const addToCart = async (problem) => {
        if (!user) {
            alert("Please login to add items to cart");
            return;
        }
        try {
            const res = await axios.post(`${apiUrl}/api/cart/add`, {
                userId: user._id,
                problemId: problem._id,
                serviceName: category.name
            });
            setCart(res.data.cart);
        } catch (error) {
            console.error("Failed to add to cart");
        }
    };

    const removeFromCart = async (problemId) => {
        if (!user) return;
        try {
            const res = await axios.post(`${apiUrl}/api/cart/remove`, {
                userId: user._id,
                itemId: problemId
            });
            setCart(res.data.cart);
        } catch (error) {
            console.error("Failed to remove from cart");
        }
    };

    const totalAmount = cart ? cart.totalPrice : 0;
    const cartItemCount = cart ? cart.items.length : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to={`/services/${id}`} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft className="w-6 h-6 text-slate-600" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900">{category?.name} Pricing</h1>
                            <p className="text-sm text-slate-500 font-medium">Transparent, upfront rates for all repairs</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Available Services</h2>
                        {problems.map((prob) => {
                            const isInCart = cart && cart.items.find(i => i.problemId && i.problemId._id === prob._id);
                            return (
                                <div key={prob._id} className={`flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all duration-300 bg-white ${isInCart ? 'border-blue-600 shadow-xl shadow-blue-100' : 'border-white hover:border-slate-200'}`}>
                                    <div className="flex-1 pr-6">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="font-black text-slate-900 text-xl">{prob.title}</div>
                                            {prob.provider && (
                                                <span className="px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-orange-200 flex items-center gap-1">
                                                    <Sparkles size={10} /> Specialty
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-slate-500 mt-2 leading-relaxed">{prob.description}</div>
                                        <div className="mt-4 text-blue-600 font-black text-lg">₹{prob.price}</div>
                                    </div>

                                    {isInCart ? (
                                        <button
                                            onClick={() => removeFromCart(prob._id)}
                                            className="bg-blue-600 text-white p-4 rounded-2xl shadow-xl shadow-blue-200 active:scale-90 transition-transform"
                                        >
                                            <CheckCircle2 className="w-6 h-6" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => addToCart(prob)}
                                            className="bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl hover:border-blue-600 hover:text-blue-600 hover:bg-white transition-all active:scale-95 group"
                                        >
                                            <Plus className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Side: Guarantees & Summary */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Summary Card */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-300">
                            <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                                <ShoppingCart className="text-blue-400" /> Booking Summary
                            </h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-slate-400 font-bold text-sm">
                                    <span>Items Selected</span>
                                    <span className="text-white">{cartItemCount}</span>
                                </div>
                                <div className="flex justify-between text-slate-400 font-bold text-sm">
                                    <span>Service Subtotal</span>
                                    <span className="text-white">₹{totalAmount}</span>
                                </div>
                                <div className="flex justify-between text-slate-400 font-bold text-sm">
                                    <span>Platform Fee</span>
                                    <span className="text-blue-400">+ ₹{
                                        settings.feeType === 'fixed' 
                                        ? settings.platformFee 
                                        : Math.round(totalAmount * (settings.platformFee / 100))
                                    }</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                    <span className="text-lg font-bold">Total Payable</span>
                                    <span className="text-3xl font-black text-blue-400">₹{
                                        totalAmount + (settings.feeType === 'fixed' 
                                        ? settings.platformFee 
                                        : Math.round(totalAmount * (settings.platformFee / 100)))
                                    }</span>
                                </div>
                            </div>
                            <Link
                                to="/cart"
                                className={`w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg ${cartItemCount > 0 ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}
                            >
                                Checkout Now <ArrowRight size={20} />
                            </Link>
                        </div>

                        {/* Guarantees */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 space-y-6">
                            <h4 className="font-black text-slate-900 border-b border-slate-50 pb-4">LocalFix Guarantee</h4>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                    <ShieldCheck size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">Service Warranty</p>
                                    <p className="text-xs text-slate-500 mt-1">90-day protection on all repairs.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                                    <Award size={20} />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">Certified Pros</p>
                                    <p className="text-xs text-slate-500 mt-1">Every technician is background checked.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServicePricing;
