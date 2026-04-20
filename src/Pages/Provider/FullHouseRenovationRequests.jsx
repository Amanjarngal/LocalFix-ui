import React, { useState, useEffect } from 'react';
import { 
  MapPin, DollarSign, User, Calendar, FileText, CheckCircle2, 
  X, AlertCircle, RefreshCw, Briefcase, ChevronRight, 
  Clock, Sparkles, MessageSquare, ArrowRight, ShieldCheck
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
      toast.error('Could not load projects');
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
      toast.error('Please fill in all quote details');
      return;
    }

    try {
      setSubmittingQuote(true);
      await submitQuote(selectedRequest._id, {
        quote: parseFloat(quoteData.quote),
        timeline: quoteData.timeline
      });
      toast.success('Your quote has been sent!');
      setShowQuoteModal(false);
      setShowDetailModal(false);
      setQuoteData({ quote: '', timeline: '' });
      fetchRequests();
    } catch (error) {
      toast.error(error.message || 'Failed to submit quote');
    } finally {
      setSubmittingQuote(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Header Section with Gradient Blur */}
      <div className="relative overflow-hidden bg-slate-900 pt-32 pb-40 px-6 md:px-12">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-blue-500 rounded-full blur-[160px] opacity-20" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-72 h-72 bg-purple-500 rounded-full blur-[120px] opacity-20" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-xl">
                  <Briefcase className="text-blue-400" size={24} />
                </div>
                <span className="text-blue-400 font-bold tracking-widest text-xs uppercase">Partner Opportunities</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                Project Dashboard
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
                Connect with high-value renovation leads. Projects marked with <Sparkles className="inline text-yellow-400" size={18} /> are AI-pre-qualified for your convenience.
              </p>
            </div>
            
            <button
              onClick={fetchRequests}
              disabled={loading}
              className="group self-start px-8 py-4 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-2xl transition-all shadow-xl shadow-slate-900/10 flex items-center gap-3 hover:-translate-y-1"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
              Refresh Board
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-24 relative z-20">
        
        {/* Error Handling */}
        {error && (
          <div className="mb-12 p-6 bg-red-50/80 backdrop-blur-md border border-red-100 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="p-3 bg-red-100 rounded-2xl">
              <AlertCircle size={24} className="text-red-600" />
            </div>
            <div>
              <p className="font-black text-red-900">Sync Error</p>
              <p className="text-red-700 font-medium text-sm">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[32px] p-8 h-[400px] animate-pulse relative">
                <div className="h-8 bg-slate-100 rounded-2xl w-3/4 mb-6" />
                <div className="space-y-4">
                  <div className="h-4 bg-slate-50 rounded-lg w-full" />
                  <div className="h-4 bg-slate-50 rounded-lg w-5/6" />
                  <div className="h-20 bg-slate-50 rounded-3xl w-full mt-8" />
                </div>
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase size={40} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No active projects</h3>
            <p className="text-slate-500 font-medium mb-12">New renovation requests will appear here as soon as they are posted.</p>
            <button
              onClick={fetchRequests}
              className="px-10 py-4 bg-slate-900 text-white font-black rounded-2xl hover:scale-105 transition-all shadow-xl"
            >
              Refresh Board
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {requests.map((request) => (
              <div 
                key={request._id} 
                onClick={() => handleOpenDetail(request)}
                className="group bg-white rounded-[32px] p-1 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-500 cursor-pointer overflow-hidden relative"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100 transition-colors" />

                <div className="p-7">
                  {/* Card Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      {request.aiCallStatus === 'completed' && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100 mb-3 w-fit">
                          <ShieldCheck size={12} fill="currentColor" className="text-green-200" />
                          <span className="text-[10px] font-black uppercase tracking-wider">AI Qualified Lead</span>
                        </div>
                      )}
                      <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {request.projectTitle}
                      </h3>
                    </div>
                  </div>

                  {/* Core Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-slate-50 rounded-3xl group-hover:bg-blue-50/50 transition-colors border border-transparent group-hover:border-blue-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Budget</p>
                      <p className="text-lg font-black text-slate-900">₹{request.estimatedBudget.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-3xl group-hover:bg-blue-50/50 transition-colors border border-transparent group-hover:border-blue-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Type</p>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{request.propertyType}</p>
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="flex items-center gap-4 mb-8 text-slate-500 px-2">
                    <div className="p-2 bg-slate-100 rounded-xl group-hover:bg-blue-100 transition-colors">
                      <MapPin size={18} className="text-slate-400 group-hover:text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{request.area}</p>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{request.city}</p>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                      <clock className="text-slate-400" size={16} />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{request.estimatedDuration}</span>
                    </div>
                    <div className="p-3 bg-slate-900 text-white rounded-2xl group-hover:scale-110 transition-all group-hover:bg-blue-600">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Project Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl flex items-center justify-center z-[100] p-6 overflow-y-auto">
          <div className="bg-white rounded-[48px] max-w-5xl w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
              
              {/* Left Side: Project Info */}
              <div className="flex-1 p-10 md:p-14 overflow-y-auto border-r border-slate-100">
                <div className="flex justify-between items-start mb-10">
                  <button 
                    onClick={() => setShowDetailModal(false)}
                    className="p-3 hover:bg-slate-100 rounded-2xl transition-all"
                  >
                    <X size={24} className="text-slate-400" />
                  </button>
                  <span className="px-5 py-2 bg-blue-50 text-blue-600 text-xs font-black rounded-full border border-blue-100 uppercase tracking-widest">
                    {selectedRequest.renovationType} Project
                  </span>
                </div>

                <div className="mb-12">
                  <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                    {selectedRequest.projectTitle}
                  </h2>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed italic">
                    "{selectedRequest.description}"
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                        <DollarSign size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Budget</p>
                        <p className="text-xl font-black text-slate-900">₹{selectedRequest.estimatedBudget.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</p>
                        <p className="text-xl font-black text-slate-900">{selectedRequest.customer?.name}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Exp. Start</p>
                        <p className="text-xl font-black text-slate-900">
                          {new Date(selectedRequest.preferredStartDate).toLocaleDateString('en-IN', { month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                        <Briefcase size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scope Highlights</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedRequest.projectScope.slice(0, 2).map(s => (
                            <span key={s} className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md uppercase">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowQuoteModal(true)}
                    className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl transition-all shadow-xl shadow-blue-300 transform active:scale-95 flex items-center justify-center gap-3"
                  >
                    Bid on Project <ArrowRight size={20} />
                  </button>
                </div>
              </div>

              {/* Right Side: AI Qualification Sidebar */}
              <div className="w-full lg:w-[400px] bg-slate-50 p-10 md:p-14 overflow-y-auto">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                    <Sparkles className="text-blue-600 underline" size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase italic">Smart Analysis</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Pre-Qualification Results</p>
                  </div>
                </div>

                {selectedRequest.aiCallStatus === 'completed' && selectedRequest.aiCallAnswers?.length > 0 ? (
                  <div className="space-y-6">
                    {selectedRequest.aiCallAnswers.map((item, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-200 rounded-full group-hover:bg-blue-500 transition-colors" />
                        <div className="pl-6 pt-1">
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2 opacity-70">Step {idx + 1}</p>
                          <p className="text-xs font-black text-slate-400 uppercase mb-2 leading-tight">{item.question}</p>
                          <p className="text-base font-bold text-slate-900 leading-relaxed bg-white/50 p-3 rounded-2xl border border-white/80 shadow-sm">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    ))}

                    <div className="mt-12 p-6 bg-slate-900 rounded-[32px] text-white overflow-hidden relative shadow-2xl">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[80px] opacity-20" />
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/20 rounded-xl">
                          <MessageSquare size={16} className="text-blue-400" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tighter">AI Prediction</span>
                      </div>
                      <p className="text-sm font-bold text-slate-300 mb-2">Confidence Level</p>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                        <div className="h-full bg-blue-500 w-[94%]" />
                      </div>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-wider">High Intent Client • Fully Qualified</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                    <div className="w-20 h-20 bg-white rounded-[32px] shadow-sm flex items-center justify-center mb-6">
                      <clock size={32} className="text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Waiting for Qualifiction</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quote Modal */}
      {showQuoteModal && selectedRequest && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md flex items-center justify-center z-[110] p-6 animate-in fade-in">
          <div className="bg-white rounded-[40px] shadow-2xl max-w-md w-full p-10 overflow-hidden relative">
            {/* Visual Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-70" />

            <div className="flex justify-between items-center mb-10 relative z-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight italic">Submit Bid</h2>
              <button 
                onClick={() => setShowQuoteModal(false)}
                className="p-3 hover:bg-slate-100 rounded-2xl transition-all"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="space-y-8 relative z-10">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Total Project Estimate *</label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-300 group-focus-within:text-blue-500 transition-colors">₹</span>
                  <input
                    type="number"
                    value={quoteData.quote}
                    onChange={(e) => setQuoteData({ ...quoteData, quote: e.target.value })}
                    placeholder="250,000"
                    className="w-full pl-12 pr-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl outline-none font-black text-xl transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-2">Estimated Timeline *</label>
                <input
                  type="text"
                  value={quoteData.timeline}
                  onChange={(e) => setQuoteData({ ...quoteData, timeline: e.target.value })}
                  placeholder="e.g. 3 Months, 24 Weeks"
                  className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-3xl outline-none font-black text-base transition-all"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  onClick={() => setShowQuoteModal(false)}
                  className="flex-1 py-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-3xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitQuote}
                  disabled={submittingQuote}
                  className="flex-[1.5] py-5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-black rounded-3xl transition-all shadow-xl shadow-slate-300 flex items-center justify-center gap-2"
                >
                  {submittingQuote ? <RefreshCw className="animate-spin" size={20} /> : 'Send Proposal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullHouseRenovationRequests;
