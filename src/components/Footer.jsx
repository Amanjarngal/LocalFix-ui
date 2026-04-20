import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, Wrench } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-slate-800 pb-12">
                    
                    {/* Brand Column */}
                    <div className="lg:col-span-1 border-r-0 lg:border-r border-slate-800 pr-0 lg:pr-8">
                        <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black text-white mb-6">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Wrench size={18} className="text-white" />
                            </div>
                            LocalFix
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                            India's most trusted network for elite home repairs, maintenance, and full house renovations. Delivering guaranteed perfection, unconditionally.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                                <Twitter size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-gradient-to-tr hover:from-orange-500 hover:via-pink-500 hover:to-purple-500 hover:text-white transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-700 hover:text-white transition-all duration-300">
                                <Linkedin size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Services Links */}
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Our Services</h3>
                        <ul className="space-y-4 text-slate-400 text-sm font-medium">
                            <li><Link to="/services" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform duration-300">Electrical Repairs</Link></li>
                            <li><Link to="/services" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform duration-300">Plumbing Solutions</Link></li>
                            <li><Link to="/services" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform duration-300">Carpentry & Woodwork</Link></li>
                            <li><Link to="/services" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform duration-300">AC & Appliance Repair</Link></li>
                            <li><Link to="/renovation" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform duration-300 text-cyan-400">Full House Renovation</Link></li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Company</h3>
                        <ul className="space-y-4 text-slate-400 text-sm font-medium">
                            <li><Link to="/about" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform duration-300">About Us</Link></li>
                            <li><Link to="/provider-enrollment" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform duration-300">Become a Partner</Link></li>
                            <li><Link to="/careers" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform duration-300">Careers</Link></li>
                            <li><Link to="/terms" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform duration-300">Terms & Conditions</Link></li>
                            <li><Link to="/privacy" className="hover:text-blue-400 hover:translate-x-1 inline-block transition-transform duration-300">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Real Contact Data */}
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Contact Us</h3>
                        <ul className="space-y-5 text-slate-400 text-sm font-medium">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5" />
                                <span>12th Floor, DLF Cyber Hub,<br/>Gurugram, Haryana 122002</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-blue-500 shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-blue-500 shrink-0" />
                                <span>support@localfix.in</span>
                            </li>
                        </ul>
                        
                        <div className="mt-8 p-4 bg-slate-900 rounded-xl border border-slate-800">
                            <p className="text-xs text-slate-400 font-bold mb-1">24/7 Emergency Support</p>
                            <p className="text-sm text-cyan-400 font-black">1800-419-LOCAL</p>
                        </div>
                    </div>

                </div>
                
                {/* Copyright Block */}
                <div className="mt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-xs font-semibold">
                    <p>&copy; {new Date().getFullYear()} LocalFix Technologies. All rights reserved.</p>
                    <div className="mt-4 md:mt-0 flex gap-4">
                        <Link to="/sitemap" className="hover:text-white transition-colors">Sitemap</Link>
                        <Link to="/security" className="hover:text-white transition-colors">Security</Link>
                        <Link to="/legal" className="hover:text-white transition-colors">Legal</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
