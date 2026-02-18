import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchCart = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`${apiUrl}/api/cart/${user._id}`);
            setCart(res.data.cart);
        } catch (error) {
            console.error("Failed to load cart");
            toast.error("Could not load cart");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, [user]);

    const handleRemoveItem = async (problemId) => {
        try {
            const res = await axios.post(`${apiUrl}/api/cart/remove`, {
                userId: user._id,
                itemId: problemId
            });
            setCart(res.data.cart);
            toast.success("Item removed");
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-slate-50">
                <ShoppingCart className="w-16 h-16 text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Please Login</h2>
                <p className="text-slate-500 mb-6">You need to be logged in to view your cart.</p>
                <Link to="/login" className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                    Login Now
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex justify-center items-center bg-slate-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center bg-slate-50">
                <ShoppingCart className="w-16 h-16 text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
                <p className="text-slate-500 mb-6">Looks like you haven't added any services yet.</p>
                <Link to="/services" className="px-6 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition">
                    Browse Services
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <ShoppingCart className="w-8 h-8 text-blue-600" />
                    Your Cart
                </h1>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item) => (
                            <div key={item._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                                        {item.serviceName || "Service"}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800">
                                        {item.problemId ? item.problemId.title : "Service Unavailable"}
                                    </h3>
                                    <p className="text-slate-500 text-sm mt-1">
                                        {item.problemId && item.problemId.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="text-xl font-black text-slate-900">
                                        ₹{item.problemId ? item.problemId.price : 0}
                                    </div>
                                    <button
                                        onClick={() => handleRemoveItem(item.problemId._id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove Item"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
                            <h2 className="text-lg font-bold text-slate-900 mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-slate-500">
                                    <span>Subtotal</span>
                                    <span>₹{cart.totalPrice}</span>
                                </div>
                                <div className="flex justify-between text-slate-500">
                                    <span>Taxes (Included)</span>
                                    <span>₹0</span>
                                </div>
                                <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between font-black text-lg text-slate-900">
                                    <span>Total</span>
                                    <span>₹{cart.totalPrice}</span>
                                </div>
                            </div>

                            <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                Proceed to Checkout
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <p className="text-xs text-slate-400 text-center mt-4">
                                Secure Checkout with LocalFix Guarantee
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
