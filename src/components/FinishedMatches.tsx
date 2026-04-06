'use client';

import { Match } from '@/types/match';
import { SportIcon } from './SportIcon';
import { motion } from 'framer-motion';
import { CheckCircle, Trophy, ChevronRight, MapPin, Calendar } from 'lucide-react';

interface FinishedMatchesProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
}

export function FinishedMatches({ matches, onSelectMatch }: FinishedMatchesProps) {
  // Sort by date (most recent first)
  const sortedMatches = [...matches].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Get sport-specific styling
  const getSportStyles = (sport: string) => {
    switch (sport) {
      case 'cricket':
        return {
          border: 'border-green-500/30 hover:border-green-500/60',
          bg: 'from-green-600/10 to-transparent',
          tag: 'bg-green-500/20 text-green-400',
          badge: 'bg-green-500/30 text-green-300 border-green-500/50',
          icon: '🏏'
        };
      case 'football':
        return {
          border: 'border-blue-500/30 hover:border-blue-500/60',
          bg: 'from-blue-600/10 to-transparent',
          tag: 'bg-blue-500/20 text-blue-400',
          badge: 'bg-blue-500/30 text-blue-300 border-blue-500/50',
          icon: '⚽'
        };
      default:
        return {
          border: 'border-white/10 hover:border-white/30',
          bg: 'from-white/10 to-white/5',
          tag: 'bg-white/10 text-gray-400',
          badge: 'bg-white/20 text-gray-300 border-white/30',
          icon: '🏆'
        };
    }
  };

  // Get winner
  const getWinner = (match: Match) => {
    const homeScore = parseInt(match.homeTeam.score || '0');
    const awayScore = parseInt(match.awayTeam.score || '0');
    if (homeScore > awayScore) return match.homeTeam.name;
    if (awayScore > homeScore) return match.awayTeam.name;
    return 'Draw';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-bold text-white">Recently Finished</h2>
        </div>
        <span className="text-sm text-gray-400">{sortedMatches.length} matches</span>
      </div>

      {sortedMatches.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-white/5 rounded-xl border border-white/10">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p>No recently finished matches</p>
          <p className="text-xs text-gray-500 mt-2">Check back later for completed games</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedMatches.map((match, index) => {
            const styles = getSportStyles(match.sport);
            const winner = getWinner(match);
            const isDraw = winner === 'Draw';
            
            return (
              <motion.button
                key={match.id}
                onClick={() => onSelectMatch(match)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`w-full flex items-center gap-4 p-4 bg-gradient-to-r ${styles.bg} rounded-xl border ${styles.border} transition-all text-left group relative overflow-hidden`}
              >
                {/* Sport Badge - Top Left */}
                <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles.badge} border`}>
                  <span className="text-sm">{styles.icon}</span>
                  <span>{match.sport === 'cricket' ? 'Cricket' : match.sport === 'football' ? 'Football' : match.sport}</span>
                </div>

                {/* Status Badge - Top Right */}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs bg-green-500/20 text-green-400 flex items-center gap-1`}>
                  <CheckCircle className="w-3 h-3" />
                  FT
                </div>

                {/* Date */}
                <div className="flex-shrink-0 w-20 text-center mt-8">
                  <div className="text-sm font-semibold text-white">{formatDate(match.date)}</div>
                  <div className="text-xs text-gray-400 mt-1">{match.time}</div>
                </div>

                {/* Teams & Score */}
                <div className="flex-1 flex items-center justify-between pr-2 mt-8">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative">
                      <SportIcon sport={match.sport} size={40} teamLogo={match.homeTeam.flag} />
                      {/* Sport indicator on logo */}
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${styles.tag}`}>
                        {styles.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-white flex items-center gap-2">
                        {match.homeTeam.name}
                        {winner === match.homeTeam.name && (
                          <Trophy className="w-3 h-3 text-amber-400" />
                        )}
                      </div>
                      <div className="text-xs text-gray-400">vs {match.awayTeam.name}</div>
                      {!isDraw && winner !== 'Draw' && (
                        <div className="text-xs text-amber-400 mt-1">
                          {winner} won
                        </div>
                      )}
                      {isDraw && (
                        <div className="text-xs text-gray-400 mt-1">Match drawn</div>
                      )}
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-lg font-bold text-white">
                        <span>{match.homeTeam.score || '-'}</span>
                        <span className="text-gray-500">-</span>
                        <span>{match.awayTeam.score || '-'}</span>
                      </div>
                      <div className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                        <MapPin className="w-3 h-3" />
                        {match.venue}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
