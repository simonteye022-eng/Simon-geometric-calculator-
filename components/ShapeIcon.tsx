
import React from 'react';

interface ShapeIconProps {
  iconClass: string;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

const ShapeIcon: React.FC<ShapeIconProps> = ({ iconClass, size = 'md', active = false }) => {
  const sizeMap = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };

  return (
    <div className={`flex items-center justify-center transition-all duration-300 ${active ? 'text-blue-400' : 'text-slate-400'}`}>
      <i className={`fa-solid ${iconClass} ${sizeMap[size]}`}></i>
    </div>
  );
};

export default ShapeIcon;
