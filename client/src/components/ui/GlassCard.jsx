
import React from 'react';
import { cn } from '../../lib/utils';

const GlassCard = ({
  className,
  children,
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'relative rounded-2xl overflow-hidden backdrop-blur-md border border-white/20 p-6 shadow-lg transition-all duration-300',
        'bg-white/80 dark:bg-slate-900/80',
        hoverEffect && 'hover:shadow-xl hover:scale-[1.02] hover:bg-white/90 dark:hover:bg-slate-900/90',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
