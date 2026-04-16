import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, DollarSign, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
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
      toast.error('Failed to load request');
      navigate('/full-house-renovation');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (providerId) => {
    try {
      setAcceptingQuote(providerId);
      const updatedRequest = await acceptQuote(id, providerId);
      setRequest(updatedRequest);
      toast.success('Quote accepted! Provider details have been sent to your contact.');
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to accept quote');
    } finally {
      setAcceptingQuote(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading request details...</p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-bold mb-4">Request not found</p>
          <button
            onClick={() => navigate('/full-house-renovation')}
            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold mb-4"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="text-4xl font-black text-slate-900">{request.projectTitle}</h1>
          <p className="text-slate-600 mt-2">{request.description}</p>
        </div>

        {/* Status Badge & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <p className="text-xs text-slate-600 font-bold mb-2">Status</p>
            <div className="flex items-center gap-2">
              {request.status === 'pending' && <Clock size={20} className="text-yellow-600" />}
              {request.status === 'accepted' && <CheckCircle2 size={20} className="text-green-600" />}
              <span className="font-bold text-slate-900 capitalize">{request.status}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <p className="text-xs text-slate-600 font-bold mb-2">Budget</p>
            <p className="text-2xl font-black text-slate-900">₹{request.estimatedBudget.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <p className="text-xs text-slate-600 font-bold mb-2">Quotes Received</p>
            <p className="text-2xl font-black text-blue-600">{request.quotesReceived || 0}</p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md">
            <p className="text-xs text-slate-600 font-bold mb-2">Duration</p>
            <p className="font-bold text-slate-900">{request.estimatedDuration}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Project Details */}
          <div className="lg:col-span-2">
            {/* Project Details Card */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b">Project Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Property Type</p>
                  <p className="text-lg font-bold text-slate-900">{request.propertyType}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Renovation Type</p>
                  <p className="text-lg font-bold text-slate-900 capitalize">
                    {request.renovationType.replace('-', ' ')}
                  </p>
                </div>
              </div>

              {request.projectScope && request.projectScope.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-3">Work Involved</p>
                  <div className="flex flex-wrap gap-2">
                    {request.projectScope.map(scope => (
                      <span key={scope} className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Timeline</p>
                <div className="flex items-center gap-2 text-slate-900">
                  <Calendar size={18} />
                  <span className="font-semibold">{request.estimatedDuration}</span>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b">Location</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-slate-600">Address</p>
                    <p className="font-semibold text-slate-900">{request.address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">City</p>
                    <p className="font-bold text-slate-900">{request.city}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Area</p>
                    <p className="font-bold text-slate-900">{request.area}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">Pincode</p>
                    <p className="font-bold text-slate-900">{request.pincode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quotes Section */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b">
                Received Quotes ({request.responses?.length || 0})
              </h2>

              {(!request.responses || request.responses.length === 0) ? (
                <div className="text-center py-12">
                  <Clock size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-600 mb-4">No quotes received yet</p>
                  <p className="text-sm text-slate-500">Providers will start sending quotes soon. Check back later!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {request.responses.map((response, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-6 hover:shadow-md transition">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">
                            {response.provider?.businessName || 'Provider'}
                          </h3>
                          <p className="text-sm text-slate-600">{response.provider?.phone}</p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            response.status === 'accepted'
                              ? 'bg-green-100 text-green-700'
                              : response.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {response.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-t border-b border-slate-100">
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Quote Amount</p>
                          <p className="text-2xl font-black text-slate-900">₹{response.quote.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600 mb-1">Timeline</p>
                          <p className="text-lg font-bold text-slate-900">{response.timeline}</p>
                        </div>
                      </div>

                      {/* Rating */}
                      {response.provider?.rating && (
                        <div className="mb-4 flex items-center gap-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={`${
                                i < Math.floor(response.provider.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm font-bold text-slate-900 ml-2">
                            {response.provider.rating.toFixed(1)}
                          </span>
                        </div>
                      )}

                      {/* Accept Button */}
                      {request.status === 'pending' && response.status === 'pending' && (
                        <button
                          onClick={() => handleAcceptQuote(response.provider._id)}
                          disabled={acceptingQuote === response.provider._id}
                          className="w-full py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                        >
                          <CheckCircle2 size={18} />
                          {acceptingQuote === response.provider._id ? 'Accepting...' : 'Accept This Quote'}
                        </button>
                      )}

                      {request.status === 'accepted' && response.status === 'accepted' && (
                        <div className="py-2.5 px-4 bg-green-50 border border-green-200 text-green-700 font-bold rounded-lg text-center">
                          ✓ You accepted this quote
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Contact & Summary */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-md p-8 sticky top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b">Your Details</h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-600 font-bold mb-1">Contact Name</p>
                  <p className="font-semibold text-slate-900">{request.contactName}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-600 font-bold mb-1">Contact Number</p>
                  <a
                    href={`tel:${request.contactNumber}`}
                    className="text-blue-600 hover:text-blue-700 font-bold"
                  >
                    {request.contactNumber}
                  </a>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-slate-600 font-bold mb-1">Customer</p>
                  <p className="font-semibold text-slate-900">{request.customer?.name}</p>
                  <p className="text-sm text-slate-600">{request.customer?.email}</p>
                </div>

                {request.status === 'accepted' && request.provider && (
                  <div className="pt-4 border-t bg-green-50 rounded-lg p-4 -mx-8 px-4">
                    <p className="text-xs text-green-700 font-bold mb-2">✓ ACCEPTED PROVIDER</p>
                    <p className="font-bold text-slate-900">{request.provider?.businessName}</p>
                    <p className="text-sm text-slate-600 mb-2">{request.provider?.phone}</p>
                    <p className="text-xs text-slate-600">
                      <strong>Quote:</strong> ₹{request.finalQuote?.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenovationRequestDetail;
