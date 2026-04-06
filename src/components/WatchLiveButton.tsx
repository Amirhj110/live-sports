'use client';

import { useState } from 'react';
import { Match } from '@/types/match';
import { motion } from 'framer-motion';
import { Play, ExternalLink, Tv, Radio } from 'lucide-react';

interface WatchLiveButtonProps {
  match: Match;
}

export function WatchLiveButton({ match }: WatchLiveButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleWatchLive = async () => {
    setIsLoading(true);
    
    // If match has a stream URL, use it directly
    if (match.streamUrl && match.streamUrl !== '') {
      window.open(match.streamUrl, '_blank');
      setIsLoading(false);
      return;
    }

    // Otherwise, try to find official streaming link based on league
    const league = match.league.toLowerCase();
    let streamUrl = '';

    // Cricket streams
    if (match.sport === 'cricket') {
      if (league.includes('psl') || league.includes('pakistan')) {
        streamUrl = 'https://www.youtube.com/@PakistanSuperLeagueOfficial';
      } else if (league.includes('ipl')) {
        streamUrl = 'https://www.youtube.com/@IPL';
      } else if (league.includes('bbl') || league.includes('big bash')) {
        streamUrl = 'https://www.youtube.com/@BBL';
      } else if (league.includes('icc') || league.includes('world cup')) {
        streamUrl = 'https://www.youtube.com/@ICC';
      } else {
        // Default to searching on YouTube
        streamUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(match.homeTeam.name + ' vs ' + match.awayTeam.name + ' live')}`;
      }
    }
    // Football streams
    else if (match.sport === 'football') {
      if (league.includes('premier league')) {
        streamUrl = 'https://www.youtube.com/@premierleague';
      } else if (league.includes('la liga')) {
        streamUrl = 'https://www.youtube.com/@LaLiga';
      } else if (league.includes('serie a')) {
        streamUrl = 'https://www.youtube.com/@SerieA';
      } else if (league.includes('bundesliga')) {
        streamUrl = 'https://www.youtube.com/@Bundesliga';
      } else if (league.includes('champions league')) {
        streamUrl = 'https://www.youtube.com/@UEFA';
      } else {
        // Default to searching on YouTube
        streamUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(match.homeTeam.name + ' vs ' + match.awayTeam.name + ' live')}`;
      }
    }
    // Basketball streams
    else if (match.sport === 'basketball') {
      if (league.includes('nba')) {
        streamUrl = 'https://www.youtube.com/@NBA';
      } else {
        streamUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(match.homeTeam.name + ' vs ' + match.awayTeam.name + ' live')}`;
      }
    }

    if (streamUrl) {
      window.open(streamUrl, '_blank');
    }
    
    setIsLoading(false);
  };

  const hasStream = match.streamUrl && match.streamUrl !== '';
  const isLive = match.status === 'live';

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <button
        onClick={handleWatchLive}
        disabled={isLoading || !isLive}
        className={`
          w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold text-white
          transition-all duration-300
          ${isLive 
            ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-500/25' 
            : 'bg-white/10 cursor-not-allowed opacity-50'
          }
          ${isLoading ? 'cursor-wait' : ''}
        `}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Finding Stream...</span>
          </>
        ) : (
          <>
            {isLive ? (
              <>
                <Radio className="w-5 h-5 animate-pulse" />
                <span>Watch Live</span>
                <ExternalLink className="w-4 h-4 opacity-70" />
              </>
            ) : (
              <>
                <Tv className="w-5 h-5" />
                <span>Stream Unavailable</span>
              </>
            )}
          </>
        )}
      </button>

      {/* Status indicator */}
      {isLive && (
        <div className="absolute -top-2 -right-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </div>
      )}

      {/* Info text */}
      <p className="text-center text-sm text-gray-400 mt-3">
        {hasStream 
          ? 'Official stream available'
          : isLive 
            ? 'Opens official broadcast channel'
            : 'Stream available at match time'
        }
      </p>
    </motion.div>
  );
}
