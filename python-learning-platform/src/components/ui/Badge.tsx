'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          {
            // Variants
            'bg-gray-700 text-gray-300': variant === 'default',
            'bg-green-500/10 text-green-400': variant === 'success',
            'bg-yellow-500/10 text-yellow-400': variant === 'warning',
            'bg-red-500/10 text-red-400': variant === 'danger',
            'bg-blue-500/10 text-blue-400': variant === 'info',
            // Sizes
            'text-xs px-2 py-0.5': size === 'sm',
            'text-sm px-2.5 py-1': size === 'md',
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
