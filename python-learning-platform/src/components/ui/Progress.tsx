'use client';

import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export default function Progress({
  value,
  max = 100,
  className,
  showLabel = false,
  size = 'md',
  color = 'blue',
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn('w-full bg-gray-700 rounded-full overflow-hidden', {
          'h-1.5': size === 'sm',
          'h-2.5': size === 'md',
          'h-4': size === 'lg',
        })}
      >
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', {
            'bg-gradient-to-r from-blue-500 to-blue-400': color === 'blue',
            'bg-gradient-to-r from-green-500 to-green-400': color === 'green',
            'bg-gradient-to-r from-yellow-500 to-yellow-400': color === 'yellow',
            'bg-gradient-to-r from-red-500 to-red-400': color === 'red',
            'bg-gradient-to-r from-purple-500 to-purple-400': color === 'purple',
          })}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm text-gray-400 mt-1">{Math.round(percentage)}%</span>
      )}
    </div>
  );
}
