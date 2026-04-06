'use client';

import { motion } from 'framer-motion';
import { 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Bell,
  Settings
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  unreadCount?: number;
}

const menuItems = [
  { id: 'live', label: 'Live', icon: Trophy },
  { id: 'upcoming', label: 'Upcoming', icon: Calendar },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
  { id: 'notifications', label: 'Alerts', icon: Bell },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function BottomNav({ activeTab, onTabChange, unreadCount = 0 }: BottomNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-lg border-t border-white/10 z-50">
      <div className="flex items-center justify-around px-2 py-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className="relative flex flex-col items-center gap-1 px-3 py-1"
              whileTap={{ scale: 0.9 }}
            >
              <div className={`
                p-2 rounded-xl transition-all
                ${isActive ? 'bg-white/10' : ''}
              `}>
                <Icon className={`
                  w-5 h-5 transition-colors
                  ${isActive ? 'text-blue-400' : 'text-gray-500'}
                `} />
              </div>
              <span className={`
                text-[10px] font-medium transition-colors
                ${isActive ? 'text-white' : 'text-gray-500'}
              `}>
                {item.label}
              </span>
              
              {/* Active Indicator */}
              {isActive && (
                <motion.div 
                  layoutId="bottomNavIndicator"
                  className="absolute -top-1 w-1 h-1 bg-blue-400 rounded-full"
                />
              )}
              
              {/* Notification Badge */}
              {item.id === 'notifications' && unreadCount > 0 && (
                <span className="absolute top-1 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">
                  {unreadCount}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
