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

  // После монтирования — прокрутка к якорю при обновлении (например #contacts, #calculator)
  useEffect(() => {
    const hash = window.location.hash?.replace('#', '');
    if (!hash) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
    return () => clearTimeout(timer);
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
      <section id="calculator" className="py-16 md:py-24 px-4 bg-gray-950">
        <div className="max-w-7xl mx-auto">
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
