import React from 'react';
import { Icons } from './Icons';
import { LogicBoard } from '../types';
import { formatPrice } from '../utils';

interface MacBoardListProps {
  boards: any[];
  logicBoards: LogicBoard[];
  onClose: () => void;
}

export const MacBoardList: React.FC<MacBoardListProps> = ({ boards, logicBoards, onClose }) => {
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'board' | 'model' | 'price'>('board');

  const allBoards = React.useMemo(() => {
    // Используем logicBoards из API (уже преобразованные)
    return logicBoards.map(b => ({
      board_number: b.board_number || '',
      model: b.model || 'Unknown',
      year: b.year?.toString() || 'N/A',
      emc: b.emc || '',
      cpu: b.architecture || '',
      model_number: b.model_number || b.board_number,
      price_uah: (b as any).price_uah,
      price_usd: (b as any).price_usd
    }));
  }, [logicBoards]);

  const filteredBoards = React.useMemo(() => {
    let result = allBoards.filter(b => 
      b.board_number.toLowerCase().includes(search.toLowerCase()) ||
      b.model.toLowerCase().includes(search.toLowerCase()) ||
      (b.cpu && b.cpu.toLowerCase().includes(search.toLowerCase())) ||
      (b.model_number && b.model_number.toLowerCase().includes(search.toLowerCase()))
    );
    
    // Сортировка
    result.sort((a, b) => {
      if (sortBy === 'board') return a.board_number.localeCompare(b.board_number);
      if (sortBy === 'model') return a.model.localeCompare(b.model);
      if (sortBy === 'price') return (a.price_usd || 0) - (b.price_usd || 0);
      return 0;
    });
    
    return result;
  }, [allBoards, search, sortBy]);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-800 rounded-t-xl text-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Icons.Board /> Logic Boards - MacBook ({allBoards.length})
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <Icons.Close />
        </button>
      </div>

      <div className="p-4 bg-white border-b border-slate-200">
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icons.Search />
            </div>
            <input
              type="text"
              placeholder="Căutare (661-xxxxx, MacBook Pro, M1...)"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
          >
            <option value="board">Sort: Part Number</option>
            <option value="model">Sort: Model</option>
            <option value="price">Sort: Preț</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => setSortBy('board')}>
                Part Number {sortBy === 'board' && '↓'}
              </th>
              <th className="px-4 py-3 cursor-pointer hover:bg-slate-100" onClick={() => setSortBy('model')}>
                Model {sortBy === 'model' && '↓'}
              </th>
              <th className="px-4 py-3">Specs</th>
              <th className="px-4 py-3 cursor-pointer hover:bg-slate-100 text-right" onClick={() => setSortBy('price')}>
                Preț {sortBy === 'price' && '↓'}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBoards.length > 0 ? (
              filteredBoards.map((b, idx) => (
                <tr key={idx} className="bg-white border-b hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-mono font-bold text-blue-600">{b.board_number}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-900">{b.model}</div>
                    {b.year && b.year !== 'N/A' && (
                      <div className="text-xs text-slate-500">{b.year}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 text-xs">
                    {b.cpu && <span className="bg-slate-100 px-2 py-0.5 rounded">{b.cpu}</span>}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {b.price_usd ? (
                      <div>
                        <div className="font-bold text-green-600">${b.price_usd.toFixed(2)}</div>
                        {b.price_uah && (
                          <div className="text-xs text-slate-500">{formatPrice(b.price_uah, 'UAH')}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  {allBoards.length === 0 ? (
                    <div>
                      <p className="text-lg mb-2">Nu există date despre plăci logice</p>
                      <p className="text-sm">Datele vor fi adăugate în curând</p>
                    </div>
                  ) : (
                    'Nimic găsit'
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {allBoards.length > 0 && (
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center">
          Afișate: {filteredBoards.length} din {allBoards.length} plăci logice
        </div>
      )}
    </div>
  );
};
