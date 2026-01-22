
import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label: string;
  colorClass: string;
  glowClass: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, label, colorClass, glowClass }) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs font-orbitron uppercase tracking-widest opacity-70">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
        <div 
          className={`h-full ${colorClass} ${glowClass} transition-all duration-1000 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
