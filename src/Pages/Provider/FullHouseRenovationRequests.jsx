import React, { useState, useEffect } from 'react';
import { MapPin, DollarSign, User, Calendar, FileText, CheckCircle2, X, AlertCircle, RefreshCw } from 'lucide-react';
import { getAvailableRenovationRequests, submitQuote } from '../../services/renovationService';
import toast from 'react-hot-toast';

const FullHouseRenovationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
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
      console.log('[FullHouseRenovationRequests] Fetching available requests...');
      const data = await getAvailableRenovationRequests();
      console.log('Available renovation requests:', data);
      setRequests(data || []);
    } catch (error) {
      console.error('[FullHouseRenovationRequests] Error fetching requests:', error);
      console.error('Error details:', error.message);
      const errorMsg = error.message || 'Failed to fetch renovation requests';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitQuote = async () => {
    if (!quoteData.quote || !quoteData.timeline) {
      toast.error('Please fill in quote amount and timeline');
      return;
    }

    try {
      setSubmittingQuote(true);
      await submitQuote(selectedRequest._id, {
        quote: parseFloat(quoteData.quote),
        timeline: quoteData.timeline
      });
      toast.success('Quote submitted successfully!');
      setShowQuoteModal(false);
      setQuoteData({ quote: '', timeline: '' });
      setSelectedRequest(null);
      fetchRequests();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to submit quote');
    } finally {
      setSubmittingQuote(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">
              Available Renovation Requests
            </h1>
            <p className="text-lg text-slate-600">
              {requests.length} project{requests.length !== 1 ? 's' : ''} in your service area
            </p>
          </div>
          <button
            onClick={fetchRequests}
            disabled={loading}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-lg transition flex items-center gap-2"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-red-900">Error Loading Requests</p>
              <p className="text-red-700 text-sm">{error}</p>
              <button
                onClick={() => {
                  // Trigger diagnostic
                  console.log('[Diagnostics] Fetching provider diagnostics...');
                  fetch(`${import.meta.env.VITE_API_URL}/api/renovations/provider/diagnostics`, {
                    credentials: 'include'
                  })
                    .then(r => r.json())
                    .then(data => {
                      console.log('[Diagnostics]', data);
                      if(data.success) {
                        const d = data.diagnostic;
                        console.log('Provider exists:', d.provider.exists);
                        console.log('Total pending requests:', d.requests.totalPending);
                        console.log('Sample requests:', d.requests.sampleRequests);
                      }
                    })
                    .catch(err => console.error('[Diagnostics Error]', err));
                }}
                className="mt-2 text-sm px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Run Diagnostics
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <AlertCircle size={64} className="mx-auto text-slate-300 mb-4" />
            <p className="text-lg text-slate-600 mb-2">No available renovation requests</p>
            <p className="text-slate-500 mb-8">
              There are currently no renovation projects matching your service areas.
            </p>
            <div className="inline-block text-left bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
              <p className="text-sm font-bold text-blue-900 mb-3">💡 How to get started:</p>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✓ <strong>Setup Service Areas</strong> - Go to your Provider Profile and add the cities/areas where you work</li>
                <li>✓ <strong>Wait for Projects</strong> - Renovation requests in your service areas will appear here</li>
                <li>✓ <strong>Browse & Bid</strong> - Click "Submit Your Quote" to send an estimate to customers</li>
                <li>✓ <strong>Get Selected</strong> - Customers will review your quotes and accept the best one</li>
              </ul>
            </div>
            <button
              onClick={fetchRequests}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
            >
              Refresh to Check Again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map((request) => (
              <div key={request._id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900 flex-1">{request.projectTitle}</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                    {request.propertyType}
                  </span>
                </div>

                {/* Description */}
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{request.description}</p>

                {/* Details Grid */}
                <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-lg">
                  {/* Budget */}
                  <div className="flex items-center gap-3">
                    <DollarSign size={18} className="text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-600">Estimated Budget</p>
                      <p className="text-lg font-bold text-slate-900">₹{request.estimatedBudget.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-red-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-600">Location</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {request.area}, {request.city} - {request.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Customer */}
                  <div className="flex items-center gap-3">
                    <User size={18} className="text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-600">Customer</p>
                      <p className="text-sm font-semibold text-slate-900">{request.customer.name}</p>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className="text-orange-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-600">Duration</p>
                      <p className="text-sm font-semibold text-slate-900">{request.estimatedDuration}</p>
                    </div>
                  </div>

                  {/* Property Type */}
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-purple-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-slate-600">Renovation Type</p>
                      <p className="text-sm font-semibold text-slate-900">
                        {request.renovationType.charAt(0).toUpperCase() + request.renovationType.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Project Scope Tags */}
                {request.projectScope && request.projectScope.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-bold text-slate-600 mb-2">Project Scope:</p>
                    <div className="flex flex-wrap gap-2">
                      {request.projectScope.map((scope) => (
                        <span
                          key={scope}
                          className="px-2.5 py-1 bg-slate-200 text-slate-700 text-xs rounded-full font-semibold"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quote Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm font-bold text-blue-900">💡 Quotes Received: {request.quotesReceived}</p>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowQuoteModal(true);
                  }}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} /> Submit Your Quote
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quote Modal */}
      {showQuoteModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-900">Submit Quote</h2>
              <button
                onClick={() => {
                  setShowQuoteModal(false);
                  setSelectedRequest(null);
                  setQuoteData({ quote: '', timeline: '' });
                }}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <X size={20} className="text-slate-600" />
              </button>
            </div>

            {/* Project Details */}
            <div className="bg-slate-50 p-4 rounded-lg mb-6">
              <p className="text-sm text-slate-600 mb-1">Project:</p>
              <p className="font-bold text-slate-900">{selectedRequest.projectTitle}</p>
              <p className="text-sm text-slate-600 mt-2">Budget: ₹{selectedRequest.estimatedBudget.toLocaleString()}</p>
            </div>

            {/* Form */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Your Quote Amount *</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-xl text-slate-600">₹</span>
                  <input
                    type="number"
                    value={quoteData.quote}
                    onChange={(e) => setQuoteData({ ...quoteData, quote: e.target.value })}
                    placeholder="Enter your quote"
                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Timeline *</label>
                <input
                  type="text"
                  value={quoteData.timeline}
                  onChange={(e) => setQuoteData({ ...quoteData, timeline: e.target.value })}
                  placeholder="e.g., 2 weeks, 1 month"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowQuoteModal(false);
                  setSelectedRequest(null);
                  setQuoteData({ quote: '', timeline: '' });
                }}
                className="flex-1 px-4 py-3 border-2 border-slate-300 text-slate-900 font-bold rounded-lg hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitQuote}
                disabled={submittingQuote}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-lg transition"
              >
                {submittingQuote ? 'Submitting...' : 'Submit Quote'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullHouseRenovationRequests;

