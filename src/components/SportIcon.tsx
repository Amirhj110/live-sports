'use client';

import { Target, Trophy, CircleDot } from 'lucide-react';

interface SportIconProps {
  sport: string;
  size?: number;
  className?: string;
  teamLogo?: string | null;
}

export function SportIcon({ sport, size = 32, className = '', teamLogo }: SportIconProps) {
  // If team logo is available, use it
  if (teamLogo) {
    return (
      <img
        src={teamLogo}
        alt="Team Logo"
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
        onError={(e) => {
          // On error, fall back to sport icon
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  // Default sport icons
  switch (sport.toLowerCase()) {
    case 'football':
    case 'soccer':
      return (
        <div
          className={`bg-green-500/20 rounded-full flex items-center justify-center ${className}`}
          style={{ width: size, height: size }}
        >
          <Target className="text-green-400" style={{ width: size * 0.6, height: size * 0.6 }} />
        </div>
      );
    case 'cricket':
      return (
        <div
          className={`bg-amber-500/20 rounded-full flex items-center justify-center ${className}`}
          style={{ width: size, height: size }}
        >
          <Trophy className="text-amber-400" style={{ width: size * 0.6, height: size * 0.6 }} />
        </div>
      );
    case 'basketball':
      return (
        <div
          className={`bg-orange-500/20 rounded-full flex items-center justify-center ${className}`}
          style={{ width: size, height: size }}
        >
          <CircleDot className="text-orange-400" style={{ width: size * 0.6, height: size * 0.6 }} />
        </div>
      );
    default:
      return (
        <div
          className={`bg-blue-500/20 rounded-full flex items-center justify-center ${className}`}
          style={{ width: size, height: size }}
        >
          <Trophy className="text-blue-400" style={{ width: size * 0.6, height: size * 0.6 }} />
        </div>
      );
  }
}
