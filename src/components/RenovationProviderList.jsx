import React, { useState, useEffect } from 'react';
import { Star, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import RenovationProviderSidebar from './RenovationProviderSidebar';
import { getAvailableProviders } from '../services/renovationService';

const RenovationProviderList = () => {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchProviders();
  }, [filters]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const data = await getAvailableProviders(filters);
      setProviders(data || []);
    } catch (error) {
      console.error('Error fetching providers:', error);
      setProviders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (providerId) => {
    // Redirect to create renovation request page with provider preselected
    window.location.href = `/full-house-renovation/request?providerId=${providerId}`;
  };

  return (
    <div className="flex gap-6 bg-slate-50 min-h-screen py-8">
      <RenovationProviderSidebar filters={filters} onFilterChange={setFilters} />

      <div className="flex-1 px-4 md:px-8">
        <div className="mb-6">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Connect with Renovation Experts</h2>
          <p className="text-slate-600">Browse verified professionals in your area</p>
          {providers.length > 0 && (
            <p className="text-sm text-slate-500 mt-2">Found {providers.length} providers</p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                <div className="w-full h-32 bg-slate-200 rounded-lg mb-4" />
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-lg text-slate-600 mb-4">No providers found matching your criteria</p>
            <button
              onClick={() => setFilters({})}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div
                key={provider._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
              >
                {/* Header with Profile Photo */}
                <div className="h-32 bg-gradient-to-r from-blue-500 to-blue-600 relative overflow-hidden">
                  {provider.profilePhoto && (
                    <img
                      src={provider.profilePhoto}
                      alt={provider.businessName}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
                </div>

                {/* Content */}
                <div className="p-6 -mt-8 relative z-10">
                  {/* Business Name */}
                  <h3 className="text-lg font-black text-slate-900 mb-1 truncate">
                    {provider.businessName}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={`${
                            i < Math.floor(provider.rating || 4.5)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {(provider.rating || 4.5).toFixed(1)}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {provider.description || 'Professional renovation services'}
                  </p>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
                    <MapPin size={16} className="text-blue-600" />
                    <span className="truncate">
                      {provider.area}, {provider.city}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                    <Phone size={16} className="text-green-600" />
                    <span>{provider.phone}</span>
                  </div>

                  {/* Experience */}
                  <div className="mb-4 p-2 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-600">
                      <span className="font-bold text-slate-900">Experience:</span> {provider.experience}+ years
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleConnect(provider._id)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 group/btn active:scale-95"
                  >
                    Connect Now
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RenovationProviderList;
