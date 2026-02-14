import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hammer, Mail, Lock, Eye, EyeOff, ArrowRight, Chrome, Facebook } from 'lucide-react';

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Logging in with:', formData);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            {/* Background Decorative Elements */}
            {/* <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-3xl" />
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-3xl" />
            </div> */}

            <div className="w-full max-w-[440px] relative z-10">
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-200 mb-4">
                        <Hammer className="text-white h-8 w-8" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">
                        Welcome <span className="text-blue-600">Back</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Log in to manage your local fixes</p>
                </div>

                {/* Card */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-slate-200/60 border border-white">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input 
                                    type="email" 
                                    placeholder="name@example.com"
                                    className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all font-medium text-slate-900"
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-bold text-slate-700">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-blue-600 hover:text-blue-700">
                                    Forgot?
                                </Link>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••"
                                    className="w-full bg-slate-100/50 border border-slate-200 rounded-2xl py-4 pl-12 pr-12 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 transition-all font-medium text-slate-900"
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-base shadow-lg shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group mt-2">
                            Sign In
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Logins */}
                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-700 text-sm">
                            <Chrome className="h-5 w-5" />
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-700 text-sm">
                            <Facebook className="h-5 w-5" />
                            Facebook
                        </button>
                    </div>
                </div>

                {/* Footer Link */}
                <p className="text-center mt-8 text-slate-500 font-medium">
                    Don't have an account? {' '}
                    <Link to="/register" className="text-blue-600 font-bold hover:underline">
                        Create one for free
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;