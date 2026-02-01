import React from 'react';
import {
  Search,
  ChevronLeft,
  X,
  Cpu,
  CircuitBoard,
  Banknote,
  TriangleAlert,
  Calculator,
  BookOpen,
  Tag,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Headphones,
  Wrench,
  Zap,
  Info
} from 'lucide-react';

// Обертка для иконок, чтобы сохранить совместимость с текущим кодом
// Lucide иконки по умолчанию 24x24, мы можем регулировать это через className
export const Icons = {
  Search: (props: any) => <Search className="w-5 h-5" {...props} />,
  Back: (props: any) => <ChevronLeft className="w-5 h-5" {...props} />,
  Close: (props: any) => <X className="w-6 h-6" {...props} />,
  
  // Компоненты
  Chip: (props: any) => <Cpu className="w-6 h-6" {...props} />, // Для микросхем
  Board: (props: any) => <CircuitBoard className="w-6 h-6" {...props} />, // Для плат
  
  // Финансы
  Price: (props: any) => <Banknote className="w-6 h-6" {...props} />,
  
  // Утилиты
  Error: (props: any) => <TriangleAlert className="w-6 h-6" {...props} />,
  Calculator: (props: any) => <Calculator className="w-6 h-6" {...props} />,
  Book: (props: any) => <BookOpen className="w-6 h-6" {...props} />,
  Tag: (props: any) => <Tag className="w-6 h-6" {...props} />,
  
  // Дополнительные (для категорий)
  Phone: (props: any) => <Smartphone className="w-5 h-5" {...props} />,
  Tablet: (props: any) => <Tablet className="w-5 h-5" {...props} />,
  Laptop: (props: any) => <Laptop className="w-5 h-5" {...props} />,
  Watch: (props: any) => <Watch className="w-5 h-5" {...props} />,
  Headphones: (props: any) => <Headphones className="w-5 h-5" {...props} />,
  Tool: (props: any) => <Wrench className="w-5 h-5" {...props} />,
  Power: (props: any) => <Zap className="w-5 h-5" {...props} />,
  Info: (props: any) => <Info className="w-5 h-5" {...props} />,
};
