import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Search, AlertTriangle, CheckCircle, Clock, XCircle, Eye, X,
    User, Wrench, CreditCard, ShieldAlert, RotateCcw, Smartphone,
    UserX, MessageSquare, Bot, ChevronDown, Filter
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSocket } from '../../context/SocketContext';

const CATEGORY_META = {
    service_quality: { label: 'Service Quality', icon: Wrench, color: 'blue' },
    technical_system: { label: 'App / Technical', icon: Smartphone, color: 'slate' },
    payment_related: { label: 'Pricing / Payment', icon: CreditCard, color: 'emerald' },
    other: { label: 'Other', icon: MessageSquare, color: 'gray' },
};

const STATUS_META = {
    pending: { label: 'Pending', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
    'in-progress': { label: 'In Progress', icon: Clock, bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    resolved: { label: 'Resolved', icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    closed: { label: 'Closed', icon: XCircle, bg: 'bg-slate-50', text: 'text-slate-500', border: 'border-slate-200' },
    rejected: { label: 'Rejected', icon: XCircle, bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' },
};

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [adminResponse, setAdminResponse] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [updating, setUpdating] = useState(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchComplaints = async () => {
        try {
            const res = await axios.get(`${apiUrl}/api/complaints`, { withCredentials: true });
            setComplaints(res.data.data || []);
        } catch (err) {
            console.error("Error fetching complaints:", err);
            toast.error("Failed to load complaints");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComplaints(); }, [apiUrl]);

    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('complaint_created', (complaint) => {
            setComplaints(prev => [complaint, ...prev]);
            toast.success(`New complaint filed by user!`);
        });

        socket.on('complaint_updated', (data) => {
            setComplaints(prev => prev.map(c => c._id === data.complaintId ? { ...c, status: data.status, adminResponse: data.adminResponse } : c));
        });

        return () => {
            socket.off('complaint_created');
            socket.off('complaint_updated');
        };
    }, [socket]);

    const handleUpdateComplaint = async (id) => {
        if (!newStatus) return toast.error("Please select a new status");
        setUpdating(true);
        try {
            await axios.patch(`${apiUrl}/api/complaints/${id}`, {
                status: newStatus,
                adminResponse: adminResponse
            }, { withCredentials: true });
            toast.success("Complaint updated successfully!");
            setSelectedComplaint(null);
            setAdminResponse('');
            setNewStatus('');
            fetchComplaints();
        } catch (err) {
            console.error("Error updating complaint:", err);
            toast.error("Failed to update complaint");
        } finally {
            setUpdating(false);
        }
    };

    const filtered = complaints.filter(c => {
        const matchSearch = c._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.raisedBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    const stats = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'pending').length,
        inProgress: complaints.filter(c => c.status === 'in-progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* ─── Header ─── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">User Complaints</h1>
                    <p className="text-gray-500">Monitor and resolve complaints raised by users and the AI Assistant.</p>
                </div>
            </div>

            {/* ─── Stats Cards ─── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</p>
                    <p className="text-3xl font-black text-gray-800 mt-1">{stats.total}</p>
                </div>
                <div className="bg-amber-50 rounded-2xl border border-amber-100 p-5 shadow-sm">
                    <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Pending</p>
                    <p className="text-3xl font-black text-amber-600 mt-1">{stats.pending}</p>
                </div>
                <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5 shadow-sm">
                    <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">In Progress</p>
                    <p className="text-3xl font-black text-blue-600 mt-1">{stats.inProgress}</p>
                </div>
                <div className="bg-green-50 rounded-2xl border border-green-100 p-5 shadow-sm">
                    <p className="text-xs font-bold text-green-500 uppercase tracking-wider">Resolved</p>
                    <p className="text-3xl font-black text-green-600 mt-1">{stats.resolved}</p>
                </div>
            </div>

            {/* ─── Filters ─── */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID, user name, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="pl-9 pr-8 py-2.5 bg-white border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium text-gray-700 cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
            </div>

            {/* ─── Table ─── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Complaint</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Raised By</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filtered.length > 0 ? (
                                filtered.map((complaint) => {
                                    const catMeta = CATEGORY_META[complaint.aiCategory] || CATEGORY_META.other;
                                    const statusMeta = STATUS_META[complaint.status] || STATUS_META.pending;
                                    return (
                                        <tr key={complaint._id} className="hover:bg-gray-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col max-w-xs">
                                                    <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                                        #{complaint._id.toString().slice(-6).toUpperCase()}
                                                        {complaint.geminiModelUsed && (
                                                            <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-full border border-blue-200">
                                                                <Bot size={9} /> AI
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-gray-500 mt-0.5 truncate">{complaint.title}</span>
                                                    <span className="text-xs text-gray-400 mt-0.5 line-clamp-1">{complaint.description}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                                        <User size={14} className="text-gray-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">{complaint.raisedBy?.name || 'Unknown'}</p>
                                                        <p className="text-[11px] text-gray-400">{complaint.raisedByRole}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-${catMeta.color}-50 text-${catMeta.color}-600 border border-${catMeta.color}-200`}>
                                                    <catMeta.icon size={12} />
                                                    {catMeta.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusMeta.bg} ${statusMeta.text} ${statusMeta.border} capitalize`}>
                                                    <statusMeta.icon size={12} />
                                                    {statusMeta.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-700">
                                                    {new Date(complaint.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <div className="text-[11px] text-gray-400 mt-0.5">
                                                    {new Date(complaint.createdAt).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => { setSelectedComplaint(complaint); setNewStatus(complaint.status); setAdminResponse(complaint.adminResponse || ''); }}
                                                    className="p-2 hover:bg-blue-50 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                                                    title="View & Respond"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <AlertTriangle className="mx-auto text-gray-300 mb-3" size={40} />
                                        <p className="text-gray-400 font-medium">No complaints found</p>
                                        <p className="text-gray-300 text-sm mt-1">Try adjusting your search or filter</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ─── Detail Modal ─── */}
            {selectedComplaint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 p-6 flex items-center justify-between z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    Complaint Details
                                    {selectedComplaint.geminiModelUsed && (
                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-500 px-2 py-1 rounded-full border border-blue-200">
                                            <Bot size={10} /> AI Generated
                                        </span>
                                    )}
                                </h2>
                                <p className="text-sm text-gray-500 font-mono">#{selectedComplaint._id}</p>
                            </div>
                            <button onClick={() => setSelectedComplaint(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* User & Booking Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Raised By</h3>
                                    <p className="font-semibold text-gray-800">{selectedComplaint.raisedBy?.name || 'Unknown User'}</p>
                                    <p className="text-sm text-gray-500 mt-1">{selectedComplaint.raisedBy?.email}</p>
                                    <p className="text-xs text-gray-400 mt-1 capitalize">Role: {selectedComplaint.raisedByRole}</p>
                                </div>
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Booking Reference</h3>
                                    <p className="font-mono text-sm font-semibold text-gray-800">{selectedComplaint.booking?._id || selectedComplaint.booking || 'N/A'}</p>
                                    <p className="text-xs text-gray-400 mt-1">Filed on: {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Complaint Content */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Complaint Title</h3>
                                    <p className="font-semibold text-gray-800 mt-1">{selectedComplaint.title}</p>
                                </div>
                                <div className="px-4 py-4">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedComplaint.description}</p>
                                </div>
                            </div>

                            {/* AI Insights */}
                            {(selectedComplaint.aiRefinedDescription || selectedComplaint.aiSuggestedResolution) && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                        <Bot size={14} /> AI Analysis
                                    </h3>
                                    {selectedComplaint.aiRefinedDescription && (
                                        <div className="mb-3">
                                            <p className="text-[11px] text-blue-500 font-bold uppercase mb-1">Refined Description</p>
                                            <p className="text-sm text-blue-800">{selectedComplaint.aiRefinedDescription}</p>
                                        </div>
                                    )}
                                    {selectedComplaint.aiSuggestedResolution && (
                                        <div>
                                            <p className="text-[11px] text-blue-500 font-bold uppercase mb-1">Suggested Resolution</p>
                                            <p className="text-sm text-blue-800">{selectedComplaint.aiSuggestedResolution}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Category & AI Model */}
                            <div className="flex flex-wrap gap-3">
                                {selectedComplaint.aiCategory && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1.5 rounded-full">
                                        Category: {CATEGORY_META[selectedComplaint.aiCategory]?.label || selectedComplaint.aiCategory}
                                    </span>
                                )}
                                {selectedComplaint.geminiModelUsed && (
                                    <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-full">
                                        <Bot size={12} /> {selectedComplaint.geminiModelUsed}
                                    </span>
                                )}
                                {selectedComplaint.aiConfidence !== null && selectedComplaint.aiConfidence !== undefined && (
                                    <span className="inline-flex items-center gap-1 text-xs font-bold bg-green-50 text-green-600 border border-green-200 px-3 py-1.5 rounded-full">
                                        Confidence: {Math.round(selectedComplaint.aiConfidence * 100)}%
                                    </span>
                                )}
                            </div>

                            {/* Admin Response Section */}
                            <div className="border-t border-gray-200 pt-6">
                                <h3 className="text-sm font-bold text-gray-800 mb-4">Admin Response & Action</h3>

                                <div className="mb-4">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Update Status</label>
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium text-gray-700"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Admin Response / Comment</label>
                                    <textarea
                                        value={adminResponse}
                                        onChange={(e) => setAdminResponse(e.target.value)}
                                        rows={4}
                                        placeholder="Write your response to the user here..."
                                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none"
                                    />
                                </div>

                                <button
                                    onClick={() => handleUpdateComplaint(selectedComplaint._id)}
                                    disabled={updating}
                                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                                >
                                    {updating ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={16} /> Update Complaint
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminComplaints;
