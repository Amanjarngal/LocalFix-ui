import React from 'react';
import { ChevronDown } from 'lucide-react';

const RenovationProviderSidebar = ({ filters, onFilterChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value || undefined });
  };

  return (
    <aside className="w-60 p-6 bg-slate-50 border-r border-slate-200 sticky top-24 max-h-screen overflow-y-auto">
      <h3 className="text-lg font-bold text-slate-900 mb-6">Filters</h3>

      {/* Location Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
        <input
          type="text"
          name="city"
          value={filters.city || ''}
          onChange={handleInputChange}
          placeholder="Enter city"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Area Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Area</label>
        <input
          type="text"
          name="area"
          value={filters.area || ''}
          onChange={handleInputChange}
          placeholder="Enter area"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Pincode Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Pincode</label>
        <input
          type="text"
          name="pincode"
          value={filters.pincode || ''}
          onChange={handleInputChange}
          placeholder="Enter pincode"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Minimum Rating</label>
        <select
          name="rating"
          value={filters.rating || ''}
          onChange={handleSelectChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
        </select>
      </div>

      {/* Sort Order */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Sort By</label>
        <select
          name="sortBy"
          value={filters.sortBy || '-rating'}
          onChange={handleSelectChange}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="-rating">Highest Rating</option>
          <option value="rating">Lowest Rating</option>
          <option value="businessName">Name (A-Z)</option>
        </select>
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={() => onFilterChange({})}
        className="w-full py-2.5 bg-slate-300 hover:bg-slate-400 text-slate-900 font-semibold rounded-lg transition-all text-sm"
      >
        Clear Filters
      </button>
    </aside>
  );
};

export default RenovationProviderSidebar;
