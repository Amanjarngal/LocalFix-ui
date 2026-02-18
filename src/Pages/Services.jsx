import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Wrench, ArrowRight, CheckCircle2, AlertCircle,
    X, Phone, Calendar, Hammer, ShoppingCart,
    Plus, Minus, ChevronRight, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [problems, setProblems] = useState([]);
    const [loadingProblems, setLoadingProblems] = useState(false);

    // Cart State
    const [cart, setCart] = useState(null); // Changed to null initial to differentiate loading
    const { user } = useAuth(); // Need user for cart operations

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
        if (user) fetchCart();
    }, [user]);

    const fetchCart = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/cart/${user._id}`);
            setCart(res.data.cart);
        } catch (error) {
            console.error("Failed to fetch cart");
        }
    };

    const fetchProblems = async (serviceId) => {
        setLoadingProblems(true);
        try {
            const res = await axios.get(`${apiUrl}/api/problems/service/${serviceId}`);
            setProblems(res.data.data);
        } catch (error) {
            console.error("Failed to load problems");
        } finally {
            setLoadingProblems(false);
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
                serviceName: selectedService.name
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

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Header Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <span className="text-blue-600 font-bold tracking-widest text-xs uppercase bg-blue-50 px-3 py-1 rounded-full">Professional Solutions</span>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 tracking-tight">
                        Expert <span className="text-blue-600">Repair</span> Services
                    </h1>
                    <p className="text-slate-500 mt-4 max-w-2xl text-lg">
                        Select a category to view upfront pricing and book certified technicians in minutes.
                    </p>
                </div>
            </div>

            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-72 bg-white rounded-3xl border border-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div
                                key={service._id}
                                onClick={() => { setSelectedService(service); fetchProblems(service._id); }}
                                className="group relative bg-white rounded-[2rem] p-8 border border-slate-200 hover:border-blue-400 transition-all duration-500 cursor-pointer hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]"
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                                        <Wrench className="w-8 h-8" />
                                    </div>
                                    <div className="flex items-center gap-1 text-amber-500 font-bold text-sm bg-amber-50 px-3 py-1 rounded-full">
                                        <Star className="w-3 h-3 fill-current" /> 4.8
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {service.name}
                                </h3>
                                <p className="text-slate-500 mb-8 line-clamp-2 text-sm leading-relaxed">
                                    {service.description}
                                </p>

                                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Explore Options</span>
                                    <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Cart Indicator */}
            {cartItemCount > 0 && (
                <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-md">
                    <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between border border-white/10 backdrop-blur-md bg-opacity-95">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">{cartItemCount} Items Selected</p>
                                <p className="text-xs text-slate-400">Total: ₹{totalAmount}</p>
                            </div>
                        </div>
                        <Link to="/cart" className="bg-white text-slate-900 px-6 py-2 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors">
                            View Cart
                        </Link>
                    </div>
                </div>
            )}

            {/* Service Details Modal */}
            {selectedService && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 md:p-6">
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setSelectedService(null)} />

                    <div className="relative bg-white w-full max-w-4xl h-full md:h-auto md:max-h-[85vh] md:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-300">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 md:px-10 border-b border-slate-100">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">{selectedService.name}</h2>
                                <p className="text-sm text-slate-500">Professional Repair Catalog</p>
                            </div>
                            <button onClick={() => setSelectedService(null)} className="p-3 bg-slate-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-10">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                {/* Left Side: Info */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                                        <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5" /> Why Choose Us?
                                        </h4>
                                        <ul className="text-sm text-blue-700 space-y-3 font-medium">
                                            <li>• 90-Day Warranty</li>
                                            <li>• Genuine Spare Parts</li>
                                            <li>• Certified Professionals</li>
                                        </ul>
                                    </div>
                                    <div className="p-6 rounded-3xl border border-slate-100 bg-slate-50">
                                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Need Help?</p>
                                        <p className="text-sm text-slate-600 mb-4">Unsure about the issue? Book a diagnostic visit.</p>
                                        <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                                            <Phone className="w-4 h-4" /> Expert Call
                                        </button>
                                    </div>
                                </div>

                                {/* Right Side: Problems/Add to Cart */}
                                <div className="lg:col-span-2">
                                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Repair Services</h4>

                                    {loadingProblems ? (
                                        <div className="space-y-4">
                                            {[1, 2, 3].map(n => <div key={n} className="h-20 bg-slate-50 rounded-2xl animate-pulse" />)}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {problems.map((prob) => {
                                                const isInCart = cart && cart.items.find(i => i.problemId && i.problemId._id === prob._id);
                                                return (
                                                    <div key={prob._id} className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${isInCart ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-300'}`}>
                                                        <div className="flex-1 pr-4">
                                                            <div className="font-bold text-slate-900 text-lg">{prob.title}</div>
                                                            <div className="text-sm text-slate-500 mt-1 line-clamp-1">{prob.description}</div>
                                                            <div className="mt-2 text-blue-600 font-black">₹{prob.price}</div>
                                                        </div>

                                                        {isInCart ? (
                                                            <button
                                                                onClick={() => removeFromCart(prob._id)}
                                                                className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200"
                                                            >
                                                                <CheckCircle2 className="w-5 h-5" />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => addToCart(prob)}
                                                                className="bg-white border-2 border-slate-100 p-3 rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all group"
                                                            >
                                                                <Plus className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;