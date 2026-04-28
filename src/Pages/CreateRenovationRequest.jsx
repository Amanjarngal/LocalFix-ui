import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    ArrowLeft, 
    Home, 
    Building2, 
    Hammer, 
    MapPin, 
    DollarSign, 
    Calendar, 
    CheckCircle2, 
    Sparkles, 
    ShieldCheck, 
    ArrowRight,
    Plus,
    X,
    Clock,
    Briefcase,
    Zap,
    ChevronRight,
    Phone,
    User
} from 'lucide-react';
import { createRenovationRequest } from '../services/renovationService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CreateRenovationRequest = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [createdId, setCreatedId] = useState(null);

    const [formData, setFormData] = useState({
        projectTitle: '',
        description: '',
        propertyType: 'Residential',
        renovationType: 'Full-House',
        estimatedBudget: '',
        estimatedDuration: '3-6 Months',
        preferredStartDate: '',
        address: '',
        city: '',
        area: '',
        pincode: '',
        contactName: '',
        contactNumber: '',
        projectScope: []
    });

    const scopeOptions = [
        'Structural', 'Electrical', 'Plumbing', 'Flooring', 
        'Painting', 'Kitchen', 'Bathroom', 'Roofing', 
        'HVAC', 'Interior Design', 'Landscaping'
    ];

    const handleScopeToggle = (option) => {
        setFormData(prev => ({
            ...prev,
            projectScope: prev.projectScope.includes(option)
                ? prev.projectScope.filter(item => item !== option)
                : [...prev.projectScope, option]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.projectScope.length === 0) {
            toast.error('Select at least one work discipline');
            return;
        }

        try {
            setLoading(true);
            const response = await createRenovationRequest(formData);
            setCreatedId(response._id);
            setSuccess(true);
            toast.success('Project published successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to publish project');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full text-center"
                >
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-10 border border-blue-100 shadow-xl shadow-blue-600/10">
                        <CheckCircle2 size={48} className="text-blue-600" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
                        Project <span className="text-blue-600">Published.</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed">
                        Your renovation request is now live. Certified experts will begin reviewing your scope and submitting quotes shortly.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to={`/full-house-renovation/request/${createdId}`}
                            className="px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
                        >
                            View Project Detail <ChevronRight size={20} />
                        </Link>
                        <Link
                            to="/full-house-renovation/my-requests"
                            className="px-10 py-5 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pb-24">
            {/* Simple Light Header */}
            <div className="bg-slate-50 border-b border-slate-100 pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] opacity-60 -mr-32 -mt-32" />
                <div className="max-w-6xl mx-auto relative z-10">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold mb-10 transition-colors">
                        <ArrowLeft size={18} /> Back
                    </button>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-3xl">
                            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-100">
                                <Zap size={14} /> Design Your Transformation
                            </motion.div>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
                                Create <span className="text-blue-600">Request.</span>
                            </h1>
                            <p className="text-lg text-slate-500 font-medium leading-relaxed">
                                Share your vision with our certified architectural network.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    
                    {/* Form Left Side */}
                    <div className="lg:col-span-2 space-y-16">
                        {/* Section: Project Vision */}
                        <section>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                    <Sparkles size={20} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Project Vision</h2>
                            </div>

                            <div className="space-y-8">
                                <div className="group">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Project Title *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.projectTitle}
                                        onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                                        placeholder="e.g. Modern Minimalist Penthouse Renovation"
                                        className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300"
                                    />
                                </div>

                                <div className="group">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Project Brief *</label>
                                    <textarea
                                        required
                                        rows="4"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe your design goals, material preferences, and structural requirements..."
                                        className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Property Configuration</label>
                                        <select
                                            value={formData.propertyType}
                                            onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                                            className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-900 transition-all appearance-none"
                                        >
                                            <option>Residential</option>
                                            <option>Commercial</option>
                                            <option>Villa/Bungalow</option>
                                            <option>Apartment</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Estimated Investment *</label>
                                        <div className="relative">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">₹</div>
                                            <input
                                                required
                                                type="number"
                                                value={formData.estimatedBudget}
                                                onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                                                placeholder="Amount"
                                                className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section: Disciplines */}
                        <section>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                                    <Hammer size={20} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Work Disciplines</h2>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {scopeOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => handleScopeToggle(option)}
                                        className={`px-6 py-3 rounded-xl font-bold text-sm transition-all border-2 ${
                                            formData.projectScope.includes(option)
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/10'
                                                : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Section: Logistics */}
                        <section>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
                                    <MapPin size={20} />
                                </div>
                                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Site Logistics</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Site Address *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        placeholder="Full address of the renovation site"
                                        className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-900 transition-all placeholder:text-slate-300"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">City *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-900 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Locality / Area *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.area}
                                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                        className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-900 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Pincode *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.pincode}
                                        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                        className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-bold text-slate-900 transition-all"
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Sidebar: Details & Submit */}
                    <aside className="space-y-8">
                        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 sticky top-32">
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                    <Clock size={20} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 uppercase">Schedule</h3>
                            </div>
                            
                            <div className="space-y-8 mb-10">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Ideal Start Date *</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.preferredStartDate}
                                        onChange={(e) => setFormData({ ...formData, preferredStartDate: e.target.value })}
                                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-900 focus:border-blue-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Project Duration</label>
                                    <select
                                        value={formData.estimatedDuration}
                                        onChange={(e) => setFormData({ ...formData, estimatedDuration: e.target.value })}
                                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-900 focus:border-blue-500 transition-all appearance-none"
                                    >
                                        <option>1-3 Months</option>
                                        <option>3-6 Months</option>
                                        <option>6-12 Months</option>
                                        <option>12+ Months</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-6 pt-10 border-t border-slate-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                                        <User size={20} />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase">Contact</h3>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Contact Person *</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.contactName}
                                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Mobile Number *</label>
                                    <input
                                        required
                                        type="tel"
                                        value={formData.contactNumber}
                                        onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                        className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl outline-none font-bold text-slate-900"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-10 py-6 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 group active:scale-95"
                            >
                                {loading ? 'Publishing...' : (
                                    <>Publish Project <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                                )}
                            </button>
                        </div>
                    </aside>
                </form>
            </div>
        </div>
    );
};

export default CreateRenovationRequest;
