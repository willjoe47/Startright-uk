import React, { useState } from 'react';
import { Check, Building2, FileText, Briefcase, Home, ShieldCheck, Calculator, ArrowRight, Menu, X } from 'lucide-react';

const App = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const services = [
    {
      id: 'company-formation',
      icon: Building2,
      title: 'Company Formation',
      price: '£99',
      description: 'Complete limited company registration with Companies House',
      features: [
        'Company name check & registration',
        'Certificate of Incorporation',
        'Shareholder agreements',
        'Digital company documents',
        '24-hour turnaround'
      ]
    },
    {
      id: 'vat-registration',
      icon: Calculator,
      title: 'VAT Registration',
      price: '£149',
      description: 'Fast VAT registration service with HMRC support',
      features: [
        'VAT number application',
        'HMRC submission',
        'VAT scheme advice',
        'Ongoing support',
        '5-7 day processing'
      ]
    },
    {
      id: 'business-insurance',
      icon: ShieldCheck,
      title: 'Business Insurance',
      price: 'From £15/mo',
      description: 'Comprehensive insurance packages for UK businesses',
      features: [
        'Public liability insurance',
        'Professional indemnity',
        'Employer\'s liability',
        'Custom quotes',
        'Instant online quotes'
      ]
    },
    {
      id: 'accounting',
      icon: FileText,
      title: 'Accounting Services',
      price: '£99/mo',
      description: 'Full bookkeeping and accounting support',
      features: [
        'Monthly bookkeeping',
        'Annual accounts',
        'Tax return filing',
        'Payroll services',
        'Dedicated accountant'
      ]
    },
    {
      id: 'business-address',
      icon: Home,
      title: 'Business Address',
      price: '£49/mo',
      description: 'Professional UK business address service',
      features: [
        'Prestigious London address',
        'Mail forwarding',
        'Companies House registration',
        'No long-term contracts',
        'Same-day setup'
      ]
    },
    {
      id: 'trademark',
      icon: Briefcase,
      title: 'Trademark Registration',
      price: '£199',
      description: 'Protect your brand with UK trademark registration',
      features: [
        'Trademark search',
        'Application filing',
        'IPO representation',
        'Class selection advice',
        'Certificate of registration'
      ]
    }
  ];

  const stripePublicKey = 'pk_live_51ShhTSLF9BeAt0gTZRJAAyNIWpC3wtxkISLTPQpVgj4fvGmpC2qB2UgHKJYSxLx7mYNxGjvaWfOv5drHNYdsYdVJ00BiPoyt2z';

  const handleCheckout = (service) => {
    // In production, this would call your Stripe checkout API
    alert(`Processing payment for ${service.title}. In production, this would redirect to Stripe Checkout.`);
    console.log('Stripe Key:', stripePublicKey);
    console.log('Service:', service);
  };

  const handlePayPal = (service) => {
    alert(`Processing PayPal payment for ${service.title}. Email: admin@wjsstyle.com`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Building2 className="w-8 h-8 text-indigo-600" />
              <span className="text-2xl font-bold text-gray-900">StartRight UK</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
            <nav className="hidden sm:flex space-x-6">
              <a href="#services" className="text-gray-600 hover:text-indigo-600">Services</a>
              <a href="#about" className="text-gray-600 hover:text-indigo-600">About</a>
              <a href="#contact" className="text-gray-600 hover:text-indigo-600">Contact</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Launch Your UK Business
            <span className="block text-indigo-600 mt-2">The Right Way</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Fast, affordable, and hassle-free business setup services for entrepreneurs across the UK
          </p>
          <a 
            href="#services"
            className="inline-flex items-center bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div 
                  key={service.id}
                  className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-indigo-300 hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-10 h-10 text-indigo-600" />
                    <span className="text-2xl font-bold text-indigo-600">{service.price}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-sm text-gray-600">
                        <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleCheckout(service)}
                      className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                    >
                      Pay with Card
                    </button>
                    <button
                      onClick={() => handlePayPal(service)}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition"
                    >
                      Pay with PayPal
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-indigo-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Why Choose StartRight UK?</h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-indigo-100">Businesses Launched</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24hr</div>
              <div className="text-indigo-100">Average Setup Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9★</div>
              <div className="text-indigo-100">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-2">© 2024 StartRight UK. All rights reserved.</p>
          <p className="text-gray-400 text-sm">
            Registered in England & Wales | Contact: admin@wjsstyle.com
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
