'use client';

import { Team } from '@/types/match';
import { motion } from 'framer-motion';
import { Users, Shield, CircleDot } from 'lucide-react';

interface TeamLineupsProps {
  homeTeam: Team;
  awayTeam: Team;
}

export function TeamLineups({ homeTeam, awayTeam }: TeamLineupsProps) {
  const homePlaying = homeTeam.players?.filter(p => p.isPlaying) || [];
  const homeBench = homeTeam.players?.filter(p => !p.isPlaying) || [];
  const awayPlaying = awayTeam.players?.filter(p => p.isPlaying) || [];
  const awayBench = awayTeam.players?.filter(p => !p.isPlaying) || [];

  // If no player data available, show team info only
  const hasLineupData = homeTeam.players || awayTeam.players;

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
        <Users className="w-4 h-4" />
        Team Lineups
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Home Team */}
        <motion.div 
          className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div 
            className="px-4 py-3 flex items-center gap-3"
            style={{ backgroundColor: `${homeTeam.color}20` }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: homeTeam.color }}
            >
              {homeTeam.shortName[0]}
            </div>
            <span className="font-semibold text-white">{homeTeam.name}</span>
          </div>
          
          <div className="p-4 space-y-3">
            {/* Starting XI */}
            <div>
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Starting XI
              </p>
              <div className="space-y-1">
                {homePlaying.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-3 py-1.5 px-2 rounded hover:bg-white/5 transition-colors"
                  >
                    <span className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-xs text-gray-400 font-medium">
                      {player.number || '-'}
                    </span>
                    <span className="text-sm text-white flex-1">{player.name}</span>
                    {player.position && (
                      <span className="text-xs text-gray-500">{player.position}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Bench */}
            {homeBench.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <CircleDot className="w-3 h-3" />
                  Substitutes
                </p>
                <div className="space-y-1">
                  {homeBench.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (homePlaying.length + index) * 0.03 }}
                      className="flex items-center gap-3 py-1 px-2 text-gray-500"
                    >
                      <span className="w-5 text-xs text-center">{player.number || '-'}</span>
                      <span className="text-sm">{player.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Away Team */}
        <motion.div 
          className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div 
            className="px-4 py-3 flex items-center gap-3"
            style={{ backgroundColor: `${awayTeam.color}20` }}
          >
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ backgroundColor: awayTeam.color }}
            >
              {awayTeam.shortName[0]}
            </div>
            <span className="font-semibold text-white">{awayTeam.name}</span>
          </div>
          
          <div className="p-4 space-y-3">
            {/* Starting XI */}
            <div>
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Starting XI
              </p>
              <div className="space-y-1">
                {awayPlaying.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-3 py-1.5 px-2 rounded hover:bg-white/5 transition-colors"
                  >
                    <span className="w-5 h-5 rounded bg-white/10 flex items-center justify-center text-xs text-gray-400 font-medium">
                      {player.number || '-'}
                    </span>
                    <span className="text-sm text-white flex-1">{player.name}</span>
                    {player.position && (
                      <span className="text-xs text-gray-500">{player.position}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
            
            {/* Bench */}
            {awayBench.length > 0 && (
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                  <CircleDot className="w-3 h-3" />
                  Substitutes
                </p>
                <div className="space-y-1">
                  {awayBench.map((player, index) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (awayPlaying.length + index) * 0.03 }}
                      className="flex items-center gap-3 py-1 px-2 text-gray-500"
                    >
                      <span className="w-5 text-xs text-center">{player.number || '-'}</span>
                      <span className="text-sm">{player.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
