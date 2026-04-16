import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Settings, 
    Save, 
    IndianRupee, 
    Percent, 
    ShieldCheck, 
    Zap,
    Loader2,
    Database,
    CreditCard
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        platformFee: 50,
        feeType: 'fixed',
        razorpayEnabled: true
    });

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/api/admin/settings`, { withCredentials: true });
            if (res.data.data) {
                setFormData({
                    platformFee: res.data.data.platformFee,
                    feeType: res.data.data.feeType,
                    razorpayEnabled: res.data.data.razorpayEnabled
                });
            }
        } catch (err) {
            toast.error("Failed to load settings");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.put(`${apiUrl}/api/admin/settings`, formData, { withCredentials: true });
            toast.success("Platform settings updated!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-12 flex justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto pb-20">
            <div className="mb-12">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">
                    <Database size={14} className="fill-blue-600" /> System Control
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    Platform <span className="text-blue-600">Settings</span>
                </h1>
                <p className="text-slate-500 font-medium mt-2">Manage global configurations, fees, and payment rules.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Payment Breakdown Settings */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-lg">Platform Fee Configuration</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Payment Breakdown & Earnings</p>
                        </div>
                    </div>
                    
                    <div className="p-10 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Fee Type</label>
                                <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, feeType: 'fixed'})}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black transition-all ${formData.feeType === 'fixed' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <IndianRupee size={16} /> Fixed
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setFormData({...formData, feeType: 'percentage'})}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black transition-all ${formData.feeType === 'percentage' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        <Percent size={16} /> Percentage
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    {formData.feeType === 'fixed' ? 'Fixed Fee Amount (₹)' : 'Fee Percentage (%)'}
                                </label>
                                <div className="relative">
                                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">
                                        {formData.feeType === 'fixed' ? <IndianRupee size={20} /> : <Percent size={20} />}
                                    </div>
                                    <input 
                                        type="number"
                                        className="w-full pl-14 pr-6 py-4.5 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all text-xl"
                                        value={formData.platformFee}
                                        onChange={(e) => setFormData({...formData, platformFee: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-4">
                            <Zap className="text-blue-600 shrink-0 mt-1" size={20} />
                            <p className="text-sm text-blue-800 font-medium leading-relaxed">
                                This fee will be added to every booking total. For example, if a service costs <span className="font-bold text-blue-900">₹500</span> and your platform fee is <span className="font-bold text-blue-900">{formData.feeType === 'fixed' ? `₹${formData.platformFee}` : `${formData.platformFee}%`}</span>, the customer will be charged <span className="font-bold text-blue-900">₹{formData.feeType === 'fixed' ? 500 + Number(formData.platformFee) : Math.round(500 * (1 + formData.platformFee/100))}</span>.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Additional Settings */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 flex items-center justify-between">
                    <div>
                        <h4 className="font-black text-slate-900">Online Payments (Razorpay)</h4>
                        <p className="text-slate-500 text-sm font-medium mt-1">Enable or disable digital transactions globally.</p>
                    </div>
                    <button 
                        type="button"
                        onClick={() => setFormData({...formData, razorpayEnabled: !formData.razorpayEnabled})}
                        className={`w-16 h-8 rounded-full transition-all relative p-1 ${formData.razorpayEnabled ? 'bg-green-500' : 'bg-slate-300'}`}
                    >
                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all transform ${formData.razorpayEnabled ? 'translate-x-8' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className="flex items-center justify-end pt-4 gap-4">
                    <button 
                        type="submit" 
                        disabled={saving}
                        className="px-12 py-5 bg-slate-900 text-white font-black text-lg rounded-[1.5rem] hover:bg-blue-600 disabled:bg-slate-300 transition-all shadow-xl shadow-slate-200 flex items-center gap-3"
                    >
                        {saving ? <Loader2 className="animate-spin" /> : <><Save size={20} /> Save Changes</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminSettings;
