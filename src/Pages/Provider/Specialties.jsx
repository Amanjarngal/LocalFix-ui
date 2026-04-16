import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Plus, 
    Trash2, 
    Edit2, 
    ShieldCheck, 
    Zap, 
    AlertCircle, 
    Loader2, 
    Briefcase,
    ChevronDown,
    IndianRupee,
    CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProviderSpecialties = () => {
    const [specialties, setSpecialties] = useState([]);
    const [categories, setCategories] = useState([]);
    const [templates, setTemplates] = useState([]); // Predefined problems from Admin
    const [loading, setLoading] = useState(true);
    const [loadingTemplates, setLoadingTemplates] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isCustom, setIsCustom] = useState(false); // Toggle between template and custom

    // Modal/Form State
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        serviceId: '',
        title: '',
        description: '',
        price: ''
    });

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchData();
    }, []);

    // When category changes, fetch templates (global problems) for that category
    useEffect(() => {
        if (formData.serviceId && !editingId) {
            fetchTemplates(formData.serviceId);
        } else {
            setTemplates([]);
        }
    }, [formData.serviceId, editingId]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [specRes, catRes] = await Promise.all([
                axios.get(`${apiUrl}/api/problems/my`, { withCredentials: true }),
                axios.get(`${apiUrl}/api/services`)
            ]);
            setSpecialties(specRes.data.data);
            setCategories(catRes.data.data);
        } catch (err) {
            toast.error("Failed to load specialties");
        } finally {
            setLoading(false);
        }
    };

    const fetchTemplates = async (srvId) => {
        setLoadingTemplates(true);
        try {
            const res = await axios.get(`${apiUrl}/api/problems/service/${srvId}`);
            setTemplates(res.data.data);
        } catch (err) {
            console.error("Failed to load templates");
        } finally {
            setLoadingTemplates(false);
        }
    };

    const handleSelectTemplate = (templateId) => {
        if (templateId === 'custom') {
            setIsCustom(true);
            setFormData({ ...formData, title: '', description: '' });
            return;
        }
        const t = templates.find(temp => temp._id === templateId);
        if (t) {
            setIsCustom(false);
            setFormData({
                ...formData,
                title: t.title,
                description: t.description
            });
        }
    };

    const handleOpenModal = (spec = null) => {
        if (spec) {
            setEditingId(spec._id);
            setIsCustom(true); // Always treat edits as custom entry for flexibility
            setFormData({
                serviceId: spec.service?._id || '',
                title: spec.title,
                description: spec.description,
                price: spec.price
            });
        } else {
            setEditingId(null);
            setIsCustom(false);
            setFormData({ serviceId: '', title: '', description: '', price: '' });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingId) {
                await axios.put(`${apiUrl}/api/problems/my/${editingId}`, formData, { withCredentials: true });
                toast.success("Specialty updated!");
            } else {
                await axios.post(`${apiUrl}/api/problems/my`, formData, { withCredentials: true });
                toast.success("Specialty added!");
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this specialty?")) return;
        try {
            await axios.delete(`${apiUrl}/api/problems/my/${id}`, { withCredentials: true });
            toast.success("Deleted successfully");
            fetchData();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* Header Area */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-widest mb-1">
                            <Zap size={14} className="fill-orange-600" /> Service Catalog
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                            My <span className="text-orange-600">Specialties</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-2">Activate standard tasks or create your own custom services.</p>
                    </div>
                    <button 
                        onClick={() => handleOpenModal()}
                        className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-slate-200 active:scale-95"
                    >
                        <Plus size={20} /> Add New Specialty
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(n => (
                            <div key={n} className="h-64 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse" />
                        ))}
                    </div>
                ) : specialties.length === 0 ? (
                    <div className="bg-white rounded-[3rem] border border-slate-100 p-20 flex flex-col items-center text-center shadow-sm">
                        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-8 border border-slate-100">
                            <Briefcase size={44} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900">Your Catalog is Empty</h2>
                        <p className="text-slate-500 mt-3 max-w-sm text-lg font-medium">Add repair tasks you excel at to appear in customer searches.</p>
                        <button 
                            onClick={() => handleOpenModal()}
                            className="mt-10 px-8 py-3 bg-orange-600 text-white rounded-xl font-black hover:bg-orange-700 transition"
                        >
                            + Start Building Catalog
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {specialties.map((spec) => (
                            <div key={spec._id} className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-100/50 transition-all duration-500 relative flex flex-col">
                                <div className="absolute top-8 right-8 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => handleOpenModal(spec)}
                                        className="p-2.5 bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(spec._id)}
                                        className="p-2.5 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                <div className="mb-6">
                                    <span className="px-4 py-1.5 bg-slate-50 text-slate-500 text-[11px] font-black uppercase tracking-widest rounded-full border border-slate-100">
                                        {spec.service?.name}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-orange-600 transition-colors leading-tight">
                                    {spec.title}
                                </h3>
                                <p className="text-sm text-slate-500 font-medium line-clamp-3 leading-relaxed mb-10 flex-1">
                                    {spec.description || "No description provided."}
                                </p>

                                <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Your Price</p>
                                        <div className="flex items-center text-3xl font-black text-slate-900 tracking-tighter">
                                            <IndianRupee size={22} className="text-orange-600" /> {spec.price}
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center border border-green-100 shadow-sm">
                                        <CheckCircle2 size={24} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Premium Form Modal */}
            {showModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-12 duration-500 flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 leading-none">
                                    {editingId ? "Edit Specialty" : "Add Specialty"}
                                </h2>
                                <p className="text-sm text-slate-500 font-bold mt-2 uppercase tracking-widest">Provider Catalog</p>
                            </div>
                            <button onClick={() => setShowModal(false)} className="p-3 bg-slate-50 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-all group">
                                <Plus size={24} className="rotate-45 text-slate-400 group-hover:text-red-500 transition-colors" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto">
                            {/* Category Selection */}
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                    <Briefcase size={14} className="text-orange-500" /> 1. Select Service Category
                                </label>
                                <div className="relative">
                                    <select 
                                        required
                                        disabled={!!editingId}
                                        className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all appearance-none cursor-pointer disabled:bg-slate-100 disabled:text-slate-400"
                                        value={formData.serviceId}
                                        onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                                    >
                                        <option value="">Choose a category...</option>
                                        {categories.map(cat => (
                                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                                        ))}
                                    </select>
                                    {!editingId && <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />}
                                </div>
                            </div>

                            {/* Template Selection / Predefined Problems */}
                            {formData.serviceId && !editingId && (
                                <div className="space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                        <AlertCircle size={14} className="text-blue-500" /> 2. Pick a Pre-defined Task
                                    </label>
                                    <div className="relative">
                                        <select 
                                            className="w-full px-6 py-4.5 bg-blue-50/50 border border-blue-100 rounded-[1.25rem] font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                                            onChange={(e) => handleSelectTemplate(e.target.value)}
                                            defaultValue=""
                                        >
                                            <option value="">-- Choose from standard tasks --</option>
                                            {templates.map(temp => (
                                                <option key={temp._id} value={temp._id}>{temp.title}</option>
                                            ))}
                                            <option value="custom" className="text-orange-600 font-black">✨ Add Customized Specialty...</option>
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none" size={20} />
                                    </div>
                                    <p className="text-[10px] text-blue-500 font-bold ml-2 italic">Choosing a task will auto-fill the details below.</p>
                                </div>
                            )}

                            {/* Details (Title & Desc) */}
                            {(isCustom || editingId) && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Specialty Title</label>
                                        <input 
                                            required
                                            type="text" 
                                            placeholder="e.g. Master Wood Polishing"
                                            className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all"
                                            value={formData.title}
                                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Detailed Description</label>
                                        <textarea 
                                            rows="4"
                                            placeholder="What exactly will you do in this service?"
                                            className="w-full px-6 py-4.5 bg-slate-50 border border-slate-200 rounded-[1.25rem] font-medium text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all resize-none"
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Price (Always show if category selected) */}
                            {formData.serviceId && (
                                <div className="space-y-3 pt-4 border-t border-slate-100 animate-in fade-in duration-500">
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">3. Set Your Professional Price</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
                                        <input 
                                            required
                                            type="number" 
                                            placeholder="Enter amount in ₹"
                                            className="w-full pl-14 pr-6 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-2xl focus:outline-none focus:ring-8 focus:ring-orange-100 transition-all placeholder:text-slate-600"
                                            value={formData.price}
                                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                                        />
                                    </div>
                                </div>
                            )}

                            <button 
                                type="submit" 
                                disabled={saving || !formData.title}
                                className="w-full py-5.5 bg-orange-600 text-white font-black text-xl rounded-[2rem] hover:bg-orange-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-2xl shadow-orange-200 flex items-center justify-center gap-4 mt-4"
                            >
                                {saving ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={24} /> {editingId ? "Update specialty" : "Activate specialty"}</>}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProviderSpecialties;
