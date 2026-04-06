'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/components/Sidebar';
import { BottomNav } from '@/components/BottomNav';
import { TopBar } from '@/components/TopBar';
import { MainStage } from '@/components/MainStage';
import { NewsSection } from '@/components/NewsSection';
import { ThisWeek } from '@/components/ThisWeek';
import { LiveMatchCarousel } from '@/components/LiveMatchCarousel';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { VideoPlayer } from '@/components/VideoPlayer';
import { WatchLiveButton } from '@/components/WatchLiveButton';
import { EventsTimeline } from '@/components/EventsTimeline';
import { TeamLineups } from '@/components/TeamLineups';
import { TrendingDashboard } from '@/components/TrendingDashboard';
import { FinishedMatches } from '@/components/FinishedMatches';
import { Match, NewsArticle } from '@/types/match';
import { Trophy, Radio, Bell, Settings, TrendingUp, Calendar, Activity } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('live');
  const [activeMatchId, setActiveMatchId] = useState<string>('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Goal!', message: 'Manchester City scored against Arsenal', time: '2 min ago', read: false },
    { id: '2', title: 'Match Started', message: 'Lakers vs Warriors is now live', time: '15 min ago', read: false },
    { id: '3', title: 'Wicket', message: 'Karachi Kings lost a wicket', time: '32 min ago', read: true },
  ]);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Get current date for API calls
      const today = new Date().toISOString().split('T')[0];
      
      // Fetch live, upcoming, and finished matches
      const [liveRes, scheduledRes, finishedRes, newsRes] = await Promise.all([
        fetch('/api/sports?sport=all&type=live'),
        fetch('/api/sports?sport=all&type=scheduled'),
        fetch('/api/sports?sport=all&type=finished'),
        fetch('/api/sports?endpoint=news'),
      ]);

      const [liveData, scheduledData, finishedData, newsData] = await Promise.all([
        liveRes.json(),
        scheduledRes.json(),
        finishedRes.json(),
        newsRes.json(),
      ]);

      const allMatches = [
        ...(liveData.result || []),
        ...(scheduledData.result || []),
        ...(finishedData.result || []),
      ];

      // Remove duplicates based on match ID
      const uniqueMatches = Array.from(
        new Map(allMatches.map((m: Match) => [m.id, m])).values()
      );

      setMatches(uniqueMatches);
      setNews(newsData.result || []);
      setLastUpdated(new Date());
      
      // Set first live match as active if none selected
      const liveMatches = uniqueMatches.filter((m: Match) => m.status === 'live');
      if (!activeMatchId && liveMatches.length > 0) {
        setActiveMatchId(liveMatches[0].id);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Categorize matches
  const { liveMatches, upcomingMatches, finishedMatches } = useMemo(() => {
    return {
      liveMatches: matches.filter(m => m.status === 'live'),
      upcomingMatches: matches.filter(m => m.status === 'upcoming'),
      finishedMatches: matches.filter(m => m.status === 'finished').sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    };
  }, [matches]);

  // Get featured match (most recent finished match for highlights)
  const featuredMatch = useMemo(() => {
    return finishedMatches[0] || null;
  }, [finishedMatches]);

  // Get active match
  const activeMatch = useMemo(() => {
    return matches.find(m => m.id === activeMatchId) || liveMatches[0] || matches[0] || null;
  }, [activeMatchId, matches, liveMatches]);

  // Filter matches based on active tab
  const filteredMatches = useMemo(() => {
    switch (activeTab) {
      case 'live':
        return liveMatches;
      case 'upcoming':
        return upcomingMatches;
      case 'finished':
        return finishedMatches;
      default:
        return matches;
    }
  }, [matches, liveMatches, upcomingMatches, finishedMatches, activeTab]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleSelectMatch = (match: Match) => {
    setActiveMatchId(match.id);
  };

  const handleWatchLive = (match: Match) => {
    // Open YouTube search for the match
    const searchQuery = `${match.homeTeam.name} vs ${match.awayTeam.name} live stream`;
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Desktop Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} unreadCount={unreadCount} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-0">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">GlobalScore</h1>
              <div className="flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-green-400" />
                <span className="text-xs text-gray-400">Live</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 pb-24 lg:pb-8 max-w-7xl mx-auto">
          {/* Top Bar - Horizontal Scroll */}
          <section className="mb-8 -mx-4 lg:-mx-8 px-4 lg:px-8 border-b border-white/10">
            <TopBar
              liveMatches={liveMatches}
              upcomingMatches={upcomingMatches}
              finishedMatches={finishedMatches}
              onSelectMatch={handleSelectMatch}
              selectedMatchId={activeMatchId}
            />
          </section>

          {/* Dynamic Content Based on Active Tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'notifications' ? (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Bell className="w-6 h-6 text-blue-400" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 bg-red-500 rounded-full text-sm">{unreadCount}</span>
                    )}
                  </h2>
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                
                {notifications.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <motion.button
                        key={notification.id}
                        onClick={() => markNotificationRead(notification.id)}
                        className={`w-full text-left p-4 rounded-xl border transition-all ${
                          notification.read 
                            ? 'bg-white/5 border-white/10' 
                            : 'bg-blue-500/10 border-blue-500/30'
                        }`}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`font-semibold ${notification.read ? 'text-white' : 'text-blue-400'}`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                          </div>
                          <span className="text-xs text-gray-500">{notification.time}</span>
                        </div>
                        {!notification.read && (
                          <div className="mt-2 flex items-center gap-2">
                            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                            <span className="text-xs text-blue-400">New</span>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                )}
              </motion.div>
            ) : activeTab === 'settings' ? (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="max-w-2xl mx-auto"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Settings className="w-6 h-6 text-blue-400" />
                  Settings
                </h2>
                
                <div className="space-y-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-4">Display</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-gray-300">Dark Mode</span>
                        <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                        </div>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-gray-300">Compact View</span>
                        <div className="w-12 h-6 bg-white/20 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-gray-300">Match Alerts</span>
                        <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                        </div>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-gray-300">Goal Notifications</span>
                        <div className="w-12 h-6 bg-blue-500 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="font-semibold text-white mb-4">Data</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-300">API Mode</span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Live API</span>
                    </div>
                    <button 
                      onClick={fetchData}
                      className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-colors"
                    >
                      Refresh Data
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Tab Header with Last Updated */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {activeTab === 'live' && <Radio className="w-6 h-6 text-red-400" />}
                    {activeTab === 'upcoming' && <Calendar className="w-6 h-6 text-blue-400" />}
                    {activeTab === 'finished' && <Trophy className="w-6 h-6 text-amber-400" />}
                    {activeTab === 'trending' && <TrendingUp className="w-6 h-6 text-green-400" />}
                    <h2 className="text-xl font-bold text-white capitalize">{activeTab} Matches</h2>
                    <span className="px-2 py-0.5 bg-white/10 rounded-full text-sm text-gray-400">
                      {filteredMatches.length}
                    </span>
                  </div>
                  {lastUpdated && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Activity className="w-3 h-3" />
                      <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>

                {/* Loading State */}
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin" />
                      <span>Loading...</span>
                    </div>
                  </div>
                ) : (
                  <>
                {/* Main/Live Tab - Show only live matches + News */}
                {activeTab === 'live' && (
                  <>
                    {/* Main Stage - Live Feature Card or Video Highlights if no live */}
                    <section className="mb-8">
                      <MainStage
                        liveMatch={liveMatches[0] || null}
                        featuredMatch={featuredMatch}
                        onWatchLive={handleWatchLive}
                      />
                    </section>

                    {/* News Section - Always show on main page */}
                    <section className="mb-8">
                      <NewsSection articles={news} />
                    </section>

                    {/* Live Match Detail - Show if there's a live match */}
                    {activeMatch && liveMatches.length > 0 && (
                      <motion.div
                        key={activeMatchId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                      >
                        {/* Left Column - Score & Video */}
                        <div className="lg:col-span-2 space-y-6">
                          <ScoreDisplay match={activeMatch} />
                          
                          <section>
                            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                              <Radio className="w-5 h-5 text-red-400" />
                              Live Stream
                            </h3>
                            <WatchLiveButton match={activeMatch} />
                          </section>

                          {/* Match Info */}
                          <div className="glass rounded-xl p-4">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2 text-gray-400">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeMatch.homeTeam.color }}></span>
                                <span>{activeMatch.homeTeam.name}</span>
                              </div>
                              <span className="text-gray-600">vs</span>
                              <div className="flex items-center gap-2 text-gray-400">
                                <span>{activeMatch.awayTeam.name}</span>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeMatch.awayTeam.color }}></span>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-white/10 text-center">
                              <span className="text-xs text-gray-500">{activeMatch.venue}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Events & Lineups */}
                        <div className="space-y-6">
                          <section className="glass rounded-xl p-4">
                            <EventsTimeline events={activeMatch.events} />
                          </section>

                          <section className="glass rounded-xl p-4">
                            <TeamLineups homeTeam={activeMatch.homeTeam} awayTeam={activeMatch.awayTeam} />
                          </section>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {/* Upcoming Tab - Show matches for today + next 7 days */}
                {activeTab === 'upcoming' && (
                  <section className="mb-8">
                    <ThisWeek matches={upcomingMatches} onSelectMatch={handleSelectMatch} news={news} />
                  </section>
                )}

                {/* Trending Tab - Show Trending Dashboard */}
                {activeTab === 'trending' && (
                  <section className="mb-8">
                    <TrendingDashboard 
                      matches={matches} 
                      onSelectMatch={handleSelectMatch}
                      news={news}
                    />
                  </section>
                )}

                {/* Finished Tab - Show Recently Finished Matches */}
                {activeTab === 'finished' && (
                  <section className="mb-8">
                    <FinishedMatches 
                      matches={finishedMatches} 
                      onSelectMatch={handleSelectMatch}
                    />
                  </section>
                )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} unreadCount={unreadCount} />
    </div>
  );
}
