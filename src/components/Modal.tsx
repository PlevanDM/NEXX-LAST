import React, { ReactNode } from 'react';
import { Icons } from './Icons';

interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  color?: 'indigo' | 'green' | 'amber' | 'red' | 'blue' | 'violet';
}

const colors = {
  indigo: 'from-indigo-500 to-purple-600',
  green: 'from-emerald-500 to-teal-600',
  amber: 'from-amber-500 to-orange-600',
  red: 'from-red-500 to-rose-600',
  blue: 'from-blue-500 to-cyan-600',
  violet: 'from-violet-500 to-purple-600',
};

export const Modal: React.FC<ModalProps> = ({ 
  title, 
  subtitle, 
  onClose, 
  children, 
  color = 'indigo' 
}) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        <div className={`bg-gradient-to-r ${colors[color]} p-5 text-white`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{title}</h2>
              {subtitle && <p className="text-white/80 text-sm mt-1">{subtitle}</p>}
            </div>
            <button 
              onClick={onClose} 
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <Icons.Close />
            </button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};
