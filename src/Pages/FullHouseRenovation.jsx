import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, ArrowRight, CheckCircle2 } from 'lucide-react';
import RenovationProviderList from '../components/RenovationProviderList';

const FullHouseRenovation = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Transform Your Home with Expert Renovation
              </h1>
              <p className="text-lg text-blue-100 mb-8">
                Connect with verified professionals who specialize in full house renovations. Get quotes, compare providers, and start your dream project today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/full-house-renovation"
                  className="px-8 py-3.5 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
                >
                  Browse Providers <ArrowRight size={20} />
                </Link>
                <Link
                  to="/full-house-renovation/request"
                  className="px-8 py-3.5 bg-blue-700 hover:bg-blue-900 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 border border-blue-500"
                >
                  Post Your Project <Hammer size={20} />
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop"
                alt="Home Renovation"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-16 text-slate-900">
            Why Choose LocalFixer for Your Renovation?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '✓',
                title: 'Verified Professionals',
                desc: 'All providers are vetted and rated by customers'
              },
              {
                icon: '✓',
                title: 'Competitive Quotes',
                desc: 'Get multiple quotes and compare prices instantly'
              },
              {
                icon: '✓',
                title: 'Transparent Process',
                desc: 'Track your project from start to completion'
              },
              {
                icon: '✓',
                title: 'Expert Guidance',
                desc: 'Professional advice throughout your renovation'
              },
              {
                icon: '✓',
                title: 'Secure Payments',
                desc: 'Safe payment options with buyer protection'
              },
              {
                icon: '✓',
                title: 'Quality Guaranteed',
                desc: 'Submit reviews and ratings after completion'
              }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl text-blue-600 mb-4 font-black">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-16 text-slate-900">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-4">
            {[
              { step: 1, title: 'Post Your Project', desc: 'Describe your renovation needs and budget' },
              { step: 2, title: 'Get Quotes', desc: 'Receive proposals from qualified providers' },
              { step: 3, title: 'Compare', desc: 'Review and compare quotes and portfolios' },
              { step: 4, title: 'Hire & Manage', desc: 'Accept quote and track project progress' }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-black text-lg mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm">{item.desc}</p>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-6 -right-3 text-slate-300">
                    <ArrowRight size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Provider List Section */}
      <section>
        <RenovationProviderList />
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Ready to Start Your Renovation?</h2>
          <p className="text-lg text-slate-300 mb-8">
            Post your project today and connect with verified professionals in your area
          </p>
          <Link
            to="/full-house-renovation/request"
            className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
          >
            Post Your Project Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FullHouseRenovation;
