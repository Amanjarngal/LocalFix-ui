import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  DollarSign, 
  User, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  RefreshCw, 
  Briefcase, 
  ChevronRight, 
  Clock, 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  ShieldCheck,
  Building2,
  Mic2,
  Zap
} from 'lucide-react';
import { getAvailableRenovationRequests, submitQuote } from '../../services/renovationService';
import toast from 'react-hot-toast';

const FullHouseRenovationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteData, setQuoteData] = useState({ quote: '', timeline: '' });
  const [submittingQuote, setSubmittingQuote] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAvailableRenovationRequests();
      setRequests(data || []);
    } catch (error) {
      setError(error.message || 'Failed to fetch renovation requests');
      toast.error('Could not load board data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = (request) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleSubmitQuote = async () => {
    if (!quoteData.quote || !quoteData.timeline) {
      toast.error('Please complete the bid details');
      return;
    }

    try {
      setSubmittingQuote(true);
      await submitQuote(selectedRequest._id, {
        quote: parseFloat(quoteData.quote),
        timeline: quoteData.timeline
      });
      toast.success('Proposal transmitted successfully!');
      setShowQuoteModal(false);
      setShowDetailModal(false);
      setQuoteData({ quote: '', timeline: '' });
      fetchRequests();
    } catch (error) {
      toast.error(error.message || 'Failed to transmit proposal');
    } finally {
      setSubmittingQuote(false);
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Light Hero Section */}
      <div className="bg-slate-50 border-b border-slate-100 pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-black text-[10px] uppercase tracking-widest mb-6 border border-blue-100"
              >
                <Zap size={14} /> Open Opportunities
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
                Project <span className="text-blue-600">Dashboard.</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed">
                Connect with high-intent renovation leads. All projects are AI-pre-qualified for your expertise.
              </p>
            </div>
            
            <button
              onClick={fetchRequests}
              disabled={loading}
              className="px-8 py-4 bg-white border border-slate-200 hover:border-blue-500 text-slate-900 font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-3 active:scale-95"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              {loading ? 'Syncing...' : 'Refresh Board'}
            </button>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-50 rounded-3xl h-80 animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-[3rem] border border-slate-100">
            <Briefcase size={40} className="mx-auto text-slate-200 mb-6" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No projects active</h3>
            <p className="text-slate-500 text-sm mb-12">New requests will appear here as soon as they are posted.</p>
            <button onClick={fetchRequests} className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all">
                Refresh Board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request, idx) => (
              <motion.div 
                key={request._id} 
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleOpenDetail(request)}
                className="group bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer p-8 flex flex-col shadow-sm hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-6">
                    {request.aiCallStatus === 'completed' ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 text-[9px] font-black uppercase tracking-wider">
                        <Sparkles size={12} fill="currentColor" /> AI Qualified
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-400 rounded-full border border-slate-100 text-[9px] font-black uppercase tracking-wider">
                        <Clock size={12} /> Verifying
                      </div>
                    )}
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                </div>

                <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {request.projectTitle}
                </h3>
                <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">
                    {request.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="p-4 bg-slate-50 rounded-xl group-hover:bg-blue-50/50 transition-colors">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Budget</p>
                        <p className="text-base font-black text-slate-900">₹{request.estimatedBudget.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl group-hover:bg-blue-50/50 transition-colors">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Configuration</p>
                        <p className="text-xs font-black text-slate-900 uppercase">{request.propertyType}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400" />
                        <span className="text-xs font-bold text-slate-700">{request.area}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{request.estimatedDuration}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Light Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedRequest && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 overflow-y-auto"
          >
            <motion.div 
                initial={{ scale: 0.98, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.98, opacity: 0, y: 10 }}
                className="bg-white rounded-[2.5rem] max-w-5xl w-full overflow-hidden shadow-2xl flex flex-col lg:flex-row h-full max-h-[90vh] border border-slate-100"
            >
              {/* Transcript Sidebar */}
              <div className="w-full lg:w-[400px] bg-slate-50/50 border-r border-slate-100 p-10 overflow-y-auto">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 border border-slate-100">
                    <Mic2 size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase">Interview Record</h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AI Call Results</p>
                  </div>
                </div>

                {selectedRequest.aiCallStatus === 'completed' ? (
                  <div className="space-y-6">
                    {selectedRequest.aiCallAnswers.map((item, idx) => (
                      <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <p className="text-[9px] font-black text-blue-600 uppercase mb-2">Step {idx + 1}</p>
                        <p className="text-[10px] font-black text-slate-400 mb-2 uppercase leading-tight">{item.question}</p>
                        <p className="text-sm font-bold text-slate-900 italic leading-relaxed">"{item.answer}"</p>
                      </div>
                    ))}
                    <div className="mt-8 p-6 bg-slate-900 rounded-3xl text-white">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck size={16} className="text-blue-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Lead Verified</span>
                        </div>
                        <p className="text-[10px] font-medium text-slate-400 mb-4 leading-relaxed">AI has confirmed structural intent and budget availability for this project.</p>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[95%]" />
                        </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Clock size={32} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Interview record pending</p>
                  </div>
                )}
              </div>

              {/* Summary Area */}
              <div className="flex-1 p-10 md:p-14 overflow-y-auto flex flex-col">
                <div className="flex justify-between items-start mb-10">
                  <button onClick={() => setShowDetailModal(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors">
                    <X size={18} />
                  </button>
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg">
                    <Building2 size={14} /> {selectedRequest.propertyType}
                  </div>
                </div>

                <div className="flex-1">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
                        {selectedRequest.projectTitle}
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                                    <DollarSign size={20} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Budget</p>
                                    <p className="text-lg font-black text-slate-900">₹{selectedRequest.estimatedBudget.toLocaleString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Owner</p>
                                    <p className="text-lg font-black text-slate-900">{selectedRequest.customer?.name}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Date</p>
                                    <p className="text-lg font-black text-slate-900">{new Date(selectedRequest.preferredStartDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                                    <Briefcase size={20} />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Scope</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {selectedRequest.projectScope.slice(0, 2).map(s => (
                                            <span key={s} className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded-md text-[8px] font-black uppercase">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 mb-10">
                        <p className="text-slate-600 font-medium leading-relaxed italic">"{selectedRequest.description}"</p>
                    </div>
                </div>

                <button onClick={() => setShowQuoteModal(true)} className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3">
                    Submit Proposal <ArrowRight size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Light Bidding Modal */}
      <AnimatePresence>
        {showQuoteModal && selectedRequest && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[110] p-6"
          >
            <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full p-10 overflow-hidden relative border border-slate-100"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-black text-slate-900">New Bid</h2>
                <button onClick={() => setShowQuoteModal(false)} className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <X size={18} />
                </button>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Total Estimate *</label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-200 group-focus-within:text-blue-500 transition-colors">₹</div>
                    <input
                      type="number"
                      value={quoteData.quote}
                      onChange={(e) => setQuoteData({ ...quoteData, quote: e.target.value })}
                      className="w-full pl-12 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-black text-xl transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Timeline *</label>
                  <input
                    type="text"
                    value={quoteData.timeline}
                    onChange={(e) => setQuoteData({ ...quoteData, timeline: e.target.value })}
                    placeholder="e.g. 4 Months"
                    className="w-full px-6 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none font-black text-base transition-all"
                  />
                </div>

                <button
                  onClick={handleSubmitQuote}
                  disabled={submittingQuote}
                  className="w-full py-5 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-300 text-white font-black rounded-2xl transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
                >
                  {submittingQuote ? <RefreshCw className="animate-spin" size={18} /> : 'Send Bid'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FullHouseRenovationRequests;
