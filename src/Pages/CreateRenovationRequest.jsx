import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { createRenovationRequest } from '../services/renovationService';
import toast from 'react-hot-toast';

const CreateRenovationRequest = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectTitle: '',
    description: '',
    estimatedBudget: '',
    propertyType: '2BHK',
    renovationType: 'complete',
    projectScope: [],
    address: '',
    city: '',
    area: '',
    pincode: '',
    contactName: '',
    contactNumber: '',
    preferredStartDate: '',
    estimatedDuration: '2-3 weeks',
  });

  const projectScopeOptions = [
    'painting', 'flooring', 'electrical', 'plumbing', 
    'carpentry', 'masonry', 'tiling', 'doors-windows', 'other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleScopeToggle = (scope) => {
    setFormData(prev => ({
      ...prev,
      projectScope: prev.projectScope.includes(scope)
        ? prev.projectScope.filter(s => s !== scope)
        : [...prev.projectScope, scope]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.projectTitle || !formData.description || !formData.estimatedBudget ||
        !formData.address || !formData.city || !formData.area || !formData.pincode) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.projectScope.length === 0) {
      toast.error('Please select at least one project scope');
      return;
    }

    try {
      setLoading(true);
      const data = await createRenovationRequest(formData);
      toast.success('Renovation request posted successfully!');
      navigate(`/full-house-renovation/request/${data._id}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-bold mb-4"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Post Your Renovation Project</h1>
          <p className="text-lg text-slate-600">
            Get quotes from verified professionals in your area
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          {/* Section 1: Project Basics */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-200">
              Project Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Project Title *</label>
                <input
                  type="text"
                  name="projectTitle"
                  value={formData.projectTitle}
                  onChange={handleInputChange}
                  placeholder="e.g., Complete Home Renovation"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Property Type *</label>
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1BHK">1 BHK</option>
                  <option value="2BHK">2 BHK</option>
                  <option value="3BHK">3 BHK</option>
                  <option value="4BHK">4 BHK</option>
                  <option value="5BHK">5 BHK</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your renovation project in detail..."
                rows="4"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Renovation Type *</label>
                <select
                  name="renovationType"
                  value={formData.renovationType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="complete">Complete Renovation</option>
                  <option value="partial">Partial Renovation</option>
                  <option value="modular">Modular Furniture</option>
                  <option value="kitchen">Kitchen Only</option>
                  <option value="bathroom">Bathroom Only</option>
                  <option value="bedroom">Bedroom Only</option>
                  <option value="living-room">Living Room Only</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Budget *</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-xl text-slate-600">₹</span>
                  <input
                    type="number"
                    name="estimatedBudget"
                    value={formData.estimatedBudget}
                    onChange={handleInputChange}
                    placeholder="Enter budget in rupees"
                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Project Scope */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-200">
              Project Scope *
            </h2>
            <p className="text-sm text-slate-600 mb-4">Select all that apply:</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {projectScopeOptions.map(scope => (
                <button
                  key={scope}
                  type="button"
                  onClick={() => handleScopeToggle(scope)}
                  className={`px-4 py-2.5 rounded-lg font-semibold transition text-sm ${
                    formData.projectScope.includes(scope)
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {scope.charAt(0).toUpperCase() + scope.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-200">
              Location
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter full address"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Area *</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  placeholder="Enter area/locality"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter pincode"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 4: Timeline */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-200">
              Timeline
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Start Date</label>
                <input
                  type="date"
                  name="preferredStartDate"
                  value={formData.preferredStartDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Duration</label>
                <select
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-3 weeks">2-3 weeks</option>
                  <option value="1 month">1 month</option>
                  <option value="2-3 months">2-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6+ months">6+ months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Contact Info */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-200">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Contact Name</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="Your phone number"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-8 py-3.5 border-2 border-slate-300 text-slate-900 font-bold rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? 'Posting...' : 'Post Your Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRenovationRequest;
