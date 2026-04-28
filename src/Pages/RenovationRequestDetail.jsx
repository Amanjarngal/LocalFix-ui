import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, 
    Star, 
    MapPin, 
    DollarSign, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    AlertCircle,
    ChevronRight,
    MessageSquare,
    Phone,
    User,
    Sparkles,
    ShieldCheck,
    Briefcase,
    Building2,
    Gem,
    ArrowUpRight
} from 'lucide-react';
import { getRenovationRequest, acceptQuote } from '../services/renovationService';
import toast from 'react-hot-toast';

const RenovationRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [acceptingQuote, setAcceptingQuote] = useState(null);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const data = await getRenovationRequest(id);
      setRequest(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load project details');
      navigate('/full-house-renovation/my-requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (providerId) => {
    try {
      setAcceptingQuote(providerId);
      const updatedRequest = await acceptQuote(id, providerId);
      setRequest(updatedRequest);
      toast.success('Quote accepted!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to accept quote');
    } finally {
      setAcceptingQuote(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing...</p>
        </div>
      </div>
    );
  }

  if (!request) return null;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending': return { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: <Clock size={14} />, label: 'Market Active' };
      case 'accepted': return { color: 'text-green-600 bg-green-50 border-green-100', icon: <CheckCircle2 size={14} />, label: 'Expert Hired' };
      default: return { color: 'text-slate-500 bg-slate-50 border-slate-100', icon: <AlertCircle size={14} />, label: status };
    }
  };

  const status = getStatusConfig(request.status);

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Light Header */}
      <div className="bg-slate-50 border-b border-slate-100 pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] opacity-60 -mr-32 -mt-32" />
        <div className="max-w-6xl mx-auto relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold mb-10 transition-colors group"
          >
            <ArrowLeft size={18} /> Back to Dashboard
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border font-black text-[9px] uppercase tracking-widest mb-6 ${status.color}`}>
                    {status.icon} {status.label}
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-none tracking-tighter mb-4">
                    {request.projectTitle}
                </h1>
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                    {request.description}
                </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Budget</p>
                <p className="text-2xl font-black text-slate-900">₹{request.estimatedBudget.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            {/* Project Overview */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                    <Briefcase size={20} />
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Project Summary</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-slate-50 rounded-3xl border border-slate-100">
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Type</p>
                    <p className="text-sm font-black text-slate-900 uppercase">{request.propertyType}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Renovation</p>
                    <p className="text-sm font-black text-slate-900 uppercase">{request.renovationType.replace('-', ' ')}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Duration</p>
                    <p className="text-sm font-black text-slate-900">{request.estimatedDuration}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Status</p>
                    <p className="text-sm font-black text-slate-900 capitalize">{request.status}</p>
                </div>
              </div>
            </section>

            {/* Quote Record */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100">
                        <MessageSquare size={20} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Response Record</h2>
                </div>
                <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
                    {request.responses?.length || 0} Quotes Received
                </span>
              </div>

              {(!request.responses || request.responses.length === 0) ? (
                <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                  <Clock size={32} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Awaiting Expert Responses...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {request.responses.map((response, idx) => (
                    <div key={idx} className={`p-8 rounded-[2.5rem] border-2 transition-all ${response.status === 'accepted' ? 'border-green-500 bg-green-50/20' : 'border-slate-100 hover:border-blue-200 bg-white'}`}>
                      <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg">
                                {response.provider?.businessName?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">{response.provider?.businessName}</h3>
                                <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={10} className={i < (response.provider?.rating || 4.5) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'} />
                                    ))}
                                    <span className="text-[10px] font-black text-slate-400 uppercase ml-2">{response.provider?.rating?.toFixed(1) || '4.5'} Rating</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Expert Quote</p>
                            <p className="text-2xl font-black text-slate-900">₹{response.quote.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Proposed Timeline</p>
                            <p className="text-sm font-black text-slate-800">{response.timeline}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Verification</p>
                            <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase">
                                <ShieldCheck size={14} /> LocalFix Verified
                            </div>
                        </div>
                      </div>

                      {request.status === 'pending' && response.status === 'pending' ? (
                        <button
                          onClick={() => handleAcceptQuote(response.provider._id)}
                          disabled={acceptingQuote === response.provider._id}
                          className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-[0.98]"
                        >
                          {acceptingQuote === response.provider._id ? 'Processing...' : 'Confirm Partnership'}
                        </button>
                      ) : response.status === 'accepted' ? (
                        <div className="py-4 bg-green-500 text-white rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-500/20">
                            <CheckCircle2 size={16} /> Partner Active
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-32">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-600 border border-red-100">
                        <MapPin size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase">Project Site</h3>
                </div>
                <div className="space-y-6">
                    <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Full Address</p>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">{request.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">City</p>
                            <p className="text-sm font-black text-slate-900">{request.city}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Pincode</p>
                            <p className="text-sm font-black text-slate-900">{request.pincode}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-10 border-t border-slate-50">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                            <User size={20} />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 uppercase">Project Lead</h3>
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm font-black text-slate-900">{request.contactName}</p>
                        <a href={`tel:${request.contactNumber}`} className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
                            <Phone size={12} /> {request.contactNumber}
                        </a>
                    </div>
                </div>

                {request.status === 'accepted' && request.provider && (
                    <div className="mt-10 pt-10 border-t border-slate-50">
                        <div className="flex items-center gap-3 mb-6 text-green-600">
                            <Gem size={20} />
                            <h3 className="text-lg font-black uppercase">Hired Expert</h3>
                        </div>
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <p className="text-sm font-black text-slate-900 mb-1">{request.provider?.businessName}</p>
                            <p className="text-xs text-slate-500 mb-4">{request.provider?.phone}</p>
                            <div className="flex items-center gap-2 text-[9px] font-black text-green-600 uppercase">
                                <ShieldCheck size={12} /> Partner Verified
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default RenovationRequestDetail;
