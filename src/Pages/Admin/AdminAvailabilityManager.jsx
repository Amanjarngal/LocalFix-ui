import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Wifi, 
  WifiOff, 
  Search, 
  Filter, 
  RefreshCw, 
  MapPin, 
  User, 
  Settings, 
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminAvailabilityManager = () => {
    const [providers, setProviders] = useState([]);
    const [stats, setStats] = useState({ total: 0, online: 0, offline: 0, pending: 0 });
    const [loading, setLoading] = useState(true);
    const [filterPincode, setFilterPincode] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, online, offline
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedProvider, setSelectedProvider] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchAvailability = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:7000';
            const response = await axios.get(`${apiUrl}/api/providers/admin/availability-monitor`, {
                params: {
                    pincode: filterPincode,
                    status: filterStatus
                },
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setProviders(response.data.data);
                setStats(response.data.stats);
            }
        } catch (err) {
            console.error('Fetch availability error:', err);
            toast.error('Failed to sync live status');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAvailability();
        // Setup a refresh interval every 30 seconds for "live" feel
        const interval = setInterval(fetchAvailability, 30000);
        return () => clearInterval(interval);
    }, [filterPincode, filterStatus]);

    const filteredProviders = providers.filter(p => 
        p.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenReport = (provider) => {
        setSelectedProvider(provider);
        setShowModal(true);
    };

    return (
        <div className="min-h-screen pb-12">
            {/* Header / Stats Section */}
            <div className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Availability Manager</h1>
                        <p className="text-slate-500 font-medium">Real-time status monitor for all approved service partners</p>
                    </div>
                    <button 
                        onClick={fetchAvailability}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        Sync Live Status
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Live Now" 
                        value={stats.online} 
                        icon={Wifi} 
                        color="green" 
                        trend="Real-time Tracking"
                    />
                    <StatCard 
                        title="Offline" 
                        value={stats.offline} 
                        icon={WifiOff} 
                        color="slate" 
                        trend="Currently Idle"
                    />
                    <StatCard 
                        title="Platform Utilization" 
                        value={`${stats.total > 0 ? Math.round((stats.online / stats.total) * 100) : 0}%`}
                        icon={Activity} 
                        color="blue" 
                        trend="Active vs Total"
                    />
                    <StatCard 
                        title="New Enrolls" 
                        value={stats.pending} 
                        icon={AlertCircle} 
                        color="orange" 
                        trend="Awaiting Review"
                    />
                </div>
            </div>

            {/* Filter Controls */}
            <div className="bg-white p-6 rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 mb-8">
                <div className="flex flex-col lg:flex-row items-center gap-6">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by Provider or Business Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-800"
                        />
                    </div>
                    
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-48">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Pincode..."
                                value={filterPincode}
                                onChange={(e) => setFilterPincode(e.target.value)}
                                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-medium text-slate-800"
                            />
                        </div>

                        <div className="flex bg-slate-100 p-1 rounded-2xl h-[58px]">
                            {['all', 'online', 'offline'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    className={`px-6 rounded-xl font-bold text-sm capitalize transition-all ${filterStatus === s ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Providers Grid */}
            {loading && providers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-slate-400">
                    <RefreshCw className="animate-spin mb-4" size={40} />
                    <p className="font-bold">Syncing live server status...</p>
                </div>
            ) : filteredProviders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] shadow-sm border border-slate-100">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <Search size={40} />
                    </div>
                    <p className="font-black text-slate-800 text-xl mb-1">No matches found</p>
                    <p className="text-slate-500 font-medium">Try adjusting your pincode or status filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProviders.map((provider) => (
                        <ProviderStatusCard 
                            key={provider._id} 
                            provider={provider} 
                            onOpenReport={handleOpenReport}
                        />
                    ))}
                </div>
            )}

            {/* Report Modal */}
            {showModal && selectedProvider && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-slate-900 p-8 text-white relative">
                            <div className="absolute top-0 right-0 p-8">
                                <button onClick={() => setShowModal(false)} className="hover:rotate-90 transition-transform">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex items-center gap-6">
                                <img 
                                    src={selectedProvider.profilePhoto || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"} 
                                    className="w-20 h-20 rounded-[24px] object-cover border-4 border-white/10"
                                />
                                <div>
                                    <h2 className="text-2xl font-black italic">{selectedProvider.ownerName}</h2>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">{selectedProvider.businessName}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className={`w-2 h-2 rounded-full ${selectedProvider.isAvailable ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'bg-slate-500'}`} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                            {selectedProvider.isAvailable ? 'Live Monitoring Active' : 'Currently Offline'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left: Service Areas */}
                                <div>
                                    <div className="flex items-center gap-2 mb-6 text-blue-600">
                                        <MapPin size={20} />
                                        <h3 className="font-black uppercase tracking-widest text-xs">Serving Pincodes</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Main Pincode */}
                                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl text-center">
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Base</p>
                                            <p className="text-sm font-black text-blue-600">{selectedProvider.pincode}</p>
                                        </div>

                                        {/* Extended Pincodes */}
                                        {selectedProvider.serviceAreas?.length > 0 ? (
                                            selectedProvider.serviceAreas.map((sa, i) => (
                                                <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center group hover:border-slate-300 transition-all">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Serving</p>
                                                    <p className="text-sm font-black text-slate-800">{sa.pincode}</p>
                                                </div>
                                            ))
                                        ) : null}
                                    </div>
                                </div>

                                {/* Right: Stats & Info */}
                                <div className="space-y-6">
                                    {/* Quick Contacts */}
                                    <div className="p-6 bg-slate-900 rounded-[32px] text-white">
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Channel Details</h4>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/5 rounded-xl">
                                                    <Activity size={16} className="text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Phone Line</p>
                                                    <p className="text-sm font-bold text-slate-100 tracking-wider">+{selectedProvider.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/5 rounded-xl">
                                                    <Settings size={16} className="text-blue-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Category</p>
                                                    <p className="text-sm font-bold text-slate-100 uppercase italic tracking-tighter">
                                                        {selectedProvider.primaryService?.name || 'Home Expert'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Logs */}
                                    <div className="p-6 border border-slate-100 rounded-[32px]">
                                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                                            <Clock size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Network Activity</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-400">Last Synced</span>
                                                <span className="font-black text-slate-800">{new Date(selectedProvider.updatedAt).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="font-bold text-slate-400">Join Date</span>
                                                <span className="font-black text-slate-800">{new Date(selectedProvider.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-slate-50 flex gap-4">
                            <button 
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-slate-100 transition-all"
                            >
                                Dismiss Report
                            </button>
                            <button className="flex-1 py-4 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-xl shadow-blue-200 flex items-center justify-center gap-2">
                                Manage Credentials <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
    const colors = {
        green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        slate: 'bg-slate-50 text-slate-600 border-slate-100',
        orange: 'bg-orange-50 text-orange-600 border-orange-100',
    };

    return (
        <div className={`p-6 rounded-[32px] border bg-white shadow-xl shadow-slate-100/50 flex flex-col items-center text-center transition-all hover:-translate-y-1`}>
            <div className={`p-4 rounded-2xl mb-4 ${colors[color]}`}>
                <Icon size={28} />
            </div>
            <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">{title}</h3>
            <div className="text-3xl font-black text-slate-800 mb-2">{value}</div>
            <div className="text-[10px] font-bold text-slate-400">{trend}</div>
        </div>
    );
};

const ProviderStatusCard = ({ provider, onOpenReport }) => {
    return (
        <div className="group bg-white rounded-[32px] p-6 border border-slate-100 shadow-xl shadow-slate-100/40 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-300 relative overflow-hidden">
            {/* Status Pulse Background */}
            {provider.isAvailable && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse opacity-50" />
            )}

            <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="relative">
                    <img 
                        src={provider.profilePhoto || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"} 
                        alt={provider.ownerName}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-50 p-1"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${provider.isAvailable ? 'bg-emerald-500' : 'bg-slate-300 animate-none'}`}>
                        {provider.isAvailable && <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75" />}
                    </div>
                </div>
                
                <div className={`px-4 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center gap-2 ${provider.isAvailable ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                    {provider.isAvailable ? 'Live Now' : 'Offline'}
                </div>
            </div>

            <div className="mb-6 relative z-10">
                <h3 className="font-black text-slate-800 truncate mb-1 group-hover:text-blue-600 transition-colors uppercase italic tracking-tighter">
                    {provider.ownerName}
                </h3>
                <p className="text-xs font-bold text-slate-400 truncate">{provider.businessName}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 relative z-10 text-[10px]">
                <div className="bg-slate-50 p-3 rounded-2xl flex flex-col text-center">
                    <span className="text-slate-400 font-bold mb-1 uppercase tracking-widest">Rating</span>
                    <span className="font-black text-slate-800 text-sm">{(provider.rating || 0).toFixed(1)} ⭐</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-2xl flex flex-col text-center">
                    <span className="text-slate-400 font-bold mb-1 uppercase tracking-widest">Category</span>
                    <span className="font-black text-slate-800 text-sm truncate uppercase tracking-tighter">
                        {provider.primaryService?.name || 'General'}
                    </span>
                </div>
            </div>

            <div className="space-y-2 border-t border-slate-50 pt-5 relative z-10 text-center">
                <div className="flex items-center justify-center gap-3 text-slate-500">
                    <MapPin size={14} className="text-slate-300" />
                    <span className="text-xs font-black text-slate-900 tracking-widest">{provider.pincode}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                    <Settings size={14} className="text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {provider.serviceAreas?.length || 0} Area Coverages
                    </span>
                </div>
                <div className="flex items-center gap-3 text-slate-500 opacity-60">
                    <Clock size={14} className="text-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Last Active: {new Date(provider.updatedAt).toLocaleTimeString()}
                    </span>
                </div>
            </div>
            
            <button 
                onClick={() => onOpenReport(provider)}
                className="w-full mt-6 py-3 bg-white border border-slate-100 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
                Open Full Report <ArrowRight size={14} />
            </button>
        </div>
    );
};

export default AdminAvailabilityManager;
