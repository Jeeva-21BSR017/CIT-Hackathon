import React from 'react';
import { cn } from '@/lib/utils';

const GradientButton = ({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative px-6 py-2.5 font-medium text-white rounded-lg overflow-hidden group",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500 before:to-indigo-600 before:transition-all before:duration-500",
        "hover:before:from-indigo-500 hover:before:to-blue-600",
        "active:scale-[0.98] active:shadow-inner active:before:opacity-90",
        "focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2",
        "disabled:opacity-70 disabled:cursor-not-allowed disabled:before:from-gray-400 disabled:before:to-gray-500 disabled:before:opacity-70 disabled:shadow-none disabled:transform-none",
        "transition-all duration-200 shadow-md hover:shadow-lg",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  );
};

export default GradientButton;
