'use client';

import { Match } from '@/types/match';
import { SportIcon } from './SportIcon';
import { motion } from 'framer-motion';
import { Radio, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface TopBarProps {
  liveMatches: Match[];
  upcomingMatches: Match[];
  finishedMatches: Match[];
  onSelectMatch: (match: Match) => void;
  selectedMatchId?: string;
}

export function TopBar({ liveMatches, upcomingMatches, finishedMatches, onSelectMatch, selectedMatchId }: TopBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const formatTimeAgo = (date: string) => {
    const matchDate = new Date(date);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - matchDate.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  const formatTimeUntil = (date: string) => {
    const matchDate = new Date(date);
    const now = new Date();
    const diffHours = Math.floor((matchDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Starting soon';
    if (diffHours < 24) return `in ${diffHours}h`;
    return `in ${Math.floor(diffHours / 24)}d`;
  };

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 backdrop-blur-sm p-2 rounded-full border border-white/10 hover:bg-black transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 backdrop-blur-sm p-2 rounded-full border border-white/10 hover:bg-black transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>

      {/* Scroll Container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide px-10 py-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Yesterday's Results */}
        {finishedMatches.slice(0, 5).map((match) => (
          <motion.button
            key={match.id}
            onClick={() => onSelectMatch(match)}
            className={`flex-shrink-0 w-64 bg-gradient-to-br from-white/10 to-white/5 rounded-xl p-3 border transition-all ${
              selectedMatchId === match.id ? 'border-blue-500/50' : 'border-white/10'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">{formatTimeAgo(match.date)}</span>
              <span className="text-xs bg-gray-500/20 px-2 py-0.5 rounded">{match.league}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SportIcon sport={match.sport} size={24} teamLogo={match.homeTeam.flag} />
                <span className="text-sm font-medium text-white">{match.homeTeam.shortName}</span>
              </div>
              <span className="text-lg font-bold text-white">{match.homeTeam.score}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <SportIcon sport={match.sport} size={24} teamLogo={match.awayTeam.flag} />
                <span className="text-sm font-medium text-white">{match.awayTeam.shortName}</span>
              </div>
              <span className="text-lg font-bold text-white">{match.awayTeam.score}</span>
            </div>
          </motion.button>
        ))}

        {/* Live Matches with Pulsing Dot */}
        {liveMatches.map((match) => (
          <motion.button
            key={match.id}
            onClick={() => onSelectMatch(match)}
            className={`flex-shrink-0 w-64 bg-gradient-to-br from-red-500/20 to-red-900/10 rounded-xl p-3 border transition-all ${
              selectedMatchId === match.id ? 'border-red-500/50' : 'border-red-500/30'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-xs font-bold text-red-400 uppercase">LIVE</span>
              </div>
              <span className="text-xs bg-red-500/20 px-2 py-0.5 rounded text-red-300">{match.league}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SportIcon sport={match.sport} size={24} teamLogo={match.homeTeam.flag} />
                <span className="text-sm font-medium text-white">{match.homeTeam.shortName}</span>
              </div>
              <span className="text-lg font-bold text-white">{match.homeTeam.score}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <SportIcon sport={match.sport} size={24} teamLogo={match.awayTeam.flag} />
                <span className="text-sm font-medium text-white">{match.awayTeam.shortName}</span>
              </div>
              <span className="text-lg font-bold text-white">{match.awayTeam.score}</span>
            </div>
            <div className="mt-2 text-xs text-red-400 text-center">{match.statusDetail || match.currentTime}</div>
          </motion.button>
        ))}

        {/* Today's Upcoming */}
        {upcomingMatches.slice(0, 5).map((match) => (
          <motion.button
            key={match.id}
            onClick={() => onSelectMatch(match)}
            className={`flex-shrink-0 w-64 bg-gradient-to-br from-blue-500/10 to-blue-900/5 rounded-xl p-3 border transition-all ${
              selectedMatchId === match.id ? 'border-blue-500/50' : 'border-white/10'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-blue-400">
                <Clock className="w-3 h-3" />
                <span className="text-xs">{formatTimeUntil(match.date)}</span>
              </div>
              <span className="text-xs bg-blue-500/20 px-2 py-0.5 rounded text-blue-300">{match.league}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SportIcon sport={match.sport} size={24} teamLogo={match.homeTeam.flag} />
                <span className="text-sm font-medium text-white">{match.homeTeam.shortName}</span>
              </div>
              <span className="text-xs text-gray-500">{match.time}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <SportIcon sport={match.sport} size={24} teamLogo={match.awayTeam.flag} />
                <span className="text-sm font-medium text-white">{match.awayTeam.shortName}</span>
              </div>
              <span className="text-xs text-gray-500">{match.venue}</span>
            </div>
          </motion.button>
        ))}

        {/* Empty State */}
        {liveMatches.length === 0 && upcomingMatches.length === 0 && finishedMatches.length === 0 && (
          <div className="flex-shrink-0 w-64 bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <p className="text-sm text-gray-400">No matches available</p>
          </div>
        )}
      </div>
    </div>
  );
}
