import React, { useState, useEffect } from 'react';
import Badge from './Badge';

export interface LiveCounterProps {
  min?: number;
  max?: number;
  interval?: number; // milliseconds
}

export const LiveCounter: React.FC<LiveCounterProps> = ({
  min = 2,
  max = 8,
  interval = 15000, // Change every 15 seconds
}) => {
  const [count, setCount] = useState(Math.floor(Math.random() * (max - min + 1)) + min);

  useEffect(() => {
    const timer = setInterval(() => {
      const newCount = Math.floor(Math.random() * (max - min + 1)) + min;
      setCount(newCount);
    }, interval);

    return () => clearInterval(timer);
  }, [min, max, interval]);

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
      <div className="relative">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <div className="absolute inset-0 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
      </div>
      <span className="text-white text-sm font-medium">
        {count} {count === 1 ? 'клієнт' : count < 5 ? 'клієнти' : 'клієнтів'} зараз на сайті
      </span>
    </div>
  );
};

export default LiveCounter;
