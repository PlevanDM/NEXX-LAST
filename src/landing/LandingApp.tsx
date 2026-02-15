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
// ServiceModAuth removed — database/service mod disabled

const LandingApp: React.FC = () => {
  const [lang, setLang] = useState(window.i18n?.getCurrentLanguage?.()?.code || 'ro');

  // При загрузке/обновлении страницы — всегда в начало (не восстанавливать старую позицию)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (window.i18n?.subscribe) {
      return window.i18n.subscribe((newLang?: string) => {
        setLang(newLang ?? window.i18n?.getCurrentLanguage?.()?.code ?? 'ro');
      });
    }
  }, []);

  // Прокрутка к якорю при клике по ссылке с hash (например #calculator, #contacts)
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash?.replace('#', '');
      if (!hash) return;
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return (
    <div className="landing-app min-h-screen bg-slate-900 text-white">
      {/* @ts-ignore */}
      {window.NEXXDesign?.Header ? React.createElement(window.NEXXDesign.Header, { currentPage: 'home' }) : null}
      {/* @ts-ignore */}
      {window.NEXXDesign?.ToastContainer ? React.createElement(window.NEXXDesign.ToastContainer) : null}
      <CallbackModal />
      <Hero />
      <Services />
      <section id="calculator" className="py-12 sm:py-16 md:py-24 px-3 sm:px-4 bg-gray-950">
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
