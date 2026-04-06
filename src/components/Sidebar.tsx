'use client';

import { motion } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  Settings, 
  TrendingUp, 
  Bell,
  Search
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount?: number;
}

const menuItems = [
  { id: 'live', label: 'Live Matches', icon: Trophy },
  { id: 'upcoming', label: 'Upcoming', icon: Calendar },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange, unreadCount = 0 }: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 bg-[#0a0a0a] border-r border-white/10">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">GlobalScore</h1>
            <p className="text-xs text-gray-500">Live Sports</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search matches..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-white/10 text-white border border-white/10' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }
              `}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : ''}`} />
              {item.label}
              {item.id === 'notifications' && unreadCount > 0 && (
                <span className="ml-auto w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-2">API Mode</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-white font-medium">Mock Data Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
