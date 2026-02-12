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
  const openModal = (_modalSetter: any, sectionName: string) => {
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

  // На nexx.html путь /nexx.html — заменяем на /nexx, чтобы контент базы отображался (пустая страница после PIN)
  React.useEffect(() => {
    if (location.pathname === '/nexx.html') {
      navigate('/nexx', { replace: true });
      return;
    }
  }, [location.pathname, navigate]);

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
      
      // Data loaded successfully
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
      (d.model_number?.toLowerCase() ?? '').includes(query) ||
      (d.board_number?.toLowerCase() ?? '').includes(query) ||
      (d.board_numbers || []).some(bn => (bn ?? '').toLowerCase().includes(query))
    ).slice(0, 5);
    
    // Поиск IC
    results.ics = Object.values(ics).filter(ic => 
      (ic.name?.toLowerCase() ?? '').includes(query) ||
      (ic.designation?.toLowerCase() ?? '').includes(query) ||
      (ic.functions || []).some(f => (f ?? '').toLowerCase().includes(query))
    ).slice(0, 5);
    
    // Поиск ошибок
    results.errors = Object.values(errors).filter(err => 
      String(err.code ?? '').toLowerCase().includes(query) ||
      (err.description?.toLowerCase() ?? '').includes(query)
    ).slice(0, 5);
    
    // Поиск по ценам
    results.prices = Object.values(prices).filter(price => 
      (price.article?.toLowerCase() ?? '').includes(query) ||
      (price.description?.toLowerCase() ?? '').includes(query)
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
    const isSessionExpired = error.includes('Сесія закінчилась') || error.includes('пінкодом');
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-slate-100 p-6">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
          <Icons.Error className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="text-xl font-bold mt-2 text-white">Помилка завантаження</h1>
        <p className="text-slate-300 text-center mt-2 max-w-md">{error}</p>
        <div className="flex flex-wrap gap-3 mt-6 justify-center">
          {isSessionExpired && (
            <button
              type="button"
              onClick={() => {
                try { localStorage.removeItem('nexx_auth'); localStorage.removeItem('nexx_pin'); } catch (_) {}
                window.location.reload();
              }}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition"
            >
              Увійти знову
            </button>
          )}
          <button
            type="button"
            onClick={loadData}
            className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition"
          >
            Спробувати знову
          </button>
          <a
            href="/"
            className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition inline-flex items-center justify-center"
          >
            На головну
          </a>
        </div>
      </div>
    );
  }

  // Dropdown state for "Tools" menu
  const [showToolsMenu, setShowToolsMenu] = React.useState(false);
  const toolsMenuRef = React.useRef<HTMLDivElement>(null);

  // Close tools dropdown on outside click
  React.useEffect(() => {
    if (!showToolsMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(e.target as Node)) {
        setShowToolsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showToolsMenu]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* ═══ NAVBAR — clean, minimal, unified colors ═══ */}
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-30">
        <div className="w-full px-3 sm:px-4 lg:px-6">
          <div className="flex items-center gap-2 sm:gap-3" style={{ height: 56, minHeight: 56 }}>
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-90 transition-opacity" title="На главную">
              <img src="/static/nexx-logo.png?v=6" alt="NEXX GSM" className="w-auto object-contain logo-pulse" style={{ height: 40, background: 'transparent' }} />
              <span className="font-bold text-base tracking-tight hidden sm:inline text-white">Database</span>
            </a>

            {/* Global Search — always visible */}
            <div className="relative flex-1 min-w-0 max-w-lg mx-1 lg:mx-3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icons.Search />
              </div>
              <input
                type="text"
                placeholder="Поиск... (Ctrl+K)"
                aria-label="Глобальный поиск по базе данных"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-slate-400 text-sm"
              />
              {/* Search Results Dropdown */}
              {globalSearchResults && globalSearch.length >= 2 && (
                <div className="absolute top-full mt-2 w-full bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-h-96 overflow-auto z-50">
                  {globalSearchResults.devices.length > 0 && (
                    <div className="p-3 border-b border-slate-700">
                      <div className="text-xs text-slate-400 mb-2 font-bold">Устройства</div>
                      {globalSearchResults.devices.map((device: Device) => (
                        <div key={device.name} onClick={() => { handleDeviceSelect(device); setGlobalSearch(''); }} className="p-2 hover:bg-slate-700 rounded cursor-pointer text-sm">
                          <div className="font-medium">{device.name}</div>
                          <div className="text-xs text-slate-400">{device.model_number}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {globalSearchResults.ics.length > 0 && (
                    <div className="p-3 border-b border-slate-700">
                      <div className="text-xs text-slate-400 mb-2 font-bold">Микросхемы</div>
                      {globalSearchResults.ics.map((ic: ICComponent) => (
                        <div key={ic.name} onClick={() => { navigate(`/nexx/ic/${encodeURIComponent(ic.name)}`); setGlobalSearch(''); }} className="p-2 hover:bg-slate-700 rounded cursor-pointer text-sm">
                          <div className="font-medium">{ic.name}</div>
                          <div className="text-xs text-slate-400">{ic.designation}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {globalSearchResults.errors.length > 0 && (
                    <div className="p-3 border-b border-slate-700">
                      <div className="text-xs text-slate-400 mb-2 font-bold">Ошибки</div>
                      {globalSearchResults.errors.map((error: ErrorDetail, idx: number) => (
                        <div key={`${error.code}-${idx}`} onClick={() => { navigate('/nexx/errors'); setGlobalSearch(''); }} className="p-2 hover:bg-slate-700 rounded cursor-pointer text-sm">
                          <div className="font-medium">{error.code}</div>
                          <div className="text-xs text-slate-400 truncate">{error.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {globalSearchResults.prices.length > 0 && (
                    <div className="p-3 border-b border-slate-700">
                      <div className="text-xs text-slate-400 mb-2 font-bold">Цены</div>
                      {globalSearchResults.prices.map((price: PriceData) => (
                        <div key={price.article} onClick={() => { navigate(`/nexx/part/${encodeURIComponent(price.article)}`); setGlobalSearch(''); }} className="p-2 hover:bg-slate-700 rounded cursor-pointer text-sm">
                          <div className="font-medium">{price.article}</div>
                          <div className="text-xs text-slate-400 truncate">{price.description}</div>
                          <div className="text-xs text-green-400 font-bold mt-1">{price.price_uah} ₴</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {globalSearchResults.devices.length === 0 && globalSearchResults.ics.length === 0 && globalSearchResults.errors.length === 0 && globalSearchResults.prices.length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-sm">Ничего не найдено</div>
                  )}
                </div>
              )}
            </div>
            
            {/* ─── Desktop: Primary actions (3 buttons) + Tools dropdown ─── */}
            <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
              {/* Primary: Calculator */}
              <button
                onClick={() => openModal(setShowCalculator, 'calculator')}
                className={`flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeSection === 'calculator'
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                <Icons.Calculator />
                <span>Калькулятор</span>
              </button>
              {/* Primary: Services */}
              <button
                onClick={() => openModal(setShowServicePrices, 'services')}
                className={`flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeSection === 'services'
                    ? 'bg-slate-600 text-white ring-2 ring-blue-400'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                <Icons.Price />
                <span>Услуги</span>
              </button>
              {/* Primary: Прайс UA */}
              <button
                onClick={() => openModal(setShowExchangeUA, 'exchangeUA')}
                className={`flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeSection === 'exchangeUA'
                    ? 'bg-slate-600 text-white ring-2 ring-blue-400'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                }`}
              >
                <Icons.Price />
                <span>Прайс UA</span>
              </button>

              {/* ─── Tools Dropdown ─── */}
              <div className="relative" ref={toolsMenuRef}>
                <button
                  onClick={() => setShowToolsMenu(!showToolsMenu)}
                  className={`flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    showToolsMenu ? 'bg-slate-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  <span>Ещё</span>
                  <svg className={`w-3.5 h-3.5 transition-transform ${showToolsMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </button>
                {showToolsMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in">
                    {[
                      { label: 'EcoFlow / PowerStation', icon: '⚡', section: 'powerTracker', setter: setShowPowerTracker },
                      { label: 'MacBook платы', icon: null, iconEl: <Icons.Board />, section: 'boards', setter: setShowMacBoards, count: counts.boards },
                      { label: 'База знаний', icon: null, iconEl: <Icons.Book />, section: 'knowledge', setter: setShowKnowledge },
                      { label: 'DFU / Recovery', icon: '⌨️', section: 'keycombo', setter: setShowKeyCombo },
                      { label: 'Микросхемы (IC)', icon: null, iconEl: <Icons.Chip />, section: 'ics', setter: setShowICs, count: counts.ics },
                      { label: 'Коды ошибок', icon: null, iconEl: <Icons.Error />, section: 'errors', setter: setShowErrors, count: counts.errors },
                    ].map((item) => (
                      <button
                        key={item.section}
                        onClick={() => { openModal(item.setter, item.section); setShowToolsMenu(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                          activeSection === item.section ? 'bg-blue-600/20 text-blue-300' : 'text-slate-200 hover:bg-slate-700'
                        }`}
                      >
                        <span className="w-5 text-center text-base flex-shrink-0">{item.icon || item.iconEl}</span>
                        <span className="flex-1">{item.label}</span>
                        {item.count ? (
                          <span className="text-[10px] text-slate-400 bg-slate-700 px-1.5 py-0.5 rounded-full font-mono" title={`${item.count} записей в базе`}>{item.count}</span>
                        ) : null}
                      </button>
                    ))}
                    <div className="border-t border-slate-700">
                      <a href="/" className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
                        <span className="w-5 text-center">🏠</span>
                        <span>На сайт</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* ─── Mobile: Hamburger ─── */}
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden flex items-center justify-center w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0"
            >
              {showMobileMenu ? <Icons.Close /> : '☰'}
            </button>
          </div>
        </div>
        
        {/* ═══ Mobile Menu — clean, grouped ═══ */}
        {showMobileMenu && (
          <div className="lg:hidden bg-slate-800 border-t border-slate-700 max-h-[85vh] overflow-y-auto">
            <div className="px-3 py-3 space-y-1">
              {/* Mobile Search */}
              <div className="relative mb-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Icons.Search /></div>
                <input type="text" placeholder="Поиск..." value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400 text-sm" />
              </div>

              {/* Primary tools */}
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 pt-2">Инструменты</p>
              {[
                { label: 'Калькулятор', icon: <Icons.Calculator />, section: 'calculator', setter: setShowCalculator, primary: true },
                { label: 'Услуги', icon: <Icons.Price />, section: 'services', setter: setShowServicePrices },
                { label: 'Прайс Украина (Apple)', icon: <Icons.Price />, section: 'exchangeUA', setter: setShowExchangeUA },
                { label: 'EcoFlow / PowerStation', icon: <span>⚡</span>, section: 'powerTracker', setter: setShowPowerTracker },
              ].map((item) => (
                <button key={item.section} onClick={() => { openModal(item.setter, item.section); setShowMobileMenu(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-colors ${
                    item.primary ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-slate-700 hover:bg-slate-600 text-white'
                  }`}>
                  <span className="w-5">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
              
              {/* Database sections */}
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 pt-3">База данных</p>
              {[
                { label: 'MacBook платы', icon: <Icons.Board />, section: 'boards', setter: setShowMacBoards },
                { label: 'База знаний', icon: <Icons.Book />, section: 'knowledge', setter: setShowKnowledge },
                { label: 'DFU / Recovery', icon: <span>⌨️</span>, section: 'keycombo', setter: setShowKeyCombo },
                { label: 'Микросхемы (IC)', icon: <Icons.Chip />, section: 'ics', setter: setShowICs },
                { label: 'Коды ошибок', icon: <Icons.Error />, section: 'errors', setter: setShowErrors },
              ].map((item) => (
                <button key={item.section} onClick={() => { openModal(item.setter, item.section); setShowMobileMenu(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-slate-700/50 hover:bg-slate-600 rounded-lg text-left text-white transition-colors">
                  <span className="w-5">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}

              {/* Back to site */}
              <div className="border-t border-slate-700 mt-2 pt-2">
                <a href="/" className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:bg-slate-700 hover:text-white rounded-lg transition-colors" onClick={() => setShowMobileMenu(false)}>
                  <span className="w-5">🏠</span>
                  <span>На сайт</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ═══ Main Content ═══ */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6">
        {/* Breadcrumbs — clean, no duplicate stats */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-slate-600">
          {navigationHistory.length > 1 && (
            <button onClick={navigateBack} className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-100 rounded-lg transition-colors text-slate-700 font-medium text-xs border border-slate-200">← Назад</button>
          )}
          <button type="button" onClick={() => navigate('/nexx')} className="font-bold text-slate-900 hover:text-blue-600 transition-colors">Database</button>
          {activeSection !== 'devices' && (
            <>
              <span className="text-slate-400">›</span>
              <span className="text-slate-700">
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
          {/* Compact stats — non-intrusive, right-aligned */}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
            <span title={`${counts.devices} устройств в базе`}>📱 {counts.devices}</span>
            <span className="text-slate-300">·</span>
            <span title={`${counts.ics} микросхем в базе`}>🔧 {counts.ics} IC</span>
            <span className="text-slate-300">·</span>
            <span title={`${counts.errors} кодов ошибок`}>⚠️ {counts.errors}</span>
          </div>
        </div>
        
        {/* Recent Devices — compact */}
        {recentDevices.length > 0 && !selectedDevice && (
          <div className="mb-6 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Icons.Info className="w-4 h-4 text-slate-500" />
              <h3 className="text-sm font-bold text-slate-700">Недавно просмотренные</h3>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {recentDevices.map((device) => (
                <button key={device.name} onClick={() => handleDeviceSelect(device)} className="flex-shrink-0 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 hover:shadow transition-all text-sm text-left">
                  <div className="font-medium text-slate-800">{device.name}</div>
                  <div className="text-xs text-slate-500">{device.model_number}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        
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
