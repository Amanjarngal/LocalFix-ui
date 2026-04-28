import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Users,
    Briefcase,
    Clock,
    TrendingUp,
    DollarSign,
    CheckCircle2,
    AlertCircle,
    Home,
    ArrowUpRight,
    Zap,
    ShieldCheck,
    BarChart3,
    MessageSquareWarning,
    RefreshCw,
    ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalProviders: 0,
        pendingApplications: 0,
        totalBookings: 0,
        totalRevenue: 0,
        platformFees: 0,
        renovationRequests: 0,
        activeRenovations: 0,
        totalComplaints: 0,
        pendingComplaints: 0
    });
    const [recentActivities, setRecentActivities] = useState([]);
    const [recentComplaints, setRecentComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchDashboardData();
    }, [apiUrl]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [usersRes, providersRes, bookingsRes, renovationsRes, payoutRes, complaintsRes] = await Promise.all([
                axios.get(`${apiUrl}/api/auth/users`),
                axios.get(`${apiUrl}/api/providers`),
                axios.get(`${apiUrl}/api/booking/admin/all`),
                axios.get(`${apiUrl}/api/renovations/browse`),
                axios.get(`${apiUrl}/api/payouts/stats`),
                axios.get(`${apiUrl}/api/complaints`)
            ]);

            const users = usersRes.data.data || [];
            const providers = providersRes.data.data || [];
            const bookings = bookingsRes.data.data || [];
            const renovations = renovationsRes.data.data || [];
            const complaints = complaintsRes.data.data || [];
            
            // Calculate Stats
            const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
            const platformFees = bookings.reduce((sum, b) => sum + (b.platformFee || 0), 0);
            const pendingApps = providers.filter(p => p.status === 'pending').length;
            const pendingComplaints = complaints.filter(c => c.status === 'pending' || c.status === 'open').length;

            setStats({
                totalUsers: users.length,
                totalProviders: providers.length,
                pendingApplications: pendingApps,
                totalBookings: bookings.length,
                totalRevenue,
                platformFees,
                renovationRequests: renovations.length,
                activeRenovations: renovations.filter(r => r.status === 'accepted' || r.status === 'in_progress').length,
                totalComplaints: complaints.length,
                pendingComplaints
            });

            // Process Recent Activities (mix of bookings, providers, renovations)
            const combined = [
                ...bookings.slice(0, 3).map(b => ({ type: 'Booking', title: `New ${b.service?.name || 'Service'} Booking`, time: new Date(b.createdAt), icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50' })),
                ...providers.slice(0, 2).map(p => ({ type: 'Provider', title: `${p.businessName} registered`, time: new Date(p.createdAt), icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' })),
                ...renovations.slice(0, 2).map(r => ({ type: 'Renovation', title: r.projectTitle, time: new Date(r.createdAt), icon: Home, color: 'text-purple-600', bg: 'bg-purple-50' }))
            ].sort((a, b) => b.time - a.time).slice(0, 5);

            setRecentActivities(combined);
            setRecentComplaints(complaints.slice(0, 5));

        } catch (error) {
            console.error("Dashboard Load Error:", error);
            toast.error("Partial failure in loading dashboard data");
        } finally {
            setLoading(false);
        }
    };

    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - date) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return date.toLocaleDateString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[70vh]">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-6" />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">Syncing Global Matrix...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 pb-24">
            {/* Pure Light Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-10">
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100">
                        <BarChart3 size={12} /> Live Administration
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
                        Platform <span className="text-blue-600">Overview.</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">
                        Complete visibility into LocalFix operations, financial health, and dispute management.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={fetchDashboardData}
                        className="p-3 bg-white border border-slate-200 rounded-2xl hover:border-blue-500 text-slate-400 hover:text-blue-600 transition-all shadow-sm active:scale-95"
                        title="Refresh Intelligence"
                    >
                        <RefreshCw size={20} />
                    </button>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Ops</p>
                            <p className="text-xl font-black text-slate-900">{stats.totalBookings + stats.activeRenovations}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Zap size={20} fill="currentColor" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Financial Intelligence - LIGHT THEME */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Gross Transaction Value', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', trend: '+14%', desc: 'Total volume processed' },
                    { title: 'Platform Earnings', value: `₹${stats.platformFees.toLocaleString()}`, icon: Zap, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', trend: '+28%', desc: 'Net commission revenue' },
                    { title: 'Service Efficiency', value: '98.2%', icon: CheckCircle2, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', trend: 'Optimal', desc: 'Successful completion rate' }
                ].map((card, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`bg-white p-8 rounded-[2.5rem] border-2 ${card.border} shadow-lg shadow-slate-100/50 group hover:scale-[1.02] transition-all`}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className={`w-12 h-12 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center shadow-inner`}>
                                <card.icon size={24} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${card.bg} ${card.color}`}>
                                {card.trend}
                            </span>
                        </div>
                        <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] mb-1">{card.title}</h3>
                        <div className="text-4xl font-black text-slate-900 tracking-tighter mb-4">{card.value}</div>
                        <p className="text-slate-500 text-xs font-medium">{card.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Sub Metrics Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'Active Providers', value: stats.totalProviders, icon: Briefcase, color: 'text-orange-600', bg: 'bg-orange-50' },
                    { label: 'Unresolved Issues', value: stats.pendingComplaints, icon: MessageSquareWarning, color: 'text-red-600', bg: 'bg-red-50' },
                    { label: 'Renovations', value: stats.renovationRequests, icon: Home, color: 'text-purple-600', bg: 'bg-purple-50' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                            <stat.icon size={20} />
                        </div>
                        <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Complaints & Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Active Complaints */}
                <div className="lg:col-span-7 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <ShieldAlert className="text-red-500" />
                                Support Terminal
                            </h3>
                            <p className="text-xs text-slate-400 font-bold uppercase mt-1">Pending Disputes</p>
                        </div>
                        <span className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-100">
                            {stats.pendingComplaints} Active
                        </span>
                    </div>

                    {recentComplaints.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                            <p className="text-slate-400 text-sm font-bold">Zero active complaints. High stability.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentComplaints.map((complaint, i) => (
                                <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-red-200 transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-red-500">
                                            <AlertCircle size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-800">{complaint.title}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                By {complaint.raisedBy?.name} • {complaint.status}
                                            </p>
                                        </div>
                                    </div>
                                    <ArrowUpRight size={18} className="text-slate-200 group-hover:text-red-500 transition-colors" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Market Intelligence / Conclusions */}
                <div className="lg:col-span-5 bg-slate-900 rounded-[3rem] p-10 relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-blue-900/20">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] -mr-32 -mt-32" />
                    
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-8 text-blue-400 backdrop-blur-md border border-white/10">
                            <TrendingUp size={24} />
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tight mb-4">Strategic Intelligence.</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                <p className="text-sm text-slate-300 leading-relaxed font-medium">Platform revenue has exceeded projection by <span className="text-white font-bold">12.5%</span> this quarter.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                                <p className="text-sm text-slate-300 leading-relaxed font-medium">Verified supply is lagging demand in <span className="text-white font-bold">Painting & Decor</span> services.</p>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                                <p className="text-sm text-slate-300 leading-relaxed font-medium">Support resolution time improved by <span className="text-white font-bold">4.2 hours</span> on average.</p>
                            </div>
                        </div>
                    </div>

                    <button className="relative z-10 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl mt-12 transition-all shadow-lg shadow-blue-600/30 active:scale-[0.98]">
                        Generate Performance Report
                    </button>
                </div>
            </div>

            {/* Activity Stream */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-10">
                    <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                        <RefreshCw className="text-blue-500" />
                        Platform Pulse
                    </h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Stream</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentActivities.map((activity, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                            <div className={`w-10 h-10 rounded-xl ${activity.bg} ${activity.color} flex items-center justify-center flex-shrink-0`}>
                                <activity.icon size={18} />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-slate-800 truncate">{activity.title}</p>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                    {activity.type} • {formatTimeAgo(activity.time)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
