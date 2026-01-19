import React from 'react';
import { Icons } from './Icons';
import { SchematicResource, RepairGuide, ConnectorPinout } from '../types';

interface KnowledgeBaseProps {
  schematics: SchematicResource[];
  guides: RepairGuide[];
  pinouts: ConnectorPinout[];
  onClose: () => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ schematics, guides, pinouts, onClose }) => {
  const [activeTab, setActiveTab] = React.useState<'schematics' | 'guides' | 'pinouts'>('schematics');
  const [search, setSearch] = React.useState('');

  const renderContent = () => {
    if (activeTab === 'schematics') {
      const filtered = schematics.filter(s => 
        s.model.toLowerCase().includes(search.toLowerCase()) || 
        (s.board_number && s.board_number.includes(search))
      );
      return (
        <div className="space-y-2">
          {filtered.map((s, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
              <div>
                <div className="font-medium text-slate-800">{s.model}</div>
                {s.board_number && <div className="text-xs font-mono text-slate-500">{s.board_number}</div>}
              </div>
              <div className="flex gap-2">
                {s.schematic_url && <a href={s.schematic_url} target="_blank" className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200">Схема</a>}
                {s.boardview_url && <a href={s.boardview_url} target="_blank" className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200">Boardview</a>}
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'guides') {
      const filtered = guides.filter(g => 
        g.title.toLowerCase().includes(search.toLowerCase()) || 
        g.category.toLowerCase().includes(search.toLowerCase())
      );
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((g, i) => (
            <div key={i} className="p-4 bg-white border border-slate-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-xs font-bold text-slate-400 uppercase mb-1">{g.category}</div>
              <h3 className="font-bold text-slate-800 mb-2">{g.title}</h3>
              <p className="text-sm text-slate-600 line-clamp-3">{g.description}</p>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'pinouts') {
      const filtered = pinouts.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase()) || 
        p.device.toLowerCase().includes(search.toLowerCase())
      );
      return (
        <div className="space-y-3">
          {filtered.map((p, i) => (
            <div key={i} className="p-4 bg-white border border-slate-200 rounded-lg">
              <h3 className="font-bold text-slate-800">{p.name} ({p.device})</h3>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                {Object.entries(p.pins).slice(0, 8).map(([pin, desc]) => (
                  <div key={pin} className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="font-mono text-slate-500">{pin}</span>
                    <span className="font-medium text-slate-700">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-indigo-600 rounded-t-xl text-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Icons.Book /> База Знаний
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <Icons.Close />
        </button>
      </div>

      <div className="bg-slate-50 p-2 flex gap-2 border-b border-slate-200 overflow-x-auto">
        {[
          { id: 'schematics', label: 'Схемы' },
          { id: 'guides', label: 'Гайды' },
          { id: 'pinouts', label: 'Распиновки' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 bg-white border-b border-slate-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Поиск..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {renderContent()}
      </div>
    </div>
  );
};
