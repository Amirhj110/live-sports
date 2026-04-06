'use client';

import { useState } from 'react';
import { Match } from '@/types/match';
import { motion } from 'framer-motion';
import { Play, Tv, Radio } from 'lucide-react';

interface VideoPlayerProps {
  match: Match;
}

export function VideoPlayer({ match }: VideoPlayerProps) {
  const [showPlayer, setShowPlayer] = useState(false);

  const hasStream = match.streamType !== 'none' && match.streamUrl;

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const matchResult = url.match(regExp);
    return matchResult && matchResult[2].length === 11 ? matchResult[2] : null;
  };

  const videoId = match.streamUrl ? getYouTubeId(match.streamUrl) : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1` : null;

  return (
    <motion.div 
      className="relative w-full aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Placeholder / Stream */}
      {!showPlayer || !hasStream ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
          {hasStream ? (
            <>
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
                <button
                  onClick={() => setShowPlayer(true)}
                  className="relative w-20 h-20 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center border border-white/20 transition-all hover:scale-110"
                >
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </button>
              </div>
              <p className="mt-4 text-white font-semibold">Live Stream Available</p>
              <p className="text-sm text-gray-400">Click to start watching</p>
              <div className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-red-500/20 rounded-full">
                <Radio className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-400 font-medium uppercase tracking-wider">Live</span>
              </div>
            </>
          ) : (
            <>
              <Tv className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-white font-semibold">No Live Stream</p>
              <p className="text-sm text-gray-400">Stream will be available at kickoff</p>
            </>
          )}
        </div>
      ) : (
        <>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              <Tv className="w-16 h-16 text-gray-600 mb-4" />
              <p className="text-white font-semibold">Stream Format Not Supported</p>
              <p className="text-sm text-gray-400">This stream type requires a native player</p>
              {match.streamUrl && (
                <button
                  onClick={() => window.open(match.streamUrl, '_blank')}
                  className="mt-4 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
                >
                  Open in New Tab
                </button>
              )}
            </div>
          )}

          {/* Live Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-red-500 rounded-lg z-10">
            <Radio className="w-4 h-4 text-white" />
            <span className="text-xs text-white font-bold uppercase tracking-wider">Live</span>
          </div>
        </>
      )}
    </motion.div>
  );
}
