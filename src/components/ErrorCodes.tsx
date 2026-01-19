import React from 'react';
import { Icons } from './Icons';
import { ErrorDetail } from '../types';

interface ErrorCodesProps {
  errors: Record<string, ErrorDetail>;
  onClose: () => void;
}

export const ErrorCodes: React.FC<ErrorCodesProps> = ({ errors, onClose }) => {
  const [search, setSearch] = React.useState('');

  const filteredErrors = React.useMemo(() => {
    // Превращаем объект в массив и фильтруем
    return Object.entries(errors)
      .map(([code, detail]) => ({ code, ...detail }))
      .filter(err => 
        err.code.toLowerCase().includes(search.toLowerCase()) ||
        err.description.toLowerCase().includes(search.toLowerCase()) ||
        (err.solution && err.solution.toLowerCase().includes(search.toLowerCase()))
      );
  }, [errors, search]);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-red-50 rounded-t-xl">
        <h2 className="text-lg font-bold text-red-800 flex items-center gap-2">
          <Icons.Error /> База ошибок (iTunes / Panic)
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-red-200 rounded-full transition-colors text-red-800">
          <Icons.Close />
        </button>
      </div>

      <div className="p-4 bg-white">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="Код ошибки (4013, 9, panic-full...)"
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50">
        {filteredErrors.length > 0 ? (
          filteredErrors.map((err) => (
            <div key={err.code} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 hover:border-red-200 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono font-bold text-lg text-red-600 bg-red-50 px-2 py-0.5 rounded">
                  {err.code}
                </span>
                {err.category && (
                  <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                    {err.category}
                  </span>
                )}
              </div>
              <p className="text-slate-800 font-medium mb-2">{err.description}</p>
              {err.solution && (
                <div className="text-sm text-slate-600 bg-green-50 p-2 rounded border border-green-100">
                  <span className="font-bold text-green-700">Решение:</span> {err.solution}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <p>Ничего не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
};
