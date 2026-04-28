import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyRenovationRequests } from '../services/renovationService';
import { Hammer, Plus, MapPin, DollarSign, Clock, CheckCircle2, AlertCircle, ChevronRight, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const UserRenovationRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getMyRenovationRequests();
      setRequests(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load your requests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return { color: 'bg-amber-50 text-amber-600 border-amber-100', icon: <AlertCircle size={14} />, label: 'Active Inquiry' };
      case 'accepted':
        return { color: 'bg-green-50 text-green-600 border-green-100', icon: <CheckCircle2 size={14} />, label: 'Expert Hired' };
      case 'in_progress':
        return { color: 'bg-blue-50 text-blue-600 border-blue-100', icon: <Clock size={14} />, label: 'Project Live' };
      case 'completed':
        return { color: 'bg-slate-100 text-slate-600 border-slate-200', icon: <CheckCircle2 size={14} />, label: 'Completed' };
      default:
        return { color: 'bg-slate-50 text-slate-500 border-slate-100', icon: <Clock size={14} />, label: status };
    }
  };

  return (
    <div className="min-h-screen bg-white py-16 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Simple Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">My Projects</h1>
            <p className="text-slate-500 font-medium">Overview of your active renovation requests.</p>
          </div>
          <Link
            to="/full-house-renovation/request"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
          >
            <Plus size={18} /> New Request
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-slate-50 rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-slate-50 rounded-3xl border border-slate-100 p-20 text-center">
            <Briefcase size={48} className="mx-auto text-slate-200 mb-6" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">No projects found</h2>
            <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm">Ready to transform your home? Start by submitting your first request.</p>
            <Link
              to="/full-house-renovation/request"
              className="inline-flex px-8 py-3 bg-white border border-slate-200 text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((request, idx) => {
              const status = getStatusConfig(request.status);
              return (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => navigate(`/full-house-renovation/request/${request._id}`)}
                  className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer p-6 flex flex-col shadow-sm hover:shadow-md"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 ${status.color}`}>
                        {status.icon} {status.label}
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {request.projectTitle}
                  </h3>
                  <p className="text-slate-500 text-sm font-medium line-clamp-1 mb-6">
                    {request.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-auto pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                        <DollarSign size={14} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-700">₹{request.estimatedBudget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400" />
                        <span className="text-sm font-bold text-slate-700 truncate">{request.area}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Clock size={12} /> {request.estimatedDuration}
                    </div>
                    <div className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {request.quotesReceived || 0} Quotes
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRenovationRequests;
