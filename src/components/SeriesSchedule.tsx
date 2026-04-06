'use client';

import { Match } from '@/types/match';
import { SportIcon } from './SportIcon';
import { motion } from 'framer-motion';
import { Calendar, Trophy, Clock, ChevronRight } from 'lucide-react';

interface SeriesScheduleProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
}

export function SeriesSchedule({ matches, onSelectMatch }: SeriesScheduleProps) {
  // Filter matches for IPL and PSL
  const iplMatches = matches.filter(m => 
    m.league.toLowerCase().includes('ipl') || 
    m.league.toLowerCase().includes('indian premier league')
  ).slice(0, 3);
  
  const pslMatches = matches.filter(m => 
    m.league.toLowerCase().includes('psl') || 
    m.league.toLowerCase().includes('pakistan super league')
  ).slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const SeriesCard = ({ 
    title, 
    matches, 
    color, 
    icon: Icon 
  }: { 
    title: string; 
    matches: Match[]; 
    color: string;
    icon: any;
  }) => {
    if (matches.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className={`p-4 bg-gradient-to-r ${color} border-b border-white/10`}>
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-white" />
            <h3 className="font-bold text-white">{title}</h3>
            <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded text-white">
              Next {matches.length} Fixtures
            </span>
          </div>
        </div>

        {/* Fixtures List */}
        <div className="divide-y divide-white/10">
          {matches.map((match, index) => (
            <button
              key={match.id}
              onClick={() => onSelectMatch(match)}
              className="w-full p-4 hover:bg-white/5 transition-colors text-left group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  {formatDate(match.date)}
                  <span className="mx-1">•</span>
                  <Clock className="w-3 h-3" />
                  {match.time}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2 flex-1">
                    <SportIcon sport={match.sport} size={28} teamLogo={match.homeTeam.flag} />
                    <span className="text-sm font-medium text-white truncate">
                      {match.homeTeam.shortName}
                    </span>
                  </div>
                  
                  <span className="text-xs text-gray-500 font-medium">VS</span>
                  
                  <div className="flex items-center gap-2 flex-1 justify-end">
                    <span className="text-sm font-medium text-white truncate">
                      {match.awayTeam.shortName}
                    </span>
                    <SportIcon sport={match.sport} size={28} teamLogo={match.awayTeam.flag} />
                  </div>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500">
                {match.venue}
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-5 h-5 text-amber-400" />
        <h2 className="text-xl font-bold text-white">Series Schedules</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SeriesCard
          title="IPL 2026"
          matches={iplMatches}
          color="from-blue-500/80 to-blue-600/80"
          icon={Trophy}
        />
        
        <SeriesCard
          title="PSL 2026"
          matches={pslMatches}
          color="from-green-500/80 to-green-600/80"
          icon={Trophy}
        />
      </div>

      {iplMatches.length === 0 && pslMatches.length === 0 && (
        <div className="text-center py-8 text-gray-400 bg-white/5 rounded-xl border border-white/10">
          <Trophy className="w-12 h-12 mx-auto mb-3 text-gray-600" />
          <p>No IPL or PSL fixtures scheduled</p>
        </div>
      )}
    </div>
  );
}
