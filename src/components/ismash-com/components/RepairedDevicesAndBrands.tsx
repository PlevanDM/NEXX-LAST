import React from 'react';
import { cn } from '@/utils';

interface DeviceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  count?: number;
}

interface Brand {
  id: string;
  name: string;
  logo?: string;
  icon?: React.ReactNode;
}

interface RepairedDevicesAndBrandsProps {
  title?: string;
  subtitle?: string;
  deviceCategories?: DeviceCategory[];
  brands?: Brand[];
  className?: string;
  onDeviceClick?: (device: DeviceCategory) => void;
  onBrandClick?: (brand: Brand) => void;
}

// Default device categories
const defaultDeviceCategories: DeviceCategory[] = [
  { id: 'iphone', name: 'iPhone', icon: '📱', count: 126 },
  { id: 'ipad', name: 'iPad', icon: '📟', count: 45 },
  { id: 'macbook', name: 'MacBook', icon: '💻', count: 38 },
  { id: 'watch', name: 'Apple Watch', icon: '⌚', count: 22 },
  { id: 'airpods', name: 'AirPods', icon: '🎧', count: 15 },
  { id: 'imac', name: 'iMac', icon: '🖥️', count: 12 },
];

// Default brands
const defaultBrands: Brand[] = [
  { id: 'apple', name: 'Apple', icon: '🍎' },
  { id: 'samsung', name: 'Samsung', icon: '📱' },
  { id: 'xiaomi', name: 'Xiaomi', icon: '📱' },
  { id: 'huawei', name: 'Huawei', icon: '📱' },
  { id: 'oneplus', name: 'OnePlus', icon: '📱' },
  { id: 'google', name: 'Google', icon: '📱' },
];

export const RepairedDevicesAndBrands: React.FC<RepairedDevicesAndBrandsProps> = ({
  title = 'Ремонтуємо всі пристрої',
  subtitle,
  deviceCategories = defaultDeviceCategories,
  brands = defaultBrands,
  className,
  onDeviceClick,
  onBrandClick,
}) => {
  return (
    <section className={cn('py-12 sm:py-16 bg-white', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {/* Device Categories */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            Категорії пристроїв
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {deviceCategories.map((device) => (
              <button
                key={device.id}
                onClick={() => onDeviceClick?.(device)}
                className="group flex flex-col items-center p-4 bg-slate-50 hover:bg-blue-50 rounded-xl border-2 border-transparent hover:border-blue-200 transition-all duration-200"
              >
                <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {device.icon}
                </span>
                <span className="font-medium text-slate-800 text-sm">{device.name}</span>
                {device.count && (
                  <span className="text-xs text-slate-500 mt-1">
                    {device.count} моделей
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div>
          <h3 className="text-lg font-semibold text-slate-700 mb-4 text-center">
            Бренди, які ремонтуємо
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => onBrandClick?.(brand)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                {brand.logo ? (
                  <img src={brand.logo} alt={brand.name} className="w-5 h-5 object-contain" />
                ) : (
                  <span className="text-lg">{brand.icon}</span>
                )}
                <span className="font-medium text-slate-700 text-sm">{brand.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl text-white">
          <div className="text-center">
            <div className="text-3xl font-bold">10k+</div>
            <div className="text-blue-200 text-sm">Ремонтів</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">126</div>
            <div className="text-blue-200 text-sm">Моделей</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">30</div>
            <div className="text-blue-200 text-sm">Днів гарантії</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">4.8</div>
            <div className="text-blue-200 text-sm">Рейтинг</div>
          </div>
        </div>
      </div>
    </section>
  );
};
