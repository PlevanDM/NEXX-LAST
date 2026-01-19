import React from 'react';
import LiveCounter from '../shared/LiveCounter';
import Button from '../shared/Button';
import Badge from '../shared/Badge';

export const HeroSection: React.FC = () => {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <div className="text-center lg:text-left">
            {/* Live Counter */}
            <div className="mb-6 flex justify-center lg:justify-start">
              <LiveCounter min={2} max={8} interval={15000} />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Професійний ремонт
              <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Apple техніки
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              iPhone, iPad, MacBook, Apple Watch.<br />
              Швидко, якісно, з гарантією.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 mb-8 justify-center lg:justify-start">
              <Badge variant="success" size="lg">
                <i className="fa fa-clock mr-1"></i>
                30-40 хв ремонт
              </Badge>
              <Badge variant="info" size="lg">
                <i className="fa fa-shield mr-1"></i>
                30 днів гарантії
              </Badge>
              <Badge variant="warning" size="lg">
                <i className="fa fa-camera mr-1"></i>
                100% фіксація стану
              </Badge>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="primary"
                size="lg"
                icon="fa-calendar-check"
                onClick={scrollToContact}
              >
                Записатися на ремонт
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon="fa-list"
                onClick={scrollToServices}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                Наші послуги
              </Button>
            </div>

            {/* Stats Quick View */}
            <div className="mt-12 grid grid-cols-3 gap-6">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white mb-1">5+</div>
                <div className="text-sm text-blue-200">років досвіду</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white mb-1">10+</div>
                <div className="text-sm text-blue-200">майстрів</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-white mb-1">5000+</div>
                <div className="text-sm text-blue-200">ремонтів</div>
              </div>
            </div>
          </div>

          {/* Right Column - Images */}
          <div className="hidden lg:block relative">
            {/* Floating Device Icons */}
            <div className="relative w-full h-[600px]">
              {/* Center Image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
                <img
                  src="/images/reception.png"
                  alt="NEXX Reception"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Icons */}
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-xl animate-float">
                <i className="fa fa-mobile-screen text-4xl text-white"></i>
              </div>
              
              <div className="absolute top-20 right-10 w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-xl animate-float delay-500">
                <i className="fa fa-laptop text-4xl text-white"></i>
              </div>
              
              <div className="absolute bottom-20 left-20 w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-xl animate-float delay-1000">
                <i className="fa fa-microscope text-4xl text-white"></i>
              </div>
              
              <div className="absolute bottom-10 right-20 w-20 h-20 bg-white/10 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-xl animate-float delay-1500">
                <i className="fa fa-shield-halved text-4xl text-white"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
        <i className="fa fa-chevron-down text-2xl"></i>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-1500 {
          animation-delay: 1.5s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
