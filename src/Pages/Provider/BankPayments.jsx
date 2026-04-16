import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Landmark, Save, Loader2, CheckCircle2, AlertCircle,
    Wallet, TrendingUp, IndianRupee, ArrowUpRight,
    Building2, CreditCard, ShieldCheck, Zap, BadgeCheck,
    Calendar, User, Download, FileText, Clock, PauseCircle,
    ChevronDown, ChevronUp, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useAuth } from '../../context/AuthContext';

const STATUS_CFG = {
    pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-700', Icon: Clock },
    paid: { label: 'Paid', cls: 'bg-green-100 text-green-700', Icon: CheckCircle2 },
    on_hold: { label: 'On Hold', cls: 'bg-red-100 text-red-700', Icon: PauseCircle },
};

const BankPayments = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [linking, setLinking] = useState(false);
    const [activeTab, setActiveTab] = useState('earnings'); // 'bank' | 'earnings'
    const [earnings, setEarnings] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [pdfLoading, setPdfLoading] = useState(false);

    const [formData, setFormData] = useState({
        accountNumber: '',
        ifscCode: '',
        accountHolderName: '',
        bankName: '',
        upiId: '',
        payoutMethod: 'bank_transfer',
    });
    const [razorpayAccountId, setRazorpayAccountId] = useState('');
    const [providerInfo, setProviderInfo] = useState(null);

    const { user } = useAuth();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetchBankDetails();
        fetchEarnings();
    }, []);

    const fetchBankDetails = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/payouts/bank-details`, { withCredentials: true });
            if (res.data.data) {
                const d = res.data.data;
                setFormData({
                    accountNumber: d.bankDetails?.accountNumber || '',
                    ifscCode: d.bankDetails?.ifscCode || '',
                    accountHolderName: d.bankDetails?.accountHolderName || '',
                    bankName: d.bankDetails?.bankName || '',
                    upiId: d.bankDetails?.upiId || '',
                    payoutMethod: d.payoutMethod || 'bank_transfer',
                });
                setRazorpayAccountId(d.razorpayAccountId || '');
            }
        } catch (err) {
            console.error("Failed to load bank details");
        } finally {
            setLoading(false);
        }
    };

    const fetchEarnings = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/payouts/my-earnings`, { withCredentials: true });
            if (res.data.data) setEarnings(res.data.data);
        } catch (err) {
            console.error("Failed to load earnings");
        }
    };

    // Also fetch provider info for PDF header
    const fetchProviderInfo = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/providers/${user?._id}`, { withCredentials: true });
            if (res.data.data) setProviderInfo(res.data.data);
        } catch {}
    };

    useEffect(() => { fetchProviderInfo(); }, [user]);

    const handleSaveBankDetails = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await axios.post(`${apiUrl}/api/payouts/bank-details`, formData, { withCredentials: true });
            toast.success("Bank details saved!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleCreateLinkedAccount = async () => {
        setLinking(true);
        try {
            const res = await axios.post(`${apiUrl}/api/payouts/create-linked-account`, {}, { withCredentials: true });
            if (res.data.data?.razorpayAccountId) {
                setRazorpayAccountId(res.data.data.razorpayAccountId);
                toast.success(res.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Account creation failed");
        } finally {
            setLinking(false);
        }
    };

    // ── PDF Statement Generator ──────────────────────────────────────
    const downloadPDF = async () => {
        setPdfLoading(true);
        try {
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
            const pageW = doc.internal.pageSize.getWidth();
            const now = new Date();
            const payouts = getFilteredPayouts();

            // ── Header band ──
            doc.setFillColor(37, 99, 235); // blue-600
            doc.rect(0, 0, pageW, 42, 'F');

            // Logo / Brand
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(22);
            doc.setFont('helvetica', 'bold');
            doc.text('LocalFix', 15, 16);

            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.text('Provider Earnings Statement', 15, 24);

            // Date range info
            doc.setFontSize(9);
            doc.text(`Generated: ${now.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageW - 15, 16, { align: 'right' });
            doc.text(`Filter: ${filterStatus === 'all' ? 'All Payouts' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}`, pageW - 15, 24, { align: 'right' });

            // ── Provider Info box ──
            doc.setFillColor(241, 245, 249); // slate-100
            doc.roundedRect(14, 48, pageW - 28, 32, 3, 3, 'F');
            doc.setTextColor(30, 41, 59); // slate-800
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(providerInfo?.ownerName || user?.name || 'Provider', 20, 58);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 116, 139); // slate-500
            doc.text(`Business: ${providerInfo?.businessName || '—'}`, 20, 65);
            doc.text(`Phone: ${providerInfo?.phone || '—'}`, 20, 71);
            doc.text(`Email: ${providerInfo?.email || user?.email || '—'}`, 20, 77);

            // Bank info right side
            doc.setTextColor(30, 41, 59);
            doc.setFontSize(9);
            if (formData.payoutMethod === 'upi') {
                doc.text(`UPI: ${formData.upiId || '—'}`, pageW - 20, 65, { align: 'right' });
            } else {
                doc.text(`Bank: ${formData.bankName || '—'}`, pageW - 20, 65, { align: 'right' });
                doc.text(`Account: ****${formData.accountNumber?.slice(-4) || '—'}`, pageW - 20, 71, { align: 'right' });
                doc.text(`IFSC: ${formData.ifscCode || '—'}`, pageW - 20, 77, { align: 'right' });
            }

            // ── Summary boxes ──
            const summary = [
                { label: 'Total Earned', value: `₹${earnings?.totalEarnings?.toLocaleString('en-IN') || 0}`, color: [22, 163, 74] },
                { label: 'Paid to You', value: `₹${earnings?.totalPaid?.toLocaleString('en-IN') || 0}`, color: [37, 99, 235] },
                { label: 'Pending', value: `₹${earnings?.totalPending?.toLocaleString('en-IN') || 0}`, color: [217, 119, 6] },
                { label: 'Jobs Done', value: String(earnings?.completedJobs || 0), color: [99, 102, 241] },
            ];
            const boxW = (pageW - 28 - 9) / 4;
            summary.forEach((s, i) => {
                const x = 14 + i * (boxW + 3);
                doc.setFillColor(...s.color);
                doc.roundedRect(x, 86, boxW, 20, 2, 2, 'F');
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(7);
                doc.setFont('helvetica', 'normal');
                doc.text(s.label.toUpperCase(), x + boxW / 2, 92, { align: 'center' });
                doc.setFontSize(13);
                doc.setFont('helvetica', 'bold');
                doc.text(s.value, x + boxW / 2, 100, { align: 'center' });
            });

            // ── Table ──
            const rows = payouts.map((p, idx) => [
                String(idx + 1),
                p.date ? new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : '—',
                p.booking?.scheduledDate ? new Date(p.booking.scheduledDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—',
                `₹${Number(p.amount || 0).toLocaleString('en-IN')}`,
                p.status?.charAt(0).toUpperCase() + p.status?.slice(1) || '—',
                p.paidAt ? new Date(p.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—',
                p.paymentMode?.replace('_', ' ') || '—',
                p.transactionRef || '—',
            ]);

            autoTable(doc, {
                startY: 112,
                head: [['#', 'Created', 'Job Date', 'Your Earning', 'Status', 'Paid On', 'Mode', 'Ref #']],
                body: rows,
                headStyles: {
                    fillColor: [30, 41, 59],
                    textColor: 255,
                    fontStyle: 'bold',
                    fontSize: 8,
                    halign: 'center',
                },
                bodyStyles: { fontSize: 8, halign: 'center', textColor: [30, 41, 59] },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                columnStyles: {
                    0: { cellWidth: 8 },
                    3: { textColor: [22, 163, 74], fontStyle: 'bold' },
                    4: { textColor: [220, 38, 38] },
                    6: { fontStyle: 'bold' },
                },
                didDrawCell: (data) => {
                    if (data.section === 'body' && data.column.index === 6) {
                        const status = payouts[data.row.index]?.status;
                        if (status === 'paid') data.cell.styles.textColor = [22, 163, 74];
                        else if (status === 'pending') data.cell.styles.textColor = [217, 119, 6];
                        else data.cell.styles.textColor = [220, 38, 38];
                    }
                },
                margin: { left: 14, right: 14 },
            });

            // ── Footer ──
            const finalY = doc.lastAutoTable.finalY + 8;
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.text(`LocalFix Platform — Confidential Statement — ${now.toLocaleString('en-IN')}`, pageW / 2, finalY + 6, { align: 'center' });

            // Page numbers
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(148, 163, 184);
                doc.text(`Page ${i} of ${pageCount}`, pageW - 14, doc.internal.pageSize.getHeight() - 8, { align: 'right' });
            }

            const fileName = `LocalFix_Statement_${(providerInfo?.ownerName || 'Provider').replace(/\s+/g, '_')}_${now.toISOString().slice(0, 10)}.pdf`;
            doc.save(fileName);
            toast.success('Statement downloaded!');
        } catch (err) {
            console.error(err);
            toast.error('Failed to generate PDF');
        } finally {
            setPdfLoading(false);
        }
    };

    const getFilteredPayouts = () => {
        if (!earnings?.payouts) return [];
        if (filterStatus === 'all') return earnings.payouts;
        return earnings.payouts.filter(p => p.status === filterStatus);
    };

    const formatCurrency = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

    if (loading) {
        return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-orange-600" size={40} /></div>;
    }

    const isActive = razorpayAccountId && !razorpayAccountId.startsWith('local_');
    const isPending = razorpayAccountId && razorpayAccountId.startsWith('local_');
    const filteredPayouts = getFilteredPayouts();

    return (
        <div className="p-8 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-widest mb-1">
                    <Wallet size={14} /> Payments
                </div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                    Bank & <span className="text-orange-600">Payments</span>
                </h1>
                <p className="text-slate-500 font-medium mt-2">Manage your payout account and download earnings statements.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-10 bg-slate-100 p-1.5 rounded-2xl w-fit">
                <button onClick={() => setActiveTab('earnings')} className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'earnings' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                    <TrendingUp size={16} /> Earnings & Payouts
                </button>
                <button onClick={() => setActiveTab('bank')} className={`px-6 py-3 rounded-xl font-black text-sm transition-all flex items-center gap-2 ${activeTab === 'bank' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                    <Building2 size={16} /> Bank Details
                </button>
            </div>

            {/* ─── EARNINGS TAB ─── */}
            {activeTab === 'earnings' && (
                <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                            <div className="p-2.5 bg-green-100 text-green-600 rounded-xl w-fit mb-3"><IndianRupee size={18} /></div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Total Earned</p>
                            <p className="text-2xl font-black text-slate-900">{formatCurrency(earnings?.totalEarnings)}</p>
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl w-fit mb-3"><CheckCircle2 size={18} /></div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Paid to You</p>
                            <p className="text-2xl font-black text-green-600">{formatCurrency(earnings?.totalPaid)}</p>
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-amber-100 shadow-sm">
                            <div className="p-2.5 bg-amber-100 text-amber-600 rounded-xl w-fit mb-3"><Clock size={18} /></div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Pending</p>
                            <p className="text-2xl font-black text-amber-600">{formatCurrency(earnings?.totalPending)}</p>
                        </div>
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl w-fit mb-3"><TrendingUp size={18} /></div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Total Jobs</p>
                            <p className="text-2xl font-black text-slate-900">{earnings?.completedJobs || 0}</p>
                        </div>
                    </div>

                    {/* Controls: Filter + Download */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
                            {['all', 'pending', 'paid', 'on_hold'].map(s => (
                                <button key={s} onClick={() => setFilterStatus(s)} className={`px-4 py-2 rounded-xl font-black text-xs transition-all capitalize ${filterStatus === s ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                                    {s === 'on_hold' ? 'On Hold' : s}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={downloadPDF}
                            disabled={pdfLoading || !filteredPayouts.length}
                            className="flex items-center gap-2.5 px-6 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 disabled:bg-slate-300 transition-all shadow-lg text-sm"
                        >
                            {pdfLoading
                                ? <><Loader2 className="animate-spin" size={16} /> Generating...</>
                                : <><FileText size={16} /> Download PDF Statement</>
                            }
                        </button>
                    </div>

                    {/* Payouts List */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-7 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                            <div>
                                <h3 className="font-black text-slate-900 text-lg">All Payout Records</h3>
                                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">{filteredPayouts.length} entries</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                <Filter size={12} /> Showing: <span className="text-slate-700 capitalize">{filterStatus === 'all' ? 'All' : filterStatus}</span>
                            </div>
                        </div>

                        {filteredPayouts.length === 0 ? (
                            <div className="p-16 text-center">
                                <Wallet className="mx-auto text-slate-200 mb-4" size={48} />
                                <p className="text-slate-400 font-bold">No payouts found</p>
                                <p className="text-slate-400 text-sm mt-1">Complete bookings to see your earnings here.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-2 px-7 py-3 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <div className="col-span-2">Date</div>
                                    <div className="col-span-2">Job Date</div>
                                    <div className="col-span-3 text-right">Your Earning</div>
                                    <div className="col-span-2 text-center">Status</div>
                                    <div className="col-span-2">Paid On</div>
                                    <div className="col-span-1">Ref #</div>
                                </div>

                                {filteredPayouts.map((payout) => {
                                    const cfg = STATUS_CFG[payout.status] || STATUS_CFG.pending;
                                    return (
                                        <div key={payout._id} className="grid grid-cols-12 gap-2 px-7 py-4 hover:bg-slate-50/50 transition-colors items-center">
                                            <div className="col-span-2">
                                                <p className="font-bold text-slate-700 text-sm">{formatDate(payout.date)}</p>
                                            </div>
                                            <div className="col-span-2">
                                                <p className="text-sm font-bold text-slate-600">
                                                    {payout.booking?.scheduledDate ? formatDate(payout.booking.scheduledDate) : '—'}
                                                </p>
                                            </div>
                                            <div className="col-span-3 text-right">
                                                <p className="font-black text-green-600 text-base">+{formatCurrency(payout.amount)}</p>
                                            </div>
                                            <div className="col-span-2 flex justify-center">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black rounded-xl ${cfg.cls}`}>
                                                    <cfg.Icon size={10} /> {cfg.label}
                                                </span>
                                            </div>
                                            <div className="col-span-2">
                                                {payout.paidAt ? (
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-600">{formatDate(payout.paidAt)}</p>
                                                        <p className="text-[10px] text-slate-400 capitalize">{payout.paymentMode?.replace('_', ' ')}</p>
                                                    </div>
                                                ) : <span className="text-[10px] text-slate-300 font-bold">—</span>}
                                            </div>
                                            <div className="col-span-1">
                                                {payout.transactionRef
                                                    ? <p className="text-xs font-bold text-blue-500 truncate" title={payout.transactionRef}>#{payout.transactionRef}</p>
                                                    : <span className="text-[10px] text-slate-300 font-bold">—</span>
                                                }
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Footer total */}
                        {filteredPayouts.length > 0 && (
                            <div className="px-7 py-5 bg-slate-900 flex items-center justify-between">
                                <p className="text-sm font-black text-slate-300 uppercase tracking-widest">{filteredPayouts.length} records</p>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Your Total</p>
                                    <p className="text-2xl font-black text-green-400">{formatCurrency(filteredPayouts.reduce((s, p) => s + (p.amount || 0), 0))}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ─── BANK DETAILS TAB ─── */}
            {activeTab === 'bank' && (
                <div className="space-y-8">
                    {/* Status Banner */}
                    {(() => {
                        return (
                            <div className={`p-6 rounded-3xl border flex items-center gap-5 ${isActive ? 'bg-green-50 border-green-200' : isPending ? 'bg-blue-50 border-blue-200' : 'bg-amber-50 border-amber-200'}`}>
                                <div className={`p-4 rounded-2xl ${isActive ? 'bg-green-100 text-green-600' : isPending ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {isActive ? <BadgeCheck size={28} /> : isPending ? <ShieldCheck size={28} /> : <AlertCircle size={28} />}
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 text-lg">
                                        {isActive ? '✅ Auto-Split Active' : isPending ? '🕐 Saved — Pending Razorpay Activation' : 'Payout Account Not Set Up'}
                                    </h3>
                                    <p className="text-sm text-slate-600 font-medium mt-0.5">
                                        {isActive ? 'Payments are automatically split to your account.'
                                            : isPending ? 'Your bank details are saved. Admin will process payouts manually until Razorpay Route is activated.'
                                                : 'Enter your bank details below and click Activate.'}
                                    </p>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Bank Form */}
                    <form onSubmit={handleSaveBankDetails}>
                        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex items-center gap-4">
                                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center shadow-inner"><Landmark size={24} /></div>
                                <div>
                                    <h3 className="font-black text-slate-900 text-lg">Bank Account Details</h3>
                                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Secure payout information</p>
                                </div>
                            </div>
                            <div className="p-10 space-y-6">
                                {/* Method Selector */}
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Payout Method</label>
                                    <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
                                        <button type="button" onClick={() => setFormData({ ...formData, payoutMethod: 'bank_transfer' })} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black transition-all text-sm ${formData.payoutMethod === 'bank_transfer' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                                            <Building2 size={16} /> Bank Transfer
                                        </button>
                                        <button type="button" onClick={() => setFormData({ ...formData, payoutMethod: 'upi' })} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black transition-all text-sm ${formData.payoutMethod === 'upi' ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                                            <CreditCard size={16} /> UPI
                                        </button>
                                    </div>
                                </div>

                                {formData.payoutMethod === 'bank_transfer' ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {[
                                            { label: 'Account Holder Name *', key: 'accountHolderName', placeholder: 'John Doe' },
                                            { label: 'Bank Name', key: 'bankName', placeholder: 'State Bank of India' },
                                            { label: 'Account Number *', key: 'accountNumber', placeholder: '1234567890123' },
                                            { label: 'IFSC Code *', key: 'ifscCode', placeholder: 'SBIN0001234', upper: true },
                                        ].map(f => (
                                            <div key={f.key} className="space-y-2">
                                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{f.label}</label>
                                                <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all" placeholder={f.placeholder} value={formData[f.key]} onChange={(e) => setFormData({ ...formData, [f.key]: f.upper ? e.target.value.toUpperCase() : e.target.value })} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">UPI ID *</label>
                                        <input type="text" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all" placeholder="yourname@upi" value={formData.upiId} onChange={(e) => setFormData({ ...formData, upiId: e.target.value })} />
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button type="submit" disabled={saving} className="flex-1 px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 disabled:bg-slate-300 transition-all shadow-lg flex items-center justify-center gap-3">
                                        {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={18} /> Save Details</>}
                                    </button>
                                    {!razorpayAccountId && (
                                        <button type="button" onClick={handleCreateLinkedAccount} disabled={linking} className="flex-1 px-8 py-4 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 disabled:bg-orange-200 transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-3">
                                            {linking ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={18} /> Activate Payouts</>}
                                        </button>
                                    )}
                                    {isPending && (
                                        <div className="flex-1 px-8 py-4 bg-blue-50 text-blue-700 font-black rounded-2xl border border-blue-200 flex items-center justify-center gap-3 text-sm">
                                            <ShieldCheck size={18} /> Pending Razorpay Activation
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </form>

                    <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100 flex items-start gap-4">
                        <ShieldCheck className="text-blue-600 shrink-0 mt-1" size={20} />
                        <p className="text-sm text-blue-800 font-medium leading-relaxed">
                            Your bank details are securely stored. Platform fee is automatically deducted from your order amount, and the remaining is paid by the admin each week.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BankPayments;
