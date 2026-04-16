import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyRenovationRequests } from '../services/renovationService';
import { Hammer, Plus, MapPin, DollarSign, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'accepted':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertCircle size={18} />;
      case 'accepted':
        return <CheckCircle2 size={18} />;
      case 'completed':
        return <CheckCircle2 size={18} />;
      default:
        return <Clock size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 mb-2">My Renovation Projects</h1>
            <p className="text-lg text-slate-600">Track and manage all your renovation requests</p>
          </div>
          <Link
            to="/full-house-renovation/request"
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 transition"
          >
            <Plus size={20} /> New Project
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
                <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-16 text-center">
            <Hammer size={64} className="mx-auto text-slate-300 mb-6" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No Projects Yet</h2>
            <p className="text-slate-600 mb-8">Start your renovation journey by posting your first project</p>
            <Link
              to="/full-house-renovation/request"
              className="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
            >
              Post Your First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => (
              <div
                key={request._id}
                onClick={() => navigate(`/full-house-renovation/request/${request._id}`)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer group overflow-hidden"
              >
                {/* Header with Status */}
                <div className="relative p-6 pb-4 border-b border-slate-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">
                      {request.projectTitle}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 border ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getStatusIcon(request.status)}
                      {request.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 line-clamp-2">{request.description}</p>
                </div>

                {/* Details */}
                <div className="p-6 space-y-3">
                  {/* Budget */}
                  <div className="flex items-center gap-3">
                    <DollarSign size={18} className="text-green-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-600">Budget</p>
                      <p className="font-bold text-slate-900">₹{request.estimatedBudget.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-red-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-600">Location</p>
                      <p className="font-bold text-slate-900">{request.area}, {request.city}</p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-orange-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-slate-600">Duration</p>
                      <p className="font-bold text-slate-900">{request.estimatedDuration}</p>
                    </div>
                  </div>
                </div>

                {/* Quotes Count */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                      <span className="font-bold text-slate-900">{request.quotesReceived || 0}</span> quotes received
                    </p>
                    <button className="text-blue-600 hover:text-blue-700 font-bold text-sm">
                      View →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRenovationRequests;
