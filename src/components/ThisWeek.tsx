'use client';

import { Match, NewsArticle } from '@/types/match';
import { SportIcon } from './SportIcon';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ChevronRight, Newspaper, Trophy } from 'lucide-react';

interface ThisWeekProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  news?: NewsArticle[];
}

export function ThisWeek({ matches, onSelectMatch, news }: ThisWeekProps) {
  // Filter matches for this week (next 7 days)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const thisWeekMatches = matches.filter((match) => {
    const matchDate = new Date(match.date);
    return matchDate >= today && matchDate <= nextWeek;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-400" />
          <h2 className="text-xl font-bold text-white">Upcoming Matches</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">🏏 Cricket</span>
          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">⚽ Football</span>
          <span className="text-sm text-gray-400 ml-2">{thisWeekMatches.length} matches</span>
        </div>
      </div>

      {thisWeekMatches.length === 0 ? (
        news && news.length > 0 ? (
          // Show news as fallback when no matches
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-400 mb-4">
              <Newspaper className="w-4 h-4" />
              <span className="text-sm">No matches scheduled. Here are the latest sports updates:</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.slice(0, 4).map((article, index) => (
                <motion.a
                  key={`news-fallback-${article.id}-${index}`}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-white/10 to-white/5 rounded-xl border border-white/10 hover:border-white/30 p-4 transition-all group"
                >
                  <h3 className="text-sm font-semibold text-white line-clamp-2 mb-2 group-hover:text-blue-400">
                    {article.title}
                  </h3>
                  {article.description && (
                    <p className="text-xs text-gray-400 line-clamp-2 mb-3">{article.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{article.source}</span>
                    <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 bg-white/5 rounded-xl border border-white/10">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-600" />
            <p>No matches scheduled this week</p>
            <p className="text-xs text-gray-500 mt-2">Check back later for upcoming fixtures</p>
          </div>
        )
      ) : (
        <div className="space-y-3">
          {thisWeekMatches.map((match, index) => {
            const styles = getSportStyles(match.sport);
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

                {/* League Badge - Top Right */}
                <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs ${styles.tag}`}>
                  <Trophy className="w-3 h-3 inline mr-1" />
                  {match.league}
                </div>

                {/* Date */}
                <div className="flex-shrink-0 w-20 text-center mt-8">
                  <div className="text-sm font-semibold text-white">{formatDate(match.date)}</div>
                  <div className="text-xs text-gray-400 flex items-center justify-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {match.time}
                  </div>
                </div>

                {/* Teams */}
                <div className="flex-1 flex items-center justify-between pr-2 mt-8">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <SportIcon sport={match.sport} size={40} teamLogo={match.homeTeam.flag} />
                      {/* Sport indicator on logo */}
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs ${styles.tag}`}>
                        {styles.icon}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{match.homeTeam.name}</div>
                      <div className="text-xs text-gray-400">vs {match.awayTeam.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
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
