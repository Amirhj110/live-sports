'use client';

import { Match } from '@/types/match';
import { motion } from 'framer-motion';
import { Activity, Clock, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ScoreDisplayProps {
  match: Match;
}

export function ScoreDisplay({ match }: ScoreDisplayProps) {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Update timestamp when match data changes
  useEffect(() => {
    setLastUpdate(new Date());
  }, [match.homeTeam.score, match.awayTeam.score, match.status]);

  const isLive = match.status === 'live';

  return (
    <motion.div 
      className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-6 border border-white/20 backdrop-blur-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {isLive ? (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Live</span>
            </div>
          ) : (
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {match.status === 'upcoming' ? 'Upcoming' : 'Finished'}
            </span>
          )}
          <span className="text-sm text-gray-400">{match.league}</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Activity className="w-3 h-3" />
          <span>Updated: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Score Board */}
      <div className="flex items-center justify-center gap-8 mb-6">
        {/* Home Team */}
        <div className="flex flex-col items-center">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-3 shadow-lg"
            style={{ backgroundColor: match.homeTeam.color }}
          >
            {match.homeTeam.shortName[0]}
          </div>
          <span className="text-sm font-medium text-white text-center max-w-[120px]">
            {match.homeTeam.name}
          </span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center px-6">
          <div className="flex items-center gap-3 text-4xl md:text-5xl font-bold text-white">
            <motion.span 
              key={match.homeTeam.score}
              initial={{ scale: 1.2, color: '#4ade80' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: 0.5 }}
            >
              {match.homeTeam.score}
            </motion.span>
            <span className="text-gray-500">-</span>
            <motion.span 
              key={match.awayTeam.score}
              initial={{ scale: 1.2, color: '#4ade80' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: 0.5 }}
            >
              {match.awayTeam.score}
            </motion.span>
          </div>
          
          {isLive && (
            <div className="flex items-center gap-1 mt-2 text-red-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">{match.currentTime}</span>
            </div>
          )}
        </div>

        {/* Away Team */}
        <div className="flex flex-col items-center">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white mb-3 shadow-lg"
            style={{ backgroundColor: match.awayTeam.color }}
          >
            {match.awayTeam.shortName[0]}
          </div>
          <span className="text-sm font-medium text-white text-center max-w-[120px]">
            {match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Venue */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-400 border-t border-white/10 pt-4">
        <MapPin className="w-4 h-4" />
        <span>{match.venue}</span>
      </div>
    </motion.div>
  );
}
