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
import { KnowledgeBase } from './components/KnowledgeBase';
import { ServicePriceList } from './components/ServicePriceList'; // NEW
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
  const [showServicePrices, setShowServicePrices] = React.useState(false); // NEW

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-xl">
                N
              </div>
              <span className="font-bold text-xl tracking-tight hidden sm:block">NEXX Database</span>
              <span className="font-bold text-xl tracking-tight sm:hidden">NEXX</span>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto">
              <button 
                onClick={() => setShowCalculator(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-sm font-medium whitespace-nowrap shadow-lg shadow-blue-900/50 border border-blue-500"
              >
                <span className="text-white"><Icons.Calculator /></span>
                <span className="hidden sm:inline text-white">Калькулятор</span>
              </button>

              <button 
                onClick={() => setShowServicePrices(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors text-sm font-medium whitespace-nowrap shadow-lg shadow-orange-900/50 border border-orange-500"
              >
                <span className="text-white"><Icons.Price /></span>
                <span className="hidden sm:inline text-white">Услуги</span>
              </button>

              <button 
                onClick={() => setShowMacBoards(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
              >
                <span className="text-blue-400"><Icons.Board /></span>
                <span className="hidden sm:inline">MacBook</span>
              </button>

              <button 
                onClick={() => setShowKnowledge(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
              >
                <span className="text-indigo-400"><Icons.Book /></span>
                <span className="hidden sm:inline">Инфо</span>
              </button>

              <button 
                onClick={() => setShowICs(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
              >
                <span className="text-violet-400"><Icons.Chip /></span>
                <span className="hidden sm:inline">IC</span>
              </button>

              <button 
                onClick={() => setShowErrors(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
              >
                <span className="text-red-400"><Icons.Error /></span>
                <span className="hidden sm:inline">Ошибки</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DeviceList 
          devices={devices} 
          isLoading={loading} 
          onSelect={setSelectedDevice} 
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

      {/* Knowledge Base Modal */}
      {showKnowledge && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] overflow-hidden">
             <KnowledgeBase 
               schematics={schematics}
               guides={guides}
               pinouts={pinouts}
               onClose={() => setShowKnowledge(false)} 
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
    </div>
  );
};
