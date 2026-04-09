'use client';

import { Match } from '@/types/match';
import { motion } from 'framer-motion';
import { Activity, Circle, Clock, Goal, Trophy } from 'lucide-react';
import Image from 'next/image';

interface MatchCardProps {
  match: Match;
  isActive: boolean;
  onClick: () => void;
}

// Sport icons using Lucide React
const SportIcon = ({ sport }: { sport: string }) => {
  switch (sport) {
    case 'football':
      return <Goal className="w-4 h-4 text-green-400" />;
    case 'cricket':
      return <Trophy className="w-4 h-4 text-yellow-400" />;
    case 'tennis':
      return <span className="text-yellow-400">🎾</span>;
    case 'basketball':
      return <span className="text-orange-400">🏀</span>;
    case 'volleyball':
      return <span className="text-cyan-400">🏐</span>;
    default:
      return <Activity className="w-4 h-4 text-blue-400" />;
  }
};

export function MatchCard({ match, isActive, onClick }: MatchCardProps) {
  const isLive = match.status === 'live';
  
  return (
    <motion.button
      onClick={onClick}
      className={`
        relative flex-shrink-0 w-64 p-4 rounded-xl border transition-all duration-300
        ${isActive 
          ? 'bg-white/15 border-white/40 shadow-lg shadow-white/10' 
          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
        }
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layoutId={`match-${match.id}`}
    >
      {/* Live Indicator */}
      {isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
          <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Live</span>
        </div>
      )}

      {/* Sport Icon & League */}
      <div className="flex items-center gap-2 mb-3">
        <SportIcon sport={match.sport} />
        <span className="text-xs text-gray-400 font-medium truncate">{match.league}</span>
      </div>

      {/* Teams & Scores - Unified for all sports */}
      <div className="space-y-2">
        {/* Home Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {match.homeTeam.logo ? (
              <div className="w-6 h-6 relative rounded-full overflow-hidden bg-white/10">
                <Image
                  src={match.homeTeam.logo}
                  alt={match.homeTeam.shortName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: match.homeTeam.color }}
              >
                {match.homeTeam.shortName[0]}
              </div>
            )}
            <span className="text-sm font-medium text-white truncate max-w-[100px]">
              {match.homeTeam.shortName}
            </span>
          </div>
          <span className="text-lg font-bold text-white">
            {match.sport === 'cricket' && match.homeTeam.wickets !== undefined
              ? `${match.homeTeam.score}/${match.homeTeam.wickets}`
              : match.homeTeam.score}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {match.awayTeam.logo ? (
              <div className="w-6 h-6 relative rounded-full overflow-hidden bg-white/10">
                <Image
                  src={match.awayTeam.logo}
                  alt={match.awayTeam.shortName}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ backgroundColor: match.awayTeam.color }}
              >
                {match.awayTeam.shortName[0]}
              </div>
            )}
            <span className="text-sm font-medium text-white truncate max-w-[100px]">
              {match.awayTeam.shortName}
            </span>
          </div>
          <span className="text-lg font-bold text-white">
            {match.sport === 'cricket' && match.awayTeam.wickets !== undefined
              ? `${match.awayTeam.score}/${match.awayTeam.wickets}`
              : match.awayTeam.score}
          </span>
        </div>
      </div>

      {/* Time/Venue */}
      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-1">
          {isLive ? (
            <>
              <Activity className="w-3 h-3 text-red-400" />
              <span className="text-red-400 font-medium">{match.currentTime}</span>
            </>
          ) : match.status === 'upcoming' ? (
            <>
              <Clock className="w-3 h-3" />
              <span>Today, 16:30</span>
            </>
          ) : (
            <>
              <Circle className="w-3 h-3" />
              <span>Finished</span>
            </>
          )}
        </div>
        <span className="truncate max-w-[100px]">{match.venue}</span>
      </div>
    </motion.button>
  );
}
