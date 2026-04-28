import React, { useState, useEffect } from 'react';
import { Star, MapPin, Phone, Mail, ArrowRight, ShieldCheck, Award, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';
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
    window.location.href = `/full-house-renovation/request?providerId=${providerId}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-screen">
      <div className="w-full lg:w-72 flex-shrink-0">
         <RenovationProviderSidebar filters={filters} onFilterChange={setFilters} />
      </div>

      <div className="flex-1">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-white rounded-[2.5rem] border border-slate-100 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/30">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6 border border-slate-100">
              <Users size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">No Experts Found</h2>
            <p className="text-slate-500 mt-2 max-w-sm text-center font-medium">
              We couldn't find any experts matching your current filters.
            </p>
            <button
              onClick={() => setFilters({})}
              className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...providers].sort((a, b) => {
              const aAvail = a.isAvailable !== false;
              const bAvail = b.isAvailable !== false;
              if (aAvail === bAvail) return 0;
              return aAvail ? -1 : 1;
            }).map((provider) => (
              <motion.div
                key={provider._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`group rounded-[2.5rem] overflow-hidden border transition-all duration-500 flex flex-col h-full ${provider.isAvailable !== false ? 'bg-white border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-200/20' : 'bg-slate-50 border-slate-200 opacity-75 grayscale-[0.4]'}`}
              >
                {/* Banner Area */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {provider.profilePhoto ? (
                    <img
                      src={provider.profilePhoto}
                      alt={provider.businessName}
                      className={`w-full h-full object-cover transition-transform duration-700 ${provider.isAvailable !== false ? 'group-hover:scale-110' : ''}`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-slate-100">
                      <Award size={64} />
                    </div>
                  )}
                  
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-xl border border-white/50">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={`${i < Math.floor(provider.rating || 4.5) ? 'fill-amber-500 text-amber-500' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                    <span className="ml-1 text-sm font-black text-slate-900">{(provider.rating || 4.5).toFixed(1)}</span>
                  </div>

                  {provider.isAvailable !== false ? (
                      <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl font-bold text-[10px] uppercase tracking-wider">
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Verified Online
                      </div>
                  ) : (
                      <div className="absolute top-4 left-4 bg-slate-500 text-white px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-xl font-bold text-[10px] uppercase tracking-wider">
                          Offline
                      </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className={`text-xl font-black leading-tight transition-colors ${provider.isAvailable !== false ? 'text-slate-900 group-hover:text-blue-600' : 'text-slate-600'}`}>
                        {provider.businessName}
                      </h2>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                        {provider.ownerName || 'Renovation Partner'}
                      </p>
                    </div>
                    <div className={`p-2.5 rounded-xl ${provider.isAvailable !== false ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                      <ShieldCheck size={20} />
                    </div>
                  </div>

                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-6 font-medium">
                    {provider.description || "Transforming homes with architectural precision and high-end finishes. Your vision, our professional execution."}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter mb-1">Experience</p>
                      <p className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                        <Award size={14} className="text-blue-500" /> {provider.experience}+ Years
                      </p>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter mb-1">Location</p>
                      <p className="text-sm font-black text-slate-800 flex items-center gap-1.5 truncate">
                        <MapPin size={14} className="text-orange-500" /> {provider.area}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Contact</span>
                        <span className="text-sm font-bold text-slate-700">{provider.phone}</span>
                    </div>
                    {provider.isAvailable !== false ? (
                      <button
                        onClick={() => handleConnect(provider._id)}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-all group/btn"
                      >
                        Connect <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <button
                        disabled
                        className="px-6 py-3 bg-slate-200 text-slate-500 cursor-not-allowed rounded-xl font-bold text-sm"
                      >
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RenovationProviderList;
