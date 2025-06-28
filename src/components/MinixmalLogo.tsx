import React from 'react';
import { Circle, Square } from 'lucide-react';

interface MinixmalLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
  onClick?: () => void;
  className?: string;
}

const MinixmalLogo: React.FC<MinixmalLogoProps> = ({ 
  size = 'medium', 
  showText = true, 
  onClick,
  className = ''
}) => {
  const sizeClasses = {
    small: {
      container: 'w-8 h-8',
      text: 'text-lg',
      spacing: 'space-x-2'
    },
    medium: {
      container: 'w-10 h-10',
      text: 'text-xl',
      spacing: 'space-x-3'
    },
    large: {
      container: 'w-12 h-12',
      text: 'text-2xl',
      spacing: 'space-x-4'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div 
      className={`flex items-center ${classes.spacing} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Logo Icon */}
      <div className={`${classes.container} relative flex items-center justify-center`}>
        {/* Outer circle - represents wholeness and simplicity */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
          {/* Inner negative space - represents minimalism */}
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            {/* Central dot - represents essence/core */}
            <div className="w-2 h-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* App Name */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${classes.text} font-bold text-white leading-none tracking-tight`}>
            Minixmal
          </h1>
          <span className="text-xs text-white/80 font-medium tracking-wide">
            SIMPLIFY LIFE
          </span>
        </div>
      )}
    </div>
  );
};

export default MinixmalLogo;