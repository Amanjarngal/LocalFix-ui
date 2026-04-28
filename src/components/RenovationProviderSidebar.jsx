import React from 'react';
import { ChevronDown, Filter, MapPin, Star, SortAsc } from 'lucide-react';

const RenovationProviderSidebar = ({ filters, onFilterChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value || undefined });
  };

  const inputClasses = "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all";
  const labelClasses = "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1";

  return (
    <aside className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/20 sticky top-24">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
          <Filter size={20} />
        </div>
        <h3 className="text-xl font-black text-slate-900">Refine Search</h3>
      </div>

      <div className="space-y-6">
        {/* Location Filter */}
        <div>
          <label className={labelClasses}>City</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="city"
              value={filters.city || ''}
              onChange={handleInputChange}
              placeholder="e.g. Jammu"
              className={`${inputClasses} pl-10`}
            />
          </div>
        </div>

        {/* Area Filter */}
        {/* <div>
          <label className={labelClasses}>Area / Locality</label>
          <input
            type="text"
            name="area"
            value={filters.area || ''}
            onChange={handleInputChange}
            placeholder="e.g. Gandhi Nagar"
            className={inputClasses}
          />
        </div> */}

        {/* Pincode Filter */}
        <div>
          <label className={labelClasses}>Pincode</label>
          <input
            type="text"
            name="pincode"
            value={filters.pincode || ''}
            onChange={handleInputChange}
            placeholder="6-digit code"
            className={inputClasses}
            maxLength={6}
          />
        </div>

        {/* Rating Filter */}
        {/* <div>
          <label className={labelClasses}>Minimum Expertise</label>
          <div className="relative">
            <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
            <select
              name="rating"
              value={filters.rating || ''}
              onChange={handleSelectChange}
              className={`${inputClasses} pl-10 appearance-none`}
            >
              <option value="">All Ratings</option>
              <option value="5">5 Star Perfection</option>
              <option value="4">4+ Star Elite</option>
              <option value="3">3+ Star Verified</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div> */}

        {/* Sort Order */}
        <div>
          <label className={labelClasses}>Order By</label>
          <div className="relative">
            <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              name="sortBy"
              value={filters.sortBy || '-rating'}
              onChange={handleSelectChange}
              className={`${inputClasses} pl-10 appearance-none`}
            >
              <option value="-rating">Top Rated First</option>
              <option value="rating">Emerging Talents</option>
              <option value="businessName">Alphabetical (A-Z)</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={() => onFilterChange({})}
          className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold rounded-xl transition-all text-xs uppercase tracking-widest border border-slate-100 mt-4"
        >
          Reset All Filters
        </button>
      </div>
    </aside>
  );
};

export default RenovationProviderSidebar;
