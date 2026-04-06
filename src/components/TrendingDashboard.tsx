'use client';

import { Match } from '@/types/match';
import { SportIcon } from './SportIcon';
import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp, Crown, ChevronRight } from 'lucide-react';

interface TrendingDashboardProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
  news: any[];
}

// Real-world April 2026 context data
const FOOTBALL_TITLE_RACE = {
  premierLeague: {
    title: "Premier League Title Race",
    fixtures: [
      { home: "Man City", away: "Liverpool", date: "Today", time: "17:30", importance: "Title Decider" },
      { home: "Arsenal", away: "Chelsea", date: "Today", time: "20:00", importance: "Top 4 Battle" },
    ],
    standings: [
      { team: "Liverpool", played: 31, points: 73, form: "WWWDW" },
      { team: "Man City", played: 31, points: 71, form: "WDWWL" },
      { team: "Arsenal", played: 31, points: 68, form: "WLWDW" },
      { team: "Chelsea", played: 31, points: 58, form: "WWLWW" },
    ]
  },
  laLiga: {
    title: "La Liga Title Race",
    fixtures: [
      { home: "Atletico Madrid", away: "Barcelona", date: "Today", time: "21:00", importance: "El Clasico" },
      { home: "Real Madrid", away: "Sevilla", date: "Tomorrow", time: "18:00", importance: "Chasing Top" },
    ],
    standings: [
      { team: "Barcelona", played: 29, points: 67, form: "WWWWW" },
      { team: "Real Madrid", played: 29, points: 63, form: "WDWDW" },
      { team: "Atletico Madrid", played: 29, points: 60, form: "WWLWD" },
      { team: "Sevilla", played: 29, points: 52, form: "WLWWD" },
    ]
  }
};

const UEFA_CHAMPIONS_LEAGUE = {
  stage: "Quarter-Finals",
  fixtures: [
    { home: "Bayern Munich", away: "Arsenal", firstLeg: "2-2", secondLeg: "Today 20:00" },
    { home: "Man City", away: "Real Madrid", firstLeg: "1-1", secondLeg: "Tomorrow 20:00" },
    { home: "PSG", away: "Barcelona", firstLeg: "3-2", secondLeg: "Apr 6 20:00" },
    { home: "Atletico Madrid", away: "Dortmund", firstLeg: "1-0", secondLeg: "Apr 6 18:00" },
  ]
};

export function TrendingDashboard({ matches, onSelectMatch, news }: TrendingDashboardProps) {
  // Filter matches for major series
  const iplMatches = matches.filter(m => 
    m.league.toLowerCase().includes('ipl') || 
    m.league.toLowerCase().includes('indian premier league')
  );
  
  const pslMatches = matches.filter(m => 
    m.league.toLowerCase().includes('psl') || 
    m.league.toLowerCase().includes('pakistan super league')
  );

  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);

  const upcomingMatches = matches.filter(m => {
    const matchDate = new Date(m.date);
    return matchDate >= today && matchDate <= nextWeek && m.status === 'upcoming';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-green-400" />
        <h2 className="text-2xl font-bold text-white">Trending Now</h2>
        <span className="text-sm text-gray-400 ml-auto">April 2026</span>
      </div>

      {/* Major Ongoing Series Section */}
      <section>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Major Ongoing Series
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* IPL 2026 Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600/20 to-blue-900/10 rounded-xl border border-blue-500/30 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏏</span>
                <h4 className="font-bold text-white">IPL 2026</h4>
              </div>
              <span className="text-xs bg-blue-500/30 px-2 py-1 rounded text-blue-300">Match 12</span>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Today's Match</span>
                <span className="text-blue-400 font-medium">LIVE NOW</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">DC</span>
                  <span className="text-gray-500">vs</span>
                  <span className="font-semibold text-white">MI</span>
                </div>
                <span className="text-sm text-green-400">MI 58/2 (8.2)</span>
              </div>
            </div>
            
            <div className="pt-3 border-t border-white/10">
              <div className="text-xs text-gray-400 mb-2">Upcoming Today:</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white">GT vs RR</span>
                <span className="text-gray-400">7:00 PM</span>
              </div>
            </div>
          </motion.div>

          {/* PSL 2026 Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-600/20 to-green-900/10 rounded-xl border border-green-500/30 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏏</span>
                <h4 className="font-bold text-white">PSL 2026</h4>
              </div>
              <span className="text-xs bg-green-500/30 px-2 py-1 rounded text-green-300">Finals Week</span>
            </div>
            
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Qualifier 1</span>
                <span className="text-gray-400">Tomorrow</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">LQ</span>
                  <span className="text-gray-500">vs</span>
                  <span className="font-semibold text-white">MS</span>
                </div>
                <span className="text-sm text-gray-400">7:00 PM</span>
              </div>
            </div>
            
            <div className="pt-3 border-t border-white/10">
              <div className="text-xs text-gray-400 mb-2">Points Table Top 4:</div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white">1. Lahore Qalandars</span>
                <span className="text-green-400">16 pts</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-white">2. Multan Sultans</span>
                <span className="text-green-400">14 pts</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Football Title Race Section */}
      <section>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-red-400" />
          Football Title Race
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Premier League */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-600/20 to-purple-900/10 rounded-xl border border-purple-500/30 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-white flex items-center gap-2">
                <span className="text-xl">🏆</span>
                Premier League
              </h4>
              <Crown className="w-4 h-4 text-amber-400" />
            </div>

            {/* Title Race Fixtures */}
            <div className="space-y-2 mb-4">
              {FOOTBALL_TITLE_RACE.premierLeague.fixtures.map((fixture, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-white font-medium">{fixture.home}</span>
                    <span className="text-gray-500">vs</span>
                    <span className="text-white font-medium">{fixture.away}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-red-400">{fixture.date}</div>
                    <div className="text-xs text-gray-400">{fixture.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Standings Preview */}
            <div className="pt-3 border-t border-white/10">
              <div className="text-xs text-gray-400 mb-2">Title Race Standings</div>
              <div className="space-y-1">
                {FOOTBALL_TITLE_RACE.premierLeague.standings.slice(0, 3).map((team, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-amber-500 text-black' : 
                        idx === 1 ? 'bg-gray-400 text-black' : 'bg-amber-700 text-white'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-white">{team.team}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-400">{team.played} played</span>
                      <span className="text-green-400 font-medium">{team.points} pts</span>
                      <span className="text-gray-500">{team.form}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* La Liga */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-red-600/20 to-red-900/10 rounded-xl border border-red-500/30 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-white flex items-center gap-2">
                <span className="text-xl">🇪🇸</span>
                La Liga
              </h4>
              <Crown className="w-4 h-4 text-amber-400" />
            </div>

            {/* Title Race Fixtures */}
            <div className="space-y-2 mb-4">
              {FOOTBALL_TITLE_RACE.laLiga.fixtures.map((fixture, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-white font-medium">{fixture.home}</span>
                    <span className="text-gray-500">vs</span>
                    <span className="text-white font-medium">{fixture.away}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-red-400">{fixture.date}</div>
                    <div className="text-xs text-gray-400">{fixture.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Standings Preview */}
            <div className="pt-3 border-t border-white/10">
              <div className="text-xs text-gray-400 mb-2">Title Race Standings</div>
              <div className="space-y-1">
                {FOOTBALL_TITLE_RACE.laLiga.standings.slice(0, 3).map((team, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        idx === 0 ? 'bg-amber-500 text-black' : 
                        idx === 1 ? 'bg-gray-400 text-black' : 'bg-amber-700 text-white'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-white">{team.team}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-400">{team.played} played</span>
                      <span className="text-green-400 font-medium">{team.points} pts</span>
                      <span className="text-gray-500">{team.form}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* UEFA Champions League Section */}
      <section>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-blue-400" />
          UEFA Champions League - {UEFA_CHAMPIONS_LEAGUE.stage}
        </h3>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-blue-900/30 to-indigo-900/20 rounded-xl border border-blue-500/30 p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {UEFA_CHAMPIONS_LEAGUE.fixtures.map((fixture, idx) => (
              <div key={idx} className="bg-white/5 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-white font-medium">{fixture.home}</span>
                  <span className="text-gray-500">vs</span>
                  <span className="text-white font-medium">{fixture.away}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">1st Leg: {fixture.firstLeg}</div>
                  <div className={`text-xs ${fixture.secondLeg.includes('Today') ? 'text-green-400 font-medium' : 'text-gray-400'}`}>
                    2nd: {fixture.secondLeg}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Social Buzz / News Section */}
      {news && news.length > 0 && (
        <section>
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Social Buzz & Top Headlines
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.slice(0, 3).map((article, idx) => (
              <motion.a
                key={idx}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all group"
              >
                <h4 className="text-sm font-semibold text-white line-clamp-2 mb-2 group-hover:text-blue-400">
                  {article.title}
                </h4>
                {article.description && (
                  <p className="text-xs text-gray-400 line-clamp-2">{article.description}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">{article.source}</span>
                  <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white" />
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
