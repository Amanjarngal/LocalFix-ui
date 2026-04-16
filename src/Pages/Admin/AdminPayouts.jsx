import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    IndianRupee, Clock, CheckCircle2, PauseCircle, Loader2,
    Search, Wallet, TrendingUp, CalendarDays, Users,
    Building2, CreditCard, Phone, X, Zap, ChevronDown,
    AlertCircle, BadgeCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_CFG = {
    pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-700 border-amber-200', Icon: Clock },
    paid: { label: 'Paid', cls: 'bg-green-100 text-green-700 border-green-200', Icon: CheckCircle2 },
    on_hold: { label: 'On Hold', cls: 'bg-red-100 text-red-700 border-red-200', Icon: PauseCircle },
};

const AdminPayouts = () => {
    const [tab, setTab] = useState('weekly'); // 'weekly' | 'all'
    const [weekView, setWeekView] = useState('current'); // 'current' | 'prev'
    const [weekly, setWeekly] = useState(null);
    const [allPayouts, setAllPayouts] = useState([]);
    const [stats, setStats] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [bulkModal, setBulkModal] = useState(null); // provider object or 'all'
    const [bulkForm, setBulkForm] = useState({ paymentMode: 'bank_transfer', transactionRef: '', adminNote: '' });
    const [actionLoading, setActionLoading] = useState(false);
    const [payModal, setPayModal] = useState(null); // single payout
    const [payForm, setPayForm] = useState({ paymentMode: 'bank_transfer', transactionRef: '', adminNote: '' });

    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchWeekly = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/api/payouts/weekly-summary?week=${weekView === 'prev' ? 'prev' : 'current'}`, { withCredentials: true });
            setWeekly(res.data.data);
        } catch { toast.error('Failed to load weekly summary'); }
        finally { setLoading(false); }
    };

    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${apiUrl}/api/payouts/all?status=${filterStatus}`, { withCredentials: true });
            setAllPayouts(res.data.data || []);
            setStats(res.data.stats);
        } catch { toast.error('Failed to load payouts'); }
        finally { setLoading(false); }
    };

    useEffect(() => { if (tab === 'weekly') fetchWeekly(); else fetchAll(); }, [tab, weekView, filterStatus]);

    // Bulk pay one provider
    const handleBulkPay = async () => {
        if (!bulkModal) return;
        setActionLoading(true);
        try {
            const isAll = bulkModal === 'all';
            let res;
            if (isAll) {
                res = await axios.post(`${apiUrl}/api/payouts/bulk-pay-all`, { ...bulkForm, week: weekView === 'prev' ? 'prev' : 'current' }, { withCredentials: true });
            } else {
                res = await axios.post(`${apiUrl}/api/payouts/provider/${bulkModal._id}/bulk-pay`, { ...bulkForm, week: weekView === 'prev' ? 'prev' : 'current' }, { withCredentials: true });
            }
            toast.success(res.data.message);
            setBulkModal(null);
            fetchWeekly();
        } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
        finally { setActionLoading(false); }
    };

    // Single mark paid
    const handleMarkPaid = async () => {
        if (!payModal) return;
        setActionLoading(true);
        try {
            await axios.patch(`${apiUrl}/api/payouts/${payModal._id}/mark-paid`, payForm, { withCredentials: true });
            toast.success(`₹${payModal.amount} marked as paid`);
            setPayModal(null);
            fetchAll();
        } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
        finally { setActionLoading(false); }
    };

    const handleHold = async (payout) => {
        const note = prompt('Reason for holding:') || '';
        try {
            await axios.patch(`${apiUrl}/api/payouts/${payout._id}/hold`, { adminNote: note }, { withCredentials: true });
            toast.success('Payout on hold');
            fetchAll();
        } catch { toast.error('Failed'); }
    };

    const filtered = allPayouts.filter(p => {
        if (!search) return true;
        const q = search.toLowerCase();
        return p.provider?.ownerName?.toLowerCase().includes(q) || p.provider?.email?.toLowerCase().includes(q);
    });

    const formatDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    const formatCurrency = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

    return (
        <div className="p-8 max-w-7xl mx-auto pb-24">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-1">
                    <Wallet size={14} /> Finance
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    Payout <span className="text-blue-600">Management</span>
                </h1>
                <p className="text-slate-500 font-medium mt-2">
                    Weekly provider settlements — platform fee retained, net earnings dispatched.
                </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit mb-10">
                <button onClick={() => setTab('weekly')} className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${tab === 'weekly' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                    <CalendarDays size={16} /> Weekly Settlement
                </button>
                <button onClick={() => setTab('all')} className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${tab === 'all' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                    <Wallet size={16} /> All Payouts
                </button>
            </div>

            {/* ─── WEEKLY TAB ─── */}
            {tab === 'weekly' && (
                <div className="space-y-8">
                    {/* Week Selector + Bulk Pay All */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
                            <button onClick={() => setWeekView('current')} className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all ${weekView === 'current' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400'}`}>This Week</button>
                            <button onClick={() => setWeekView('prev')} className={`px-5 py-2.5 rounded-xl font-black text-sm transition-all ${weekView === 'prev' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400'}`}>Last Week</button>
                        </div>
                        {weekly?.providerCount > 0 && (
                            <button
                                onClick={() => { setBulkModal('all'); setBulkForm({ paymentMode: 'bank_transfer', transactionRef: '', adminNote: '' }); }}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 text-sm"
                            >
                                <Zap size={16} /> Pay All {weekly.providerCount} Providers ({formatCurrency(weekly.grandTotal)})
                            </button>
                        )}
                    </div>

                    {/* Week Info */}
                    {weekly && (
                        <div className="text-sm font-bold text-slate-500">
                            Showing: <span className="text-slate-800">{formatDate(weekly.weekStart)} — {formatDate(weekly.weekEnd)}</span>
                            <span className="ml-4 text-slate-400">• {weekly.totalJobs} jobs • {weekly.providerCount} providers</span>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl w-fit mb-4"><Users size={22} /></div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Providers to Pay</p>
                            <p className="text-3xl font-black text-slate-900">{weekly?.providerCount || 0}</p>
                        </div>
                        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm">
                            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl w-fit mb-4"><TrendingUp size={22} /></div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Jobs This Week</p>
                            <p className="text-3xl font-black text-slate-900">{weekly?.totalJobs || 0}</p>
                        </div>
                        <div className="bg-blue-600 rounded-3xl p-7 shadow-xl shadow-blue-100">
                            <div className="p-3 bg-white/20 text-white rounded-2xl w-fit mb-4"><IndianRupee size={22} /></div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-blue-200 mb-1">Total to Settle</p>
                            <p className="text-3xl font-black text-white">{formatCurrency(weekly?.grandTotal)}</p>
                        </div>
                    </div>

                    {/* Provider Cards */}
                    {loading ? (
                        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={36} /></div>
                    ) : !weekly?.providers?.length ? (
                        <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center">
                            <CheckCircle2 className="mx-auto text-green-400 mb-4" size={48} />
                            <p className="text-slate-500 font-bold text-lg">All settled!</p>
                            <p className="text-slate-400 text-sm mt-1">No pending payouts for this week.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {weekly.providers.map((item) => {
                                const bd = item.provider?.bankDetails;
                                const isUpi = item.provider?.payoutMethod === 'upi';
                                return (
                                    <div key={item.provider?._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                                        <div className="p-7 flex flex-col lg:flex-row lg:items-center gap-6">
                                            {/* Provider Info */}
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-100 shrink-0">
                                                        {item.provider?.ownerName?.charAt(0) || 'P'}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-black text-slate-900 text-lg">{item.provider?.ownerName}</h3>
                                                        <p className="text-sm text-slate-500 font-bold">{item.provider?.businessName}</p>
                                                        <p className="text-xs text-slate-400 font-bold mt-0.5 flex items-center gap-1"><Phone size={10} /> {item.provider?.phone}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bank Info */}
                                            <div className="bg-slate-50 rounded-2xl px-5 py-4 min-w-[200px]">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Payment Details</p>
                                                {isUpi ? (
                                                    <>
                                                        <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">UPI</span>
                                                        <p className="font-bold text-slate-800 text-sm mt-1">{bd?.upiId || 'Not set'}</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="text-xs font-black text-slate-600 bg-white px-2 py-0.5 rounded-lg border border-slate-200">Bank</span>
                                                        <p className="font-bold text-slate-800 text-sm mt-1">{bd?.accountNumber ? `****${bd.accountNumber.slice(-4)}` : 'Not set'}</p>
                                                        <p className="text-xs text-slate-400 font-bold">{bd?.ifscCode || '—'} • {bd?.accountHolderName || '—'}</p>
                                                    </>
                                                )}
                                            </div>

                                            {/* Stats */}
                                            <div className="flex gap-6">
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Jobs</p>
                                                    <p className="text-2xl font-black text-slate-900">{item.jobCount}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Platform Fee</p>
                                                    <p className="text-xl font-black text-red-500">-{formatCurrency(item.totalPlatformFee)}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">To Pay</p>
                                                    <p className="text-2xl font-black text-green-600">{formatCurrency(item.totalAmount)}</p>
                                                </div>
                                            </div>

                                            {/* Action */}
                                            <button
                                                onClick={() => { setBulkModal(item.provider); setBulkForm({ paymentMode: 'bank_transfer', transactionRef: '', adminNote: '' }); }}
                                                className="px-6 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 transition-all shadow-lg shadow-green-100 flex items-center gap-2 text-sm whitespace-nowrap"
                                            >
                                                <Zap size={16} /> Pay {formatCurrency(item.totalAmount)}
                                            </button>
                                        </div>

                                        {/* Job list (collapsible preview) */}
                                        <div className="border-t border-slate-50 px-7 py-4 bg-slate-50/30">
                                            <div className="flex gap-4 flex-wrap">
                                                {item.payouts.map((p, i) => (
                                                    <div key={p._id} className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-100">
                                                        <IndianRupee size={10} className="text-green-500" />
                                                        {formatCurrency(p.amount)}
                                                        <span className="text-slate-300">•</span>
                                                        {formatDate(p.booking?.scheduledDate || p.createdAt)}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ─── ALL PAYOUTS TAB ─── */}
            {tab === 'all' && (
                <div className="space-y-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl"><Clock size={22} /></div>
                                <span className="text-xs font-black text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">{stats?.pendingCount || 0}</span>
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Pending</p>
                            <p className="text-3xl font-black text-slate-900">{formatCurrency(stats?.totalPending)}</p>
                        </div>
                        <div className="bg-white rounded-3xl p-7 border border-slate-100 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-2xl"><CheckCircle2 size={22} /></div>
                                <span className="text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">{stats?.paidCount || 0}</span>
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">Paid Out</p>
                            <p className="text-3xl font-black text-slate-900">{formatCurrency(stats?.totalPaid)}</p>
                        </div>
                        <div className="bg-blue-600 rounded-3xl p-7 shadow-xl shadow-blue-100">
                            <div className="p-3 bg-white/20 text-white rounded-2xl w-fit mb-4"><TrendingUp size={22} /></div>
                            <p className="text-[11px] font-black uppercase tracking-widest text-blue-200 mb-1">Total Settled</p>
                            <p className="text-3xl font-black text-white">{formatCurrency((stats?.totalPending || 0) + (stats?.totalPaid || 0))}</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input type="text" placeholder="Search provider..." className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-100" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
                            {['all', 'pending', 'paid', 'on_hold'].map(s => (
                                <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2.5 rounded-xl font-black text-sm transition-all capitalize ${filterStatus === s ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400'}`}>
                                    {s === 'on_hold' ? 'Hold' : s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        {loading ? <div className="p-16 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={36} /></div>
                            : !filtered.length ? (
                                <div className="p-16 text-center">
                                    <Wallet className="mx-auto text-slate-200 mb-4" size={48} />
                                    <p className="text-slate-400 font-bold">No payouts found</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                                {['Provider', 'Payment Info', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                                                    <th key={h} className={`py-5 px-5 text-[11px] font-black uppercase tracking-widest text-slate-400 ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {filtered.map((payout) => {
                                                const cfg = STATUS_CFG[payout.status] || STATUS_CFG.pending;
                                                const bd = payout.provider?.bankDetails;
                                                return (
                                                    <tr key={payout._id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="py-5 px-5">
                                                            <p className="font-black text-slate-900">{payout.provider?.ownerName}</p>
                                                            <p className="text-xs text-slate-400 font-bold">{payout.provider?.businessName}</p>
                                                        </td>
                                                        <td className="py-5 px-5">
                                                            {payout.provider?.payoutMethod === 'upi'
                                                                ? <><span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg">UPI</span><p className="text-xs text-slate-600 font-bold mt-1">{bd?.upiId || '—'}</p></>
                                                                : <><span className="text-xs font-black text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg">Bank</span><p className="text-xs text-slate-600 font-bold mt-1">{bd?.accountNumber ? `****${bd.accountNumber.slice(-4)}` : '—'}</p><p className="text-[10px] text-slate-400">{bd?.ifscCode}</p></>
                                                            }
                                                        </td>
                                                        <td className="py-5 px-5">
                                                            <p className="font-black text-slate-900 text-lg">{formatCurrency(payout.amount)}</p>
                                                            <p className="text-xs text-red-400 font-bold">Fee: -{formatCurrency(payout.platformFee)}</p>
                                                        </td>
                                                        <td className="py-5 px-5">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-xl border ${cfg.cls}`}>
                                                                <cfg.Icon size={11} /> {cfg.label}
                                                            </span>
                                                            {payout.transactionRef && <p className="text-[10px] text-blue-500 font-bold mt-1">#{payout.transactionRef}</p>}
                                                        </td>
                                                        <td className="py-5 px-5">
                                                            <p className="text-sm font-bold text-slate-600">{formatDate(payout.createdAt)}</p>
                                                        </td>
                                                        <td className="py-5 px-5 text-right">
                                                            {payout.status !== 'paid' ? (
                                                                <div className="flex items-center gap-2 justify-end">
                                                                    <button onClick={() => { setPayModal(payout); setPayForm({ paymentMode: 'bank_transfer', transactionRef: '', adminNote: '' }); }} className="px-4 py-2 bg-green-600 text-white font-black text-xs rounded-xl hover:bg-green-700 transition-all flex items-center gap-1">
                                                                        <CheckCircle2 size={12} /> Pay
                                                                    </button>
                                                                    {payout.status !== 'on_hold' && (
                                                                        <button onClick={() => handleHold(payout)} className="px-3 py-2 bg-slate-100 text-slate-500 font-black text-xs rounded-xl hover:bg-red-50 hover:text-red-500 transition-all">
                                                                            <PauseCircle size={13} />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            ) : <CheckCircle2 size={18} className="text-green-500 ml-auto" />}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                    </div>
                </div>
            )}

            {/* ─── BULK PAY MODAL ─── */}
            {bulkModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">
                                    {bulkModal === 'all' ? 'Pay All Providers' : `Pay ${bulkModal?.ownerName}`}
                                </h2>
                                <p className="text-slate-500 font-medium text-sm mt-0.5">
                                    {bulkModal === 'all'
                                        ? `Settle ${formatCurrency(weekly?.grandTotal)} across ${weekly?.providerCount} providers`
                                        : 'Settle all pending jobs for this provider this week'}
                                </p>
                            </div>
                            <button onClick={() => setBulkModal(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"><X size={20} /></button>
                        </div>

                        {bulkModal !== 'all' && (() => {
                            const item = weekly?.providers?.find(p => p.provider?._id === bulkModal?._id);
                            const bd = bulkModal?.bankDetails;
                            return (
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-green-600 mb-1">Net Payout ({item?.jobCount} jobs)</p>
                                            <p className="text-4xl font-black text-green-600">{formatCurrency(item?.totalAmount)}</p>
                                            <p className="text-xs text-red-400 font-bold mt-1">Platform fee retained: {formatCurrency(item?.totalPlatformFee)}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-green-200 space-y-0.5">
                                        {bulkModal?.payoutMethod === 'upi'
                                            ? <p className="text-sm font-bold text-slate-700">UPI: {bd?.upiId}</p>
                                            : <>
                                                <p className="text-sm font-bold text-slate-700">Account: {bd?.accountNumber}</p>
                                                <p className="text-sm font-bold text-slate-700">IFSC: {bd?.ifscCode} | {bd?.bankName}</p>
                                                <p className="text-sm font-bold text-slate-700">Name: {bd?.accountHolderName}</p>
                                            </>}
                                    </div>
                                </div>
                            );
                        })()}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Payment Mode</label>
                                <select className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100" value={bulkForm.paymentMode} onChange={(e) => setBulkForm({ ...bulkForm, paymentMode: e.target.value })}>
                                    <option value="bank_transfer">Bank Transfer (NEFT/IMPS)</option>
                                    <option value="upi">UPI</option>
                                    <option value="razorpay">Razorpay Payout</option>
                                    <option value="cash">Cash</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Transaction Reference / UTR</label>
                                <input type="text" placeholder="e.g. 424242424242" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100" value={bulkForm.transactionRef} onChange={(e) => setBulkForm({ ...bulkForm, transactionRef: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Admin Note</label>
                                <input type="text" placeholder="Weekly settlement note..." className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-100" value={bulkForm.adminNote} onChange={(e) => setBulkForm({ ...bulkForm, adminNote: e.target.value })} />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setBulkModal(null)} className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
                            <button onClick={handleBulkPay} disabled={actionLoading} className="flex-1 px-6 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 disabled:bg-green-300 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2">
                                {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <><Zap size={18} /> Confirm Payout</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── SINGLE PAY MODAL ─── */}
            {payModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Mark as Paid</h2>
                                <p className="text-slate-500 font-medium mt-0.5">{payModal.provider?.ownerName}</p>
                            </div>
                            <button onClick={() => setPayModal(null)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400"><X size={20} /></button>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
                            <p className="text-xs font-black uppercase tracking-widest text-green-600 mb-1">Net Payout</p>
                            <p className="text-4xl font-black text-green-600">{formatCurrency(payModal.amount)}</p>
                            <p className="text-xs text-red-400 font-bold mt-1">Platform fee: {formatCurrency(payModal.platformFee)}</p>
                        </div>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Payment Mode</label>
                                <select className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none" value={payForm.paymentMode} onChange={(e) => setPayForm({ ...payForm, paymentMode: e.target.value })}>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="upi">UPI</option>
                                    <option value="cash">Cash</option>
                                </select>
                            </div>
                            <input type="text" placeholder="Transaction Ref / UTR" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none" value={payForm.transactionRef} onChange={(e) => setPayForm({ ...payForm, transactionRef: e.target.value })} />
                            <input type="text" placeholder="Admin note (optional)" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none" value={payForm.adminNote} onChange={(e) => setPayForm({ ...payForm, adminNote: e.target.value })} />
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setPayModal(null)} className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl">Cancel</button>
                            <button onClick={handleMarkPaid} disabled={actionLoading} className="flex-1 px-6 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 flex items-center justify-center gap-2">
                                {actionLoading ? <Loader2 className="animate-spin" size={18} /> : <><CheckCircle2 size={18} /> Confirm</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPayouts;
