'use client';

import { Match } from '@/types/match';
import { MatchCard } from './MatchCard';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

interface LiveMatchCarouselProps {
  matches: Match[];
  activeMatchId: string | null;
  onSelectMatch: (matchId: string) => void;
}

export function LiveMatchCarousel({ matches, activeMatchId, onSelectMatch }: LiveMatchCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-white">Live Matches</h2>
          <span className="px-2.5 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full">
            {matches.filter(m => m.status === 'live').length} Live
          </span>
        </div>
        
        {/* Navigation Arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        <motion.div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              isActive={activeMatchId === match.id}
              onClick={() => onSelectMatch(match.id)}
            />
          ))}
        </motion.div>
        
        {/* Gradient Fades */}
        <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-[#0a0a0a] to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-[#0a0a0a] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}
