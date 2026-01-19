import React from 'react';
import { Icons } from './Icons';
import { MacBoard, LogicBoard } from '../types';

interface MacBoardListProps {
  boards: MacBoard[];
  logicBoards: LogicBoard[];
  onClose: () => void;
}

export const MacBoardList: React.FC<MacBoardListProps> = ({ boards, logicBoards, onClose }) => {
  const [search, setSearch] = React.useState('');

  const allBoards = React.useMemo(() => {
    // Нормализуем данные из обоих источников
    const normalizedLogic = logicBoards.map(b => ({
      board_number: b.board_number,
      model: b.model,
      year: b.year.toString(),
      emc: b.emc || '',
      cpu: b.architecture || '',
      model_number: b.model_number
    }));

    // Добавляем данные из mac_board_reference, если их еще нет
    // (Хотя mac_board_reference богаче деталями, но logic_boards полнее списком)
    // Для простоты пока просто объединим и покажем
    return normalizedLogic;
  }, [logicBoards]);

  const filteredBoards = React.useMemo(() => {
    return allBoards.filter(b => 
      b.board_number.toLowerCase().includes(search.toLowerCase()) ||
      b.model.toLowerCase().includes(search.toLowerCase()) ||
      b.emc.toLowerCase().includes(search.toLowerCase()) ||
      (b.model_number && b.model_number.toLowerCase().includes(search.toLowerCase()))
    );
  }, [allBoards, search]);

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-slate-200">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-800 rounded-t-xl text-white">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Icons.Board /> Справочник плат MacBook
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
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
            placeholder="Поиск (A1708, 820-00840, M1...)"
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
            <tr>
              <th className="px-4 py-3">Board N°</th>
              <th className="px-4 py-3">Модель</th>
              <th className="px-4 py-3">Год</th>
              <th className="px-4 py-3">CPU</th>
            </tr>
          </thead>
          <tbody>
            {filteredBoards.length > 0 ? (
              filteredBoards.map((b, idx) => (
                <tr key={idx} className="bg-white border-b hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-mono font-bold text-blue-600">{b.board_number}</div>
                    {b.model_number && <div className="text-xs text-slate-500 mt-0.5 font-bold bg-slate-100 px-1 rounded inline-block">{b.model_number}</div>}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {b.model}
                    {b.emc && <div className="text-xs text-slate-500 mt-0.5">{b.emc}</div>}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{b.year}</td>
                  <td className="px-4 py-3 text-slate-500">{b.cpu}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  Ничего не найдено
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
