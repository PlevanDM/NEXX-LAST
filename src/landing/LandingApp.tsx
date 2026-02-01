import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Services from './components/Services';
import WhyUs from './components/WhyUs';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import TrackOrder from './components/TrackOrder';
import RemonlineServices from './components/RemonlineServices';
import Appointment from './components/Appointment';
import Contact from './components/Contact';
import CallbackModal from './components/CallbackModal';
import ServiceModAuth from './components/ServiceModAuth';

const LandingApp: React.FC = () => {
  const [lang, setLang] = useState(window.i18n?.getCurrentLanguage()?.code || 'ro');

  useEffect(() => {
    if (window.i18n?.subscribe) {
      return window.i18n.subscribe((newLang: string) => {
        setLang(newLang);
      });
    }
  }, []);

  return (
    <div className="landing-app min-h-screen bg-slate-900 text-white">
      {/* @ts-ignore */}
      {window.NEXXDesign?.Header ? React.createElement(window.NEXXDesign.Header, { currentPage: 'home' }) : null}
      {/* @ts-ignore */}
      {window.NEXXDesign?.ToastContainer ? React.createElement(window.NEXXDesign.ToastContainer) : null}
      <CallbackModal />
      <ServiceModAuth />
      <Hero />
      <Services />
      <section id="calculator" className="section-padding bg-gray-950">
        <div className="content-container">
          {/* @ts-ignore */}
          {window.PriceCalculator ? React.createElement(window.PriceCalculator) : null}
        </div>
      </section>
      <WhyUs />
      <Gallery />
      <Reviews />
      <TrackOrder />
      <RemonlineServices />
      <Appointment />
      <Contact />
      {/* @ts-ignore */}
      {window.NEXXDesign?.Footer ? React.createElement(window.NEXXDesign.Footer) : null}
    </div>
  );
};

export default LandingApp;
