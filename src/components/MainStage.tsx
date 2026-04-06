'use client';

import { Match } from '@/types/match';
import { SportIcon } from './SportIcon';
import { motion } from 'framer-motion';
import { Radio, Play, ExternalLink } from 'lucide-react';

interface MainStageProps {
  liveMatch: Match | null;
  featuredMatch: Match | null;
  onWatchLive: (match: Match) => void;
}

export function MainStage({ liveMatch, featuredMatch, onWatchLive }: MainStageProps) {
  // Priority 1: Show live match feature card
  if (liveMatch) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/20 via-red-900/10 to-black border border-red-500/30"
      >
        {/* Background pulse effect */}
        <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
        
        <div className="relative p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-lg font-bold text-red-400 uppercase tracking-wider">Live Now</span>
            </div>
            <span className="text-sm text-gray-400">{liveMatch.league}</span>
          </div>

          {/* Score Board */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            {/* Home Team */}
            <div className="flex flex-col items-center flex-1">
              <SportIcon 
                sport={liveMatch.sport} 
                size={64} 
                teamLogo={liveMatch.homeTeam.flag}
                className="mb-3"
              />
              <h3 className="text-xl font-bold text-white text-center">{liveMatch.homeTeam.name}</h3>
              <p className="text-4xl font-bold text-white mt-2">{liveMatch.homeTeam.score}</p>
              {liveMatch.sport === 'cricket' && (
                <p className="text-sm text-gray-400">{liveMatch.homeTeam.wickets} wickets • {liveMatch.homeTeam.overs} overs</p>
              )}
            </div>

            {/* VS / Time */}
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold text-gray-500">VS</span>
              <div className="mt-2 text-xs text-red-400 text-center">{liveMatch.statusDetail || liveMatch.currentTime || 'Live'}</div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center flex-1">
              <SportIcon 
                sport={liveMatch.sport} 
                size={64} 
                teamLogo={liveMatch.awayTeam.flag}
                className="mb-3"
              />
              <h3 className="text-xl font-bold text-white text-center">{liveMatch.awayTeam.name}</h3>
              <p className="text-4xl font-bold text-white mt-2">{liveMatch.awayTeam.score}</p>
              {liveMatch.sport === 'cricket' && (
                <p className="text-sm text-gray-400">{liveMatch.awayTeam.wickets} wickets • {liveMatch.awayTeam.overs} overs</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onWatchLive(liveMatch)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all"
            >
              <Radio className="w-5 h-5" />
              Watch Live
            </button>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(liveMatch.homeTeam.name + ' vs ' + liveMatch.awayTeam.name + ' live')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all"
            >
              <ExternalLink className="w-5 h-5" />
              YouTube Search
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  // Priority 2: Show video highlights for featured match
  if (featuredMatch) {
    const searchQuery = `${featuredMatch.homeTeam.name} vs ${featuredMatch.awayTeam.name} highlights`;
    const youtubeEmbedUrl = `https://www.youtube.com/embed?autoplay=0&search=${encodeURIComponent(searchQuery)}`;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 overflow-hidden"
      >
        <div className="p-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Match Highlights</h3>
          <p className="text-sm text-gray-400">
            {featuredMatch.homeTeam.name} vs {featuredMatch.awayTeam.name} • {featuredMatch.league}
          </p>
        </div>
        
        <div className="aspect-video bg-black">
          <iframe
            src={youtubeEmbedUrl}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Match Highlights"
          />
        </div>

        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <SportIcon sport={featuredMatch.sport} size={32} teamLogo={featuredMatch.homeTeam.flag} />
              <span className="font-semibold text-white">{featuredMatch.homeTeam.score}</span>
            </div>
            <span className="text-gray-500">-</span>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{featuredMatch.awayTeam.score}</span>
              <SportIcon sport={featuredMatch.sport} size={32} teamLogo={featuredMatch.awayTeam.flag} />
            </div>
          </div>
          
          <a
            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-lg transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            More Highlights
          </a>
        </div>
      </motion.div>
    );
  }

  // Empty state
  return (
    <div className="rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 p-8 text-center">
      <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Play className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No Live Matches</h3>
      <p className="text-gray-400">Check back later for live coverage or browse upcoming matches below.</p>
    </div>
  );
}
