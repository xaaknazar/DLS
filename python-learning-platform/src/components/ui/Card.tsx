'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'hover' | 'interactive';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50',
          {
            'hover:border-gray-600/50 hover:bg-gray-800/70 transition-all duration-300':
              variant === 'hover',
            'hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer transition-all duration-300':
              variant === 'interactive',
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
