import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Briefcase,
    CheckCircle2,
    XCircle,
    Eye,
    Search,
    User,
    Mail,
    Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProviderApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchApplications = async () => {
        try {
            const response = await axios.get(`${apiUrl}/api/providers`);
            setApplications(response.data.data || []);
        } catch (error) {
            console.error("Error fetching applications:", error);
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, [apiUrl]);

    const handleStatusUpdate = async (id, status) => {
        try {
            const response = await axios.patch(`${apiUrl}/api/providers/status/${id}`, { status });
            if (response.data.success) {
                toast.success(`Application ${status} successfully`);
                fetchApplications(); // Refresh list
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    const filteredApps = applications.filter(app =>
        app.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Provider Applications</h1>
                    <p className="text-gray-500">Review and verify service partner enrollment requests.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none w-full md:w-64 transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredApps.length > 0 ? (
                    filteredApps.map((app) => (
                        <div key={app._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                        <Briefcase size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">{app.businessName}</h3>
                                        <div className="flex flex-wrap gap-4 mt-1">
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <User size={14} /> {app.ownerName}
                                            </span>
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <Mail size={14} /> {app.email}
                                            </span>
                                            <span className="text-sm text-gray-500 flex items-center gap-1">
                                                <Phone size={14} /> {app.phone}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center flex-wrap gap-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${app.status === 'approved' ? 'bg-green-50 text-green-600' :
                                            app.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                                'bg-amber-50 text-amber-600'
                                        }`}>
                                        {app.status}
                                    </span>

                                    <div className="h-8 w-[1px] bg-gray-100 hidden lg:block mx-2"></div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            title="View Details"
                                            className="p-2 border border-gray-100 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
                                        >
                                            <Eye size={18} />
                                        </button>

                                        {app.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'approved')}
                                                    className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                                                >
                                                    <CheckCircle2 size={16} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(app._id, 'rejected')}
                                                    className="flex items-center gap-1 px-3 py-2 border border-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
                                                >
                                                    <XCircle size={16} /> Reject
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white py-12 text-center rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-400">No applications found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderApplications;
