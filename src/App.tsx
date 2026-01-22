import React from 'react';
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
import { Device, PriceData, ErrorDetail, ICComponent, OfficialServiceData, MacBoard, SchematicResource, RepairGuide, ConnectorPinout, LogicBoard, BootSequence, DiodeMeasurement, ExchangePrice, ServicePrices } from './types';
import { convertPrice, formatPrice } from './utils';

export const App = () => {
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
  const [servicePrices, setServicePrices] = React.useState<ServicePrices | null>(null);
  
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
  const [showKeyCombo, setShowKeyCombo] = React.useState(false); // NEW: DFU/Recovery
  
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
      
      // Ctrl+1-6 - быстрое переключение разделов
      if (e.ctrlKey && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const sections = [
          () => setShowCalculator(true),
          () => setShowServicePrices(true),
          () => setShowMacBoards(true),
          () => setShowKnowledge(true),
          () => setShowICs(true),
          () => setShowErrors(true)
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
    setSelectedDevice(device);
    setActiveSection('device-detail');
    setNavigationHistory(prev => [...prev, 'device-detail']);
  }, [addToRecent]);

  // Функция для закрытия всех модальных окон
  const closeAllModals = () => {
    setShowPriceTable(false);
    setShowErrors(false);
    setShowICs(false);
    setShowCalculator(false);
    setShowMacBoards(false);
    setShowKnowledge(false);
    setShowServicePrices(false);
    setShowKeyCombo(false);
    setShowMobileMenu(false);
    setSelectedDevice(null);
    setSelectedIC(null);
    setSelectedPart(null);
    setActiveSection('devices');
  };

  // Функция для открытия модального окна с учетом истории
  const openModal = (modalSetter: (value: boolean) => void, sectionName: string) => {
    closeAllModals();
    modalSetter(true);
    setActiveSection(sectionName);
    setNavigationHistory(prev => [...prev, sectionName]);
  };

  // Функция навигации назад
  const navigateBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop(); // Удаляем текущий
      const previousSection = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      
      // Открываем предыдущий раздел
      closeAllModals();
      setActiveSection(previousSection);
      switch(previousSection) {
        case 'calculator': setShowCalculator(true); break;
        case 'services': setShowServicePrices(true); break;
        case 'boards': setShowMacBoards(true); break;
        case 'knowledge': setShowKnowledge(true); break;
        case 'keycombo': setShowKeyCombo(true); break;
        case 'ics': setShowICs(true); break;
        case 'errors': setShowErrors(true); break;
        case 'prices': setShowPriceTable(true); break;
        default: break;
      }
    } else {
      closeAllModals();
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
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
      setServicePrices(data.servicePrices || null);
      
      setRates(data.rates);
      setKeyCombinations(data.keyCombinations);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить базу данных. Проверьте соединение.');
    } finally {
      setLoading(false);
    }
  };

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

  // Преобразуем объект цен в массив для таблицы
  const priceListArray = React.useMemo(() => {
    return Object.values(prices);
  }, [prices]);
  
  // Блокировка скролла body при открытии модальных окон
  React.useEffect(() => {
    const isAnyModalOpen = showPriceTable || showErrors || showICs || showCalculator || 
                           showMacBoards || showKnowledge || showServicePrices || showKeyCombo || 
                           selectedDevice || selectedIC || selectedPart;
    
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showPriceTable, showErrors, showICs, showCalculator, showMacBoards, showKnowledge, showServicePrices, showKeyCombo, selectedDevice, selectedIC, selectedPart]);
  
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xl">
                N
              </div>
              <span className="font-bold text-xl tracking-tight hidden lg:block">NEXX Database</span>
              <span className="font-bold text-xl tracking-tight lg:hidden">NEXX</span>
            </div>
            
            {/* Глобальный поиск */}
            <div className="relative flex-1 max-w-md hidden md:block">
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
                             onClick={() => { setSelectedIC(ic); setGlobalSearch(''); }}
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
                          onClick={() => { setSelectedPart(price); setGlobalSearch(''); }}
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
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              <button 
                onClick={() => openModal(setShowCalculator, 'calculator')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium whitespace-nowrap shadow-lg shadow-orange-900/50 border border-orange-500 ${
                  activeSection === 'services'
                    ? 'bg-orange-600 ring-2 ring-orange-400'
                    : 'bg-orange-600 hover:bg-orange-500'
                }`}
              >
                <Icons.Price />
                <span>Услуги</span>
              </button>

              <button 
                onClick={() => openModal(setShowMacBoards, 'boards')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium whitespace-nowrap relative ${
                  activeSection === 'boards'
                    ? 'bg-slate-700 ring-2 ring-blue-400'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <span className="text-blue-400"><Icons.Board /></span>
                <span>MacBook</span>
                {counts.boards > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {counts.boards}
                  </span>
                )}
              </button>

              <button 
                onClick={() => openModal(setShowKnowledge, 'knowledge')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${
                  activeSection === 'knowledge'
                    ? 'bg-slate-700 ring-2 ring-indigo-400'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <span className="text-indigo-400"><Icons.Book /></span>
                <span>Инфо</span>
              </button>

              <button 
                onClick={() => openModal(setShowKeyCombo, 'keycombo')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${
                  activeSection === 'keycombo'
                    ? 'bg-slate-700 ring-2 ring-purple-400'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <span className="text-purple-400">⌨️</span>
                <span>DFU</span>
              </button>

              <button 
                onClick={() => openModal(setShowICs, 'ics')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium whitespace-nowrap relative ${
                  activeSection === 'ics'
                    ? 'bg-slate-700 ring-2 ring-violet-400'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <span className="text-violet-400"><Icons.Chip /></span>
                <span>IC</span>
                {counts.ics > 0 && (
                  <span className="absolute -top-1 -right-1 bg-violet-500 text-white text-xs rounded-full px-1.5 py-0.5 text-[10px] font-bold">
                    {counts.ics}
                  </span>
                )}
              </button>

              <button 
                onClick={() => openModal(setShowErrors, 'errors')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium whitespace-nowrap relative ${
                  activeSection === 'errors'
                    ? 'bg-slate-700 ring-2 ring-red-400'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <span className="text-red-400"><Icons.Error /></span>
                <span>Ошибки</span>
                {counts.errors > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 text-[10px] font-bold">
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
        
        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-slate-800 border-t border-slate-700">
            <div className="px-4 py-3 space-y-2">
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs & Stats */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            {navigationHistory.length > 1 && (
              <button 
                onClick={navigateBack}
                className="flex items-center gap-1 px-2 py-1 bg-slate-200 hover:bg-slate-300 rounded transition-colors text-slate-700 font-medium"
              >
                ← Назад
              </button>
            )}
            <span className="font-bold text-slate-900">Главная</span>
            {activeSection !== 'devices' && (
              <>
                <span>›</span>
                <span className="capitalize">
                  {activeSection === 'calculator' && 'Калькулятор'}
                  {activeSection === 'services' && 'Услуги'}
                  {activeSection === 'boards' && 'MacBook платы'}
                  {activeSection === 'knowledge' && 'База знаний'}
                  {activeSection === 'keycombo' && 'DFU/Recovery'}
                  {activeSection === 'ics' && 'Микросхемы'}
                  {activeSection === 'errors' && 'Коды ошибок'}
                  {activeSection === 'prices' && 'Прайс-лист'}
                  {activeSection === 'device-detail' && 'Устройство'}
                </span>
              </>
            )}
            {selectedDevice && (
              <>
                <span>›</span>
                <span className="font-medium text-blue-600">{selectedDevice.name}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
              <Icons.Phone />
              <span className="font-bold">{counts.devices}</span>
              <span className="hidden sm:inline">устройств</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg border border-violet-200">
              <Icons.Chip />
              <span className="font-bold">{counts.ics}</span>
              <span className="hidden sm:inline">IC</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg border border-red-200">
              <Icons.Error />
              <span className="font-bold">{counts.errors}</span>
              <span className="hidden sm:inline">ошибок</span>
            </div>
          </div>
        </div>
        
        {/* Recent Devices */}
        {recentDevices.length > 0 && !selectedDevice && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Icons.Info />
              <h3 className="text-sm font-bold text-slate-700">Недавно просмотренные</h3>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {recentDevices.map((device) => (
                <button
                  key={device.name}
                  onClick={() => handleDeviceSelect(device)}
                  className="flex-shrink-0 px-4 py-2 bg-white border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-sm"
                >
                  <div className="font-medium text-slate-800">{device.name}</div>
                  <div className="text-xs text-slate-500">{device.model_number}</div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Keyboard Shortcuts Hint */}
        <div className="mb-4 p-3 bg-slate-100 rounded-lg border border-slate-200 text-xs text-slate-600 hidden md:block">
          <span className="font-bold">Шорткаты:</span>
          <span className="ml-3"><kbd className="px-2 py-1 bg-white border border-slate-300 rounded">Ctrl+K</kbd> Поиск</span>
          <span className="ml-3"><kbd className="px-2 py-1 bg-white border border-slate-300 rounded">Esc</kbd> Закрыть</span>
          <span className="ml-3"><kbd className="px-2 py-1 bg-white border border-slate-300 rounded">Ctrl+1-6</kbd> Разделы</span>
        </div>
        
        {/* Quick Actions - показываем только на главной странице */}
        {activeSection === 'devices' && !selectedDevice && (
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <button 
              onClick={() => openModal(setShowPriceTable, 'prices')}
              className="p-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">💰</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">4846</span>
              </div>
              <div className="font-bold text-sm">Прайс-лист</div>
              <div className="text-xs opacity-80">Все цены</div>
            </button>
            
            <button 
              onClick={() => openModal(setShowCalculator, 'calculator')}
              className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <Icons.Calculator />
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">NEW</span>
              </div>
              <div className="font-bold text-sm">Калькулятор</div>
              <div className="text-xs opacity-80">Стоимость ремонта</div>
            </button>
            
            <button 
              onClick={() => openModal(setShowKnowledge, 'knowledge')}
              className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <Icons.Book />
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">10</span>
              </div>
              <div className="font-bold text-sm">База знаний</div>
              <div className="text-xs opacity-80">Гайды и схемы</div>
            </button>
            
            <button 
              onClick={() => openModal(setShowKeyCombo, 'keycombo')}
              className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">⌨️</span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">DFU</span>
              </div>
              <div className="font-bold text-sm">DFU/Recovery</div>
              <div className="text-xs opacity-80">Комбинации клавиш</div>
            </button>
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
          onClose={() => setSelectedDevice(null)}
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
          onClose={() => setSelectedPart(null)} 
        />
      )}

      {/* IC Detail Modal */}
      {selectedIC && (
        <ICDetailModal 
          item={selectedIC} 
          onClose={() => setSelectedIC(null)} 
        />
      )}

      {/* Global Price List Modal */}
      {showPriceTable && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] overflow-hidden">
             <PriceTable 
               items={priceListArray} 
               onClose={() => setShowPriceTable(false)} 
               onSelectItem={setSelectedPart}
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
               onClose={() => setShowErrors(false)} 
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
               onClose={() => setShowICs(false)} 
               onSelect={setSelectedIC}
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
               onClose={() => setShowMacBoards(false)} 
             />
          </div>
        </div>
      )}

      {/* Service Prices Modal (NEW) */}
      {showServicePrices && servicePrices && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden">
             <ServicePriceList 
               prices={servicePrices}
               rates={rates}
               onClose={() => setShowServicePrices(false)} 
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
               onClose={() => setShowCalculator(false)} 
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
               onClose={() => setShowKeyCombo(false)} 
             />
          </div>
        </div>
      )}
    </div>
  );
};
