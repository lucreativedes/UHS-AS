
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'green' | 'blue' | 'purple' | 'red' | 'none';
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', glowColor = 'none' }) => {
  const glowClasses = {
    green: 'border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]',
    blue: 'border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
    purple: 'border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]',
    red: 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
    none: 'border-white/10'
  };

  return (
    <div className={`glass rounded-3xl p-6 ${glowClasses[glowColor]} ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
