import React from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { fetchAppData } from './api';
import { DeviceList } from './components/DeviceList';
import { PriceTable } from './components/PriceTable';
import { Modal } from './components/Modal';
import { Icons } from './components/Icons';
import { ICList } from './components/ICList';
import { ErrorCodes } from './components/ErrorCodes';
import { RepairCalculator } from './components/RepairCalculator';
import { PartDetailModal } from './components/PartDetailModal';
import { ICDetailModal } from './components/ICDetailModal';
import { DeviceDetailModal } from './components/DeviceDetailModal';
import { MacBoardList } from './components/MacBoardList';
import { ServicePriceList } from './components/ServicePriceList'; // NEW
import { KeyCombinations } from './components/KeyCombinations'; // NEW: DFU/Recovery
import { PowerStationTracker } from './components/PowerStationTracker'; // EcoFlow / Power Tracker
import { ExchangePriceListModal } from './components/ExchangePriceListModal'; // Apple Official UA
import { Device, PriceData, ErrorDetail, ICComponent, OfficialServiceData, MacBoard, SchematicResource, RepairGuide, ConnectorPinout, LogicBoard, BootSequence, DiodeMeasurement, ExchangePrice, ServicePrices } from './types';
import { convertPrice, formatPrice } from './utils';

export const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Реальные данные
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [prices, setPrices] = React.useState<Record<string, PriceData>>({});
  const [errors, setErrors] = React.useState<Record<string, ErrorDetail>>({});
  const [ics, setIcs] = React.useState<Record<string, ICComponent>>({});
  const [officialPrices, setOfficialPrices] = React.useState<OfficialServiceData | null>(null);
  const [macBoards, setMacBoards] = React.useState<MacBoard[]>([]);
  const [logicBoards, setLogicBoards] = React.useState<LogicBoard[]>([]);
  const [schematics, setSchematics] = React.useState<SchematicResource[]>([]);
  const [guides, setGuides] = React.useState<RepairGuide[]>([]);
  const [pinouts, setPinouts] = React.useState<ConnectorPinout[]>([]);
  
  // Новые данные
  const [compatibility, setCompatibility] = React.useState<Record<string, any>>({});
  const [bootSequences, setBootSequences] = React.useState<Record<string, BootSequence[]>>({});
  const [measurements, setMeasurements] = React.useState<Record<string, DiodeMeasurement[]>>({});
  const [exchangePrices, setExchangePrices] = React.useState<Record<string, ExchangePrice>>({});
  const [appleExchangeMeta, setAppleExchangeMeta] = React.useState<{ lastUpdated: string; source: string } | undefined>(undefined);
  const [servicePrices, setServicePrices] = React.useState<ServicePrices | null>(null);
  const [services, setServices] = React.useState<Record<string, any>>({});
  
  const [rates, setRates] = React.useState<any>(null);
  const [keyCombinations, setKeyCombinations] = React.useState<any>(null);

  // Состояние интерфейса
  const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(null);
  const [selectedPart, setSelectedPart] = React.useState<PriceData | null>(null);
  const [selectedIC, setSelectedIC] = React.useState<ICComponent | null>(null);
  
  const [showPriceTable, setShowPriceTable] = React.useState(false);
  const [showErrors, setShowErrors] = React.useState(false);
  const [showICs, setShowICs] = React.useState(false);
  const [showCalculator, setShowCalculator] = React.useState(false);
  const [showMacBoards, setShowMacBoards] = React.useState(false);
  const [showKnowledge, setShowKnowledge] = React.useState(false);
  const [showServicePrices, setShowServicePrices] = React.useState(false);
  const [showExchangeUA, setShowExchangeUA] = React.useState(false); // Прайс Apple Official UA
  const [showKeyCombo, setShowKeyCombo] = React.useState(false); // NEW: DFU/Recovery
  const [showPowerTracker, setShowPowerTracker] = React.useState(false); // Power Tracker (EcoFlow, Bluetti, DJI)
  
  // Новое состояние
  const [showMobileMenu, setShowMobileMenu] = React.useState(false);
  const [globalSearch, setGlobalSearch] = React.useState('');
  const [activeSection, setActiveSection] = React.useState<string>('devices');
  const [recentDevices, setRecentDevices] = React.useState<Device[]>([]);
  const [navigationHistory, setNavigationHistory] = React.useState<string[]>(['devices']);
  
  // Клавиатурные шорткаты
  React.useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      // Ctrl+K или Cmd+K - фокус на поиск
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Esc - закрыть все модалки
      if (e.key === 'Escape') {
        closeAllModals();
      }
      
      // Ctrl+1-8 - быстрое переключение разделов (Прайс Украина = 3, Power Tracker = 8)
      if (e.ctrlKey && e.key >= '1' && e.key <= '8') {
        e.preventDefault();
        const sections = [
          () => setShowCalculator(true),      // 1
          () => setShowServicePrices(true),   // 2
          () => setShowExchangeUA(true),      // 3 Прайс Украина
          () => setShowMacBoards(true),       // 4
          () => setShowKnowledge(true),       // 5
          () => setShowICs(true),             // 6
          () => setShowErrors(true),          // 7
          () => setShowPowerTracker(true)     // 8 Power Tracker (EcoFlow)
        ];
        sections[parseInt(e.key) - 1]?.();
      }
    };
    
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);
  
  // История просмотра устройств (localStorage)
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('recentDevices');
      if (saved) {
        setRecentDevices(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Error loading recent devices:', err);
    }
  }, []);
  
  const addToRecent = React.useCallback((device: Device) => {
    setRecentDevices(prev => {
      const filtered = prev.filter(d => d.name !== device.name);
      const updated = [device, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('recentDevices', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving recent devices:', err);
      }
      return updated;
    });
  }, []);
  
  const handleDeviceSelect = React.useCallback((device: Device) => {
    addToRecent(device);
    navigate(`/nexx/device/${encodeURIComponent(device.name)}`);
  }, [addToRecent, navigate]);

  // Функция для закрытия всех модальных окон
  const closeAllModals = () => {
    navigate('/nexx');
  };

  // Функция для открытия модального окна с учетом истории
  const openModal = (modalSetter: any, sectionName: string) => {
    // Mapping section names to routes
    const routeMap: Record<string, string> = {
      'calculator': '/nexx/calculator',
      'services': '/nexx/services',
      'exchangeUA': '/nexx/exchange-ua',
      'boards': '/nexx/boards',
      'knowledge': '/nexx/knowledge',
      'ics': '/nexx/ics',
      'errors': '/nexx/errors',
      'powerTracker': '/nexx/power-tracker',
      'keycombo': '/nexx/key-combo',
      'prices': '/nexx/prices'
    };
    navigate(routeMap[sectionName] || '/nexx');
    setShowMobileMenu(false);
  };

  // Функция навигации назад
  const navigateBack = () => {
    navigate(-1);
  };

  // Sync state with URL
  React.useEffect(() => {
    const path = location.pathname;

    // Reset all modals first
    setShowPriceTable(false);
    setShowErrors(false);
    setShowICs(false);
    setShowCalculator(false);
    setShowMacBoards(false);
    setShowKnowledge(false);
    setShowServicePrices(false);
    setShowExchangeUA(false);
    setShowKeyCombo(false);
    setShowPowerTracker(false);
    setSelectedDevice(null);
    setSelectedIC(null);
    setSelectedPart(null);
    setActiveSection('devices');

    if (path.startsWith('/nexx/device/')) {
      const deviceName = decodeURIComponent(path.replace('/nexx/device/', ''));
      const device = devices.find(d => d.name === deviceName);
      if (device) {
        setSelectedDevice(device);
        setActiveSection('device-detail');
      }
    } else if (path === '/nexx/calculator') {
      setShowCalculator(true);
      setActiveSection('calculator');
    } else if (path === '/nexx/services') {
      setShowServicePrices(true);
      setActiveSection('services');
    } else if (path === '/nexx/exchange-ua') {
      setShowExchangeUA(true);
      setActiveSection('exchangeUA');
    } else if (path === '/nexx/boards') {
      setShowMacBoards(true);
      setActiveSection('boards');
    } else if (path === '/nexx/knowledge') {
      setShowKnowledge(true);
      setActiveSection('knowledge');
    } else if (path === '/nexx/ics') {
      setShowICs(true);
      setActiveSection('ics');
    } else if (path === '/nexx/errors') {
      setShowErrors(true);
      setActiveSection('errors');
    } else if (path === '/nexx/power-tracker') {
      setShowPowerTracker(true);
      setActiveSection('powerTracker');
    } else if (path === '/nexx/key-combo') {
      setShowKeyCombo(true);
      setActiveSection('keycombo');
    } else if (path === '/nexx/prices') {
      setShowPriceTable(true);
      setActiveSection('prices');
    } else if (path.startsWith('/nexx/ic/')) {
      const icName = decodeURIComponent(path.replace('/nexx/ic/', ''));
      if (ics[icName]) {
        setSelectedIC(ics[icName]);
      }
    } else if (path.startsWith('/nexx/part/')) {
      const partArticle = decodeURIComponent(path.replace('/nexx/part/', ''));
      if (prices[partArticle]) {
        setSelectedPart(prices[partArticle]);
      }
    }
  }, [location.pathname, devices, ics, prices]);

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAppData();
      setDevices(data.devices);
      setPrices(data.prices);
      setErrors(data.errors || {});
      setIcs(data.ics || {});
      setOfficialPrices(data.officialPrices);
      setMacBoards(data.macBoards || []);
      setLogicBoards(data.logicBoards || []);
      setSchematics(data.schematics || []);
      setGuides(data.guides || []);
      setPinouts(data.pinouts || []);
      
      setCompatibility(data.compatibility || {});
      setBootSequences(data.bootSequences || {});
      setMeasurements(data.measurements || {});
      setExchangePrices(data.exchangePrices || {});
      setAppleExchangeMeta(data.appleExchangeMeta);
      setServicePrices(data.servicePrices || null);
      setServices(data.services || {});
      
      setRates(data.rates);
      setKeyCombinations(data.keyCombinations);
      
      // Debug logging
      console.log('📊 Data loaded:', {
        devices: data.devices?.length || 0,
        errors: Object.keys(data.errors || {}).length,
        ics: Object.keys(data.ics || {}).length,
        logicBoards: data.logicBoards?.length || 0,
        keyCombinations: Object.keys(data.keyCombinations || {}).length,
        services: Object.keys(data.services || {}).length,
        guides: data.guides?.length || 0
      });
    } catch (err: any) {
      console.error(err);
      const isUnauth = err?.message === 'UNAUTHORIZED';
      if (isUnauth) {
        try {
          localStorage.removeItem('nexx_auth');
          localStorage.removeItem('nexx_pin');
        } catch (_) {}
        setError('Сесія закінчилась. Оновіть сторінку та увійдіть з пінкодом знову.');
      } else {
        setError('Не вдалося завантажити базу даних. Перевірте зʼєднання.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Преобразуем объект цен в массив для таблицы (hooks must run before any early return)
  const priceListArray = React.useMemo(() => {
    return Object.values(prices);
  }, [prices]);
  
  // Блокировка скролла body при открытии модальных окон
  React.useEffect(() => {
    const isAnyModalOpen = showPriceTable || showErrors || showICs || showCalculator || 
                           showMacBoards || showKnowledge || showServicePrices || showExchangeUA || showKeyCombo || showPowerTracker || 
                           selectedDevice || selectedIC || selectedPart;
    
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showPriceTable, showErrors, showICs, showCalculator, showMacBoards, showKnowledge, showServicePrices, showExchangeUA, showKeyCombo, showPowerTracker, selectedDevice, selectedIC, selectedPart]);
  
  // Глобальный поиск
  const globalSearchResults = React.useMemo(() => {
    if (!globalSearch || globalSearch.length < 2) return null;
    
    const query = globalSearch.toLowerCase();
    const results: any = {
      devices: [] as Device[],
      ics: [] as ICComponent[],
      errors: [] as ErrorDetail[],
      prices: [] as PriceData[]
    };
    
    // Поиск устройств
    results.devices = devices.filter(d => 
      d.name.toLowerCase().includes(query) ||
      d.model_number?.toLowerCase().includes(query) ||
      d.board_number?.toLowerCase().includes(query) ||
      (d.board_numbers || []).some(bn => bn.toLowerCase().includes(query))
    ).slice(0, 5);
    
    // Поиск IC
    results.ics = Object.values(ics).filter(ic => 
      ic.name?.toLowerCase().includes(query) ||
      ic.designation?.toLowerCase().includes(query) ||
      (ic.functions || []).some(f => f.toLowerCase().includes(query))
    ).slice(0, 5);
    
    // Поиск ошибок
    results.errors = Object.values(errors).filter(err => 
      String(err.code).toLowerCase().includes(query) ||
      err.description?.toLowerCase().includes(query)
    ).slice(0, 5);
    
    // Поиск по ценам
    results.prices = Object.values(prices).filter(price => 
      price.article?.toLowerCase().includes(query) ||
      price.description?.toLowerCase().includes(query)
    ).slice(0, 5);
    
    return results;
  }, [globalSearch, devices, ics, errors, prices]);
  
  // Счетчики для навигации
  const counts = React.useMemo(() => ({
    devices: devices.length,
    ics: Object.keys(ics).length,
    errors: Object.keys(errors).length,
    boards: macBoards.length
  }), [devices, ics, errors, macBoards]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-600 p-4">
        <Icons.Error />
        <h1 className="text-xl font-bold mt-2">Ошибка загрузки</h1>
        <p>{error}</p>
        <button 
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar — на всю ширину, компактнее */}
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-30">
        <div className="w-full px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center gap-2 sm:gap-4" style={{ height: 56, minHeight: 56 }}>
            {/* Logo — то же лого что на лендинге: nexx-logo.png */}
            <a
              href="/"
              className="nexx-logo-link flex items-center gap-2 flex-shrink-0 hover:opacity-90 transition-opacity"
              title="На головну (лендинг)"
            >
              <img src="/static/nexx-logo.png?v=5" alt="NEXX GSM" className="w-auto object-contain logo-pulse" style={{ height: 48, background: 'transparent' }} />
              <span className="font-bold text-lg tracking-tight hidden sm:inline text-white">Database</span>
            </a>
            {/* Кнопка выход на лендинг — всегда видна */}
            <a
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium transition-colors flex-shrink-0 min-h-[40px] lg:min-h-0"
              title="На головну (лендинг)"
            >
              <span className="lg:hidden">🏠</span>
              <span>На сайт</span>
            </a>
            
            {/* EcoFlow — в навбаре на мобиле (lg:hidden), всегда видна без меню */}
            <button
              type="button"
              onClick={() => openModal(setShowPowerTracker, 'powerTracker')}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors flex-shrink-0 min-h-[40px]"
              title="EcoFlow — ціни станцій"
            >
              <span>⚡</span>
              <span>EcoFlow</span>
            </button>
            
            {/* Глобальный поиск */}
            <div className="relative flex-1 min-w-0 max-w-md hidden md:block mx-1 lg:mx-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Поиск по всей базе..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 text-sm"
              />
              
              {/* Результаты глобального поиска */}
              {globalSearchResults && globalSearch.length >= 2 && (
                <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-h-96 overflow-auto z-50">
                  {globalSearchResults.devices.length > 0 && (
                    <div className="p-3 border-b border-slate-700">
                      <div className="text-xs text-slate-400 mb-2 font-bold">Устройства ({globalSearchResults.devices.length})</div>
                      {globalSearchResults.devices.map((device: Device) => (
                        <div key={device.name} 
                             onClick={() => { handleDeviceSelect(device); setGlobalSearch(''); }}
                             className="p-2 hover:bg-slate-700 rounded cursor-pointer text-sm">
                          <div className="font-medium">{device.name}</div>
                          <div className="text-xs text-slate-400">{device.model_number}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {globalSearchResults.ics.length > 0 && (
                    <div className="p-3 border-b border-slate-700">
                      <div className="text-xs text-slate-400 mb-2 font-bold">Микросхемы ({globalSearchResults.ics.length})</div>
                      {globalSearchResults.ics.map((ic: ICComponent) => (
                        <div key={ic.name} 
                             onClick={() => { navigate(`/nexx/ic/${encodeURIComponent(ic.name)}`); setGlobalSearch(''); }}
                             className="p-2 hover:bg-slate-700 rounded cursor-pointer text-sm">
                          <div className="font-medium">{ic.name}</div>
                          <div className="text-xs text-slate-400">{ic.designation}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {globalSearchResults.errors.length > 0 && (
                    <div className="p-3 border-b border-slate-700">
                      <div className="text-xs text-slate-400 mb-2 font-bold">Ошибки ({globalSearchResults.errors.length})</div>
                      {globalSearchResults.errors.map((error: ErrorDetail) => (
                        <div key={error.code} className="p-2 hover:bg-slate-700 rounded text-sm">
                          <div className="font-medium">{error.code}</div>
                          <div className="text-xs text-slate-400 truncate">{error.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {globalSearchResults.prices.length > 0 && (
                    <div className="p-3 border-b border-slate-700">
                      <div className="text-xs text-slate-400 mb-2 font-bold">Цены ({globalSearchResults.prices.length})</div>
                      {globalSearchResults.prices.map((price: PriceData) => (
                        <div 
                          key={price.article} 
                          onClick={() => { navigate(`/nexx/part/${encodeURIComponent(price.article)}`); setGlobalSearch(''); }}
                          className="p-2 hover:bg-slate-700 rounded cursor-pointer text-sm"
                        >
                          <div className="font-medium">{price.article}</div>
                          <div className="text-xs text-slate-400 truncate">{price.description}</div>
                          <div className="text-xs text-green-400 font-bold mt-1">{price.price_uah} ₴</div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {globalSearchResults.devices.length === 0 && globalSearchResults.ics.length === 0 && globalSearchResults.errors.length === 0 && globalSearchResults.prices.length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-sm">
                      Ничего не найдено
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Desktop Navigation — компактные кнопки, в одну строку */}
            <div className="hidden lg:flex items-center gap-1.5 xl:gap-2 overflow-x-auto max-w-full custom-scrollbar shrink-0 flex-nowrap justify-end">
              <button
                onClick={() => openModal(setShowCalculator, 'calculator')}
                className={`flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg transition-colors text-xs font-medium whitespace-nowrap shrink-0 ${
                  activeSection === 'calculator'
                    ? 'bg-blue-600 shadow-lg shadow-blue-900/50 border border-blue-500 ring-2 ring-blue-400'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/50 border border-blue-500'
                }`}
              >
                <Icons.Calculator />
                <span>Калькулятор</span>
              </button>
              <button
                onClick={() => openModal(setShowServicePrices, 'services')}
                className={`flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg transition-colors text-xs font-medium whitespace-nowrap shrink-0 shadow-lg shadow-orange-900/50 border border-orange-500 ${
                  activeSection === 'services' ? 'bg-orange-600 ring-2 ring-orange-400' : 'bg-orange-600 hover:bg-orange-500'
                }`}
              >
                <Icons.Price />
                <span>Услуги</span>
              </button>
              <button
                onClick={() => openModal(setShowExchangeUA, 'exchangeUA')}
                className={`flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg transition-colors text-xs font-medium whitespace-nowrap shrink-0 shadow-lg shadow-amber-900/50 border border-amber-500 ${
                  activeSection === 'exchangeUA' ? 'bg-amber-600 ring-2 ring-amber-400' : 'bg-amber-600 hover:bg-amber-500'
                }`}
              >
                <Icons.Price />
                <span>Прайс UA</span>
              </button>
              <button
                onClick={() => openModal(setShowPowerTracker, 'powerTracker')}
                className={`flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg transition-colors text-xs font-medium whitespace-nowrap shrink-0 shadow-lg shadow-emerald-900/50 border border-emerald-500 ${
                  activeSection === 'powerTracker' ? 'bg-emerald-600 ring-2 ring-emerald-400' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                <span>⚡</span>
                <span>EcoFlow</span>
              </button>
              <button
                onClick={() => openModal(setShowMacBoards, 'boards')}
                className={`flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg transition-colors text-xs font-medium whitespace-nowrap shrink-0 relative ${
                  activeSection === 'boards' ? 'bg-slate-700 ring-2 ring-blue-400' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <span className="text-blue-400"><Icons.Board /></span>
                <span>MacBook</span>
                {counts.boards > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-blue-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                    {counts.boards}
                  </span>
                )}
              </button>
              <button
                onClick={() => openModal(setShowKnowledge, 'knowledge')}
                className={`flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg transition-colors text-xs font-medium whitespace-nowrap shrink-0 ${
                  activeSection === 'knowledge' ? 'bg-slate-700 ring-2 ring-indigo-400' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <span className="text-indigo-400"><Icons.Book /></span>
                <span>Инфо</span>
              </button>
              <button
                onClick={() => openModal(setShowKeyCombo, 'keycombo')}
                className={`flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg transition-colors text-xs font-medium whitespace-nowrap shrink-0 ${
                  activeSection === 'keycombo' ? 'bg-slate-700 ring-2 ring-purple-400' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <span className="text-purple-400">⌨️</span>
                <span>DFU</span>
              </button>
              <button
                onClick={() => openModal(setShowICs, 'ics')}
                className={`flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg transition-colors text-xs font-medium whitespace-nowrap shrink-0 relative ${
                  activeSection === 'ics' ? 'bg-slate-700 ring-2 ring-violet-400' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <span className="text-violet-400"><Icons.Chip /></span>
                <span>IC</span>
                {counts.ics > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-violet-500 text-white text-[10px] rounded-full px-1 min-w-[1rem] h-4 flex items-center justify-center font-bold">
                    {counts.ics}
                  </span>
                )}
              </button>
              <button
                onClick={() => openModal(setShowErrors, 'errors')}
                className={`flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg transition-colors text-xs font-medium whitespace-nowrap shrink-0 relative ${
                  activeSection === 'errors' ? 'bg-slate-700 ring-2 ring-red-400' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <span className="text-red-400"><Icons.Error /></span>
                <span>Ошибки</span>
                {counts.errors > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full px-1 min-w-[1rem] h-4 flex items-center justify-center font-bold">
                    {counts.errors}
                  </span>
                )}
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden flex items-center justify-center w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              {showMobileMenu ? <Icons.Close /> : '☰'}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu — прокручиваемый, EcoFlow вверху */}
        {showMobileMenu && (
          <div className="lg:hidden bg-slate-800 border-t border-slate-700 max-h-[85vh] overflow-y-auto">
            <div className="px-4 py-3 space-y-2">
              <a href="/" className="w-full flex items-center justify-between px-4 py-3 bg-slate-600 hover:bg-slate-500 rounded-lg text-left text-white font-medium" onClick={() => setShowMobileMenu(false)}>
                <span className="flex items-center gap-3">🏠 На сайт (головна)</span>
              </a>
              {/* EcoFlow — сразу под «На сайт», зелёная кнопка */}
              <button onClick={() => { openModal(setShowPowerTracker, 'powerTracker'); setShowMobileMenu(false); }} className="w-full flex items-center justify-between px-4 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-left text-white font-medium">
                <span className="flex items-center gap-3">
                  <span className="text-xl">⚡</span>
                  <span>EcoFlow — ціни станцій</span>
                </span>
              </button>
              {/* Mobile Search */}
              <div className="relative mb-3">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icons.Search />
                </div>
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400 text-sm"
                />
              </div>
              
              <button onClick={() => { openModal(setShowCalculator, 'calculator'); setShowMobileMenu(false); }} className="w-full flex items-center justify-between px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-left">
                <span className="flex items-center gap-3">
                  <Icons.Calculator />
                  <span>Калькулятор</span>
                </span>
              </button>
              
              <button onClick={() => { openModal(setShowServicePrices, 'services'); setShowMobileMenu(false); }} className="w-full flex items-center justify-between px-4 py-3 bg-orange-600 hover:bg-orange-500 rounded-lg text-left">
                <span className="flex items-center gap-3">
                  <Icons.Price />
                  <span>Услуги</span>
                </span>
              </button>
              
              <button onClick={() => { openModal(setShowExchangeUA, 'exchangeUA'); setShowMobileMenu(false); }} className="w-full flex items-center justify-between px-4 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg text-left">
                <span className="flex items-center gap-3">
                  <Icons.Price />
                  <span>Прайс Украина (Apple)</span>
                </span>
              </button>
              
              <button onClick={() => { openModal(setShowMacBoards, 'boards'); setShowMobileMenu(false); }} className="w-full flex items-center justify-between px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left">
                <span className="flex items-center gap-3">
                  <Icons.Board />
                  <span>MacBook платы</span>
                </span>
                {counts.boards > 0 && <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">{counts.boards}</span>}
              </button>
              
              <button onClick={() => { openModal(setShowKnowledge, 'knowledge'); setShowMobileMenu(false); }} className="w-full flex items-center justify-between px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left">
                <span className="flex items-center gap-3">
                  <Icons.Book />
                  <span>База знаний</span>
                </span>
              </button>
              
              <button onClick={() => { openModal(setShowKeyCombo, 'keycombo'); setShowMobileMenu(false); }} className="w-full flex items-center justify-between px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left">
                <span className="flex items-center gap-3">
                  ⌨️
                  <span>DFU/Recovery</span>
                </span>
              </button>
              
              <button onClick={() => { openModal(setShowICs, 'ics'); setShowMobileMenu(false); }} className="w-full flex items-center justify-between px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left">
                <span className="flex items-center gap-3">
                  <Icons.Chip />
                  <span>Микросхемы</span>
                </span>
                {counts.ics > 0 && <span className="bg-violet-500 text-white text-xs rounded-full px-2 py-1">{counts.ics}</span>}
              </button>
              
              <button onClick={() => { openModal(setShowErrors, 'errors'); setShowMobileMenu(false); }} className="w-full flex items-center justify-between px-4 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-left">
                <span className="flex items-center gap-3">
                  <Icons.Error />
                  <span>Коды ошибок</span>
                </span>
                {counts.errors > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">{counts.errors}</span>}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content — ограниченная ширина для удобства чтения */}
      <main className="w-full content-container py-6">
        {/* Breadcrumbs & Stats — карточка для визуальной иерархии */}
        <div className="mb-6 bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600 min-w-0">
              {navigationHistory.length > 1 && (
                <button 
                  onClick={navigateBack}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-700 font-medium text-xs sm:text-sm"
                >
                  ← Назад
                </button>
              )}
              <span className="font-bold text-slate-900">Главная</span>
              {activeSection !== 'devices' && (
                <>
                  <span className="text-slate-400">›</span>
                  <span className="capitalize text-slate-700">
                    {activeSection === 'calculator' && 'Калькулятор'}
                    {activeSection === 'services' && 'Услуги'}
                    {activeSection === 'exchangeUA' && 'Прайс Украина'}
                    {activeSection === 'boards' && 'MacBook платы'}
                    {activeSection === 'knowledge' && 'База знаний'}
                    {activeSection === 'keycombo' && 'DFU/Recovery'}
                    {activeSection === 'powerTracker' && 'Power Tracker'}
                    {activeSection === 'ics' && 'Микросхемы'}
                    {activeSection === 'errors' && 'Коды ошибок'}
                    {activeSection === 'prices' && 'Прайс-лист'}
                    {activeSection === 'device-detail' && 'Устройство'}
                  </span>
                </>
              )}
              {selectedDevice && (
                <>
                  <span className="text-slate-400">›</span>
                  <span className="font-medium text-blue-600 truncate max-w-[200px] sm:max-w-none">{selectedDevice.name}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 sm:gap-3 text-sm flex-shrink-0">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                <Icons.Phone className="w-4 h-4 text-blue-500" />
                <span className="font-bold">{counts.devices}</span>
                <span className="hidden sm:inline text-blue-600">устр.</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-violet-50 text-violet-700 rounded-lg border border-violet-100">
                <Icons.Chip className="w-4 h-4 text-violet-500" />
                <span className="font-bold">{counts.ics}</span>
                <span className="hidden sm:inline text-violet-600">IC</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 text-red-700 rounded-lg border border-red-100">
                <Icons.Error className="w-4 h-4 text-red-500" />
                <span className="font-bold">{counts.errors}</span>
                <span className="hidden sm:inline text-red-600">ошиб.</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Devices — компактные карточки */}
        {recentDevices.length > 0 && !selectedDevice && (
          <div className="mb-6 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icons.Info className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-700">Недавно просмотренные</h3>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {recentDevices.map((device) => (
                <button
                  key={device.name}
                  onClick={() => handleDeviceSelect(device)}
                  className="flex-shrink-0 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 hover:shadow transition-all text-sm text-left"
                >
                  <div className="font-medium text-slate-800">{device.name}</div>
                  <div className="text-xs text-slate-500">{device.model_number}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Keyboard Shortcuts — сворачиваемая подсказка */}
        <details className="mb-4 group hidden md:block">
          <summary className="cursor-pointer list-none p-2 -m-2 rounded-lg hover:bg-slate-100 text-xs text-slate-500 hover:text-slate-700 transition-colors">
            <span className="font-medium">⌨️ Шорткаты</span>
            <span className="ml-2 text-slate-400 group-open:inline">▼</span>
          </summary>
          <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
            <kbd className="px-2 py-1 bg-white border border-slate-300 rounded font-mono">Ctrl+K</kbd> Поиск
            <span className="mx-2 text-slate-400">·</span>
            <kbd className="px-2 py-1 bg-white border border-slate-300 rounded font-mono">Esc</kbd> Закрыть
            <span className="mx-2 text-slate-400">·</span>
            <kbd className="px-2 py-1 bg-white border border-slate-300 rounded font-mono">Ctrl+1–8</kbd> Разделы
          </div>
        </details>
        
        <DeviceList 
          devices={devices} 
          isLoading={loading} 
          onSelect={handleDeviceSelect} 
        />
      </main>

      {/* Device Detail Modal (NEW SUPER MODAL) */}
      {selectedDevice && (
        <DeviceDetailModal
          device={selectedDevice}
          onClose={closeAllModals}
          rates={rates}
          compatibility={compatibility}
          bootSequences={bootSequences}
          measurements={measurements}
        />
      )}

      {/* Part Detail Modal */}
      {selectedPart && (
        <PartDetailModal 
          item={selectedPart} 
          rates={rates} 
          onClose={closeAllModals}
        />
      )}

      {/* IC Detail Modal */}
      {selectedIC && (
        <ICDetailModal 
          item={selectedIC} 
          onClose={closeAllModals}
        />
      )}

      {/* Global Price List Modal */}
      {showPriceTable && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] overflow-hidden">
             <PriceTable 
               items={priceListArray} 
               onClose={closeAllModals}
               onSelectItem={(item) => navigate(`/nexx/part/${encodeURIComponent(item.article)}`)}
             />
          </div>
        </div>
      )}

      {/* Error Codes Modal */}
      {showErrors && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden">
             <ErrorCodes 
               errors={errors} 
               onClose={closeAllModals}
             />
          </div>
        </div>
      )}

      {/* IC Database Modal */}
      {showICs && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden">
             <ICList 
               ics={ics} 
               onClose={closeAllModals}
               onSelect={(ic) => navigate(`/nexx/ic/${encodeURIComponent(ic.name)}`)}
             />
          </div>
        </div>
      )}

      {/* Mac Board List Modal */}
      {showMacBoards && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden">
             <MacBoardList 
               boards={macBoards} 
               logicBoards={logicBoards}
               onClose={closeAllModals}
             />
          </div>
        </div>
      )}

      {/* Service Prices Modal (NEW) */}
      {showServicePrices && Object.keys(services).length > 0 && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden">
             <ServicePriceList 
               services={services}
               rates={rates}
               onClose={closeAllModals}
             />
          </div>
        </div>
      )}

      {/* Apple Official UA Exchange Price List Modal */}
      {showExchangeUA && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden flex flex-col">
             <ExchangePriceListModal
               exchangePrices={exchangePrices}
               meta={appleExchangeMeta}
               onClose={closeAllModals}
             />
          </div>
        </div>
      )}

      {/* Repair Calculator Modal */}
      {showCalculator && officialPrices && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden">
             <RepairCalculator 
               officialPrices={officialPrices}
               exchangePrices={exchangePrices}
               devices={devices}
               rates={rates}
               onClose={closeAllModals}
             />
          </div>
        </div>
      )}

      {/* Key Combinations Modal (DFU/Recovery) */}
      {showKeyCombo && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden">
             <KeyCombinations 
               data={keyCombinations}
               onClose={closeAllModals}
             />
          </div>
        </div>
      )}

      {/* Power Tracker Modal (EcoFlow, Bluetti, DJI) */}
      {showPowerTracker && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden">
             <PowerStationTracker onClose={closeAllModals} />
          </div>
        </div>
      )}
    </div>
  );
};
