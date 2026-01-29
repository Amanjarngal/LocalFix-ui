import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, Hammer, ChevronRight, ArrowRight } from 'lucide-react';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        // Prevent body scroll when mobile menu is open
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';

        return () => window.removeEventListener('scroll', handleScroll);
    }, [isOpen]);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    return (
        <>
            <nav
                className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled || isOpen
                    ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/50 py-3'
                    : 'bg-transparent py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2.5 group relative z-[110]">
                            <div className="p-2 bg-blue-600 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-blue-200">
                                <Hammer className="text-white h-5 w-5 md:h-6 md:w-6" />
                            </div>
                            <span className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
                                Local<span className="text-blue-600">Fixer</span>
                            </span>
                        </Link>

                        {/* Desktop Links */}
                        <div className="hidden md:flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50 backdrop-blur-sm">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${location.pathname === link.path
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-slate-600 hover:text-blue-600'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            <button className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                                <User className="h-5 w-5" />
                            </button>
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-100 flex items-center gap-2 group">
                                Join as Pro
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Mobile Toggle */}
                        <button
                            className="md:hidden relative z-[110] p-2.5 rounded-xl bg-slate-900 text-white shadow-lg active:scale-90 transition-all"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* FULL SCREEN MOBILE MENU */}
            <div
                className={`fixed inset-0 z-[90] md:hidden transition-all duration-500 ease-in-out ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'
                    }`}
            >
                {/* Backdrop Overlay */}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsOpen(false)} />

                {/* Menu Content */}
                <div
                    className={`absolute right-0 top-0 h-full w-[80%] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="flex flex-col h-full p-8 pt-24">
                        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Navigation</p>

                        <div className="flex flex-col gap-2">
                            {navLinks.map((link, i) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`flex items-center justify-between group p-4 rounded-2xl transition-all ${location.pathname === link.path
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'hover:bg-slate-50 text-slate-800'
                                        }`}
                                    style={{ transitionDelay: `${i * 50}ms` }}
                                >
                                    <span className="text-xl font-bold">{link.name}</span>
                                    <ChevronRight className={`h-5 w-5 transition-transform ${location.pathname === link.path ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                                </Link>
                            ))}
                        </div>

                        <div className="mt-auto space-y-4">
                            <div className="p-6 bg-slate-900 rounded-3xl text-white">
                                <h4 className="font-bold mb-1">Expert?</h4>
                                <p className="text-slate-400 text-xs mb-4">Start earning by providing services in your local area.</p>
                                <button className="w-full py-3 bg-blue-600 rounded-xl font-bold text-sm">
                                    Register as Provider
                                </button>
                            </div>
                            <button className="w-full py-4 flex items-center justify-center gap-2 font-bold text-slate-700 border border-slate-200 rounded-2xl">
                                <User className="h-5 w-5" />
                                Account Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;