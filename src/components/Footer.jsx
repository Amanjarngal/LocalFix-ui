import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-800 pb-12">
                    <div className="col-span-1 md:col-span-1">
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            LocalFixer
                        </span>
                        <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                            Your one-stop destination for all local home repair and maintenance services. Reliable, professional, and fast.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Services</h3>
                        <ul className="mt-4 space-y-2 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Electrical Works</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Plumbing</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Carpentry</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">AC & Appliance Repair</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Company</h3>
                        <ul className="mt-4 space-y-2 text-gray-400 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Contact</h3>
                        <ul className="mt-4 space-y-2 text-gray-400 text-sm">
                            <li>Email: support@localfixer.com</li>
                            <li>Phone: +1 (555) 000-0000</li>
                            <li>Available 24/7 for emergencies</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 flex justify-between items-center text-gray-400 text-xs">
                    <p>&copy; 2026 LocalFixer. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-white">Twitter</a>
                        <a href="#" className="hover:text-white">Facebook</a>
                        <a href="#" className="hover:text-white">Instagram</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
