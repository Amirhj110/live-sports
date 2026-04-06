'use client';

import { MatchEvent, EventType } from '@/types/match';
import { motion } from 'framer-motion';
import { 
  Goal, 
  AlertCircle, 
  AlertTriangle, 
  RefreshCw, 
  CircleOff,
  Trophy,
  Timer,
  Swords
} from 'lucide-react';

interface EventsTimelineProps {
  events: MatchEvent[];
}

const eventConfig: Record<EventType, { icon: React.ReactNode; color: string; label: string }> = {
  goal: { icon: <Goal className="w-4 h-4" />, color: 'text-green-400 bg-green-400/20', label: 'Goal' },
  yellow_card: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-yellow-400 bg-yellow-400/20', label: 'Yellow Card' },
  red_card: { icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-400 bg-red-400/20', label: 'Red Card' },
  substitution: { icon: <RefreshCw className="w-4 h-4" />, color: 'text-blue-400 bg-blue-400/20', label: 'Substitution' },
  wicket: { icon: <CircleOff className="w-4 h-4" />, color: 'text-red-400 bg-red-400/20', label: 'Wicket' },
  boundary: { icon: <Trophy className="w-4 h-4" />, color: 'text-green-400 bg-green-400/20', label: 'Boundary' },
  six: { icon: <Swords className="w-4 h-4" />, color: 'text-purple-400 bg-purple-400/20', label: 'Six' },
  over: { icon: <Timer className="w-4 h-4" />, color: 'text-gray-400 bg-gray-400/20', label: 'Over' },
  timeout: { icon: <Timer className="w-4 h-4" />, color: 'text-orange-400 bg-orange-400/20', label: 'Timeout' },
  quarter_end: { icon: <Timer className="w-4 h-4" />, color: 'text-gray-400 bg-gray-400/20', label: 'End of Quarter' },
};

export function EventsTimeline({ events }: EventsTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500">
        <Timer className="w-8 h-8 mb-2" />
        <p className="text-sm">No events yet</p>
      </div>
    );
  }

  // Sort events by minute descending (most recent first)
  const sortedEvents = [...events].sort((a, b) => b.minute - a.minute);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Key Events</h3>
      
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-white/10" />
        
        <div className="space-y-3">
          {sortedEvents.map((event, index) => {
            const config = eventConfig[event.type];
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative flex items-start gap-4 pl-10"
              >
                {/* Event Icon */}
                <div className={`
                  absolute left-2 w-6 h-6 rounded-full flex items-center justify-center
                  ${config.color} border border-white/10
                `}>
                  {config.icon}
                </div>

                {/* Event Content */}
                <div className="flex-1 bg-white/5 rounded-lg p-3 border border-white/10">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">{config.label}</span>
                    <span className="text-xs text-gray-400">{event.minute}{getMinuteSuffix(event.type)}</span>
                  </div>
                  <p className="text-sm text-gray-300">{event.description}</p>
                  {event.player && (
                    <p className="text-xs text-gray-500 mt-1">{event.player}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getMinuteSuffix(type: EventType): string {
  if (['cricket', 'boundary', 'six', 'wicket', 'over'].includes(type)) return '';
  if (['timeout', 'quarter_end'].includes(type)) return '\'';
  return '\'';
}
