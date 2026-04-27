import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Wrench, Star, Heart, ArrowRight, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchServices = async () => {
            const cached = sessionStorage.getItem('cachedServices');
            if (cached) {
                setServices(JSON.parse(cached));
                setLoading(false);
            }
            try {
                const res = await axios.get(`${apiUrl}/api/services`);
                setServices(res.data.data);
                sessionStorage.setItem('cachedServices', JSON.stringify(res.data.data));
            } catch (error) {
                console.error("Failed to load services");
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [apiUrl]);

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Services Grid */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                            Explore All <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Categories</span>
                        </h2>
                        <p className="text-slate-500 mt-2 text-sm font-medium">
                            {services.length} professional services available
                        </p>
                    </div>
                    {/* Search Bar */}
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div key={n} className="h-[380px] bg-slate-100 rounded-3xl border border-slate-200 animate-pulse" />
                        ))}
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                            <Search className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">No services found</h3>
                        <p className="text-slate-500 text-sm">Try adjusting your search query</p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredServices.map((service) => (
                            <motion.div
                                variants={itemVariants}
                                key={service._id}
                                onClick={() => navigate(`/services/${service._id}`)}
                                className="group relative bg-white rounded-3xl border border-slate-100 hover:border-blue-200 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-[0_20px_60px_-15px_rgba(37,99,235,0.15)] overflow-hidden"
                            >
                                {/* Service Image */}
                                <div className="relative h-48 overflow-hidden">
                                    {service.image ? (
                                        <>
                                            <img
                                                src={service.image}
                                                alt={service.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                            {/* Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                                        </>
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 flex items-center justify-center">
                                            <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center text-blue-500 border border-slate-200 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                                <Wrench className="w-10 h-10" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Rating Badge */}
                                    <div className="absolute top-4 right-4 flex items-center gap-1.5 text-amber-500 font-black text-xs bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-amber-200 shadow-sm">
                                        <Star className="w-3.5 h-3.5 fill-current" /> 4.9
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6 pt-4">
                                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors leading-tight">
                                        {service.name}
                                    </h3>
                                    <p className="text-slate-500 mb-6 line-clamp-2 text-sm font-medium leading-relaxed group-hover:text-slate-600 transition-colors">
                                        {service.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.15em] group-hover:text-blue-600 transition-colors">
                                            Find Experts
                                        </span>
                                        <div className="w-10 h-10 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:-rotate-45 transition-all duration-300 border border-slate-200 group-hover:border-transparent">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Bottom Trust Section */}
            <div className="bg-gradient-to-b from-slate-50 to-white border-t border-slate-100 py-24 overflow-hidden relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-96 bg-blue-100/50 rounded-full blur-[120px] pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    >
                        <Heart className="mx-auto text-blue-500 mb-8 w-14 h-14" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight tracking-tight"
                    >
                        Join millions who trust LocalFix <br className="hidden md:block" /> for their home repairs.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-slate-500 text-lg mb-12 font-medium max-w-2xl mx-auto"
                    >
                        From leaky faucets to full home renovations, we've got the elite experts you need to get the job done efficiently and correctly.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-6 justify-center"
                    >
                        <div className="bg-white px-10 py-6 rounded-3xl border border-slate-200 hover:border-blue-300 transition-colors shadow-lg">
                            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 mb-1">5k+</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Verified Experts</p>
                        </div>
                        <div className="bg-white px-10 py-6 rounded-3xl border border-slate-200 hover:border-emerald-300 transition-colors shadow-lg">
                            <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-400 mb-1">100k+</p>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Happy Customers</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Services;
